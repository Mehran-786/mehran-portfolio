import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { sql, initDb } from '../_lib/db.js';
import { verifyAdminSession, validateOrigin, getR2Client } from '../_lib/utils.js';

export default async function handler(req, res) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    if (!validateOrigin(req)) {
      return res.status(403).json({ error: 'Forbidden: Request origin not allowed.' });
    }
  }

  const id = req.query?.id || req.url?.split('/')?.filter(Boolean)?.pop()?.split('?')?.[0];
  if (!id) {
    return res.status(400).json({ error: 'Missing project ID.' });
  }

  await initDb();

  // ------------------------- GET: Single Project -------------------------
  if (req.method === 'GET') {
    try {
      const { rows } = await sql`
        SELECT id, number, title, badge, description, tech_tags, links, media, is_flagship, display_order, created_at, updated_at
        FROM projects
        WHERE id = ${id}
        LIMIT 1;
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Project not found.' });
      }

      const r = rows[0];
      return res.status(200).json({
        id: r.id,
        number: r.number || '',
        title: r.title,
        badge: r.badge || '',
        description: r.description,
        techTags: typeof r.tech_tags === 'string' ? JSON.parse(r.tech_tags) : (r.tech_tags || []),
        links: typeof r.links === 'string' ? JSON.parse(r.links) : (r.links || {}),
        media: typeof r.media === 'string' ? JSON.parse(r.media) : (r.media || []),
        isFlagship: Boolean(r.is_flagship),
        displayOrder: r.display_order || 0,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      });
    } catch (err) {
      console.error('[Project GET Item Error]', err?.message || err);
      return res.status(500).json({ error: 'Failed to fetch project.' });
    }
  }

  // ------------------------- PUT / PATCH: Update Project (Admin Only) -------------------------
  if (['PUT', 'PATCH'].includes(req.method)) {
    const isAdmin = verifyAdminSession(req);
    if (!isAdmin) {
      return res.status(401).json({ error: 'Unauthorized. Admin credentials required to modify projects.' });
    }

    try {
      const {
        title,
        badge = '',
        description,
        techTags = [],
        links = {},
        media = [],
        isFlagship = false,
      } = req.body || {};

      const cleanTitle = typeof title === 'string' ? title.replace(/<[^>]*>?/gm, '').trim() : '';
      if (!cleanTitle || cleanTitle.length < 3) {
        return res.status(400).json({ error: 'Project title must be at least 3 characters.' });
      }

      const cleanDescription = typeof description === 'string' ? description.replace(/<[^>]*>?/gm, '').trim() : '';
      if (!cleanDescription || cleanDescription.length < 10) {
        return res.status(400).json({ error: 'Project description must be at least 10 characters.' });
      }

      const cleanBadge = typeof badge === 'string' ? badge.replace(/<[^>]*>?/gm, '').trim().slice(0, 100) : '';

      const cleanTechTags = Array.isArray(techTags)
        ? techTags.map(t => String(t).replace(/<[^>]*>?/gm, '').trim()).filter(Boolean)
        : [];

      const cleanLinks = {
        github: typeof links?.github === 'string' && links.github.trim().startsWith('http') ? links.github.trim() : null,
        demo: typeof links?.demo === 'string' && (links.demo.trim().startsWith('http') || links.demo.trim().startsWith('/')) ? links.demo.trim() : null,
        demoLabel: typeof links?.demoLabel === 'string' && links.demoLabel.trim() ? links.demoLabel.trim().slice(0, 50) : 'Open Live Application',
      };

      const cleanMedia = Array.isArray(media)
        ? media.map(m => ({
            type: ['image', 'video', 'file'].includes(m.type) ? m.type : 'image',
            url: typeof m.url === 'string' ? m.url.trim() : '',
            key: typeof m.key === 'string' ? m.key.trim() : '',
            name: typeof m.name === 'string' ? m.name.slice(0, 120) : '',
            title: typeof m.title === 'string' ? m.title.slice(0, 120) : '',
            desc: typeof m.desc === 'string' ? m.desc.slice(0, 200) : '',
            size: typeof m.size === 'string' ? m.size : '',
          })).filter(m => m.url || m.key)
        : [];

      const now = new Date().toISOString();

      const { rowCount } = await sql`
        UPDATE projects
        SET
          title = ${cleanTitle},
          badge = ${cleanBadge},
          description = ${cleanDescription},
          tech_tags = ${JSON.stringify(cleanTechTags)}::jsonb,
          links = ${JSON.stringify(cleanLinks)}::jsonb,
          media = ${JSON.stringify(cleanMedia)}::jsonb,
          is_flagship = ${Boolean(isFlagship)},
          updated_at = ${now}
        WHERE id = ${id};
      `;

      if (rowCount === 0) {
        return res.status(404).json({ error: 'Project not found.' });
      }

      return res.status(200).json({
        id,
        title: cleanTitle,
        badge: cleanBadge,
        description: cleanDescription,
        techTags: cleanTechTags,
        links: cleanLinks,
        media: cleanMedia,
        isFlagship: Boolean(isFlagship),
        updatedAt: now,
      });
    } catch (err) {
      console.error('[Project Update Error]', err?.message || err);
      return res.status(500).json({ error: 'Failed to update project.' });
    }
  }

  // ------------------------- DELETE: Remove Project (Admin Only) -------------------------
  if (req.method === 'DELETE') {
    const isAdmin = verifyAdminSession(req);
    if (!isAdmin) {
      return res.status(401).json({ error: 'Unauthorized. Admin credentials required to delete projects.' });
    }

    try {
      const { rows } = await sql`
        SELECT media FROM projects WHERE id = ${id} LIMIT 1;
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Project not found.' });
      }

      const media = typeof rows[0].media === 'string' ? JSON.parse(rows[0].media) : (rows[0].media || []);
      const r2Keys = media.map(m => m.key).filter(Boolean);

      await sql`
        DELETE FROM projects WHERE id = ${id};
      `;

      // Clean up R2 assets if any were uploaded
      if (r2Keys.length > 0) {
        try {
          const r2 = getR2Client();
          const bucket = process.env.R2_BUCKET_NAME || 'mehranrasool-reviews';
          await r2.send(new DeleteObjectsCommand({
            Bucket: bucket,
            Delete: {
              Objects: r2Keys.map(Key => ({ Key })),
              Quiet: true,
            },
          }));
        } catch (r2Err) {
          console.warn('[R2 Project Media Cleanup Warning]', r2Err?.message || r2Err);
        }
      }

      return res.status(200).json({ success: true, message: 'Project deleted successfully.' });
    } catch (err) {
      console.error('[Project Delete Error]', err?.message || err);
      return res.status(500).json({ error: 'Failed to delete project.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

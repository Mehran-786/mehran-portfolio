import { verifyAdminSession } from '../_lib/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isAdmin = verifyAdminSession(req);
  return res.status(200).json({ isAdmin });
}

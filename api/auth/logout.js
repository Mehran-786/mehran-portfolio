export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieHeader = `admin_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict${isProduction ? '; Secure' : ''}`;

  res.setHeader('Set-Cookie', cookieHeader);
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
}

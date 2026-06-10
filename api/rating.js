const STORE_BASE = 'https://storegit.pages.dev';
const FILE_NAME  = 'defikent_ratings.json';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const STORE_KEY = process.env.STOREGIT_API_KEY;
  if (!STORE_KEY) return res.status(500).json({ error: 'Key not configured' });

  if (req.method === 'GET') {
    try {
      const r = await fetch(
        `${STORE_BASE}/api/download?name=${FILE_NAME}`,
        { headers: { 'X-API-Key': STORE_KEY } }
      );
      if (!r.ok) return res.status(200).json({ ratings: [], count: 0, average: 0 });
      const text = await r.text();
      return res.status(200).json(JSON.parse(text));
    } catch (err) {
      console.error('GET error:', err);
      return res.status(500).json({ error: 'Failed to load' });
    }
  }

  if (req.method === 'POST') {
    const { star, ip } = req.body || {};
    if (!star || star < 1 || star > 5) return res.status(400).json({ error: 'Invalid star' });
    try {
      // Load existing data
      const r = await fetch(
        `${STORE_BASE}/api/download?name=${FILE_NAME}`,
        { headers: { 'X-API-Key': STORE_KEY } }
      );
      const text = r.ok ? await r.text() : null;
      const data = text ? JSON.parse(text) : { ratings: [], count: 0, average: 0 };

      // Update ratings
      data.ratings = data.ratings.filter(r => r.ip !== ip);
      data.ratings.push({ ip, star, time: new Date().toISOString() });
      data.count   = data.ratings.length;
      data.average = (data.ratings.reduce((a, b) => a + b.star, 0) / data.count).toFixed(1);

      // FIX: Buffer.from instead of btoa/unescape (Node.js has no btoa)
      const content = Buffer.from(JSON.stringify(data), 'utf-8').toString('base64');

      // Delete old file if exists
      const filesRes = await fetch(`${STORE_BASE}/api/files`, { headers: { 'X-API-Key': STORE_KEY } });
      const files    = filesRes.ok ? await filesRes.json() : [];
      const old      = Array.isArray(files) ? files.find(f => f.name === FILE_NAME) : null;
      if (old) {
        await fetch(`${STORE_BASE}/api/delete`, {
          method:  'DELETE',
          headers: { 'X-API-Key': STORE_KEY, 'Content-Type': 'application/json' },
          body:    JSON.stringify({ name: FILE_NAME, sha: old.sha }),
        });
      }

      // Upload new file
      await fetch(`${STORE_BASE}/api/upload`, {
        method:  'POST',
        headers: { 'X-API-Key': STORE_KEY, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: FILE_NAME, content }),
      });

      return res.status(200).json({ average: data.average, count: data.count });
    } catch (err) {
      console.error('POST error:', err);
      return res.status(500).json({ error: 'Failed to save' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

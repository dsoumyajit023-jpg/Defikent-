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
      const text = await fetch(
        `${STORE_BASE}/api/download?name=${FILE_NAME}`,
        { headers: { 'X-API-Key': STORE_KEY } }
      ).then(r => r.ok ? r.text() : null);
      if (!text) return res.status(200).json({ ratings: [], count: 0, average: 0 });
      return res.status(200).json(JSON.parse(text));
    } catch { return res.status(500).json({ error: 'Failed to load' }); }
  }

  if (req.method === 'POST') {
    const { star, ip } = req.body || {};
    if (!star || star < 1 || star > 5) return res.status(400).json({ error: 'Invalid star' });
    try {
      const text = await fetch(
        `${STORE_BASE}/api/download?name=${FILE_NAME}`,
        { headers: { 'X-API-Key': STORE_KEY } }
      ).then(r => r.ok ? r.text() : null);
      const data = text ? JSON.parse(text) : { ratings: [], count: 0, average: 0 };
      data.ratings = data.ratings.filter(r => r.ip !== ip);
      data.ratings.push({ ip, star, time: new Date().toISOString() });
      data.count = data.ratings.length;
      data.average = (data.ratings.reduce((a, b) => a + b.star, 0) / data.count).toFixed(1);
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
      const files = await fetch(`${STORE_BASE}/api/files`, { headers: { 'X-API-Key': STORE_KEY } }).then(r => r.json()).catch(() => []);
      const old = files.find(f => f.name === FILE_NAME);
      if (old) {
        await fetch(`${STORE_BASE}/api/delete`, {
          method: 'DELETE',
          headers: { 'X-API-Key': STORE_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: FILE_NAME, sha: old.sha })
        });
      }
      await fetch(`${STORE_BASE}/api/upload`, {
        method: 'POST',
        headers: { 'X-API-Key': STORE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: FILE_NAME, content })
      });
      return res.status(200).json({ average: data.average, count: data.count });
    } catch { return res.status(500).json({ error: 'Failed to save' }); }
  }
};

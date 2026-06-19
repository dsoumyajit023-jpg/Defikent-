

const KEY = 'dk_garage';

export function getGarage() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function saveToGarage(item) {
  const list  = getGarage();
  const entry = { id: Date.now(), savedAt: new Date().toLocaleString('en-IN'), ...item };
  list.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)));
  return entry;
}

export function deleteFromGarage(id) {
  localStorage.setItem(KEY, JSON.stringify(getGarage().filter(e => e.id !== id)));
}

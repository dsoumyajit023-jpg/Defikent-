/**
 * garage.js — save/load/delete comparison results in localStorage.
 */

const KEY = 'dk_garage';

export function getGarage() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch { return []; }
}

export function saveToGarage(item) {
  const garage = getGarage();
  const entry = {
    id: Date.now(),
    savedAt: new Date().toLocaleString('en-IN'),
    ...item,
  };
  garage.unshift(entry);
  // Keep max 20 saves
  localStorage.setItem(KEY, JSON.stringify(garage.slice(0, 20)));
  return entry;
}

export function deleteFromGarage(id) {
  const garage = getGarage().filter(e => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(garage));
}

export function clearGarage() {
  localStorage.removeItem(KEY);
}

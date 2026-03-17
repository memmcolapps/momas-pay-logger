const state = {
  logs: [],
  meta: { current_page: 1, per_page: 50, total: 0, last_page: 1 },
  filters: { level: '', search: '' },
  polling: { enabled: false, intervalMs: 5000 },
  expandedRows: new Set(),
  loading: false,
};

const subscribers = [];

export function getState() {
  return state;
}

export function setState(partial) {
  for (const key of Object.keys(partial)) {
    if (partial[key] !== null && typeof partial[key] === 'object' && !Array.isArray(partial[key]) && !(partial[key] instanceof Set)) {
      state[key] = { ...state[key], ...partial[key] };
    } else {
      state[key] = partial[key];
    }
  }
  subscribers.forEach(fn => fn(state));
}

export function subscribe(fn) {
  subscribers.push(fn);
}

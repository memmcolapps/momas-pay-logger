import { getState, setState } from '../state.js';

let timerId = null;
let isFetching = false;
let fetchFn = null;

export function initAutoRefresh(onRefresh) {
  fetchFn = onRefresh;

  const toggle = document.getElementById('auto-refresh-toggle');
  const intervalSelect = document.getElementById('refresh-interval');

  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      const ms = Number(intervalSelect.value);
      setState({ polling: { enabled: true, intervalMs: ms } });
      startPolling(ms);
    } else {
      stopPolling();
      setState({ polling: { enabled: false } });
    }
  });

  intervalSelect.addEventListener('change', () => {
    const ms = Number(intervalSelect.value);
    setState({ polling: { intervalMs: ms } });
    if (getState().polling.enabled) {
      stopPolling();
      startPolling(ms);
    }
  });

  // Pause polling when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopPolling();
    } else if (getState().polling.enabled) {
      startPolling(getState().polling.intervalMs);
    }
  });
}

function startPolling(ms) {
  stopPolling();
  timerId = setInterval(async () => {
    if (isFetching || !fetchFn) return;
    isFetching = true;
    try {
      await fetchFn();
    } finally {
      isFetching = false;
    }
  }, ms);
}

function stopPolling() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

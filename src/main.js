import './style.css';
import { getState, setState, subscribe } from './state.js';
import { fetchLogs, queryLogs } from './api.js';
import { renderLogs, initLogTable } from './components/logTable.js';
import { initFilters } from './components/filters.js';
import { renderPagination, initPagination } from './components/pagination.js';
import { initAutoRefresh } from './components/autoRefresh.js';

const envBadge = document.getElementById('env-badge');
if (envBadge) {
  const mode = import.meta.env.MODE;
  envBadge.textContent = mode;
  envBadge.dataset.env = mode;
}

subscribe(() => {
  renderLogs();
  renderPagination();
});

function hasActiveFilters(f) {
  return Boolean(
    f.level ||
    f.message ||
    f.start_date ||
    f.end_date ||
    (f.sort_by && f.sort_by !== 'created_at') ||
    (f.sort_order && f.sort_order !== 'desc')
  );
}

async function loadLogs(page) {
  const { filters, meta } = getState();
  const perPage = meta.per_page || 50;
  setState({ loading: true });

  const result = hasActiveFilters(filters)
    ? await queryLogs({ ...filters, page, per_page: perPage })
    : await fetchLogs(page, perPage);

  if (result.status) {
    setState({
      logs: result.data.logs,
      meta: result.data.meta,
      loading: false,
      expandedRows: new Set(),
    });
  } else {
    setState({ logs: [], loading: false });
  }
}

async function refreshCurrentPage() {
  const { meta } = getState();
  await loadLogs(meta.current_page || 1);
}

initLogTable();
initFilters(() => loadLogs(1));
initPagination((page) => loadLogs(page));
initAutoRefresh(refreshCurrentPage);

loadLogs(1);

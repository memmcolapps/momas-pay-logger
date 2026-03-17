import './style.css';
import { getState, setState, subscribe } from './state.js';
import { fetchLogs } from './api.js';
import { renderLogs, initLogTable } from './components/logTable.js';
import { initFilters } from './components/filters.js';
import { renderPagination, initPagination } from './components/pagination.js';
import { initAutoRefresh } from './components/autoRefresh.js';

// Subscribe renderers to state changes
subscribe(() => {
  renderLogs();
  renderPagination();
});

// Fetch logs for a given page
async function loadLogs(page) {
  setState({ loading: true });

  const result = await fetchLogs(page);

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

// Refresh current page (used by auto-refresh)
async function refreshCurrentPage() {
  const { meta } = getState();
  await loadLogs(meta.current_page);
}

// Initialize components
initLogTable();
initFilters();
initPagination((page) => loadLogs(page));
initAutoRefresh(refreshCurrentPage);

// Load first page on startup
loadLogs(1);

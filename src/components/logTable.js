import { getState, setState } from '../state.js';
import { formatDate, levelBadgeClass, highlightJSON } from '../utils/formatters.js';

const tbody = () => document.getElementById('log-body');
const emptyEl = () => document.getElementById('empty-state');
const loadingEl = () => document.getElementById('loading');
const filterCountEl = () => document.getElementById('filter-count');

function getFilteredLogs() {
  const { logs, filters } = getState();
  let filtered = logs;

  if (filters.level) {
    filtered = filtered.filter(l => l.level === filters.level);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(l => l.message.toLowerCase().includes(q));
  }

  return filtered;
}

export function renderLogs() {
  const state = getState();
  const el = tbody();
  const empty = emptyEl();
  const loading = loadingEl();
  const countEl = filterCountEl();

  if (state.loading) {
    el.textContent = '';
    empty.classList.add('hidden');
    loading.classList.remove('hidden');
    return;
  }

  loading.classList.add('hidden');

  const filtered = getFilteredLogs();
  const total = state.logs.length;

  // Show filter count when filters are active
  if ((state.filters.level || state.filters.search) && total > 0) {
    countEl.textContent = `${filtered.length} of ${total}`;
  } else {
    countEl.textContent = '';
  }

  if (filtered.length === 0) {
    el.textContent = '';
    empty.classList.remove('hidden');
    empty.textContent = total === 0 ? 'No logs found' : 'No logs match filters';
    return;
  }

  empty.classList.add('hidden');

  const frag = document.createDocumentFragment();

  for (const log of filtered) {
    const isExpanded = state.expandedRows.has(log.id);

    // Main row
    const tr = document.createElement('tr');
    tr.className = `log-row${isExpanded ? ' expanded' : ''}`;
    tr.dataset.id = log.id;

    tr.innerHTML = `
      <td class="timestamp">${formatDate(log.created_at)}</td>
      <td><span class="level-badge ${levelBadgeClass(log.level)}">${log.level}</span></td>
      <td class="message-text">${escapeText(log.message)}</td>
      <td><span class="expand-icon">&#9654;</span></td>
    `;

    frag.appendChild(tr);

    // Context row (if expanded)
    if (isExpanded) {
      const ctxTr = document.createElement('tr');
      ctxTr.className = 'context-row';
      const td = document.createElement('td');
      td.colSpan = 4;

      const highlighted = highlightJSON(log.context);
      if (highlighted) {
        td.innerHTML = `<pre class="context-pre">${highlighted}</pre>`;
      } else {
        td.innerHTML = '<div class="context-empty">No context data</div>';
      }

      ctxTr.appendChild(td);
      frag.appendChild(ctxTr);
    }
  }

  el.textContent = '';
  el.appendChild(frag);
}

function escapeText(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function initLogTable() {
  document.getElementById('log-body').addEventListener('click', (e) => {
    const row = e.target.closest('tr.log-row');
    if (!row) return;

    const id = Number(row.dataset.id);
    const { expandedRows } = getState();

    if (expandedRows.has(id)) {
      expandedRows.delete(id);
    } else {
      expandedRows.add(id);
    }

    setState({ expandedRows });
  });
}

import { setState } from '../state.js';

let debounceTimer = null;
let onFiltersChange = null;

function toIsoWithOffset(localValue) {
  if (!localValue) return '';
  const d = new Date(localValue);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const tzMin = -d.getTimezoneOffset();
  const sign = tzMin >= 0 ? '+' : '-';
  const abs = Math.abs(tzMin);
  const tz = `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${tz}`;
}

function applyFilters(partial) {
  setState({ filters: partial });
  if (onFiltersChange) onFiltersChange();
}

export function initFilters(onChange) {
  onFiltersChange = onChange;

  const levelSelect = document.getElementById('level-filter');
  const searchInput = document.getElementById('search-input');
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');
  const sortBy = document.getElementById('sort-by');
  const sortOrder = document.getElementById('sort-order');
  const resetBtn = document.getElementById('reset-filters');

  levelSelect.addEventListener('change', () => {
    applyFilters({ level: levelSelect.value });
  });

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      applyFilters({ message: searchInput.value.trim() });
    }, 300);
  });

  startDate.addEventListener('change', () => {
    applyFilters({ start_date: toIsoWithOffset(startDate.value) });
  });

  endDate.addEventListener('change', () => {
    applyFilters({ end_date: toIsoWithOffset(endDate.value) });
  });

  sortBy.addEventListener('change', () => {
    applyFilters({ sort_by: sortBy.value });
  });

  sortOrder.addEventListener('change', () => {
    applyFilters({ sort_order: sortOrder.value });
  });

  resetBtn.addEventListener('click', () => {
    levelSelect.value = '';
    searchInput.value = '';
    startDate.value = '';
    endDate.value = '';
    sortBy.value = 'created_at';
    sortOrder.value = 'desc';
    applyFilters({
      level: '',
      message: '',
      start_date: '',
      end_date: '',
      sort_by: 'created_at',
      sort_order: 'desc',
    });
  });
}

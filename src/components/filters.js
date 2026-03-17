import { setState } from '../state.js';

let debounceTimer = null;

export function initFilters() {
  const levelSelect = document.getElementById('level-filter');
  const searchInput = document.getElementById('search-input');

  levelSelect.addEventListener('change', () => {
    setState({ filters: { level: levelSelect.value } });
  });

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setState({ filters: { search: searchInput.value } });
    }, 200);
  });
}

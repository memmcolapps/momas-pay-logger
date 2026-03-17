import { getState } from '../state.js';

let onPageChange = null;

export function renderPagination() {
  const { meta, loading } = getState();
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageInfo = document.getElementById('page-info');
  const totalInfo = document.getElementById('total-info');

  const page = meta.current_page || 1;
  const last = meta.last_page || 1;
  const total = meta.total || 0;

  pageInfo.textContent = `Page ${page} of ${last}`;
  totalInfo.textContent = total > 0 ? `${total} total logs` : '';

  prevBtn.disabled = page <= 1 || loading;
  nextBtn.disabled = page >= last || loading;
}

export function initPagination(callback) {
  onPageChange = callback;

  document.getElementById('prev-btn').addEventListener('click', () => {
    const { meta } = getState();
    if (meta.current_page > 1 && onPageChange) {
      onPageChange(meta.current_page - 1);
    }
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    const { meta } = getState();
    if (meta.current_page < meta.last_page && onPageChange) {
      onPageChange(meta.current_page + 1);
    }
  });
}

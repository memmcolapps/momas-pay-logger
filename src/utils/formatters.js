export function formatDate(isoString) {
  const d = new Date(isoString);
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  if (d.toDateString() === now.toDateString()) return time;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${pad(d.getDate())} ${time}`;
}

export function levelBadgeClass(level) {
  const l = (level || '').toLowerCase();
  const map = { info: 'level-info', error: 'level-error', warning: 'level-warning', debug: 'level-debug', critical: 'level-critical' };
  return map[l] || 'level-info';
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlightJSON(obj) {
  if (Array.isArray(obj) && obj.length === 0) return null;
  if (obj === null || obj === undefined) return null;
  if (typeof obj === 'object' && Object.keys(obj).length === 0) return null;

  const raw = JSON.stringify(obj, null, 2);
  const escaped = escapeHtml(raw);

  return escaped
    .replace(/"([^"]+)"(?=\s*:)/g, '<span class="json-key">"$1"</span>')
    .replace(/:\s*"([^"]*?)"/g, ': <span class="json-string">"$1"</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="json-bool">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="json-null">$1</span>');
}

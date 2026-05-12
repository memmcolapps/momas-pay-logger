const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

function errorResult(message) {
  return { status: false, message, data: { logs: [], meta: {} } };
}

export async function fetchLogs(page = 1, perPage = 50) {
  try {
    const res = await fetch(
      `${API_BASE}/api/logs?page=${page}&per_page=${perPage}`,
      { method: "GET", headers: { Accept: "application/json" } }
    );
    if (!res.ok) return errorResult((await res.text()) || `HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return errorResult(err.message);
  }
}

export async function queryLogs({
  level,
  message,
  start_date,
  end_date,
  sort_by,
  sort_order,
  page = 1,
  per_page = 50,
} = {}) {
  const params = new URLSearchParams({ page, per_page });
  if (level) params.set("level", level);
  if (message) params.set("message", message);
  if (start_date) params.set("start_date", start_date);
  if (end_date) params.set("end_date", end_date);
  if (sort_by) params.set("sort_by", sort_by);
  if (sort_order) params.set("sort_order", sort_order);

  try {
    const res = await fetch(`${API_BASE}/api/logs/query?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return errorResult((await res.text()) || `HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return errorResult(err.message);
  }
}

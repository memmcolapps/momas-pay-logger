const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const METER_NO = import.meta.env.VITE_METER_NO || '';
const PASSWORD = import.meta.env.VITE_PASSWORD || '';

export async function fetchLogs(page = 1, perPage = 50) {
  try {
    const url = `${BASE_URL}/api/logs?page=${page}&per_page=${perPage}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meterNo: METER_NO, password: PASSWORD }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { status: false, message: text || `HTTP ${res.status}`, data: { logs: [], meta: {} } };
    }

    return await res.json();
  } catch (err) {
    return { status: false, message: err.message, data: { logs: [], meta: {} } };
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function fetchLogs(page = 1, perPage = 50) {
  try {
    const url = `https://momaspay.memmserve.com/api/logs?page=${page}&per_page=${perPage}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        status: false,
        message: text || `HTTP ${res.status}`,
        data: { logs: [], meta: {} },
      };
    }

    return await res.json();
  } catch (err) {
    return {
      status: false,
      message: err.message,
      data: { logs: [], meta: {} },
    };
  }
}

import { get, post } from "axios";
import { schedule } from "node-cron";
import { loadSyncState, getLastId, updateLastId } from "./utils/syncState";

const FILTER_TYPES = ["machine", "process", "file", "socket"];

const API_INVESTIGATION = "http://your-api.com/api/investigations"; // 🔁 thay bằng API thật
const API_QUERY_BASE = "http://your-query-api.com/api/query"; // 🔁 API query dữ liệu
const API_SAVE_BASE = "http://10.32.116.244:5000/api"; // ✅ API lưu dữ liệu

async function fetchInvestigations() {
  const res = await get(API_INVESTIGATION);
  return res.data?.data?.investigation || [];
}

async function processFilter(type, rawFilter, start, end, filterId) {
  const syncState = loadSyncState();
  const lastId = getLastId(filterId, type, syncState);

  let finalFilter = rawFilter || "1=1";
  if (lastId) {
    finalFilter += ` AND id > '${lastId}'`;
  }

  console.log(`[${type}] Querying: ${finalFilter}`);

  const queryRes = await post(`${API_QUERY_BASE}/${type}`, {
    filter: finalFilter,
    start_time: start,
    end_time: end,
  });

  const records = queryRes.data.records || [];
  if (records.length === 0) {
    console.log(`[${type}] No new data.`);
    return;
  }

  await post(`${API_SAVE_BASE}/${type}-profile/add`, {
    data: records,
    filter_id: filterId,
  });

  const ids = records.map((r) => r.id).filter(Boolean);
  const maxId = ids.sort().slice(-1)[0];

  if (maxId) {
    updateLastId(filterId, type, maxId, syncState);
    console.log(`[${type}] Updated last_id to ${maxId}`);
  }
}

async function mainJob() {
  try {
    const investigations = await fetchInvestigations();

    for (const inv of investigations) {
      const { filters, start_time, end_time, id: filterId } = inv;

      const parsedFilters = JSON.parse(filters || "{}");

      for (const type of FILTER_TYPES) {
        if (parsedFilters[type]?.filter) {
          await processFilter(
            type,
            parsedFilters[type].filter,
            start_time,
            end_time,
            filterId
          );
        }
      }
    }
  } catch (err) {
    console.error("❌ Error in cron job:", err.message);
  }
}

// Chạy cron mỗi phút
schedule("* * * * *", () => {
  console.log(`🔁 Cron running: ${new Date().toISOString()}`);
  mainJob();
});

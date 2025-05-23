/* eslint-disable @typescript-eslint/no-require-imports */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { post } = require("axios");
const { schedule } = require("node-cron");
const { loadSyncState, getLastId, updateLastId } = require("./utils/syncState");
const { retrieveToken } = require("./utils/tokenManager");
const FILTER_TYPES = ["registry", "process", "file", "socket"];

const API_INVESTIGATION =
  "http://10.32.116.244:5000/api/investigation/paginate"; // 🔁 thay bằng API thật
const API_QUERY_BASE = "http://10.32.116.244:5000/api/events/paginate"; // 🔁 API query dữ liệu
const API_SAVE_BASE = "http://10.32.116.244:5000/api"; // ✅ API lưu dữ liệu

async function fetchInvestigationsWithPost() {
  try {
    // Lấy token từ API xác thực
    const token = await retrieveToken();

    // JSON body để gửi đến API
    const requestBody = {
      start_date: "2025-03-31",
      end_date: "2026",
      skip: 0,
      limit: 50,
      filter: "",
    };

    // Gửi yêu cầu POST đến API investigation
    const response = await post(API_INVESTIGATION, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
        "Content-Type": "application/json", // Đảm bảo gửi đúng định dạng JSON
      },
    });
    // Kiểm tra phản hồi từ API
    if (response?.data?.code === 200) {
      return response.data.data; // Trả về dữ liệu investigation
    } else {
      throw new Error(
        response?.data?.message || "Failed to fetch investigations."
      );
    }
  } catch (error) {
    console.error("Error fetching investigations:", error.message);
    throw error;
  }
}
async function processFilter(type, rawFilter, start, end, filterId) {
  const syncState = loadSyncState();
  const lastId = getLastId(filterId, type, syncState);

  let finalFilter = rawFilter || "1=1";
  if (lastId) {
    finalFilter += ` AND id > '${lastId}'`;
  }

  console.log(`[${type}] Querying: ${finalFilter}`);
  const token = await retrieveToken();
  console.log({
    filter: finalFilter,
    start_date: start,
    end_date: end,
    object: type,
    limit: 1000,
    skip: 0,
  });
  const queryRes = await post(
    `${API_QUERY_BASE}`,
    {
      filter: finalFilter,
      start_date: start,
      end_date: end,
      object: type,
      limit: 1000,
      skip: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
        "Content-Type": "application/json", // Đảm bảo gửi đúng định dạng JSON
      },
    }
  );
  console.log("Query response:", queryRes.data.data.events);
  const records = queryRes.data.data.events || [];
  if (records.length === 0) {
    console.log(`[${type}] No new data.`);
    return;
  }

  await post(
    `${API_SAVE_BASE}/${type}-profile/add`,
    {
      data: records,
      filter_id: filterId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
        "Content-Type": "application/json", // Đảm bảo gửi đúng định dạng JSON
      },
    }
  );

  const ids = records.map((r) => r.id).filter(Boolean);
  const maxId = ids.sort().slice(-1)[0];

  if (maxId) {
    updateLastId(filterId, type, maxId, syncState);
    console.log(`[${type}] Updated last_id to ${maxId}`);
  }
}

async function mainJob() {
  try {
    const investigations = await fetchInvestigationsWithPost();
    console.log("🔁 Fetched investigations:", investigations);
    for (const inv of investigations.investigation) {
      const { filters, start_time, end_time, id: filterId } = inv;

      for (const type of FILTER_TYPES) {
        if (filters[type]?.filter) {
          await processFilter(
            type,
            filters[type].filter,
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
mainJob();

import { existsSync, readFileSync, writeFileSync } from "fs";
const path = "./sync-state.json";

function loadSyncState() {
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, "utf-8"));
}

function saveSyncState(state) {
  writeFileSync(path, JSON.stringify(state, null, 2));
}

function getLastId(filterId, type, state) {
  return state[filterId]?.[type] || null;
}

function updateLastId(filterId, type, newId, state) {
  if (!state[filterId]) state[filterId] = {};
  state[filterId][type] = newId;
  saveSyncState(state);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { loadSyncState, saveSyncState, getLastId, updateLastId };

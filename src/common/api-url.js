const API_URL = {
  HOME_PAGE: {
    DEFAULT: "/api/be/dashboard/statis",
    TATIC: "/api/be/dashboard/getTacticCounts",
  },
  LOGIN_PAGE: { DEFAULT: "/api/be/auth/login" },
  EVENT_PAGE: { DEFAULT: "/api/be/events/paginate" },
  ALERT_PAGE: {
    DEFAULT: "/api/be/alerts/paginate",
    PROCESS_TREE: "/api/be/alerts/getProcessTree",
    EVENTS: "/api/be/alerts/getEventAlert",
    EVENTS_MITTRE: "/api/be/alerts/getMitreEventsbyAlert",
    EVENTS_SOCKET: "/api/be/alerts/getSocketEventsByAlert",
  },
  EDR_PAGE: {
    DEFAULT: "/api/be/edrs/paginate",
    REMOTE: "/api/be/edrs/update-remote",
    SOCKET_EDR: "/api/remote_edrs",
  },
  NDR_PAGE: {
    DEFAULT: "/api/be/ndrs/paginate",
    REMOTE: "/api/ndrs/update-remote",
    SOCKET_NDR: "/api/remote_ndrs",
  },
  LOGS_PAGE: { DEFAULT: "/api/be/error-logs/paginate" },
  INVESTIGATION_PAGE: {
    DEFAULT: "/api/be/filter/paginate",
    DELETE: "/api/be/filter/delete",
    ADD: "/api/be/filter/add",
  },
  MALOPS_PAGE: {
    DEFAULT: "/api/be/alerts/paginate",
  },
};
export default API_URL;

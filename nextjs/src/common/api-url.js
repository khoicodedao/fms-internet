const API_URL = {
  HOME_PAGE: {
    DEFAULT: "/api/be/dashboard/statis",
    TATIC: "/api/be/dashboard/getTacticCounts",
    UNIT_CHART: "/api/be/dashboard/getUnitNameCounts",
  },
  LOGIN_PAGE: { DEFAULT: "/api/be/auth/login" },
  EVENT_PAGE: { DEFAULT: "/api/be/events/paginate" },
  ALERT_PAGE: {
    NDR: "/api/be/alerts/paginateAlertNDR",
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
    EDIT: "/api/be/filter/edit",
    PREVIEW: "/api/be/filter/testFilter",
  },
  MALOPS_PAGE: {
    DEFAULT: "/api/be/filter/paginate",
  },
  EVENTS_MITTRE_PAGE: {
    DEFAULT: "/api/be/events/getEventMitre",
  },
  UNIT: {
    LIST_EVENT: "/api/be/dashboard/getUnitNameCounts",
    LIST: "/api/be/units/paginate",
  },
  FLIE: {
    DEFAULT: "/api/be/files/paginate",
  },
  STATISTIC_PAGE: {
    DEFAULT: "/api/be/statistics/summary",
  },
};
export default API_URL;

const API_URL = {
  HOME_PAGE: { DEFAULT: "/api/dashboard/statis" },
  LOGIN_PAGE: { DEFAULT: "/api/auth/login" },
  EVENT_PAGE: { DEFAULT: "/api/events/paginate" },
  ALERT_PAGE: { DEFAULT: "/api/alerts/paginate" },
  EDR_PAGE: {
    DEFAULT: "/api/edrs/paginate",
    REMOTE: "/api/edrs/update-remote",
    SOCKET_EDR: "/api/remote_edrs",
  },
  NDR_PAGE: {
    DEFAULT: "/api/ndrs/paginate",
    REMOTE: "/api/ndrs/update-remote",
  },
  LOGS_PAGE: { DEFAULT: "/api/error-logs/paginate" },
  INVESTIGATION_PAGE: {
    DEFAULT: "/api/filter/paginate",
    DELETE: "/api/filter/delete",
    ADD: "/api/filter/add",
  },
  MALOPS_PAGE: {
    DEFAULT: "/api/investigation/paginate",
    DELETE: "/api/investigation/delete",
    ADD: "/api/investigation/add",
    EDIT: "/api/investigation/edit",
  },
};
export default API_URL;

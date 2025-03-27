const API_URL = {
  HOME_PAGE: { DEFAULT: "/api/dashboard/statis" },
  LOGIN_PAGE: { DEFAULT: "/api/auth/login" },
  EVENT_PAGE: { DEFAULT: "/api/events/paginate" },
  ALERT_PAGE: { DEFAULT: "/api/alerts/paginate" },
  EDR_PAGE: { DEFAULT: "/api/edrs/paginate" },
  NDR_PAGE: {
    DEFAULT: "/api/ndrs/paginate",
    REMOTE: "/api/ndrs/update-remote",
  },
};
export default API_URL;

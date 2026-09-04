export const LOCAL_BACK_URL = "http://localhost:8000";

export const getBackendBaseUrl = () => {
  if (typeof window !== "undefined" && window.__BACKEND_URL__) {
    return window.__BACKEND_URL__.replace(/\/+$/, "");
  }
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");
  }
  return LOCAL_BACK_URL;
};

export const BACKEND_BASE_URL = getBackendBaseUrl();

// QR Table Session
export const startSessionApiUrl = `${getBackendBaseUrl()}/api/v1/sessions/start`;
export const sessionUrl = `${getBackendBaseUrl()}/api/v1/sessions/start?`;

// 2. Menu: GET /api/v1/menus/public
export const getPublicMenuUrl = `${getBackendBaseUrl()}/api/v1/menus/public`;
export const getPublicMenuAltUrl = `${getBackendBaseUrl()}/api/v1/menu/public`;

// 3. Orders: POST /api/v1/orders
export const placeOrderUrl = `${getBackendBaseUrl()}/api/v1/orders`;
export const placeOrderAltUrl = `${getBackendBaseUrl()}/api/v1/orders`;
export const getOrderUrl = (orderId) => `${getBackendBaseUrl()}/api/v1/orders/customer/${orderId}`;
export const getMyOrdersUrl = `${getBackendBaseUrl()}/api/v1/customer/my-orders`;

// 4. Customer CRM: POST /api/v1/customer/login, GET /api/v1/customer/me
export const createCustomerUrl = `${getBackendBaseUrl()}/api/v1/customer/login`;
export const getCustomerProfileUrl = `${getBackendBaseUrl()}/api/v1/customer/me`;
export const feedbackUrl = `${getBackendBaseUrl()}/api/v1/feedback`;

<<<<<<< HEAD

// Branch info
export const getBranchUrl = (branchId) => `${getBackendBaseUrl()}/api/v1/branch/${branchId}`;

=======
>>>>>>> 6efab485007ad435303f04ac0d3c8ba30fdfb117



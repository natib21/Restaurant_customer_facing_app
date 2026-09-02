const BACKEND_BASE_URL = "https://restaurant-bo.onrender.com";
const LOCAL_BACK_URL = "http://localhost:8000"

// QR Table Session
export const startSessionApiUrl = `${LOCAL_BACK_URL}/api/v1/sessions/start`;
export const sessionUrl = `${LOCAL_BACK_URL}/api/v1/sessions/start?`;

// 2. Menu: GET /api/v1/menus/public
export const getPublicMenuUrl = `${LOCAL_BACK_URL}/api/v1/menu/public`;
export const getPublicMenuAltUrl = `${LOCAL_BACK_URL}/api/v1/menu/public`;

// 3. Orders: POST /api/v1/orders
export const placeOrderUrl = `${LOCAL_BACK_URL}/api/v1/orders`;
export const placeOrderAltUrl = `${LOCAL_BACK_URL}/api/v1/order`;
export const getOrderUrl = (orderId) => `${LOCAL_BACK_URL}/api/v1/orders/${orderId}`;
export const getMyOrdersUrl = `${LOCAL_BACK_URL}/api/v1/customer/my-orders`;

// 4. Customer CRM: POST /api/v1/customer/login, GET /api/v1/customer/me
export const createCustomerUrl = `${LOCAL_BACK_URL}/api/v1/customer/login`;
export const getCustomerProfileUrl = `${LOCAL_BACK_URL}/api/v1/customer/me`;
export const feedbackUrl = `${LOCAL_BACK_URL}/api/v1/feedback`;



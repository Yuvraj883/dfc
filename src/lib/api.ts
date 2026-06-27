export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  calories: number | null;
  allergens: string[];
  spice_level: number;
  is_vegetarian: boolean;
  is_gluten_free: boolean;
  is_available: boolean;
  is_featured: boolean;
  customizations: Customization[];
}

export interface Customization {
  id: string;
  name: string;
  customization_type: string;
  options: Record<string, string>;
  extra_price: number;
  is_global: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  items: MenuItem[];
}

export interface MenuResponse {
  categories: MenuCategory[];
  global_customizations: Customization[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  loyalty_points: number;
}

export interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  selected_customizations: Record<string, unknown>;
  line_price: number;
}

export interface Order {
  id: string;
  order_type: string;
  status: string;
  subtotal: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
  payment_status: string;
  pickup_time: string | null;
  loyalty_points_earned: number;
  created_at: string;
  items: OrderItem[];
  guest_token?: string;
}

export interface Settings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  hours: Record<string, { open: string; close: string }>;
  holiday_closures: string[];
  banner_text: string | null;
  announcement: string | null;
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  source: string;
  created_at: string;
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
  remaining: number;
}

export interface DashboardStats {
  today_orders: number;
  today_revenue: number;
  today_reservations: number;
  pending_orders: number;
  popular_items: { name: string; count: number }[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  getMenu: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<MenuResponse>(`/api/menu${qs}`);
  },
  getSettings: () => request<Settings>("/api/settings"),
  getReviews: () => request<Review[]>("/api/reviews"),
  signup: (data: { name: string; email: string; password: string; phone?: string }) =>
    request<User>("/api/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<{ access_token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
  me: () => request<User>("/api/auth/me"),
  getGoogleLoginUrl: () => request<{ url: string }>("/api/auth/google/login"),
  googleCallback: (code: string) => 
    request<User>(`/api/auth/google/callback?code=${code}`, { method: "POST" }),
  validateTable: (token: string) =>
    request<{ valid: boolean; expires_at: string }>(`/api/table/validate?t=${token}`),
  createOrder: (data: unknown, tableToken?: string | null) => {
    const qs = tableToken ? `?t=${tableToken}` : "";
    return request<Order>(`/api/orders${qs}`, { method: "POST", body: JSON.stringify(data) });
  },
  getOrder: (id: string, token?: string) => {
    const qs = token ? `?token=${token}` : "";
    return request<Order>(`/api/orders/${id}${qs}`);
  },
  getMyOrders: () => request<Order[]>("/api/orders"),
  validatePromo: (code: string, subtotal: number) =>
    request<{ valid: boolean; discount: number; message: string }>("/api/promo/validate", {
      method: "POST",
      body: JSON.stringify({ code, subtotal }),
    }),
  getAvailability: (date: string) =>
    request<{ date: string; slots: AvailabilitySlot[] }>(`/api/reservations/availability?date=${date}`),
  createReservation: (data: unknown) =>
    request<unknown>("/api/reservations", { method: "POST", body: JSON.stringify(data) }),
  cancelReservation: (token: string) =>
    request<{ ok: boolean }>(`/api/reservations/cancel?token=${token}`, { method: "POST" }),
  createPaymentIntent: (orderId: string) =>
    request<{ client_secret: string; payment_intent_id: string; mock: boolean }>(
      `/api/payments/create-intent?order_id=${orderId}`,
      { method: "POST" }
    ),
  confirmMockPayment: (orderId: string, paymentIntentId: string) =>
    request<{ ok: boolean }>(
      `/api/payments/confirm-mock/${orderId}?payment_intent_id=${paymentIntentId}`,
      { method: "POST" }
    ),
  submitCatering: (data: unknown) =>
    request<{ ok: boolean; message: string }>("/api/catering", { method: "POST", body: JSON.stringify(data) }),
  submitContact: (data: unknown) =>
    request<{ ok: boolean; message: string }>("/api/contact", { method: "POST", body: JSON.stringify(data) }),
  adminDashboard: () => request<DashboardStats>("/api/admin/dashboard"),
  adminOrders: () => request<Order[]>("/api/admin/orders"),
  adminUpdateOrderStatus: (id: string, status: string) =>
    request<Order>(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  adminReservations: () => request<unknown[]>("/api/admin/reservations"),
  adminTables: () => request<{ id: string; table_number: number; capacity: number; qr_url: string | null }[]>("/api/admin/tables"),
  adminUpdateMenuItem: (id: string, data: Partial<MenuItem>) =>
    request<{ ok: boolean }>(`/api/admin/menu/item/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  adminCreateMenuItem: (data: Partial<MenuItem> & { category_id: string }) =>
    request<{ id: string; name: string }>(`/api/admin/menu/item`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  adminDeleteMenuItem: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/menu/item/${id}`, {
      method: "DELETE",
    }),
  adminGetStaff: () =>
    request<{ id: string; name: string; email: string; role: string }[]>("/api/admin/staff"),
  adminCreateStaff: (data: unknown) =>
    request<{ id: string; name: string; email: string; role: string }>("/api/admin/staff", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  adminDeleteStaff: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/staff/${id}`, {
      method: "DELETE",
    }),
};

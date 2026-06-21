import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizationIds: string[];
  customizationLabels: string[];
  customizationExtra: number;
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  promoDiscount: number;
  tableToken: string | null;
  orderType: "pickup" | "dine_in";
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string, customizationIds: string[]) => void;
  updateQuantity: (menuItemId: string, customizationIds: string[], quantity: number) => void;
  setPromo: (code: string | null, discount: number) => void;
  setTableToken: (token: string | null) => void;
  setOrderType: (type: "pickup" | "dine_in") => void;
  clear: () => void;
  subtotal: () => number;
}

const itemKey = (id: string, cids: string[]) => `${id}:${cids.sort().join(",")}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      promoDiscount: 0,
      tableToken: null,
      orderType: "pickup",
      addItem: (item) =>
        set((state) => {
          const key = itemKey(item.menuItemId, item.customizationIds);
          const existing = state.items.find(
            (i) => itemKey(i.menuItemId, i.customizationIds) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.menuItemId, i.customizationIds) === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (menuItemId, customizationIds) =>
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.menuItemId, i.customizationIds) !== itemKey(menuItemId, customizationIds)
          ),
        })),
      updateQuantity: (menuItemId, customizationIds, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.menuItemId, i.customizationIds) === itemKey(menuItemId, customizationIds)
              ? { ...i, quantity }
              : i
          ).filter((i) => i.quantity > 0),
        })),
      setPromo: (code, discount) => set({ promoCode: code, promoDiscount: discount }),
      setTableToken: (token) =>
        set({ tableToken: token, orderType: token ? "dine_in" : get().orderType }),
      setOrderType: (type) => set({ orderType: type }),
      clear: () => set({ items: [], promoCode: null, promoDiscount: 0 }),
      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + (i.price + i.customizationExtra) * i.quantity,
          0
        ),
    }),
    { name: "dfc-cart" }
  )
);

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type MenuItem } from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import QRCode from "react-qr-code";

function MenuManager() {
  const { data, isLoading, refetch } = useQuery({ queryKey: ["admin-menu"], queryFn: () => api.getMenu() });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem> & { category_id?: string }>({});
  const [saving, setSaving] = useState(false);

  if (isLoading) return <div>Loading menu...</div>;

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleAddNew = (categoryId: string) => {
    setEditingId("NEW");
    setEditForm({ category_id: categoryId, name: "", description: "", price: 0, is_available: true, is_featured: false, image_url: "" });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId === "NEW") {
        await api.adminCreateMenuItem(editForm as any);
      } else if (editingId) {
        await api.adminUpdateMenuItem(editingId, editForm);
      }
      setEditingId(null);
      refetch();
    } catch (err) {
      alert("Failed to save menu item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setSaving(true);
    try {
      await api.adminDeleteMenuItem(id);
      if (editingId === id) setEditingId(null);
      refetch();
    } catch (err) {
      alert("Failed to delete menu item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {data?.categories.map((cat) => (
        <div key={cat.id}>
          <div className="mb-4 flex items-center justify-between border-b border-orange-100 pb-2">
            <h3 className="text-xl font-bold text-dfc-red">{cat.name}</h3>
            <button 
              onClick={() => handleAddNew(cat.id)}
              className="text-sm font-semibold text-dfc-red hover:text-dfc-red-dark bg-orange-50 px-3 py-1 rounded-full"
            >
              + Add Item
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cat.items.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <div key={item.id} className="rounded-xl border border-orange-100 p-4 bg-white">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Name</label>
                        <input
                          className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Description</label>
                        <textarea
                          className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                          value={editForm.description || ""}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs font-semibold text-gray-500">Price</label>
                          <input
                            type="number"
                            className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                            value={editForm.price || 0}
                            onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Image URL</label>
                        <input
                          className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                          value={editForm.image_url || ""}
                          onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={editForm.is_available ?? true}
                            onChange={(e) => setEditForm({ ...editForm, is_available: e.target.checked })}
                          />
                          Available
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={editForm.is_featured ?? false}
                            onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.checked })}
                          />
                          Featured
                        </label>
                      </div>
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                        <button onClick={() => handleDelete(item.id)} disabled={saving} className="text-xs font-semibold text-red-500 hover:text-red-700">
                          Delete
                        </button>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingId(null)} className="rounded px-3 py-1 text-sm text-gray-500 hover:bg-gray-100">Cancel</button>
                          <button onClick={() => handleSave()} disabled={saving} className="rounded bg-dfc-red px-3 py-1 text-sm text-white hover:bg-dfc-red-dark disabled:opacity-50">Save</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold">{item.name}</h4>
                        <span className="font-bold text-dfc-red">{formatPrice(item.price)}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2 h-8">{item.description}</p>
                      <div className="mt-2 text-xs flex gap-2">
                        <span className={item.is_available ? "text-green-600" : "text-red-500"}>
                          {item.is_available ? "Available" : "Hidden"}
                        </span>
                        {item.is_featured && <span className="text-yellow-600">Featured</span>}
                      </div>
                      <button onClick={() => handleEdit(item)} className="mt-3 w-full rounded-lg bg-orange-50 py-1.5 text-sm font-semibold text-dfc-red hover:bg-orange-100">
                        Edit Item
                      </button>
                    </>
                  )}
                </div>
              );
            })}

            {/* NEW ITEM FORM */}
            {editingId === "NEW" && editForm.category_id === cat.id && (
               <div className="rounded-xl border border-dfc-red p-4 bg-orange-50/50">
               <div className="space-y-3">
                 <div>
                   <label className="text-xs font-semibold text-gray-500">Name</label>
                   <input
                     className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                     value={editForm.name || ""}
                     onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                   />
                 </div>
                 <div>
                   <label className="text-xs font-semibold text-gray-500">Description</label>
                   <textarea
                     className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                     value={editForm.description || ""}
                     onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                   />
                 </div>
                 <div className="flex gap-2">
                   <div className="flex-1">
                     <label className="text-xs font-semibold text-gray-500">Price</label>
                     <input
                       type="number"
                       className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                       value={editForm.price || 0}
                       onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                     />
                   </div>
                 </div>
                 <div>
                   <label className="text-xs font-semibold text-gray-500">Image URL</label>
                   <input
                     className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                     value={editForm.image_url || ""}
                     onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                   />
                 </div>
                 <div className="flex items-center justify-between mt-2">
                   <label className="flex items-center gap-2 text-sm text-gray-700">
                     <input
                       type="checkbox"
                       checked={editForm.is_available ?? true}
                       onChange={(e) => setEditForm({ ...editForm, is_available: e.target.checked })}
                     />
                     Available
                   </label>
                   <label className="flex items-center gap-2 text-sm text-gray-700">
                     <input
                       type="checkbox"
                       checked={editForm.is_featured ?? false}
                       onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.checked })}
                     />
                     Featured
                   </label>
                 </div>
                 <div className="flex justify-end gap-2 pt-2 mt-2 border-t border-orange-100">
                   <button onClick={() => setEditingId(null)} className="rounded px-3 py-1 text-sm text-gray-500 hover:bg-orange-100">Cancel</button>
                   <button onClick={() => handleSave()} disabled={saving} className="rounded bg-dfc-red px-3 py-1 text-sm text-white hover:bg-dfc-red-dark disabled:opacity-50">Save Item</button>
                 </div>
               </div>
             </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StaffManager() {
  const { data: staff, isLoading, refetch } = useQuery({ queryKey: ["admin-staff"], queryFn: () => api.adminGetStaff() });
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff" });
  const [saving, setSaving] = useState(false);

  if (isLoading) return <div>Loading staff...</div>;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.adminCreateStaff(form);
      setForm({ name: "", email: "", password: "", role: "staff" });
      refetch();
    } catch (err: any) {
      alert("Failed to create staff account");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this staff account?")) return;
    setSaving(true);
    try {
      await api.adminDeleteStaff(id);
      refetch();
    } catch (err) {
      alert("Failed to delete staff account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
        <h3 className="mb-4 text-lg font-bold text-dfc-red">Add New Staff</h3>
        <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Name"
            required
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Password"
            required
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="flex gap-2">
            <select
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="staff">Staff</option>
              <option value="owner">Owner</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-dfc-red px-4 py-2 text-sm font-semibold text-white hover:bg-dfc-red-dark disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-bold">Current Staff</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staff?.map((s) => (
            <div key={s.id} className="flex flex-col justify-between rounded-xl border border-orange-100 p-4">
              <div>
                <h4 className="font-semibold">{s.name}</h4>
                <p className="text-sm text-gray-500">{s.email}</p>
                <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-gray-600">
                  {s.role}
                </span>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                disabled={saving}
                className="mt-4 text-left text-sm font-semibold text-red-500 hover:text-red-700"
              >
                Remove Account
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: stats } = useQuery({ queryKey: ["admin-dashboard"], queryFn: () => api.adminDashboard(), retry: false });
  const { data: orders } = useQuery({ queryKey: ["admin-orders"], queryFn: () => api.adminOrders(), retry: false });
  const { data: tables } = useQuery({ queryKey: ["admin-tables"], queryFn: () => api.adminTables(), retry: false });

  if (!stats) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-4 text-gray-600">Login as staff/owner to access admin features.</p>
        <p className="mt-2 text-sm text-gray-500">Demo: owner@dfc.com / owner12345</p>
      </div>
    );
  }

  const updateStatus = async (id: string, status: string) => {
    await api.adminUpdateOrderStatus(id, status);
    window.location.reload();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between border-b border-orange-100 pb-4 gap-4">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex gap-2">
          {["dashboard", "menu", "staff"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold capitalize transition",
                activeTab === tab ? "bg-dfc-red text-white" : "bg-orange-50 text-gray-700 hover:bg-orange-100"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "dashboard" && (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Today's Orders", value: stats.today_orders },
              { label: "Revenue", value: formatPrice(stats.today_revenue) },
              { label: "Reservations", value: stats.today_reservations },
              { label: "Pending", value: stats.pending_orders },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-orange-50 p-4">
                <p className="text-sm text-gray-600">{s.label}</p>
                <p className="text-2xl font-bold text-dfc-red">{s.value}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-4 text-xl font-bold">Live Orders</h2>
          <div className="mb-8 space-y-3">
            {orders?.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-orange-100 p-4">
                <div>
                  <p className="font-semibold">#{o.id.slice(0, 8)} · {o.order_type}</p>
                  <p className="text-sm text-gray-500 capitalize">{o.status} · {formatPrice(o.total)}</p>
                </div>
                <div className="flex gap-2">
                  {["preparing", "ready", "completed"].map((s) => (
                    <button key={s} onClick={() => updateStatus(o.id, s)} className="rounded-lg bg-orange-100 px-3 py-1 text-xs font-medium capitalize hover:bg-orange-200">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h2 className="mb-4 text-xl font-bold">Table QR Codes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tables?.map((t) => (
              <div key={t.id} className="flex flex-col items-center rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-800">Table {t.table_number}</h3>
                {t.qr_url ? (
                  <>
                    <div className="mb-4 rounded-xl border-4 border-white shadow-sm ring-1 ring-gray-100 bg-white p-2">
                      <QRCode value={t.qr_url} size={150} level="M" />
                    </div>
                    <div className="flex w-full gap-2">
                      <a
                        href={t.qr_url}
                        target="_blank"
                        className="flex-1 rounded-lg border border-orange-100 bg-orange-50 py-2 text-center text-xs font-semibold text-dfc-red hover:bg-orange-100"
                      >
                        Open Link
                      </a>
                      <button
                        onClick={() => window.print()}
                        className="flex-1 rounded-lg bg-gray-100 py-2 text-center text-xs font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Print All
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No QR generated.</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      
      {activeTab === "menu" && <MenuManager />}
      {activeTab === "staff" && <StaffManager />}
    </div>
  );
}

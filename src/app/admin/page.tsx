"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type MenuItem, API_URL } from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import QRCode from "react-qr-code";
import { toast } from "sonner";

function MenuManager() {
  const { data, isLoading, refetch } = useQuery({ queryKey: ["admin-menu"], queryFn: () => api.getMenu() });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem> & { category_id?: string }>({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const data = await api.adminUploadImage(formData);
      setEditForm(prev => ({ ...prev, image_url: data.url }));
    } catch (err) {
      alert("Failed to upload image");
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

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
        await api.adminCreateMenuItem(editForm as Parameters<typeof api.adminCreateMenuItem>[0]);
      } else if (editingId) {
        await api.adminUpdateMenuItem(editingId, editForm);
      }
      setEditingId(null);
      refetch();
    } catch {
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
    } catch {
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
                        <label className="text-xs font-semibold text-gray-500">Image</label>
                        {editForm.image_url ? (
                          <div className="mt-1 mb-2 relative h-32 w-full rounded-xl overflow-hidden border border-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={editForm.image_url} alt="Preview" className="object-cover w-full h-full" />
                            <button 
                              onClick={() => setEditForm(prev => ({ ...prev, image_url: "" }))}
                              className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-dfc-red hover:file:bg-orange-100 cursor-pointer disabled:opacity-50"
                            />
                            {uploadingImage && <span className="text-xs font-bold text-dfc-red animate-pulse">Uploading...</span>}
                          </div>
                        )}
                        {!editForm.image_url && (
                          <input
                            placeholder="Or paste an image URL directly"
                            className="mt-2 w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-500 placeholder-gray-400"
                            value={editForm.image_url || ""}
                            onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                          />
                        )}
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
                    <label className="text-xs font-semibold text-gray-500">Image</label>
                    {editForm.image_url ? (
                      <div className="mt-1 mb-2 relative h-32 w-full rounded-xl overflow-hidden border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={editForm.image_url} alt="Preview" className="object-cover w-full h-full" />
                        <button 
                          onClick={() => setEditForm(prev => ({ ...prev, image_url: "" }))}
                          className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-dfc-red hover:file:bg-orange-100 cursor-pointer disabled:opacity-50"
                        />
                        {uploadingImage && <span className="text-xs font-bold text-dfc-red animate-pulse">Uploading...</span>}
                      </div>
                    )}
                    {!editForm.image_url && (
                      <input
                        placeholder="Or paste an image URL directly"
                        className="mt-2 w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-500 placeholder-gray-400"
                        value={editForm.image_url || ""}
                        onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                      />
                    )}
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
    } catch {
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
    } catch {
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
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!stats) return;

    const wsUrl = API_URL.replace(/^http/, "ws") + "/api/ws/admin";
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "new_order") {
          const audio = new Audio("/notification.mp3");
          audio.play().catch(console.error);

          toast.success(`New Order #${data.order.id.slice(0, 6).toUpperCase()} received!`, {
            description: `Total: ${formatPrice(data.order.total)}`,
            duration: 8000,
          });

          queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
          queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
        }
      } catch (err) {
        console.error(err);
      }
    };

    return () => {
      ws.close();
    };
  }, [stats, queryClient]);

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
      <div className="mb-10 flex flex-col sm:flex-row items-center justify-between rounded-3xl bg-white p-4 shadow-sm border border-gray-100 gap-4">
        <h1 className="font-display text-3xl font-extrabold text-gray-900 ml-4">Admin Panel</h1>
        <div className="flex gap-2 rounded-2xl bg-gray-50 p-1 border border-gray-100">
          {["dashboard", "menu", "staff"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-xl px-5 py-2 text-sm font-bold capitalize transition-all duration-300",
                activeTab === tab ? "bg-white text-dfc-red shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "dashboard" && (
        <>
          <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Today's Orders", value: stats.today_orders },
              { label: "Revenue", value: formatPrice(stats.today_revenue) },
              { label: "Reservations", value: stats.today_reservations },
              { label: "Pending", value: stats.pending_orders },
            ].map((s) => (
              <div key={s.label} className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg shadow-gray-200/40 border border-gray-100">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-50 blur-2xl" />
                <p className="relative z-10 text-sm font-bold tracking-wide text-gray-500 uppercase">{s.label}</p>
                <p className="font-display relative z-10 mt-2 text-4xl font-extrabold text-dfc-red">{s.value}</p>
              </div>
            ))}
          </div>

          <h2 className="font-display mb-6 text-2xl font-extrabold text-gray-900">Live Orders</h2>
          <div className="mb-12 space-y-4">
            {orders?.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 font-bold text-dfc-red">
                    {o.order_type === "dine_in" ? "🍽" : "🥡"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Order #{o.id.slice(0, 6).toUpperCase()}</p>
                    <p className="text-sm text-gray-500 font-medium capitalize">{o.status} · {formatPrice(o.total)}</p>
                    {o.location_url && (
                      <a href={o.location_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        📍 View on Map
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {["preparing", "ready", "completed"].map((s) => (
                    <button 
                      key={s} 
                      onClick={() => updateStatus(o.id, s)} 
                      className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-all",
                        o.status === s 
                          ? "bg-dfc-red text-white shadow-md shadow-dfc-red/20" 
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-display mb-6 text-2xl font-extrabold text-gray-900">Table QR Codes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tables?.map((t) => (
              <div key={t.id} className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/40 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/60">
                <h3 className="font-display mb-4 text-xl font-extrabold text-gray-900">Table {t.table_number}</h3>
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

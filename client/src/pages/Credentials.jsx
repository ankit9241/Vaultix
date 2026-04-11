import React, { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Key,
  Sparkles,
  Edit2,
} from "lucide-react";
import { credentialService } from "../services/api";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ConfirmModal";
import Skeleton from "../components/ui/Skeleton";

const Credentials = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: "",
  });
  const [editingCredential, setEditingCredential] = useState(null);

  const [form, setForm] = useState({
    title: "",
    website: "",
    emailOrPhone: "",
    password: "",
    notes: "",
  });

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const res = await credentialService.getAll();
      setCredentials(res.data);
    } catch {
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleReveal = (id) => {
    const set = new Set(revealed);
    set.has(id) ? set.delete(id) : set.add(id);
    setRevealed(set);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const deleteCred = async (id) => {
    const credential = credentials.find((c) => c._id === id);
    setConfirmModal({
      isOpen: true,
      itemId: id,
      itemName: credential?.title || "this credential",
    });
  };

  const confirmDelete = async () => {
    if (confirmModal.itemId) {
      await credentialService.delete(confirmModal.itemId);
      setCredentials(credentials.filter((c) => c._id !== confirmModal.itemId));
      setConfirmModal({
        isOpen: false,
        itemId: null,
        itemName: "",
      });
    }
  };

  const createCred = async (e) => {
    e.preventDefault();
    await credentialService.create(form);
    setIsModalOpen(false);
    setForm({
      title: "",
      website: "",
      emailOrPhone: "",
      password: "",
      notes: "",
    });
    fetchCredentials();
  };

  const editCredential = (credential) => {
    setEditingCredential(credential);
    setForm({
      title: credential.title,
      website: credential.website,
      emailOrPhone: credential.emailOrPhone,
      password: credential.password,
      notes: credential.notes,
    });
    setIsModalOpen(true);
  };

  const updateCredential = async (e) => {
    e.preventDefault();
    await credentialService.update(editingCredential._id, form);
    setIsModalOpen(false);
    setEditingCredential(null);
    setForm({
      title: "",
      website: "",
      emailOrPhone: "",
      password: "",
      notes: "",
    });
    fetchCredentials();
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#f4f4f5]">
            Credentials
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-amber-300/80">
            Secure vault for account access
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-[#0e0e10] transition duration-200 hover:opacity-90"
        >
          <Plus size={16} />
          New Credential
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#111217]/90 shadow-sm shadow-black/10">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-12 gap-4 items-center">
                <Skeleton className="col-span-4 h-4" />
                <Skeleton className="col-span-3 h-4" />
                <Skeleton className="col-span-3 h-4" />
                <Skeleton className="col-span-2 h-4" />
              </div>
            ))}
          </div>
        ) : credentials.length === 0 ? (
          <div className="relative overflow-hidden p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(17,24,39,0.9),transparent_45%)]" />
            <div className="relative max-w-2xl mx-auto text-center space-y-5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-700 bg-[#151a24] shadow-lg shadow-black/20">
                <Key size={26} className="text-amber-300" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-[#f4f4f5]">
                  No credentials stored
                </h3>
                <p className="mx-auto max-w-xl text-sm leading-6 text-gray-400 md:text-base">
                  Save website logins, API keys, and account passwords securely
                  in your vault.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-[#0e0e10] shadow-lg shadow-amber-400/20 transition duration-200 hover:opacity-90"
                >
                  <Plus size={16} />
                  Add First Credential
                </button>
                <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-[#151a24] px-4 py-3 text-sm text-gray-400">
                  <Sparkles size={14} className="text-amber-300" />
                  Store secrets with encrypted fields
                </div>
              </div>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#1a202d] text-xs uppercase tracking-[0.12em] text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left">Resource</th>
                <th className="px-6 py-4 text-left">Username</th>
                <th className="px-6 py-4 text-left">Password</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {credentials.map((c) => (
                <tr
                  key={c._id}
                  className="border-t border-gray-800 transition-colors hover:bg-[#1a202d]"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-[#f4f4f5]">{c.title}</p>
                      <p className="text-xs text-gray-500">{c.website}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-mono text-gray-400">
                    {c.emailOrPhone}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-gray-400">
                        {revealed.has(c._id) ? c.password : "••••••••••"}
                      </span>

                      <button
                        onClick={() => toggleReveal(c._id)}
                        className="text-gray-500 transition-colors hover:text-amber-300"
                      >
                        {revealed.has(c._id) ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => editCredential(c)}
                        className="text-gray-500 transition-colors hover:text-amber-300"
                        title="Edit credential"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => copy(c.password)}
                        className="text-gray-500 transition-colors hover:text-amber-300"
                      >
                        <Copy size={16} />
                      </button>

                      <button
                        onClick={() => deleteCred(c._id)}
                        className="text-gray-500 transition-colors hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCredential(null);
          setForm({
            title: "",
            website: "",
            emailOrPhone: "",
            password: "",
            notes: "",
          });
        }}
        title={editingCredential ? "Edit Credential" : "New Credential"}
      >
        <form
          onSubmit={editingCredential ? updateCredential : createCred}
          className="space-y-4"
        >
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-[#151a24] px-3 py-2 text-[#f4f4f5] outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20"
          />

          <input
            placeholder="Website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-[#151a24] px-3 py-2 text-[#f4f4f5] outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20"
          />

          <input
            placeholder="Email / Username"
            value={form.emailOrPhone}
            onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-[#151a24] px-3 py-2 text-[#f4f4f5] outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-[#151a24] px-3 py-2 text-[#f4f4f5] outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20"
          />

          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-[#151a24] px-3 py-2 text-[#f4f4f5] outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20"
          />

          <button className="w-full rounded-lg bg-amber-400 py-2 font-semibold text-[#0e0e10] transition duration-200 hover:opacity-90">
            {editingCredential ? "Update Credential" : "Save Credential"}
          </button>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({
            ...confirmModal,
            isOpen: false,
            itemId: null,
            itemName: "",
          })
        }
        onConfirm={confirmDelete}
        title="Delete Credential"
        message={`Are you sure you want to delete "${confirmModal.itemName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Credentials;

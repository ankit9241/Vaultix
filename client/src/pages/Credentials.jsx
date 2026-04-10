import React, { useState, useEffect } from "react";
import { Plus, Eye, EyeOff, Copy, Trash2, Key, Sparkles, Edit2 } from "lucide-react";
import { credentialService } from "../services/api";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ConfirmModal";

const Credentials = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: ""
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
    const credential = credentials.find(c => c._id === id);
    setConfirmModal({
      isOpen: true,
      itemId: id,
      itemName: credential?.title || "this credential"
    });
  };

  const confirmDelete = async () => {
    if (confirmModal.itemId) {
      await credentialService.delete(confirmModal.itemId);
      setCredentials(credentials.filter((c) => c._id !== confirmModal.itemId));
      setConfirmModal({
        isOpen: false,
        itemId: null,
        itemName: ""
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
          <h1 className="text-3xl font-bold text-white">Credentials</h1>
          <p className="text-sm text-textMuted">
            Secure vault for account access
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Plus size={16} />
          New Credential
        </button>
      </div>

      {/* Table */}
      <div className="bg-panel border border-border rounded-2xl overflow-hidden shadow-sm shadow-black/10">
        {loading ? (
          <div className="p-6 text-textMuted">Loading...</div>
        ) : credentials.length === 0 ? (
          <div className="relative overflow-hidden p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.9),transparent_45%)]" />
            <div className="relative max-w-2xl mx-auto text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0a0e18] border border-border flex items-center justify-center shadow-lg shadow-black/20">
                <Key size={26} className="text-primary" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-white">
                  No credentials stored
                </h3>
                <p className="text-sm md:text-base text-textMuted leading-6 max-w-xl mx-auto">
                  Save website logins, API keys, and account passwords securely
                  in your vault.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary px-5 py-3 rounded-lg text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/20"
                >
                  <Plus size={16} />
                  Add First Credential
                </button>
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-[#0a0e18] text-textMuted text-sm">
                  <Sparkles size={14} className="text-primary" />
                  Store secrets with encrypted fields
                </div>
              </div>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#1c1f2a] text-textMuted text-xs uppercase">
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
                  className="border-t border-border hover:bg-[#1c1f2a] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-white">{c.title}</p>
                      <p className="text-xs text-textMuted">{c.website}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-mono text-textSecondary">
                    {c.emailOrPhone}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-textSecondary">
                        {revealed.has(c._id) ? c.password : "••••••••••"}
                      </span>

                      <button
                        onClick={() => toggleReveal(c._id)}
                        className="text-textMuted hover:text-white"
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
                        className="text-textMuted hover:text-primary"
                        title="Edit credential"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => copy(c.password)}
                        className="text-textMuted hover:text-primary"
                      >
                        <Copy size={16} />
                      </button>

                      <button
                        onClick={() => deleteCred(c._id)}
                        className="text-textMuted hover:text-red-500"
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
        <form onSubmit={editingCredential ? updateCredential : createCred} className="space-y-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />

          <input
            placeholder="Website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />

          <input
            placeholder="Email / Username"
            value={form.emailOrPhone}
            onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />

          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />

          <button className="w-full bg-primary py-2 rounded-lg font-semibold">
            {editingCredential ? "Update Credential" : "Save Credential"}
          </button>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({
          ...confirmModal,
          isOpen: false,
          itemId: null,
          itemName: ""
        })}
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

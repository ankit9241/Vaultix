import React, { useState, useEffect } from "react";
import { Plus, Eye, EyeOff, Copy, Trash2 } from "lucide-react";
import { credentialService } from "../services/api";
import Modal from "../components/ui/Modal";

const Credentials = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    await credentialService.delete(id);
    setCredentials(credentials.filter((c) => c._id !== id));
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
      <div className="bg-panel border border-border rounded-xl overflow-hidden">

        {loading ? (
          <div className="p-6 text-textMuted">Loading...</div>
        ) : credentials.length === 0 ? (
          <div className="p-10 text-center text-textMuted">
            No credentials stored
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
                  className="border-t border-border hover:bg-[#1c1f2a] group"
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
                        {revealed.has(c._id)
                          ? c.password
                          : "••••••••••"}
                      </span>

                      <button
                        onClick={() => toggleReveal(c._id)}
                        className="text-textMuted hover:text-white"
                      >
                        {revealed.has(c._id)
                          ? <EyeOff size={14} />
                          : <Eye size={14} />}
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100">

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

      {/* Security Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Insights */}
        <div className="md:col-span-2 bg-[#1c1f2a]/60 backdrop-blur-xl p-6 rounded-xl border border-border">

          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">
                Security Insights
              </h3>
              <p className="text-sm text-textMuted">
                Entropy and usage patterns
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs text-primary font-semibold">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="flex items-end gap-2 h-28">
            {[40, 65, 90, 55, 75, 30, 85].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t ${
                  i === 2 ? "bg-primary" : "bg-[#2a2e3a]"
                }`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          <div className="flex justify-between mt-3 text-[10px] text-textMuted uppercase">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

        </div>

        {/* Vault Health */}
        <div className="bg-panel p-6 rounded-xl border border-border flex flex-col justify-between">

          <div>
            <p className="text-xs text-textMuted uppercase mb-2">
              Vault Health
            </p>

            <div className="text-3xl font-bold text-primary">
              92<span className="text-textMuted text-lg">%</span>
            </div>

            <p className="text-sm text-textMuted mt-2">
              Strong password entropy detected
            </p>
          </div>

          <button className="mt-6 w-full bg-code border border-border py-2 rounded-lg text-sm hover:bg-[#1c1f2a] transition">
            Run Security Audit
          </button>

        </div>

      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Credential"
      >
        <form onSubmit={createCred} className="space-y-4">

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />

          <input
            placeholder="Website"
            value={form.website}
            onChange={(e) =>
              setForm({ ...form, website: e.target.value })
            }
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />

          <input
            placeholder="Email / Username"
            value={form.emailOrPhone}
            onChange={(e) =>
              setForm({ ...form, emailOrPhone: e.target.value })
            }
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />

          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />

          <button className="w-full bg-primary py-2 rounded-lg font-semibold">
            Save Credential
          </button>

        </form>
      </Modal>

    </div>
  );
};

export default Credentials;
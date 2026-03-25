import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { noteService } from "../services/api";
import Modal from "../components/ui/Modal";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await noteService.getAll();
      setNotes(res.data);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    await noteService.create(form);
    setIsModalOpen(false);
    setForm({ title: "", content: "" });
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await noteService.delete(id);
    setNotes(notes.filter((n) => n._id !== id));
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Technical Notes
          </h1>
          <p className="text-xs text-textMuted uppercase">
            Architectural logs & configs
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="text-textMuted">Loading...</div>
      ) : notes.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl h-48 flex items-center justify-center text-textMuted">
          No notes yet
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {notes.map((note) => (
            <div
              key={note._id}
              onClick={() => setSelectedNote(note)}
              className="bg-[#1c1f2a] rounded-xl p-6 cursor-pointer hover:ring-1 hover:ring-primary/30 transition flex flex-col h-60"
            >

              {/* Title */}
              <h3 className="font-bold text-white text-lg mb-3">
                {note.title}
              </h3>

              {/* Content */}
              <p className="text-sm text-textMuted line-clamp-4 mb-auto">
                {note.content}
              </p>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-textMuted">
                <span>{formatDate(note.createdAt)}</span>
                <span>{note.content.length} chars</span>
              </div>

            </div>
          ))}

          {/* Add Card */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="border border-dashed border-border rounded-xl flex items-center justify-center text-textMuted hover:border-primary cursor-pointer"
          >
            + New Note
          </div>

        </div>
      )}

      {/* VIEW MODAL */}
      {selectedNote && (
        <Modal
          isOpen={!!selectedNote}
          onClose={() => setSelectedNote(null)}
          title={selectedNote.title}
        >
          <div className="space-y-4">

            <div className="flex justify-between text-xs text-textMuted">
              <span>{formatDate(selectedNote.createdAt)}</span>

              <button
                onClick={() => {
                  deleteNote(selectedNote._id);
                  setSelectedNote(null);
                }}
                className="text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="bg-code border border-border p-4 rounded-lg font-mono text-sm text-white whitespace-pre-wrap">
              {selectedNote.content}
            </div>

          </div>
        </Modal>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Note"
      >
        <form onSubmit={createNote} className="space-y-4">

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />

          <textarea
            rows={6}
            placeholder="Write your note..."
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white font-mono"
          />

          <button className="w-full bg-primary py-2 rounded-lg font-semibold">
            Save Note
          </button>

        </form>
      </Modal>

    </div>
  );
};

export default Notes;
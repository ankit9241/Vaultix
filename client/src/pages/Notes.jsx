import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Search,
  FileText,
  Copy,
  Check,
  Sparkles,
  Edit2,
} from "lucide-react";
import { noteService } from "../services/api";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ConfirmModal";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedNoteId, setCopiedNoteId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: ""
  });
  const [editingNote, setEditingNote] = useState(null);

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

  const editNote = (note) => {
    setEditingNote(note);
    setForm({ title: note.title, content: note.content });
    setIsModalOpen(true);
  };

  const updateNote = async (e) => {
    e.preventDefault();
    await noteService.update(editingNote._id, form);
    setIsModalOpen(false);
    setEditingNote(null);
    setForm({ title: "", content: "" });
    fetchNotes();
  };

  const deleteNote = async (id) => {
    const note = notes.find(n => n._id === id);
    setConfirmModal({
      isOpen: true,
      itemId: id,
      itemName: note?.title || "this note"
    });
  };

  const confirmDelete = async () => {
    if (confirmModal.itemId) {
      await noteService.delete(confirmModal.itemId);
      setNotes(notes.filter((n) => n._id !== confirmModal.itemId));
      if (selectedNote?._id === confirmModal.itemId) {
        setSelectedNote(null);
      }
      setConfirmModal({
        isOpen: false,
        itemId: null,
        itemName: ""
      });
    }
  };

  const copyNoteContent = async (note) => {
    await navigator.clipboard.writeText(note.content || "");
    setCopiedNoteId(note._id);
    setTimeout(() => setCopiedNoteId(null), 1500);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      note.title?.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">Technical Notes</h1>
          <p className="text-xs text-textMuted uppercase">
            Architectural logs & configs - {notes.length} total
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
        >
          <Plus size={16} />
          New Note
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search size={16} className="absolute left-3 top-3.5 text-textMuted" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes by title or content"
          className="w-full pl-10 pr-4 py-3 bg-code border border-border rounded-lg text-white placeholder:text-textMuted"
        />
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#1c1f2a] rounded-xl p-6 h-60 animate-pulse"
            />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-panel/80 p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.9),transparent_45%)]" />
          <div className="relative max-w-2xl mx-auto text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0a0e18] border border-border flex items-center justify-center shadow-lg shadow-black/20">
              <FileText size={26} className="text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">
                No notes yet
              </h3>
              <p className="text-sm md:text-base text-textMuted leading-6 max-w-xl mx-auto">
                Capture architecture decisions, setup commands, deployment
                notes, and team references in one clean workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary px-5 py-3 rounded-lg text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/20"
              >
                <Plus size={16} />
                Create First Note
              </button>
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-[#0a0e18] text-textMuted text-sm">
                <Sparkles size={14} className="text-primary" />
                Keep notes searchable and secure
              </div>
            </div>
          </div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel/70 px-6 py-10 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <h3 className="text-lg font-semibold text-white">
              No notes match "{searchQuery}"
            </h3>
            <p className="text-sm text-textMuted">
              Try a different keyword or clear the search to show all notes.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note._id}
              onClick={() => setSelectedNote(note)}
              className="bg-panel/70 border border-border rounded-2xl p-6 cursor-pointer hover:border-primary/40 hover:bg-[#1c1f2a] transition flex flex-col h-60 shadow-sm shadow-black/10"
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
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-textMuted">
                <span>{formatDate(note.createdAt)}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editNote(note);
                    }}
                    className="hover:text-primary"
                    title="Edit note"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyNoteContent(note);
                    }}
                    className="hover:text-primary"
                    title="Copy note"
                  >
                    {copiedNoteId === note._id ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note._id);
                    }}
                    className="hover:text-red-500"
                    title="Delete note"
                  >
                    <Trash2 size={14} />
                  </button>
                  <span>{(note.content || "").length} chars</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add Card */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="border border-dashed border-border rounded-2xl flex items-center justify-center text-textMuted hover:border-primary cursor-pointer min-h-[240px] bg-panel/40 hover:bg-[#1c1f2a] transition-all"
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

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedNote(null);
                    editNote(selectedNote);
                  }}
                  className="text-textMuted hover:text-primary"
                  title="Edit note"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => copyNoteContent(selectedNote)}
                  className="text-textMuted hover:text-primary"
                >
                  {copiedNoteId === selectedNote._id ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
                <button
                  onClick={() => {
                    deleteNote(selectedNote._id);
                  }}
                  className="text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="bg-code border border-border p-4 rounded-lg font-mono text-sm text-white whitespace-pre-wrap">
              {selectedNote.content}
            </div>
          </div>
        </Modal>
      )}

      {/* CREATE/EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
          setForm({ title: "", content: "" });
        }}
        title={editingNote ? "Edit Note" : "New Note"}
      >
        <form onSubmit={editingNote ? updateNote : createNote} className="space-y-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-code border border-border px-4 py-3 rounded-lg text-white"
          />

          <textarea
            rows={6}
            placeholder="Write your note..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full bg-code border border-border px-4 py-3 rounded-lg text-white font-mono"
          />

          <button className="w-full bg-primary py-2 rounded-lg font-semibold">
            {editingNote ? "Update Note" : "Save Note"}
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
        title="Delete Note"
        message={`Are you sure you want to delete "${confirmModal.itemName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Notes;

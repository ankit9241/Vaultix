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
import Skeleton from "../components/ui/Skeleton";

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
    itemName: "",
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
    const note = notes.find((n) => n._id === id);
    setConfirmModal({
      isOpen: true,
      itemId: id,
      itemName: note?.title || "this note",
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
        itemName: "",
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
          <h1 className="text-4xl font-semibold tracking-tight text-[#f4f4f5]">
            Technical Notes
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-amber-300/80">
            Architectural logs & configs - {notes.length} total
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-[#0e0e10] transition duration-200 hover:opacity-90"
        >
          <Plus size={16} />
          New Note
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search size={16} className="absolute left-3 top-3.5 text-gray-500" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes by title or content"
          className="w-full rounded-lg border border-gray-700 bg-[#151a24] py-3 pl-10 pr-4 text-[#f4f4f5] outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20"
        />
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-800 bg-[#111217]/90 p-6 h-60"
            >
              <Skeleton className="mb-4 h-5 w-2/3" />
              <Skeleton className="mb-2 h-3 w-full" />
              <Skeleton className="mb-2 h-3 w-5/6" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#111217]/85 p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(17,24,39,0.9),transparent_45%)]" />
          <div className="relative max-w-2xl mx-auto text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-700 bg-[#151a24] shadow-lg shadow-black/20">
              <FileText size={26} className="text-amber-300" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">
                No notes yet
              </h3>
              <p className="mx-auto max-w-xl text-sm leading-6 text-gray-400 md:text-base">
                Capture architecture decisions, setup commands, deployment
                notes, and team references in one clean workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-[#0e0e10] shadow-lg shadow-amber-400/20 transition duration-200 hover:opacity-90"
              >
                <Plus size={16} />
                Create First Note
              </button>
              <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-[#151a24] px-4 py-3 text-sm text-gray-400">
                <Sparkles size={14} className="text-amber-300" />
                Keep notes searchable and secure
              </div>
            </div>
          </div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-[#111217]/70 px-6 py-10 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <h3 className="text-lg font-semibold text-white">
              No notes match "{searchQuery}"
            </h3>
            <p className="text-sm text-gray-400">
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
              className="flex h-60 cursor-pointer flex-col rounded-2xl border border-gray-800 bg-[#111217]/80 p-6 shadow-sm shadow-black/10 transition duration-200 hover:border-amber-400/40 hover:bg-[#161b27]"
            >
              {/* Title */}
              <h3 className="font-bold text-white text-lg mb-3">
                {note.title}
              </h3>

              {/* Content */}
              <p className="mb-auto line-clamp-4 text-sm text-gray-400">
                {note.content}
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-3 text-xs text-gray-500">
                <span>{formatDate(note.createdAt)}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editNote(note);
                    }}
                    className="transition-colors hover:text-amber-300"
                    title="Edit note"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyNoteContent(note);
                    }}
                    className="transition-colors hover:text-amber-300"
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
            className="flex min-h-[240px] cursor-pointer items-center justify-center rounded-2xl border border-dashed border-gray-700 bg-[#111217]/50 text-gray-400 transition-all duration-200 hover:border-amber-400/60 hover:bg-[#171d2a] hover:text-amber-200"
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
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatDate(selectedNote.createdAt)}</span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedNote(null);
                    editNote(selectedNote);
                  }}
                  className="text-gray-500 transition-colors hover:text-amber-300"
                  title="Edit note"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => copyNoteContent(selectedNote)}
                  className="text-gray-500 transition-colors hover:text-amber-300"
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

            <div className="rounded-lg border border-gray-700 bg-[#151a24] p-4 font-mono text-sm text-[#f4f4f5] whitespace-pre-wrap">
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
        <form
          onSubmit={editingNote ? updateNote : createNote}
          className="space-y-4"
        >
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-[#151a24] px-4 py-3 text-[#f4f4f5] outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20"
          />

          <textarea
            rows={6}
            placeholder="Write your note..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-[#151a24] px-4 py-3 font-mono text-[#f4f4f5] outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20"
          />

          <button className="w-full rounded-lg bg-amber-400 py-2 font-semibold text-[#0e0e10] transition duration-200 hover:opacity-90">
            {editingNote ? "Update Note" : "Save Note"}
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

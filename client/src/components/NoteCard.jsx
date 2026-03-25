import React from 'react';
import { StickyNote, Trash2, Calendar, Maximize2 } from 'lucide-react';

const NoteCard = ({ note, onDelete, onClick }) => {
    return (
        <div
            onClick={() => onClick(note)}
            className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-indigo-600/50 hover:shadow-xl hover:shadow-indigo-600/5 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-64"
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(note._id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
                <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-indigo-50 transition-colors text-slate-400 group-hover:text-indigo-600">
                    <StickyNote size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate pr-8">
                    {note.title}
                </h3>
            </div>

            <div className="flex-1 overflow-hidden">
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-5 whitespace-pre-line">
                    {note.content}
                </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                        {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                    <Maximize2 size={16} />
                </div>
            </div>
        </div>
    );
};

export default NoteCard;

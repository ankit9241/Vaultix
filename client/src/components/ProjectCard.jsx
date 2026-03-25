import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ChevronRight, Trash2 } from 'lucide-react';

const ProjectCard = ({ project, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/projects/${project._id}`)}
            className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-indigo-600/50 hover:shadow-xl hover:shadow-indigo-600/5 transition-all cursor-pointer group relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-indigo-600 transition-colors"></div>

            <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                    <Layers size={24} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(project._id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {project.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-1 mb-4">
                    {project.description || 'No description provided.'}
                </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    {project.sectionCount || 0} Environments
                </span>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    );
};

export default ProjectCard;

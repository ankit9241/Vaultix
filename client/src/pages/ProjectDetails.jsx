import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Folder, ChevronRight, Settings } from 'lucide-react';
import { projectService, sectionService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSection, setNewSection] = useState({ name: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await sectionService.create(projectId, newSection);
            setIsModalOpen(false);
            setNewSection({ name: '' });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create section');
        } finally {
            setSubmitting(false);
        }
    };

    const fetchData = async () => {
        try {
            const pRes = await projectService.getById(projectId);
            setProject(pRes.data);
            const sRes = await sectionService.getAllByProject(projectId);
            setSections(sRes.data);
        } catch (err) {
            console.error('Failed to fetch project details', err);
            setError('Failed to load project data');
            setProject(null);
            setSections([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSection = async (id) => {
        if (window.confirm('Delete this section?')) {
            try {
                await sectionService.delete(id);
                setSections(sections.filter(s => s._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/projects')}>
                        <ArrowLeft size={16} className="mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-semibold text-primary">{project?.name || 'Loading...'}</h1>
                        <p className="text-text-secondary mt-1">{project?.description || 'Loading project details...'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary">
                        <Settings size={16} className="mr-2" />
                        Settings
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Folder size={16} className="mr-2" />
                        Create Folder
                    </Button>
                </div>
            </div>

            {/* Sections Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse">
                            <div className="space-y-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-lg"></div>
                                <div className="h-4 bg-slate-50 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-50 rounded w-1/2"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : sections.length === 0 ? (
                <Card className="text-center py-12">
                    <div className="w-16 h-16 bg-card rounded-lg flex items-center justify-center text-text-muted mx-auto mb-4">
                        <Folder size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">No folders yet</h3>
                    <p className="text-text-secondary mb-4">You must create a folder before adding environment variables</p>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Folder size={16} className="mr-2" />
                        Create Folder
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sections.map((section) => (
                        <Card 
                            key={section._id} 
                            hover 
                            onClick={() => navigate(`/projects/${projectId}/sections/${section._id}`)}
                            className="cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                    <Folder size={20} />
                                </div>
                                <ChevronRight size={16} className="text-text-muted" />
                            </div>
                            <h3 className="font-semibold text-primary mb-1">{section.name}</h3>
                            <p className="text-sm text-text-secondary mb-4">
                                Environment variables for {section.name} environment
                            </p>
                            <div className="flex items-center justify-between text-xs text-text-muted">
                                <span>{section.varCount || 0} variables</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSection(section._id);
                                    }}
                                    className="text-red-600 hover:bg-red-500/10 px-2"
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Folder Modal */}
            <Modal
                isOpen={isModalOpen}
                title="Create Folder"
                onClose={() => setIsModalOpen(false)}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">Folder Name</label>
                        <input
                            type="text"
                            required
                            value={newSection.name}
                            onChange={(e) => setNewSection({ name: e.target.value })}
                            placeholder="e.g. Frontend, Backend, Staging"
                            className="w-full bg-code text-text-primary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent placeholder:text-text-muted"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={submitting}
                            className="flex-1"
                        >
                            Create Folder
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProjectDetails;

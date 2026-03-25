import React from 'react';
import { Folder, ArrowRight } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const FolderCard = ({ folder, onNavigate }) => {
    return (
        <Card hover className="p-4 cursor-pointer" onClick={() => onNavigate(folder._id)}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Folder size={20} className="text-primary" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-text-primary">{folder.name}</h3>
                        <p className="text-sm text-text-secondary">{folder.description}</p>
                        <p className="text-xs text-text-muted mt-1">{folder.envCount} variables</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm">
                    <ArrowRight size={14} />
                </Button>
            </div>
        </Card>
    );
};

export default FolderCard;

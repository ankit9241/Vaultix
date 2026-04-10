import React from "react";
import { Folder, ArrowRight, Edit2, Trash2 } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import ConfirmModal from "./ConfirmModal";

const FolderCard = ({ folder, onNavigate, onEdit, onDelete }) => {
  const [confirmModal, setConfirmModal] = React.useState({
    isOpen: false,
    itemName: ""
  });

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(folder);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      itemName: folder.name
    });
  };

  const confirmDelete = () => {
    onDelete(folder._id);
    setConfirmModal({
      isOpen: false,
      itemName: ""
    });
  };

  return (
    <>
      <Card
        hover
        className="p-4 cursor-pointer"
        onClick={() => onNavigate(folder._id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Folder className="text-primary" size={20} />
            <div>
              <h3 className="font-semibold text-white">{folder.name}</h3>
              <p className="text-xs text-textMuted">
                {folder.envCount || 0} env files
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              title="Edit folder"
              className="text-textMuted hover:text-white"
            >
              <Edit2 size={14} className="text-textMuted" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              title="Delete folder"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </Button>
            <Button variant="ghost" size="sm">
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({
          ...confirmModal,
          isOpen: false,
          itemName: ""
        })}
        onConfirm={confirmDelete}
        title="Delete Folder"
        message={`Are you sure you want to delete "${confirmModal.itemName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default FolderCard;

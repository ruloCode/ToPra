import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreateTaskForm from "./CreateTaskForm";
import { Task } from "@/lib/tasks";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  taskToEdit?: Task;
}

export default function CreateTaskModal({ isOpen, onClose, onSuccess, taskToEdit }: CreateTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <CreateTaskForm
          initialTask={taskToEdit}
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
} 
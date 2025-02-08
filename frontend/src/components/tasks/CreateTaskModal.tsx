import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreateTaskForm from "./CreateTaskForm";
import ChatInterface from "./ChatInterface";
import { Task } from "@/lib/tasks";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  taskToEdit?: Task;
}

export default function CreateTaskModal({ isOpen, onClose, onSuccess, taskToEdit }: CreateTaskModalProps) {
  const [activeTab, setActiveTab] = useState<string>("form");
  const { toast } = useToast();

  const handleTaskCreated = (fromChat: boolean = false) => {
    toast({
      title: "¡Éxito!",
      description: "La tarea ha sido creada correctamente",
    });
    onSuccess();
    // Solo cerrar el modal si no viene del chat
    if (!fromChat) {
      onClose();
    }
  };

  const handleError = (error: Error) => {
    toast({
      title: "Error",
      description: "No se pudo crear la tarea. Por favor, intenta de nuevo.",
      variant: "destructive",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <CreateTaskForm
              initialTask={taskToEdit}
              onSuccess={handleTaskCreated}
              onCancel={onClose}
            />
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface 
              onTaskExtracted={() => {
                handleTaskCreated(true);
              }}
              isActive={activeTab === "chat"}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 
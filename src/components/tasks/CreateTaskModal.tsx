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
    onSuccess();
    toast({
      title: "¡Éxito!",
      description: "La tarea ha sido creada correctamente",
      duration: 3000,
    });
    
    if (!fromChat) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent 
        onInteractOutside={(e) => {
          if (activeTab === "chat") {
            e.preventDefault();
          }
        }}
        className="fixed left-0 right-0 bottom-0 sm:left-[50%] sm:top-[50%] sm:-translate-x-[50%] sm:-translate-y-[50%] sm:bottom-auto sm:max-w-[600px] sm:h-auto rounded-t-lg sm:rounded-lg p-0 bg-white dark:bg-background-paper border border-border dark:border-[#28282F]"
      >
        <DialogHeader className="px-6 py-4 border-b border-border dark:border-[#28282F]">
          <DialogTitle>{taskToEdit ? 'Editar tarea' : 'Crear nueva tarea'}</DialogTitle>
        </DialogHeader>

        {taskToEdit ? (
          <div className="px-6 pt-4 bg-white dark:bg-background-paper">
            <CreateTaskForm
              initialTask={taskToEdit}
              onSuccess={() => handleTaskCreated(false)}
            />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 px-6 bg-white dark:bg-background-paper">
              <TabsTrigger value="form">Formulario</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <div className="sm:max-h-[600px] bg-white dark:bg-background-paper">
              <TabsContent value="form" className="px-6 pt-4 m-0 overflow-y-auto">
                <CreateTaskForm
                  initialTask={taskToEdit}
                  onSuccess={() => handleTaskCreated(false)}
                />
              </TabsContent>

              <TabsContent value="chat" className="p-0 m-0 h-[500px]">
                <ChatInterface 
                  onTaskExtracted={() => {
                    handleTaskCreated(true);
                  }}
                  isActive={activeTab === "chat"}
                />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
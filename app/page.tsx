"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TaskCard, { Task } from "@/components/TaskCard";
import { Plus, Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/lib/hooks";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("MEDIUM");
  const [newDueDate, setNewDueDate] = useState("");
  const [newDuration, setNewDuration] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTasks();
    }
  }, [status, router, debouncedSearch]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tasks?search=${encodeURIComponent(debouncedSearch)}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent, taskStatus: string) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: newTitle, 
          description: newDesc, 
          status: taskStatus, 
          priority: newPriority,
          dueDate: newDueDate || null,
          duration: newDuration || null
        }),
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
        closeAddForm();
      }
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const closeAddForm = () => {
    setIsAdding(null);
    setNewTitle("");
    setNewDesc("");
    setNewPriority("MEDIUM");
    setNewDueDate("");
    setNewDuration("");
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error("Failed to update task", error);
      fetchTasks();
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setTasks(tasks.filter(t => t.id !== id));
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Failed to delete task", error);
      fetchTasks();
    }
  };

  if (status === "loading" || (loading && tasks.length === 0 && !searchQuery)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const columns = [
    { id: "TODO", title: "To Do", color: "border-slate-300", bg: "bg-slate-100/50" },
    { id: "IN_PROGRESS", title: "In Progress", color: "border-indigo-300", bg: "bg-indigo-50/30" },
    { id: "DONE", title: "Done", color: "border-emerald-300", bg: "bg-emerald-50/30" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Header Area */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Board</h1>
            <p className="text-slate-500 mt-1 text-sm mb-3">Manage your tasks effortlessly.</p>
            
            {/* Task Stats connected to database state */}
            {tasks.length > 0 && (
              <div className="flex items-center gap-3 text-xs font-semibold">
                <div className="flex items-center bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"></span>
                  In Progress: {tasks.filter(t => t.status === "IN_PROGRESS").length}
                </div>
                <div className="flex items-center bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                  Done: {tasks.filter(t => t.status === "DONE").length}
                </div>
                <div className="flex items-center bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-slate-400 mr-1.5"></span>
                  To Do: {tasks.filter(t => t.status === "TODO").length}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-white placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow shadow-sm"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Kanban Board */}
        <div className="flex-grow flex flex-col sm:flex-row gap-6 overflow-x-auto pb-4">
          {columns.map((column, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={column.id} 
              className={`flex-1 min-w-[320px] flex flex-col bg-slate-100/50 rounded-2xl border ${column.color} overflow-hidden shadow-sm`}
            >
              {/* Column Header */}
              <div className="px-4 py-3 border-b border-slate-200/50 bg-white/50 backdrop-blur-sm flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-slate-800">{column.title}</h2>
                  <span className="bg-white text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm border border-slate-200">
                    {tasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
                <button
                  onClick={() => setIsAdding(column.id)}
                  className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Column Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                
                <AnimatePresence>
                  {/* Add Task Form (Inline) */}
                  {isAdding === column.id && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      onSubmit={(e) => handleAddTask(e, column.id)} 
                      className="bg-white p-4 rounded-xl shadow-lg shadow-slate-200/50 border border-indigo-200 mb-4 overflow-hidden"
                    >
                      <input
                        type="text"
                        required
                        placeholder="What needs to be done?"
                        className="w-full text-sm font-semibold text-slate-900 mb-2 border-b border-slate-200 focus:outline-none focus:border-indigo-500 bg-transparent px-1 py-1"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        autoFocus
                      />
                      <textarea
                        placeholder="Add details..."
                        className="w-full text-xs text-slate-600 mb-3 border border-slate-200 rounded focus:outline-none focus:border-indigo-400 bg-transparent px-2 py-1.5 min-h-[60px] resize-none"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                      />
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Priority</span>
                          <select
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value)}
                            className="w-full text-xs font-semibold bg-slate-100 rounded px-1.5 py-1.5 text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Due Date</span>
                          <input 
                            type="date"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                            className="w-full text-xs font-semibold bg-slate-100 rounded px-1.5 py-1.5 text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Duration</span>
                          <input 
                            type="text"
                            placeholder="e.g. 2 hours"
                            value={newDuration}
                            onChange={(e) => setNewDuration(e.target.value)}
                            className="w-full text-xs font-semibold bg-slate-100 rounded px-1.5 py-1.5 text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={closeAddForm}
                          className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-xs font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-700 shadow-sm transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Tasks List */}
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {tasks
                      .filter(t => t.status === column.id)
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onUpdate={handleUpdateTask}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                  </AnimatePresence>
                  
                  {tasks.filter(t => t.status === column.id).length === 0 && isAdding !== column.id && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50"
                    >
                      No tasks yet
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

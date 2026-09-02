"use client";

import { useState } from "react";
import { Trash2, Edit2, ArrowRight, ArrowLeft, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  duration: string | null;
};

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || "");
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
  const [editDuration, setEditDuration] = useState(task.duration || "");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-rose-500";
      case "MEDIUM":
        return "bg-amber-500";
      case "LOW":
        return "bg-emerald-500";
      default:
        return "bg-slate-400";
    }
  };

  const handleSave = () => {
    onUpdate(task.id, { 
      title: editTitle, 
      description: editDesc, 
      priority: editPriority,
      dueDate: editDueDate || null,
      duration: editDuration || null
    });
    setIsEditing(false);
  };

  const moveStatus = (direction: 'forward' | 'backward') => {
    const statuses = ["TODO", "IN_PROGRESS", "DONE"];
    const currentIndex = statuses.indexOf(task.status);
    let nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < statuses.length) {
      onUpdate(task.id, { status: statuses[nextIndex] });
    }
  };

  if (isEditing) {
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white p-4 rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 mb-4"
      >
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-base font-bold text-slate-900 mb-3 border-b-2 border-indigo-100 focus:outline-none focus:border-indigo-500 bg-slate-50 px-2 py-1.5 rounded-t-md transition-colors"
          placeholder="Task title"
          autoFocus
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          className="w-full text-slate-800 mb-3 border-2 border-slate-100 rounded-md focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-slate-50 px-3 py-2 text-sm min-h-[80px] resize-none transition-all"
          placeholder="Description (optional)"
        />
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Priority</span>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-100 border-none rounded-md px-2 py-1.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
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
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-100 border-none rounded-md px-2 py-1.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
             />
          </div>
          <div className="col-span-2">
             <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Duration (e.g. 2h, 30m)</span>
             <input 
                type="text" 
                placeholder="Time needed"
                value={editDuration}
                onChange={(e) => setEditDuration(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-100 border-none rounded-md px-2 py-1.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
             />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all active:scale-95"
          >
            Save Task
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className="group bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all duration-200 mb-3 relative overflow-hidden flex flex-col"
    >
      {/* Priority Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityColor(task.priority)}`} />
      
      <div className="pl-2 flex-grow">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className={`text-base font-semibold leading-snug ${task.status === "DONE" ? "line-through text-slate-400" : "text-slate-800"}`}>
            {task.title}
          </h3>
          <span className="flex items-center space-x-1 ml-2 mt-0.5 shrink-0">
            <span className={`h-2.5 w-2.5 rounded-full ${getPriorityColor(task.priority)} shadow-sm`} title={`Priority: ${task.priority}`} />
          </span>
        </div>
        
        {task.description && (
          <p className={`text-sm mb-3 line-clamp-3 ${task.status === "DONE" ? "text-slate-400" : "text-slate-600"}`}>
            {task.description}
          </p>
        )}
        
        {/* Meta Info (Date & Duration) */}
        {(task.dueDate || task.duration) && (
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-slate-50">
            {task.dueDate && (
              <div className={`flex items-center text-[11px] font-medium ${new Date(task.dueDate) < new Date() && task.status !== "DONE" ? 'text-rose-500' : 'text-slate-500'}`}>
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {format(new Date(task.dueDate), "MMM d, yyyy")}
              </div>
            )}
            {task.duration && (
              <div className="flex items-center text-[11px] font-medium text-slate-500">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {task.duration}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Action Bar (shows on hover or active) */}
      <div className="pl-2 mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex space-x-1">
          {task.status !== "TODO" && (
            <button
              onClick={() => moveStatus('backward')}
              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
              title="Move left"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          {task.status !== "DONE" && (
            <button
              onClick={() => moveStatus('forward')}
              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
              title="Move right"
            >
              <ArrowRight size={16} />
            </button>
          )}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

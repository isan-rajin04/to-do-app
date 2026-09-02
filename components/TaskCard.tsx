"use client";

import { useState } from "react";
import { Trash2, Edit2, ArrowRight, ArrowLeft } from "lucide-react";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
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
    onUpdate(task.id, { title: editTitle, description: editDesc, priority: editPriority });
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
      <div className="bg-white p-4 rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 mb-4 animate-in fade-in zoom-in-95 duration-200">
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
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-slate-500">Priority:</span>
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
            className="text-xs font-semibold bg-slate-100 border-none rounded-md px-2 py-1 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
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
      </div>
    );
  }

  return (
    <div className="group bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all duration-200 mb-3 relative overflow-hidden flex flex-col">
      {/* Priority Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityColor(task.priority)}`} />
      
      <div className="pl-2 flex-grow">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className={`text-base font-semibold leading-snug ${task.status === "DONE" ? "line-through text-slate-400" : "text-slate-800"}`}>
            {task.title}
          </h3>
          <span className="flex items-center space-x-1 ml-2 mt-0.5">
            <span className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} title={`Priority: ${task.priority}`} />
          </span>
        </div>
        
        {task.description && (
          <p className={`text-sm mb-4 line-clamp-3 ${task.status === "DONE" ? "text-slate-400" : "text-slate-600"}`}>
            {task.description}
          </p>
        )}
      </div>
      
      {/* Action Bar (shows on hover or active) */}
      <div className="pl-2 mt-auto pt-3 flex items-center justify-between border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex space-x-1">
          {task.status !== "TODO" && (
            <button
              onClick={() => moveStatus('backward')}
              className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
              title="Move left"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          {task.status !== "DONE" && (
            <button
              onClick={() => moveStatus('forward')}
              className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
              title="Move right"
            >
              <ArrowRight size={16} />
            </button>
          )}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

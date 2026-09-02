"use client";

import { useState } from "react";
import { Trash2, Edit2, CheckCircle2 } from "lucide-react";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-red-100 text-red-800 border-red-200";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DONE":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "TODO":
        return "To Do";
      case "IN_PROGRESS":
        return "In Progress";
      case "DONE":
        return "Done";
      default:
        return status;
    }
  };

  const handleSave = () => {
    onUpdate(task.id, { title: editTitle, description: editDesc });
    setIsEditing(false);
  };

  const cycleStatus = () => {
    const statuses = ["TODO", "IN_PROGRESS", "DONE"];
    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onUpdate(task.id, { status: nextStatus });
  };

  if (isEditing) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-lg font-semibold mb-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500 bg-transparent px-1 py-1"
          placeholder="Task title"
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          className="w-full text-gray-600 mb-4 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent px-2 py-1 text-sm min-h-[80px] resize-none"
          placeholder="Description (optional)"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all duration-200 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className={`text-lg font-semibold ${task.status === "DONE" ? "line-through text-gray-400" : "text-gray-800"}`}>
          {task.title}
        </h3>
        <button
          onClick={cycleStatus}
          className={`px-2.5 py-1 text-xs font-medium rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(task.status)}`}
          title="Click to change status"
        >
          {getStatusLabel(task.status)}
        </button>
      </div>
      <p className={`text-sm mb-4 flex-grow ${task.status === "DONE" ? "text-gray-400" : "text-gray-600"}`}>
        {task.description || <span className="italic opacity-50">No description</span>}
      </p>
      
      <div className="flex justify-end space-x-2 mt-auto pt-3 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onUpdate(task.id, { status: "DONE" })}
          className="p-1.5 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50 transition-colors"
          title="Mark as done"
        >
          <CheckCircle2 size={18} />
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          title="Edit task"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
          title="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

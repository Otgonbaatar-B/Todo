"use client";
import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Priority } from "@/components/types";
import { formatDate, formatTime } from "@/components/utils";

// Types remain the same
type Todo = {
  id: string;
  text: string;
  status: "backlog" | "todo" | "in-progress" | "review" | "done";
  priority: Priority;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
};

const STORAGE_KEY = "todo-app-data";

const priorityColors = {
  low: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  medium: "bg-amber-100 text-amber-800 border border-amber-200",
  high: "bg-rose-100 text-rose-800 border border-rose-200",
};

const statusColors = {
  backlog: "bg-slate-50 border-slate-200",
  todo: "bg-blue-50 border-blue-200",
  "in-progress": "bg-violet-50 border-violet-200",
  review: "bg-amber-50 border-amber-200",
  done: "bg-emerald-50 border-emerald-200",
};

const statusIcons = {
  backlog: <Loader2 className="w-4 h-4" />,
  todo: <AlertCircle className="w-4 h-4" />,
  "in-progress": <Loader2 className="w-4 h-4 animate-spin" />,
  review: <Clock className="w-4 h-4" />,
  done: <CheckCircle2 className="w-4 h-4" />,
};

const TodoApp = () => {
  // State declarations remain the same
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [newTodoData, setNewTodoData] = useState({
    priority: "medium" as Priority,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "18:00",
  });

  // Effects and handlers remain the same
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setTodos(JSON.parse(saved));
        } catch (error) {
          console.error("Error loading todos:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo,
        status: "todo",
        priority: newTodoData.priority,
        startDate: newTodoData.startDate,
        endDate: newTodoData.endDate,
        startTime: newTodoData.startTime,
        endTime: newTodoData.endTime,
        createdAt: new Date().toISOString(),
      };
      setTodos([...todos, todo]);
      setNewTodo("");
    }
  };

  const columns: { title: string; status: Todo["status"] }[] = [
    { title: "Хүлээгдэж буй", status: "backlog" },
    { title: "Хийх ажлууд", status: "todo" },
    { title: "Хийгдэж байгаа", status: "in-progress" },
    { title: "Хянагдаж байгаа", status: "review" },
    { title: "Дууссан", status: "done" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          Таскын удирдлага
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={addTodo}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Шинэ таск..."
                className="w-full rounded-xl text-black border-2 border-indigo-200 p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
              />
            </div>
            <select
              value={newTodoData.priority}
              onChange={(e) =>
                setNewTodoData((prev) => ({
                  ...prev,
                  priority: e.target.value as Priority,
                }))
              }
              className="rounded-xl border-2 text-black border-indigo-200 p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
            >
              <option value="low">Бага</option>
              <option value="medium">Дунд</option>
              <option value="high">Өндөр</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Эхлэх огноо",
                value: newTodoData.startDate,
                type: "date",
                key: "startDate",
              },
              {
                label: "Дуусах огноо",
                value: newTodoData.endDate,
                type: "date",
                key: "endDate",
              },
              {
                label: "Эхлэх цаг",
                value: newTodoData.startTime,
                type: "time",
                key: "startTime",
              },
              {
                label: "Дуусах цаг",
                value: newTodoData.endTime,
                type: "time",
                key: "endTime",
              },
            ].map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) =>
                    setNewTodoData((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  className="w-full text-black rounded-xl border-2 border-indigo-200 p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="group w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            Таск нэмэх
          </button>
        </motion.form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {columns.map(({ title, status }) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={status}
              className={`${statusColors[status]} rounded-2xl shadow-lg p-4 border backdrop-blur-sm`}
            >
              <div className="flex items-center gap-2 mb-4">
                {statusIcons[status]}
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {todos
                    .filter((todo) => todo.status === status)
                    .map((todo) => (
                      <motion.div
                        key={todo.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-xl p-4 border border-gray-100"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <span className="flex-1 font-medium text-gray-800">
                              {todo.text}
                            </span>
                            <button
                              onClick={() =>
                                setTodos(todos.filter((t) => t.id !== todo.id))
                              }
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full ${
                                priorityColors[todo.priority]
                              } transition-colors`}
                            >
                              <AlertCircle size={14} className="inline mr-1" />
                              {todo.priority === "low"
                                ? "Бага"
                                : todo.priority === "medium"
                                ? "Дунд"
                                : "Өндөр"}
                            </span>

                            <span className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(todo.startDate)} -{" "}
                              {formatDate(todo.endDate)}
                            </span>
                          </div>

                          <select
                            value={todo.status}
                            onChange={(e) =>
                              setTodos(
                                todos.map((t) =>
                                  t.id === todo.id
                                    ? {
                                        ...t,
                                        status: e.target
                                          .value as Todo["status"],
                                      }
                                    : t
                                )
                              )
                            }
                            className="w-full mt-2 rounded-lg border text-black border-gray-200 p-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                          >
                            {columns.map(({ title, status }) => (
                              <option key={status} value={status}>
                                {title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;

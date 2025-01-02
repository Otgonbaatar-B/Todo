"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Clock, Calendar, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Priority } from "@/components/types";
import { formatDate, formatTime } from "@/components/utils";

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
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const statusColors = {
  backlog: "bg-gray-100",
  todo: "bg-blue-100",
  "in-progress": "bg-purple-100",
  review: "bg-orange-100",
  done: "bg-green-100",
};

const TodoApp = () => {
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

  // Load saved todos on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsedTodos = JSON.parse(saved);
          setTodos(parsedTodos);
        } catch (error) {
          console.error("Error loading todos:", error);
        }
      }
    }
  }, []);

  // Save todos when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos]);

  // Rest of the component code remains the same...
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

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateStatus = (id: string, newStatus: Todo["status"]) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      )
    );
  };

  const updatePriority = (id: string, newPriority: Priority) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, priority: newPriority } : todo
      )
    );
  };

  const handleDragStart = (todo: Todo) => {
    setDraggedTodo(todo);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Todo["status"]) => {
    if (draggedTodo) {
      updateStatus(draggedTodo.id, status);
      setDraggedTodo(null);
    }
  };

  const columns: { title: string; status: Todo["status"] }[] = [
    { title: "Хүлээгдэж буй", status: "backlog" },
    { title: "Хийх ажлууд", status: "todo" },
    { title: "Хийгдэж байгаа", status: "in-progress" },
    { title: "Хянагдаж байгаа", status: "review" },
    { title: "Дууссан", status: "done" },
  ];

  const isOverdue = (todo: Todo) => {
    const now = new Date();
    const endDate = new Date(`${todo.endDate}T${todo.endTime || "23:59"}`);
    return now > endDate && todo.status !== "done";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      {/* Component JSX remains the same... */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-900 mb-8">
          Таскын удирдлага
        </h1>
        {/* Add Todo Form */}
        <form
          onSubmit={addTodo}
          className="mb-8 bg-white rounded-xl shadow-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Шинэ таск..."
              className="rounded-lg border-2 border-indigo-200 p-3 focus:border-indigo-500 focus:outline-none"
            />
            <select
              value={newTodoData.priority}
              onChange={(e) =>
                setNewTodoData((prev) => ({
                  ...prev,
                  priority: e.target.value as Priority,
                }))
              }
              className="rounded-lg border-2 border-indigo-200 p-3"
            >
              <option value="low">Бага</option>
              <option value="medium">Дунд</option>
              <option value="high">Өндөр</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Эхлэх огноо
              </label>
              <input
                type="date"
                value={newTodoData.startDate}
                onChange={(e) =>
                  setNewTodoData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full rounded-lg border-2 border-indigo-200 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дуусах огноо
              </label>
              <input
                type="date"
                value={newTodoData.endDate}
                onChange={(e) =>
                  setNewTodoData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="w-full rounded-lg border-2 border-indigo-200 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Эхлэх цаг
              </label>
              <input
                type="time"
                value={newTodoData.startTime}
                onChange={(e) =>
                  setNewTodoData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="w-full rounded-lg border-2 border-indigo-200 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дуусах цаг
              </label>
              <input
                type="time"
                value={newTodoData.endTime}
                onChange={(e) =>
                  setNewTodoData((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
                className="w-full rounded-lg border-2 border-indigo-200 p-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle size={20} />
            Таск нэмэх
          </button>
        </form>
        {/* Todo Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {columns.map(({ title, status }) => (
            <div
              key={status}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
              className={`${statusColors[status]} rounded-xl shadow-lg p-4`}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {title}
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {todos
                    .filter((todo) => todo.status === status)
                    .map((todo) => (
                      <motion.div
                        key={todo.id}
                        layoutId={todo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        draggable
                        onDragStart={() => handleDragStart(todo)}
                        className={`bg-white p-4 rounded-lg cursor-move hover:shadow-md transition-all ${
                          isOverdue(todo) ? "border-l-4 border-red-500" : ""
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between">
                            <span className="flex-1 font-medium">
                              {todo.text}
                            </span>
                            <button
                              onClick={() => deleteTodo(todo.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full ${
                                priorityColors[todo.priority]
                              }`}
                            >
                              <AlertCircle size={14} className="inline mr-1" />
                              {todo.priority === "low"
                                ? "Бага"
                                : todo.priority === "medium"
                                ? "Дунд"
                                : "Өндөр"}
                            </span>
                            <span className="flex items-center text-gray-600">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(todo.startDate)} -{" "}
                              {formatDate(todo.endDate)}
                            </span>
                            <span className="flex items-center text-gray-600">
                              <Clock size={14} className="mr-1" />
                              {formatTime(todo.startTime || "")} -{" "}
                              {formatTime(todo.endTime || "")}
                            </span>
                          </div>
                          <select
                            value={todo.status}
                            onChange={(e) =>
                              updateStatus(
                                todo.id,
                                e.target.value as Todo["status"]
                              )
                            }
                            className="mt-2 rounded border p-1 text-sm"
                          >
                            <option value="backlog">Хүлээгдэж буй</option>
                            <option value="todo">Хийх</option>
                            <option value="in-progress">Хийгдэж байгаа</option>
                            <option value="review">Хянагдаж байгаа</option>
                            <option value="done">Дууссан</option>
                          </select>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;

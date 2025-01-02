"use client";
import { useState } from "react";
import { Priority, Todo } from "./types";
import { PlusCircle } from "lucide-react";

type AddTodoProps = {
  setIsModalOpen: (value: boolean) => void;
};

const AddTodo: React.FC<AddTodoProps> = ({ setIsModalOpen }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newTodoData, setNewTodoData] = useState({
    priority: "medium" as Priority,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "18:00",
  });

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
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      {" "}
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
    </div>
  );
};

export default AddTodo;

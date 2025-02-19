"use client";

import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:4000/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    await axios.post("http://localhost:4000/tasks", {
      title: newTask,
      description: newDescription || null,
    });
    fetchTasks();
    setNewTask("");
    setNewDescription("");
  };

  const toggleTask = async (id: number, completed: boolean) => {
    await axios.put(`http://localhost:4000/tasks/${id}`, {
      completed: !completed,
    });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await axios.delete(`http://localhost:4000/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Task Manager
        </h1>

        <div className="flex flex-col gap-2 mb-8">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            placeholder="Add a new task..."
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 resize-y min-h-[100px]"
            placeholder="Add a description (optional)..."
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Add Task
          </button>
        </div>

        <ul className="space-y-3">
          {tasks.map((task: any) => (
            <li
              key={task.id}
              className="flex flex-col bg-gray-50 p-4 rounded-lg group hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex-1 text-gray-800 ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`px-4 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                      task.completed
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-4 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="mt-2 text-gray-600 text-sm">{task.description}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
uuidv4();

function OrbitTasksApp() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("orbitTasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error parsing tasks from localStorage: ", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orbitTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const handleDelete = (e, id) => {
    let index = tasks.findIndex((item) => {
      return item.id === id;
    });
    let newTasks = tasks.filter((item) => {
      return item.id !== id;
    });
    setTasks(newTasks);
  };

  const handleAdd = () => {
    if (!task.trim()) {
      return;
    }
    setTasks([...tasks, { id: uuidv4(), task, isCompleted: false }]);
    setTask("");
  };

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((item) => item.isCompleted).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const stats = getStats();

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = tasks.findIndex((item) => {
      return item.id === id;
    });
    let newTasks = [...tasks];
    newTasks[index].isCompleted = !newTasks[index].isCompleted;
    setTasks(newTasks);
  };

  const saveEdit = (id) => {
    if (!editValue.trim()) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, task: editValue.trim() } : task
      )
    );
    setEditingId(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const getFilteredTasks = () => {
    switch (currentFilter) {
      case "completed":
        return tasks.filter((task) => task.isCompleted);
      case "pending":
        return tasks.filter((task) => !task.isCompleted);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 ">
      <div className="container w-full max-w-md p-6 mx-auto my-5 sm:p-8 bg-white/95 backdrop-blur-lg rounded-xl">
        <h1 className="text-2xl font-bold text-center text-pink-500">
          OrbitTasks
        </h1>
        <h1 className="text-lg font-bold text-center">My Task List</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 py-5 mx-1 my-5 rounded-lg stat bg-violet-100">
          <div className="text-center">
            <div className="text-xl font-bold text-violet-600">
              {stats.total}
            </div>
            <div className="text-slate-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-slate-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">
              {stats.pending}
            </div>
            <div className="text-slate-600">Pending</div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-6 addTask">
          <div className="flex flex-col gap-1 sm:flex-row">
            <input
              onChange={handleChange}
              value={task}
              type="text"
              className="flex-1 p-3 rounded-lg"
              placeholder="Add a Task...."
              onKeyUp={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
            <button
              onClick={handleAdd}
              disabled={!task.trim()}
              className={`px-4 py-3 mx-2 font-bold text-white rounded-md transition-colors ${
                task.trim()
                  ? "bg-blue-700 hover:bg-blue-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 mb-6">
          {[
            {
              key: "all",
              label: "All",
              activeColor: "bg-indigo-500 text-white shadow-lg",
              inactiveColor: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
            },
            {
              key: "pending",
              label: "Pending",
              activeColor: "bg-red-500 text-white shadow-lg",
              inactiveColor: "text-red-600 bg-red-50 hover:bg-red-100",
            },
            {
              key: "completed",
              label: "Done",
              activeColor: "bg-green-500 text-white shadow-lg",
              inactiveColor: "text-green-600 bg-green-50 hover:bg-green-100",
            },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setCurrentFilter(filter.key)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                currentFilter === filter.key
                  ? filter.activeColor
                  : filter.inactiveColor
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Tasks Section */}
        <div className="mb-6">
          <div className="tasks">
            <h2 className="text-lg font-semibold text-gray-600">Your Tasks</h2>

            {filteredTasks.length === 0 ? (
              <div className="py-4 text-center text-gray-400">
                No tasks found.
              </div>
            ) : (
              filteredTasks.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 my-2 bg-gray-100 rounded-lg"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={item.id}
                      checked={item.isCompleted}
                      onChange={handleCheckbox}
                      className="mr-2"
                    />
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyUp={(e) => {
                          if (e.key === "Enter") saveEdit(item.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="flex-1 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={
                          item.isCompleted ? "line-through text-gray-400" : ""
                        }
                      >
                        {item.task}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingId === item.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(item.id)}
                          className="px-2 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-2 py-1 text-xs text-white bg-gray-500 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(item.id, item.task)}
                          className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {stats.total > 0 && (
          <div className="p-4 mt-6 rounded-xl bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Process</span>
              <span className="text-sm font-medium text-gray-800">
                {Math.round((stats.completed / stats.total) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 transition-all duration-500 ease-out rounded-full bg-gradient-to-r from-green-400 to-green-600"
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Storage Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Tasks are automatically saved to your browser's local storage
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrbitTasksApp;

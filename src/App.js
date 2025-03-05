import React, { useEffect, useState } from "react";
import "./App.css";
import { Pencil, Trash2 } from "lucide-react";

const API_URL = "http://localhost:8080/api/todolist";

const App = () => {
    const [todos, setTodos] = useState([]);
    const [todoInput, setTodoInput] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState("");

    // Fetch all todo lists from the API
    const fetchTodos = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch todos");
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchTodos();
    }, []);

    // Add a new todo item
    const handleAddTodo = async () => {
        if (todoInput.trim() === "") return;

        const newTodo = { todolist: todoInput, completed: false };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTodo),
            });
            if (!response.ok) throw new Error("Failed to add todo");

            const data = await response.json();
            setTodos([...todos, data]);
            setTodoInput("");
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    // Toggle the completed status of a todo item
    const handleToggleComplete = async (id) => {
        const todoToUpdate = todos.find((todo) => todo.id === id);
        const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTodo),
            });
            if (!response.ok) throw new Error("Failed to update todo");

            const updatedData = await response.json();
            setTodos(todos.map((todo) => (todo.id === id ? updatedData : todo)));
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    // Set the current todo to edit
    const handleEditTodo = (id, text) => {
        setEditIndex(id);
        setEditText(text);
    };

    // Save the edited todo item
    const handleSaveEdit = async (id) => {
        const updatedTodo = { ...todos.find((todo) => todo.id === id), todolist: editText };

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTodo),
            });
            if (!response.ok) throw new Error("Failed to save edit");

            const updatedData = await response.json();
            setTodos(todos.map((todo) => (todo.id === id ? updatedData : todo)));
            setEditIndex(null);
        } catch (error) {
            console.error("Error saving edit:", error);
        }
    };

    // Delete a todo item
    const handleDeleteTodo = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete todo");

            setTodos(todos.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    return (
        <div className="todo-container">
            <h1>Todo List</h1>
            <div className="todo-input">
                <input
                    type="text"
                    placeholder="Add new todo..."
                    value={todoInput}
                    onChange={(e) => setTodoInput(e.target.value)}
                />
                <button onClick={handleAddTodo} className="addButton">+ Add</button>
            </div>
            <ul className="todo-list">
                {todos.map((todo) => (
                    <li key={todo.id} className={todo.completed ? "completed" : ""}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggleComplete(todo.id)}
                        />
                        {editIndex === todo.id ? (
                            <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                            />
                        ) : (
                            <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                                {todo.todolist}
                            </span>
                        )}
                        <div style={{ display: "inline-flex", gap: "5px" }}>
                            {editIndex === todo.id ? (
                                <button onClick={() => handleSaveEdit(todo.id)}>💾</button>
                            ) : (
                                <button onClick={() => handleEditTodo(todo.id, todo.todolist)} className="editButton">
                                    <Pencil size={15} className="text-blue-500 hover:text-blue-700" />
                                </button>
                            )}
                            <button onClick={() => handleDeleteTodo(todo.id)} className="deleteButton">
                                <Trash2 size={15} className="text-red-500 hover:text-red-700" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;

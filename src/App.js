    import React, { useState } from "react";
    import "./App.css";
    import { useTodos } from "./useTodos";
    import { Pencil, Trash2, Save } from "lucide-react";

    const App = () => {
        const { todos, addTodo, toggleComplete, editTodo, deleteTodo } = useTodos();
        const [todoInput, setTodoInput] = useState("");
        const [editIndex, setEditIndex] = useState(null);
        const [editText, setEditText] = useState("");

        const handleAddTodo = () => {
            addTodo(todoInput);
            setTodoInput("");
        };

        const handleEditTodo = (id, text) => {
            setEditIndex(id);
            setEditText(text);
        };

        const handleSaveEdit = (id) => {
            editTodo(id, editText);
            setEditIndex(null);
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
                                onChange={() => toggleComplete(todo.id)}
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
                                    <button onClick={() => handleSaveEdit(todo.id)}>
                                        <Save size={15} className="text-green-500 hover:text-green-700" />
                                    </button>
                                ) : (
                                    <button onClick={() => handleEditTodo(todo.id, todo.todolist)} className="editButton">
                                        <Pencil size={15} className="text-blue-500 hover:text-blue-700" />
                                    </button>
                                )}
                                <button onClick={() => deleteTodo(todo.id)} className="deleteButton">
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

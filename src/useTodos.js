import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api/todolist";

export function useTodos() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch((error) => console.error("Error fetching todos:", error));
    }, []);

    const addTodo = (todolist) => {
        if (todolist.trim() === "") return;
        if (todos.some(todo => todo.todolist.toLowerCase() === todolist.toLowerCase())) {
            alert("Task already exists!");
            return;
        }
        const newTodo = { todolist, completed: false };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo),
        })
            .then((res) => res.json())
            .then((data) => setTodos([...todos, data]))
            .catch((error) => console.error("Error adding todo:", error));
    };

    const toggleComplete = (id) => {
        const todoToUpdate = todos.find((todo) => todo.id === id);
        const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTodo),
        })
            .then((res) => res.json())
            .then((updatedData) => {
                setTodos(todos.map((todo) => (todo.id === id ? updatedData : todo)));
            })
            .catch((error) => console.error("Error updating todo:", error));
    };

    const editTodo = (id, newText) => {
        const updatedTodo = { ...todos.find((todo) => todo.id === id), todolist: newText };

        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTodo),
        })
            .then((res) => res.json())
            .then((updatedData) => {
                setTodos(todos.map((todo) => (todo.id === id ? updatedData : todo)));
            })
            .catch((error) => console.error("Error updating todo:", error));
    };

    const deleteTodo = (id) => {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => {
                setTodos(todos.filter((todo) => todo.id !== id));
            })
            .catch((error) => console.error("Error deleting todo:", error));
    };

    return { todos, addTodo, toggleComplete, editTodo, deleteTodo };
}



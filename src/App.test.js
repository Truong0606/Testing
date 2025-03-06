import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import App from "./App";
import { useTodos } from "./useTodos";

jest.mock("./useTodos");

const mockTodos = [
  { id: 1, todolist: "Test Todo 1", completed: false },
  { id: 2, todolist: "Test Todo 2", completed: true },
];

describe("App Component", () => {
  let addTodoMock, toggleMock, editMock, deleteMock;

  beforeEach(() => {
    addTodoMock = jest.fn();
    toggleMock = jest.fn();
    editMock = jest.fn();
    deleteMock = jest.fn();

    useTodos.mockReturnValue({
      todos: mockTodos,
      addTodo: addTodoMock,
      toggleComplete: toggleMock,
      editTodo: editMock,
      deleteTodo: deleteMock,
    });

    jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Reset lại mock sau mỗi test
  });

  test("renders Todo List title", () => {
    render(<App />);
    expect(screen.getByText(/Todo List/i)).toBeInTheDocument();
  });

  test("renders todos from useTodos", () => {
    render(<App />);
    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
  });

  test("adds a new todo", () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo.../i);
    fireEvent.change(input, { target: { value: "New Task" } });

    fireEvent.click(screen.getByText("+ Add"));
    expect(addTodoMock).toHaveBeenCalledWith("New Task");
  });

  test("toggles a todo", () => {
    render(<App />);
    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    expect(toggleMock).toHaveBeenCalledWith(mockTodos[0].id);
  });

  test("edits and saves a todo", () => {
    render(<App />);

    const editButton = screen.getAllByRole("button")[1];
    fireEvent.click(editButton);

    const editInput = screen.getByDisplayValue("Test Todo 1");
    expect(editInput).toBeInTheDocument();

    fireEvent.change(editInput, { target: { value: "Updated Task" } });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    expect(editMock).toHaveBeenCalledWith(mockTodos[0].id, "Updated Task");
  });

  test("deletes a todo", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button")[2]);

    expect(deleteMock).toHaveBeenCalledWith(mockTodos[0].id);
  });

  test("should not add duplicate todo", () => {
    useTodos.mockReturnValue({
      todos: [{ id: 1, todolist: "Learn React", completed: false }],
      addTodo: addTodoMock,
      toggleComplete: toggleMock,
      editTodo: editMock,
      deleteTodo: deleteMock,
    });

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Add new todo.../i), {
      target: { value: "Learn React" },
    });
    fireEvent.click(screen.getByText("+ Add"));

    expect(window.alert).toHaveBeenCalledWith("Task already exists!");
  });

  test("should handle deleteTodo error", async () => {
    global.fetch = jest.fn(() => Promise.reject("Failed to delete"));
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.deleteTodo(1);
    });

    expect(result.current.todos).toHaveLength(2);
  });

  test("should handle fetch error", async () => {
    global.fetch = jest.fn(() => Promise.reject("API is down"));
    const { result, waitForNextUpdate } = renderHook(() => useTodos());

    await waitForNextUpdate();
    expect(result.current.todos).toEqual([]);
  });
  test("saves an edited todo", () => {
    render(<App />);


    const editButton = screen.getAllByRole("button")[1];
    fireEvent.click(editButton);


    const editInput = screen.getByDisplayValue("Test Todo 1");
    expect(editInput).toBeInTheDocument();


    fireEvent.change(editInput, { target: { value: "Updated Task" } });


    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    expect(editMock).toHaveBeenCalledWith(mockTodos[0].id, "Updated Task");
  });

  test("handleSaveEdit updates todo and resets edit state", () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.editTodo = jest.fn();
    });

    const setEditIndexMock = jest.fn();
    const editText = "Updated Task";

    const handleSaveEdit = (id) => {
      result.current.editTodo(id, editText);
      setEditIndexMock(null);
    };

    act(() => {
      handleSaveEdit(mockTodos[0].id);
    });

    // Verify that editTodo was called with correct parameters
    expect(result.current.editTodo).toHaveBeenCalledWith(mockTodos[0].id, "Updated Task");

    // Verify that setEditIndex was called to reset editing state
    expect(setEditIndexMock).toHaveBeenCalledWith(null);
  });
});

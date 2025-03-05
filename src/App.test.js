import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("Todo List App", () => {
  test("renders input field and add button", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Add new todo...")).toBeInTheDocument();
    expect(screen.getByText("+ Add")).toBeInTheDocument();
  });

  test("adds a new todo", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Add new todo...");
    const addButton = screen.getByText("+ Add");

    fireEvent.change(input, { target: { value: "Learn React" } });
    fireEvent.click(addButton);

    expect(screen.getByText("Learn React")).toBeInTheDocument();
  });

  test("marks a todo as completed", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Add new todo...");
    const addButton = screen.getByText("+ Add");

    fireEvent.change(input, { target: { value: "Learn Testing" } });
    fireEvent.click(addButton);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(screen.getByText("Learn Testing")).toHaveStyle("text-decoration: line-through");
  });

  test("edits a todo", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Add new todo...");
    const addButton = screen.getByText("+ Add");

    fireEvent.change(input, { target: { value: "Edit me" } });
    fireEvent.click(addButton);

    const editButton = screen.getByText("✏️");
    fireEvent.click(editButton);

    const editInput = screen.getByDisplayValue("Edit me");
    fireEvent.change(editInput, { target: { value: "Edited!" } });
    fireEvent.click(screen.getByText("💾"));

    expect(screen.getByText("Edited!")).toBeInTheDocument();
  });

  test("deletes a todo", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Add new todo...");
    const addButton = screen.getByText("+ Add");

    fireEvent.change(input, { target: { value: "Delete me" } });
    fireEvent.click(addButton);

    const deleteButton = screen.getByText("🗑️");
    fireEvent.click(deleteButton);

    expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
  });

  test("does not add empty todos", () => {
    render(<App />);
    const addButton = screen.getByText("+ Add");
    fireEvent.click(addButton);
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});

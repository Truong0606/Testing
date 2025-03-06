import { renderHook, act } from "@testing-library/react";
import { useTodos } from "./useTodos";

global.fetch = jest.fn();

const mockTodo = { id: 1, todolist: "Test Task", completed: false };

describe("useTodos Hook", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test("fetches and sets initial todos", async () => {
        fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue([mockTodo]),
        });

        const { result, waitForNextUpdate } = renderHook(() => useTodos());

        await waitForNextUpdate();
        expect(result.current.todos).toEqual([mockTodo]);
    });

    test("adds a new todo", async () => {
        fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockTodo),
        });

        const { result } = renderHook(() => useTodos());

        await act(async () => {
            result.current.addTodo("New Task");
        });

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:8080/api/todolist",
            expect.objectContaining({ method: "POST" })
        );
    });

    test("toggles a todo", async () => {
        fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({ ...mockTodo, completed: true }),
        });

        const { result } = renderHook(() => useTodos());

        await act(async () => {
            result.current.toggleComplete(mockTodo.id);
        });

        expect(fetch).toHaveBeenCalledWith(
            `http://localhost:8080/api/todolist/${mockTodo.id}`,
            expect.objectContaining({ method: "PUT" })
        );
    });

    test("edits a todo", async () => {
        fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({ ...mockTodo, todolist: "Updated Task" }),
        });

        const { result } = renderHook(() => useTodos());

        await act(async () => {
            result.current.editTodo(mockTodo.id, "Updated Task");
        });

        expect(fetch).toHaveBeenCalledWith(
            `http://localhost:8080/api/todolist/${mockTodo.id}`,
            expect.objectContaining({ method: "PUT" })
        );
    });

    test("deletes a todo", async () => {
        fetch.mockResolvedValue({});

        const { result } = renderHook(() => useTodos());

        await act(async () => {
            result.current.deleteTodo(mockTodo.id);
        });

        expect(fetch).toHaveBeenCalledWith(
            `http://localhost:8080/api/todolist/${mockTodo.id}`,
            expect.objectContaining({ method: "DELETE" })
        );
    });
});

package com.example.testing.service;

import com.example.testing.entity.ToDoList;
import com.example.testing.entity.request.ToDoListRequest;
import com.example.testing.repository.ToDoListRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ToDoListService {

    @Autowired
    private ToDoListRepository toDoListRepository;

    public ToDoList create(ToDoListRequest request) {
        ToDoList toDoList = new ToDoList();
        toDoList.setTodolist(request.getTodolist());
        return toDoListRepository.save(toDoList);
    }

    public List<ToDoList> getAllToDoList() {
        return toDoListRepository.findByDeletedFalse();
    }

    public Optional<ToDoList> getToDoListById(Long id) {
        return toDoListRepository.findById(id);
    }

    @Transactional
    public ToDoList updateToDoList(Long id, ToDoListRequest request) {
        return toDoListRepository.findById(id).map(toDoList -> {
            toDoList.setTodolist(request.getTodolist());
            return toDoListRepository.save(toDoList);
        }).orElseThrow(() -> new RuntimeException("ToDoList not found"));
    }

    @Transactional
    public boolean deleteToDoList(Long id) {
        return toDoListRepository.findById(id).map(toDoList -> {
            toDoList.setDeleted(true);
            toDoListRepository.save(toDoList);
            return true;
        }).orElse(false);
    }
}

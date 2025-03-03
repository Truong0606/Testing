package com.example.testing.api;

import com.example.testing.entity.ToDoList;
import com.example.testing.entity.request.ToDoListRequest;
import com.example.testing.service.ToDoListService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todolist")
@CrossOrigin(origins = "*")
public class ToDoListAPI {

    @Autowired
    private ToDoListService toDoListService;

    @PostMapping
    public ResponseEntity<ToDoList> createList(@Valid @RequestBody ToDoListRequest request) {
        return ResponseEntity.ok(toDoListService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ToDoList>> getAllList() {
        return ResponseEntity.ok(toDoListService.getAllToDoList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ToDoList> getToDoListById(@PathVariable Long id) {
        return toDoListService.getToDoListById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ToDoList> updateToDoList(@PathVariable Long id, @Valid @RequestBody ToDoListRequest request) {
        return ResponseEntity.ok(toDoListService.updateToDoList(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteToDoList(@PathVariable Long id) {
        boolean deleted = toDoListService.deleteToDoList(id);
        return deleted ? ResponseEntity.ok("Deleted successfully") : ResponseEntity.notFound().build();
    }
}

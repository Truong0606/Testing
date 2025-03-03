package com.example.testing.repository;

import com.example.testing.entity.ToDoList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ToDoListRepository extends JpaRepository<ToDoList, Long> {
    List<ToDoList> findByDeletedFalse();
}

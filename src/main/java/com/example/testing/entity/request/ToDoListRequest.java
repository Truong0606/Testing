package com.example.testing.entity.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ToDoListRequest {
    @NotBlank(message = "To do list cannot be blank")
    private String todolist;
}

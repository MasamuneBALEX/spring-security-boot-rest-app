package ru.kata.spring.boot_security.web_data.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.web_data.models.User;
import ru.kata.spring.boot_security.web_data.services.UserService;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class UserRestController {

    private final UserService userService;

    @Autowired
    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/current-user")
    public User getCurrentUser(Principal principal) {
        return (User) userService.loadUserByUsername(principal.getName());
    }
}

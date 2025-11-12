package ru.kata.spring.boot_security.web_data.services;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.web_data.models.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    void addUser(User user);

    void updateUser(User user);

    void deleteUserById(int id);

    User getUserById(int id);

    List<User> getAllUsers();
}

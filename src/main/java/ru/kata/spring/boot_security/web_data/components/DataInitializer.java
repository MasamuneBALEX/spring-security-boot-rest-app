package ru.kata.spring.boot_security.web_data.components;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.web_data.models.Role;
import ru.kata.spring.boot_security.web_data.models.User;
import ru.kata.spring.boot_security.web_data.services.RoleService;
import ru.kata.spring.boot_security.web_data.services.UserService;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public DataInitializer(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    @Transactional
    public void init() {
        Role user = new Role("USER");
        Role admin = new Role("ADMIN");
        roleService.saveRole(admin);
        roleService.saveRole(user);

        User userAdmin = new User("Aleksandr", "Belov", 22, "Lonodn",
                "Admin", "12345", "aleks_test@mail.ru",
                new HashSet<>(Set.of(user, admin)));

        User userUser = new User("Aleksey", "Smirnov", 25, "Moscow",
                "AleksSmirnov", "12345", "test@mail.ru",
                new HashSet<>(Set.of(user)));
        userService.addUser(userUser);
        userService.addUser(userAdmin);

    }
}

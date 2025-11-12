package ru.kata.spring.boot_security.web_data.services;

import ru.kata.spring.boot_security.web_data.models.Role;

import java.util.List;

public interface RoleService {
    List<Role> getAllRoles();

    Role getRoleById(int id);

    void saveRole(Role role);

    void deleteRoleById(int id);
}

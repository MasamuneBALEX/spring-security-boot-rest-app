package ru.kata.spring.boot_security.web_data.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kata.spring.boot_security.web_data.models.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}

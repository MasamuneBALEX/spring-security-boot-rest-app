package ru.kata.spring.boot_security.web_data.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.web_data.models.User;
import ru.kata.spring.boot_security.web_data.repositories.UserRepository;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }


    @Override
    public void addUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public void updateUser(User user) {
        User lastUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new UsernameNotFoundException(user.getUsername()));

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            if (!passwordEncoder.matches(user.getPassword(), lastUser.getPassword())) {
                lastUser.setPassword(passwordEncoder.encode(user.getPassword()));
            }
        }

        lastUser.setFirstName(user.getFirstName());
        lastUser.setSurname(user.getSurname());
        lastUser.setAge(user.getAge());
        lastUser.setEmail(user.getEmail());
        System.out.println("User Roles is " + user.getRoles());
        lastUser.setRoles(user.getRoles());

        userRepository.save(lastUser);
    }

    @Override
    public void deleteUserById(int id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        userRepository.delete(user);
        System.out.println("User with id [" + id + "] has been deleted");
    }

    @Override
    public User getUserById(int id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

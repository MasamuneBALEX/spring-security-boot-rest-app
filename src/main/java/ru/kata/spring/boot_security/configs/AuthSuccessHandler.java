package ru.kata.spring.boot_security.configs;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

public class AuthSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isUser = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER"));

        try {
            if (isAdmin) {
                response.sendRedirect("/admin");
            } else if (isUser) {
                response.sendRedirect("/user");
            } else {
                response.sendRedirect("/"); // на всякий случай
            }
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}

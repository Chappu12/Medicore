package com.example.hospital.service.user;

import com.example.hospital.dto.AuthRequest;
import com.example.hospital.dto.AuthResponse;
import com.example.hospital.dto.UserRegisterRequest;
import com.example.hospital.entity.Role;
import com.example.hospital.entity.User;
import com.example.hospital.exception.MismatchedPasswordsException;
import com.example.hospital.exception.UserAlreadyExistsException;
import com.example.hospital.repository.UserRepository;
import com.example.hospital.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public void updateUser(User user) {
        if (user.getId() == null || !userRepository.existsById(user.getId())) {
            throw new UsernameNotFoundException("User not found");
        }
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        userRepository.save(user);
    }

    @Override
    @Transactional
    public AuthResponse registerUser(UserRegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new MismatchedPasswordsException("Password and confirm password do not match.");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already registered. Please try logging in or use a different email.");
        }
        if (userRepository.findByContactNumber(request.getContactNumber().trim()).isPresent()) {
            throw new UserAlreadyExistsException("Contact number already registered. Please try logging in or use a different number.");
        }
        if (userRepository.findByEmergencyContact(request.getEmergencyContact().trim()).isPresent()) {
            throw new UserAlreadyExistsException("Emergency contact number already registered. Please try logging in or use a different number.");
        }

        User user = User.builder()
                .name(request.getName())
                .gender(request.getGender())
                .dob(request.getDob())
                .address(request.getAddress())
                .contactNumber(formatPhoneNumber(request.getContactNumber()))
                .emergencyContact(formatPhoneNumber(request.getEmergencyContact()))
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // ✅ Set default role
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(token, "Registration successful", true);
    }

    @Override
    public AuthResponse loginUser(AuthRequest request) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword());
        authenticationManager.authenticate(auth);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, "Login successful", true);
    }

    private String formatPhoneNumber(String number) {
        return "+91 " + number.trim();
    }
}
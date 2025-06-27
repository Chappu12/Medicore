package com.example.hospital.service.user;

import com.example.hospital.dto.AuthRequest;
import com.example.hospital.dto.AuthResponse;
import com.example.hospital.dto.UserRegisterRequest;
import com.example.hospital.entity.Appointment;
import com.example.hospital.entity.User;

import java.util.List;

public interface IUserService {
    AuthResponse registerUser(UserRegisterRequest request);
    AuthResponse loginUser(AuthRequest request);
    User getUserById(Long id);
    User findByEmail(String email);
    void deleteUser(Long id);
    void updateUser(User user);
}

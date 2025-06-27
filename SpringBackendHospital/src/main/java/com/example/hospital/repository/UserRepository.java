package com.example.hospital.repository;

import com.example.hospital.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByContactNumber(String contactNumber);
    Optional<User> findByEmergencyContact(String emergencyContact);
}

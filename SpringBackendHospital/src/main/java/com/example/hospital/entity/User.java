package com.example.hospital.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Pattern(
            regexp = "^[a-zA-Z\\s]+$",
            message = "Name must contain only letters and spaces"
    )
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Gender is required")
    @Pattern(
            regexp = "^(?i)(Male|Female|Other)$", // (?i) makes it case-insensitive
            message = "Gender must be either Male, Female, or Other"
    )
    private String gender;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dob;

    @NotBlank(message = "Address is required")
    private String address;

    @Column(nullable = false)
    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    @Column(nullable = false)
    @NotBlank(message = "Emergency contact number is required")
    private String emergencyContact;


    @NotBlank(message = "Email is required")
    @Pattern(
            regexp = "^[a-zA-Z0-9._%+-]+@gmail\\.com$",
            message = "Email must be a valid Gmail address"
    )
    private String email;

    @Size(min = 8, message = "Password must be 8 character")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$",
            message = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    )
    private String password;

    // save URL or path of image
    private String imageUrl; // ✅ This will store the URL after Cloudinary upload

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private List<Appointment> appointments;

    @Enumerated(EnumType.STRING)
    private Role role;
}

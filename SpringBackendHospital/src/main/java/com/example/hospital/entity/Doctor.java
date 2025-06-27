package com.example.hospital.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Pattern(
            regexp = "^[a-zA-Z\\s]*\\.?[a-zA-Z\\s]*$",
            message = "Name must contain only letters and spaces"
    )
    @NotBlank(message = "Name is required")
    private String name;

    // save URL or path of image
    private String imageUrl; // ✅ This will store the URL after Cloudinary upload

    @NotBlank(message = "Speciality is required")
    private String speciality;

    @NotBlank(message = "Degree is required")
    private String degree;

    @NotBlank(message = "Experience is required")
    private String experience;

    @NotBlank(message = "Information is required")
    @Column(length = 1000)
    private String about;

    @NotNull(message = "Fee is required")
    @Positive(message = "Fee must be a positive number")
    private Double fees;

    @Embedded
    private Address address;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private List<Appointment> appointments;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> availableSlots;

}
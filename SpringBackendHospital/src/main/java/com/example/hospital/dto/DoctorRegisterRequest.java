package com.example.hospital.dto;

import com.example.hospital.entity.Address;
import com.example.hospital.entity.Appointment;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class DoctorRegisterRequest {

    private Long id;

    private String name;

    // save URL or path of image
    private String imageUrl; // ✅ This will store the URL after Cloudinary upload

    private String speciality;

    private String degree;

    private String experience;

    private String about;

    private Double fees;

    @Embedded
    private Address address;

}

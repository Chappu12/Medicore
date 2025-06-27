package com.example.hospital.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate slotDate;
    private LocalTime slotTime;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference // 🔥 Prevent infinite loop when serializing user
    private User user;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    @JsonBackReference // 🔥 Prevent infinite loop when serializing doctor
    private Doctor doctor;

    @Column(name = "appointment_cancelled")
    @JsonProperty("appointment_cancelled")// 👈 match frontend casing
    private Boolean appointmentCancelled = false; // Default to false

    private Boolean payment;
    private Double amount;
    private Boolean payment_isCompleted;
}
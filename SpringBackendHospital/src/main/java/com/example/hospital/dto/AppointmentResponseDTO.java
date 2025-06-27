package com.example.hospital.dto;

import lombok.Data;

@Data
public class AppointmentResponseDTO {
    private Long id;
    private String slotDate;
    private String slotTime;
    private Double amount;
    private DoctorRegisterRequest docData;
    private Boolean appointmentCancelled;
}

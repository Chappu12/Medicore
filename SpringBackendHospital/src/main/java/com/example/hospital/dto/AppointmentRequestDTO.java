package com.example.hospital.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class AppointmentRequestDTO {
    private Long doctorId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private String slotDate; // format: "2025-06-11"

    @JsonFormat(pattern = "HH:mm")  // or "hh:mm a"
    private String slotTime; // format: "14:00"

}
    
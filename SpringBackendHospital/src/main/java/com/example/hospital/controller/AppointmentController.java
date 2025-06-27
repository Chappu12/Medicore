package com.example.hospital.controller;

import com.example.hospital.dto.AppointmentRequestDTO;
import com.example.hospital.entity.Appointment;
import com.example.hospital.service.appointment.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService service;

    @PostMapping("/book")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> bookAppointment(
            @RequestBody AppointmentRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        System.out.println("Hi");
        Appointment appointment = service.bookAppointment(dto, userDetails.getUsername());
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("appointment", appointment);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/cancel/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable("id") Long id
    ) {
        Appointment cancelledAppointment = service.cancelAppointment(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("appointments", cancelledAppointment);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cancelled/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Appointment>> getCancelledAppointments(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.getUserAppointments(id));
    }

}

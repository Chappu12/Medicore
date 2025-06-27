package com.example.hospital.service.appointment;

import com.example.hospital.dto.AppointmentRequestDTO;
import com.example.hospital.entity.Appointment;
import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.User;
import com.example.hospital.repository.AppointmentRepository;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public Appointment bookAppointment(AppointmentRequestDTO dto, String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LocalDate date = LocalDate.parse(dto.getSlotDate());
        LocalTime time = LocalTime.parse(dto.getSlotTime());

        Appointment appointment = Appointment.builder()
                .user(user) // Linked patient
                .doctor(doctor) // Linked doctor
                .slotDate(date) // Parsed from DTO
                .slotTime(time) // Parsed from DTO
                .amount(doctor.getFees()) // Snapshot of current fee
                .payment(false) // Initially not paid
                .build();

        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

        // Mark as cancelled
        appointment.setAppointmentCancelled(true);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getUserAppointments(Long userId) {
        // Return only non-cancelled appointments
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("User with ID " + userId + " not found.");
        }
        // Fetch appointments for the user that are not cancelled
        return appointmentRepository.findByUserIdAndAppointmentCancelledFalse(userId);
    }
}

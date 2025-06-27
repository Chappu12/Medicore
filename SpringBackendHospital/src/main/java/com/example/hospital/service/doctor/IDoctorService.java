package com.example.hospital.service.doctor;

import com.example.hospital.dto.DoctorRegisterRequest;
import com.example.hospital.entity.Doctor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface IDoctorService {
    Doctor registerDoctor(Doctor doctor);
    void deleteDoctor(Long id);
    void updateDoctor(Doctor doctor);
    Optional<Doctor> getOneDoc(Long id);
    List<DoctorRegisterRequest> getAllDoctors();
    List<LocalTime> getAvailableSlots(Long doctorId, LocalDate date);
}

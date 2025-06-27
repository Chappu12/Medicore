package com.example.hospital.service.doctor;

import com.example.hospital.dto.DoctorRegisterRequest;
import com.example.hospital.entity.Appointment;
import com.example.hospital.entity.Doctor;
import com.example.hospital.repository.AppointmentRepository;
import com.example.hospital.repository.DoctorRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements IDoctorService {

    private final DoctorRepository repository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public Doctor registerDoctor(Doctor doctor) {
        return repository.save(doctor);
    }

    @Override
    public void deleteDoctor(Long id) {
        repository.deleteById(id);
    }

    @Override
    public void updateDoctor(Doctor doctor) {
        if (doctor.getId() == null || !repository.existsById(doctor.getId())) {
            throw new EntityNotFoundException("Doctor with ID " + doctor.getId() + " not found.");
        }

        repository.save(doctor);
    }

    @Override
    public Optional<Doctor> getOneDoc(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<DoctorRegisterRequest> getAllDoctors() {
        List<Doctor> doctors = repository.findAll();

        return doctors.stream().map(doc -> {
            DoctorRegisterRequest dto = new DoctorRegisterRequest();
            dto.setId(doc.getId());
            dto.setName(doc.getName());
            dto.setImageUrl(doc.getImageUrl());
            dto.setSpeciality(doc.getSpeciality());
            dto.setDegree(doc.getDegree());
            dto.setExperience(doc.getExperience());
            dto.setAbout(doc.getAbout());
            dto.setFees(doc.getFees());
            dto.setAddress(doc.getAddress());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<LocalTime> getAvailableSlots(Long doctorId, LocalDate date) {
        // Use the updated repository method
        // Fetch booked appointments for the doctor on the specified date
        List<Appointment> bookedAppointments = appointmentRepository
                .findBookedAppointmentsByDoctorAndDate(doctorId, date);

        List<LocalTime> allSlots = generateTimeSlots();

        return allSlots.stream()
                .filter(slot -> bookedAppointments.stream()
                        .noneMatch(app -> app.getSlotTime().equals(slot)))
                .collect(Collectors.toList());
    }

    // Helper method to generate 30-min slots from 10:00 to 21:00
    private List<LocalTime> generateTimeSlots() {
        LocalTime start = LocalTime.of(10, 0);
        LocalTime end = LocalTime.of(21, 0);
        int intervalMinutes = 30;
        List<LocalTime> slots = new java.util.ArrayList<>();
        for (LocalTime time = start; time.isBefore(end); time = time.plusMinutes(intervalMinutes)) {
            slots.add(time);
        }
        return slots;
    }
}

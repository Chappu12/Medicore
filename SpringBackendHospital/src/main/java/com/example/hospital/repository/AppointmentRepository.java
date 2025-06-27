package com.example.hospital.repository;

import com.example.hospital.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.slotDate = :slotDate AND (a.appointmentCancelled IS NULL OR a.appointmentCancelled = false)")
    List<Appointment> findBookedAppointmentsByDoctorAndDate(@Param("doctorId") Long doctorId, @Param("slotDate") LocalDate slotDate);

    List<Appointment> findByUserIdAndAppointmentCancelledFalse(Long userId);
}
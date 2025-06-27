package com.example.hospital.controller;

import com.example.hospital.dto.DoctorRegisterRequest;
import com.example.hospital.entity.Doctor;
import com.example.hospital.service.cloud.CloudinaryService;
import com.example.hospital.service.doctor.DoctorServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorServiceImpl doctorService;
    private final CloudinaryService cloudinaryService;

    @PostMapping("/register")
    public ResponseEntity<?> registerDoctor(
            @ModelAttribute Doctor doctor,
            @RequestParam("image") MultipartFile file
    ) {
        try {
            // 1. Upload image
            String imageUrl = cloudinaryService.uploadImage(file);

            // 2. Inject image URL into doctor
            doctor.setImageUrl(imageUrl); // ✅ Save URL, not file

            // 3. Save doctor to DB
            Doctor saved = doctorService.registerDoctor(doctor);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Image upload failed");
        }
    }

//    @PostMapping("/update-profile")
//    public ResponseEntity<String> updateData(
//            @RequestBody Doctor doctor
//            ){
//        ResponseEntity<String> response = null;
//        doctorService.updateDoctor(doctor);
//        String message = "User " + doctor.getId() + " updated.";
//        response = ResponseEntity.ok(message);
//        return response;
//    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Doctor>> getOneDoc(
            @PathVariable("id") Long id
    ){
        return ResponseEntity.ok(doctorService.getOneDoc(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<DoctorRegisterRequest>> displayDoctors(){
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<List<LocalTime>> getAvailableSlots(
            @PathVariable("id") Long id,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<LocalTime> slots = doctorService.getAvailableSlots(id, date);
        return ResponseEntity.ok(slots);
    }
}

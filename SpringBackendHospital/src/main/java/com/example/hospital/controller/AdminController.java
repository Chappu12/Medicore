package com.example.hospital.controller;

import com.example.hospital.dto.AuthRequest;
import com.example.hospital.dto.AuthResponse;
import com.example.hospital.dto.DoctorRegisterRequest;
import com.example.hospital.entity.Doctor;
import com.example.hospital.service.cloud.CloudinaryService;
import com.example.hospital.service.doctor.DoctorServiceImpl;
import com.example.hospital.service.user.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    // This controller is accessible only to users with the ADMIN role
    // You can add methods here to handle admin-specific requests

    private final DoctorServiceImpl doctorService;
    private final UserServiceImpl userService;
    private final CloudinaryService cloudinaryService;

//    @PostMapping("/login")
//    public ResponseEntity<AuthResponse> login(
//            @RequestBody AuthRequest request
//    ){
//        return ResponseEntity.ok(userService.loginUser(request));
//    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // Authenticate the user first
        AuthResponse response = userService.loginUser(request);

        // Fetch user to check role
        var user = userService.findByEmail(request.getEmail());

        if (user == null || !user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).body(
                    new AuthResponse(null, "Access denied. Only ADMIN can login here.", false)
            );
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register-doctor")
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


    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorRegisterRequest>> getAllDoctors() {
        List<DoctorRegisterRequest> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

}

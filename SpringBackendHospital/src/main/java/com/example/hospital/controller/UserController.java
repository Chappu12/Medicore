package com.example.hospital.controller;

import com.example.hospital.dto.*;
import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.User;
import com.example.hospital.repository.UserRepository;
import com.example.hospital.service.cloud.CloudinaryService;
import com.example.hospital.service.user.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final IUserService service;
    private final AuthenticationManager authenticationManager;
    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegisterRequest request) {
        return ResponseEntity.ok(service.registerUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(service.loginUser(request));
    }

    @GetMapping("/get-profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        String email = authentication.getName(); // Extracted by JwtFilter
        User user = service.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body(new AuthResponse(null, "User not found", false));
        }

        return ResponseEntity.ok(new ApiResponse(true, "User profile fetched", user));
    }

    @PutMapping("/update-profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> updateUser(
            @RequestParam("id") Long id,
            @RequestParam("name") String name,
            @RequestParam("gender") String gender,
            @RequestParam("dob") String dob, // parse manually
            @RequestParam("email") String email,
            @RequestParam("contactNumber") String contactNumber,
            @RequestParam("emergencyContact") String emergencyContact,
            @RequestParam("address") String address,
            @RequestParam(value = "password", required = false) String password,
            @RequestPart(value = "image", required = false) MultipartFile file
    ) {
        try {
            User existingUser = service.getUserById(id);
            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // 🌄 Image handling
            if (file != null && !file.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(file);
                existingUser.setImageUrl(imageUrl);
            }

            // 🛠 Update fields
            existingUser.setName(name);
            existingUser.setGender(gender);
            existingUser.setDob(LocalDate.parse(dob)); // ✅ safe parse
            existingUser.setEmail(email);
            existingUser.setContactNumber(contactNumber);
            existingUser.setEmergencyContact(emergencyContact);
            existingUser.setAddress(address);

            service.updateUser(existingUser);
            return ResponseEntity.ok("User " + id + " updated.");
        } catch (Exception e) {
            e.printStackTrace(); // log it
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Update failed: " + e.getMessage());
        }
    }

    // in this method according to the frontend I have mapped the response
    @GetMapping("/appointments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAppointments(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<AppointmentResponseDTO> appointments = user.getAppointments().stream()
//                .filter(app -> app.getAppointmentCancelled() == null || !app.getAppointmentCancelled()) // Exclude cancelled
                .map(app -> {
                    AppointmentResponseDTO dto = new AppointmentResponseDTO();
                    dto.setId(app.getId());
                    dto.setSlotDate(app.getSlotDate().toString());
                    dto.setSlotTime(app.getSlotTime().toString());
                    dto.setAmount(app.getAmount());
                    dto.setAppointmentCancelled(app.getAppointmentCancelled());

                    Doctor doctor = app.getDoctor();
                    DoctorRegisterRequest docDto = new DoctorRegisterRequest();
                    docDto.setId(doctor.getId());
                    docDto.setName(doctor.getName());
                    docDto.setImageUrl(doctor.getImageUrl());
                    docDto.setSpeciality(doctor.getSpeciality());
                    docDto.setDegree(doctor.getDegree());
                    docDto.setExperience(doctor.getExperience());
                    docDto.setAbout(doctor.getAbout());
                    docDto.setFees(doctor.getFees());
                    docDto.setAddress(doctor.getAddress());

                    dto.setDocData(docDto);

                    return dto;
                }).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("appointments", appointments);

        return ResponseEntity.ok(response);
    }

}

package com.example.hospital.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;

import com.example.hospital.entity.User; // Import your User entity

@Component
public class JwtUtil {

    private static final String SECRET = "5C3J7a9W2b8Y1kqMz6eP0tBnXsRwU4vL"; // At least 256-bit key for HS256
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // 🔧 Updated: Takes User object to include role in claims
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name()) // for frontend, if needed
                .claim("authorities", "ROLE_" + user.getRole().name()) // important for Spring
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Extract username/email from token
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // 🧪 Validate token
    public boolean validateToken(String token, String userEmail) {
        final String extractedEmail = extractUsername(token);
        return (userEmail.equals(extractedEmail)) && !isTokenExpired(token);
    }

    // ❌ Check if token is expired
    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // 🧬 Parse claims
    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }



    // Extract authorities as a list of strings
    public List<String> extractAuthorities(String token) {
        String authorities = getClaims(token).get("authorities", String.class);
        if (authorities == null || authorities.isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.asList(authorities.split(","));
    }
}

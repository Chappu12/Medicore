package com.example.hospital.filter;

import com.example.hospital.util.JwtUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Autowired
    public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Extract Authorization Header
        final String authHeader = request.getHeader("Authorization");

        String token = null;
        String username = null;

        // 2. Check if Authorization header exists and starts with "Bearer "
        // or simply checks if the token is present or not
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Extract the actual token (remove "Bearer ")
            username = jwtUtil.extractUsername(token); // extracts username from token
        }

        // 3. Validate Token and Authenticate if not already authenticated
        // Check if username was extracted AND
        // if no authentication is currently set in the SecurityContext (meaning this request hasn't been authenticated yet)
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Load user details from your data source using the extracted username
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Validate the token against the user details
            // This usually checks token expiration and signature, and often verifies the username

            if (jwtUtil.validateToken(token, userDetails.getUsername())) {
                // If the token is valid, extract authorities (roles/permissions) from the token
                // This is where you can extract roles/permissions from the token
                // and convert them to SimpleGrantedAuthority objects
                // This is important for Spring Security to understand the user's roles
                // Convert the list of authorities (strings) from the token into SimpleGrantedAuthority objects
                // This is necessary for Spring Security to understand the user's roles

                List<SimpleGrantedAuthority> authorities = jwtUtil.extractAuthorities(token).stream()
                        .map(SimpleGrantedAuthority::new)
                        .toList();

                // Create an authentication token
                // userDetails: The principal (the authenticated user)
                // null: Credentials (password, not needed for JWT after initial login)
                // userDetails.getAuthorities(): The roles/permissions of the user
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                authorities);

                // Set authentication details (remote address, session ID, etc.) for logging/auditing
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the Authentication object in the SecurityContextHolder
                // This tells Spring Security that the current request is authenticated
                SecurityContextHolder.getContext().setAuthentication(authToken); //Marks user as authenticated for the current request
            }
        }
        // 4. Continue the filter chain
        // Pass the request and response to the next filter in the Spring Security chain
        filterChain.doFilter(request, response);
    }
}

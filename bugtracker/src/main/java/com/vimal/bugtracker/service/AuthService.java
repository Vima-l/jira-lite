package com.vimal.bugtracker.service;

import com.vimal.bugtracker.dto.AuthenticationRequest;
import com.vimal.bugtracker.dto.AuthenticationResponse;
import com.vimal.bugtracker.dto.RegisterRequest;
import com.vimal.bugtracker.dto.VerifyRequest;
import com.vimal.bugtracker.model.User;
import com.vimal.bugtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    // temporary store of OTPs for unverified users
    private final Map<String, String> otpStore = new HashMap<>();

    public String register(RegisterRequest request) {
        //Clean old unverified user with same email
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent() && !existingUser.get().isEnabled()) {
            userRepository.delete(existingUser.get());
        }

        //Check if user already exists (and is verified)
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists and is verified.");
        }

        // ✅ Step 3: Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setEnabled(false);
        user.setOtpGeneratedAt(LocalDateTime.now());

        userRepository.save(user);

        // ✅ Step 4: Generate and store OTP
        String otp = generateOtp(); // your OTP logic
        otpStore.put(user.getEmail(), otp);

        // ✅ Step 5: Send email
        mailService.sendOtp(user.getEmail(), otp);

        return "OTP sent to your email. Please verify to activate your account.";
    }

    public String verifyOtp(String email, String otp) {
        if (!otpStore.containsKey(email)) {
            return "No OTP found. Register first.";
        }

        if (!otpStore.get(email).equals(otp)) {
            return "Invalid OTP";
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Check if OTP has expired (5 minutes window)
        LocalDateTime now = LocalDateTime.now();
        if (user.getOtpGeneratedAt() == null || user.getOtpGeneratedAt().plusMinutes(5).isBefore(now)) {
            return "OTP expired. Please register again.";
        }

        // ✅ OTP is valid and not expired
        user.setEnabled(true); // or setIsVerified(true)
        user.setOtp(null); // clear OTP from DB
        user.setOtpGeneratedAt(null); // clear timestamp
        userRepository.save(user);

        otpStore.remove(email); // remove from in-memory store

        return "User verified successfully. You can now log in.";
    }


    public AuthenticationResponse login(AuthenticationRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(!user.isVerified()){
            throw new RuntimeException("User is not verified.");
        }
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Passwords don't match.");
        }
        String token= jwtService.generateToken(user.getEmail(),user.getRole().toString());
        return new AuthenticationResponse(token,user.getRole().toString());
    }

    private String generateOtp() {
        return String.valueOf(UUID.randomUUID().toString().substring(0, 6));
    }
}

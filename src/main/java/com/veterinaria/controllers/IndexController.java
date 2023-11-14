package com.veterinaria.controllers;

import com.veterinaria.controllers.request.*;
import com.veterinaria.entities.ERole;
import com.veterinaria.entities.RoleEntity;
import com.veterinaria.entities.TokenEntity;
import com.veterinaria.entities.UserEntity;
import com.veterinaria.repositories.UserRepository;
import com.veterinaria.security.jwt.JwtUtils;
import com.veterinaria.security.jwt.TokenResponse;
import com.veterinaria.services.EmailService;
import com.veterinaria.services.Impl.UserDetailsServiceImpl;
import com.veterinaria.services.Impl.UserEntityServiceImpl;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class IndexController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    UserEntityServiceImpl userEntityServiceImpl;

    @Autowired
    EmailService emailService;

    @PostMapping("/createuser")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserDTO createUserDTO) throws MessagingException {

        Set<RoleEntity> roles = createUserDTO.getRoles().stream()
                .map(role -> RoleEntity.builder().name(ERole.valueOf(role)).build())
                .collect(Collectors.toSet());

        UserEntity userEntity = UserEntity.builder()
                .email(createUserDTO.getEmail())
                .phone(createUserDTO.getPhone())
                .address(createUserDTO.getDirection())
                .username(createUserDTO.getUsername())
                .password(passwordEncoder.encode(createUserDTO.getPassword()))
                .roles(roles)
                .createdAt(createUserDTO.getCreatedAt())
                .build();
        System.out.println(createUserDTO);
        System.out.println(userEntity);
        userRepository.save(userEntity);

        if (!createUserDTO.getRoles().contains("CLIENT")) {
            emailService.sendEmail(userEntity.getEmail(), "Confirmar correo electrónico", "register.html");
        }


        return ResponseEntity.ok(userEntity);
    }

    @DeleteMapping("/deleteuser/{id}")
    public Optional<UserEntity> deleteUser(@PathVariable int id) {
        Optional<UserEntity> userEntity = userRepository.findById((long) id);
        userDetailsService.deleteUser((long) id);
        return userEntity;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateToken(@RequestBody TokenEntity tokenEntity) throws Exception {

        try {
            Auth(tokenEntity.getUsername(), tokenEntity.getPassword());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(tokenEntity.getUsername());
        String token = jwtUtils.generateAccessToken(userDetails.getUsername());
        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setToken(token);
        return ResponseEntity.ok(tokenResponse);
    }

    public void Auth(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException | BadCredentialsException disabledException) {
            throw new Exception("Credenciales invalidas");
        }

    }

    @PostMapping("/auth/login")
    public TokenResponse login(@Valid @RequestBody LoginUserDTO loginUserDTO, BindingResult bindingResult) throws Exception {
        if (bindingResult.hasErrors()) {
            return new TokenResponse();
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginUserDTO.getUsername(), loginUserDTO.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateAccessToken(authentication.getName());
            TokenResponse tokenResponse = new TokenResponse();
            tokenResponse.setToken(jwt);
            return tokenResponse;
        } catch (Exception e) {
            return new TokenResponse();
        }
    }


    @GetMapping("/details")
    public ResponseEntity<?> getUserDetails(HttpServletResponse response) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        Optional<UserEntity> userEntity = userRepository.findByUsername(username);
        if (userEntity.isEmpty())
            throw new RuntimeException("Usuario no encontrado");
        return new ResponseEntity<>(userEntity.get(), null, response.getStatus());
    }

    @PostMapping("/logot")
    public ResponseEntity<ResponseDTO> logout(HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new ResponseDTO("Logout exitoso", null));
    }


    @GetMapping("/actual")
    public UserDetails getActualUser(Principal principal) {
        return userDetailsService.loadUserByUsername(principal.getName());
    }

    @GetMapping("/actualuser/{username}")
    public UserEmailDTO getActualUser(@PathVariable String username) {
        UserEmailDTO userEmailDTO = new UserEmailDTO();
        userEmailDTO.setUsername(username);
        userEmailDTO.setEmail(userEntityServiceImpl.getUserByUsername(username).getEmail());
        return userEmailDTO;
    }


}

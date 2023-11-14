package com.veterinaria.controllers;

import com.veterinaria.controllers.request.EmailCodeDTO;
import com.veterinaria.controllers.request.EmailDTO;
import com.veterinaria.controllers.request.UserEmailDTO;
import com.veterinaria.entities.UserEntity;
import com.veterinaria.repositories.EmailCodeDTORepository;
import com.veterinaria.repositories.UserRepository;
import com.veterinaria.services.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailCodeDTORepository emailCodeDTORepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public void sendEmail(String email) throws MessagingException {
        Optional<EmailCodeDTO> tempEmail = emailCodeDTORepository.findByEmail(email);
        tempEmail.ifPresent(emailCodeDTO -> emailCodeDTORepository.delete(emailCodeDTO));
        emailService.sendEmail(email, "Confirmar correo electrónico", "register.html");
    }

    @PostMapping("/recover")
    public void sendRecoverEmail(@RequestBody UserEmailDTO userEmailDTO) throws MessagingException {
        String email = userEmailDTO.getEmail();
        Optional<UserEntity> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            System.out.println("No existe el usuario");
        } else {
            Optional<EmailCodeDTO> tempEmail = emailCodeDTORepository.findByEmail(email);
            tempEmail.ifPresent(emailCodeDTO -> emailCodeDTORepository.delete(emailCodeDTO));
            emailService.sendEmail(email, "Recuperar contraseña", "recoverPassword.html");
        }
    }

    @PostMapping("/validate")
    public Boolean validateCode(@RequestBody EmailDTO emailDTO) {
        return emailService.validateCode(emailDTO);
    }


}

package com.veterinaria.services;

import com.veterinaria.controllers.request.EmailDTO;
import jakarta.mail.MessagingException;

public interface EmailService {
    void sendEmail(String email, String title, String type) throws MessagingException;
    Integer getRandomNumber();

    Boolean validateCode(EmailDTO emailDTO);
}

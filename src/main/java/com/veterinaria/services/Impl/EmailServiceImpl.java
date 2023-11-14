package com.veterinaria.services.Impl;

import com.veterinaria.controllers.request.EmailCodeDTO;
import com.veterinaria.controllers.request.EmailDTO;
import com.veterinaria.entities.ERole;
import com.veterinaria.entities.RoleEntity;
import com.veterinaria.entities.UserEntity;
import com.veterinaria.repositories.EmailCodeDTORepository;
import com.veterinaria.repositories.UserRepository;
import com.veterinaria.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private EmailCodeDTORepository emailCodeDTORepository;

    @Autowired
    private UserRepository userRepository;

    public int randomNumber = 0;

    private String mail;

    public void sendEmail(String email, String title, String type) throws MessagingException {
        mail = email;
        Random random = new Random();
        randomNumber = random.nextInt(90000000) + 10000000;

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(email);
        helper.setTo(email);
        helper.setSubject("Confirma tu correo");

        Context context = new Context();
        context.setVariable("code", randomNumber);
        context.setVariable("title", title);

        String htmlContent = templateEngine.process(type, context);

        helper.setText(htmlContent, true);

        javaMailSender.send(message);

        Optional<EmailCodeDTO> existingEmailCodeDTO = emailCodeDTORepository.findByEmail(mail);

        existingEmailCodeDTO.ifPresent(emailCodeDTO -> emailCodeDTORepository.deleteById(existingEmailCodeDTO.get().getId()));
        EmailCodeDTO emailCodeDTO = new EmailCodeDTO();
        emailCodeDTO.setCode(randomNumber);
        emailCodeDTO.setEmail(mail);
        emailCodeDTORepository.save(emailCodeDTO);

    }

    public Integer getRandomNumber() {
        return randomNumber;
    }

    public Boolean validateCode(EmailDTO emailDTO) {
        String email = emailDTO.getEmail();
        Optional<EmailCodeDTO> tempEmail = emailCodeDTORepository.findByEmail(email);
        if (tempEmail.isEmpty()) {
            System.out.println("No se encontró un registro para el correo electrónico dado en la base de datos.");
            return false;
        } else {
            boolean resp = false;
            if (tempEmail.get().getEmail().equals(email)) {
                Integer storedCode = tempEmail.get().getCode();
                Integer submittedCode = emailDTO.getCode();

                if (storedCode.equals(submittedCode)) {
                    UserEntity user = userRepository.findByEmail(email).get();
                    RoleEntity role = user.getRoles().stream().reduce((role1, role2) -> role1).get();
                    role.setName(ERole.valueOf("USER"));
                    userRepository.save(user);
                    /*emailCodeDTORepository.deleteById(tempEmail.get().getId());*/
                    return resp = true;
                } else {
                    System.out.println("Código incorrecto");
                    return resp;
                }
            }
            return resp;
        }
    }
}

package com.veterinaria.controllers.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserDTO {

    @Email @NotBlank
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String direction;

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    private Set<String> roles;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date createdAt;

}

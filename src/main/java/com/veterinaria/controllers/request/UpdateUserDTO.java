package com.veterinaria.controllers.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserDTO {

    private int id;
    private String username;
    private String email;
    private String phone;
    private String address;

}

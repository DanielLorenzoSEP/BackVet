package com.veterinaria.controllers.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PetDTO {

    private Long id;

    private String name;

    private String sex;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date birthdate;

    private String specie;

    private String race;

    private float weight;

    private int userId;

    private String userUsername;


    
}

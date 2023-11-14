package com.veterinaria.controllers.request;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "email_code")
public class EmailCodeDTO {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Integer code;

    @Column(unique = true)
    private String email;
}

package com.veterinaria.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.*;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "pets")
@JsonIgnoreProperties({"appointments"})
public class PetEntity {

    @Getter @Setter
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter @Setter
    @NotBlank
    private String name;

    @Getter @Setter
    @NotBlank
    private String sex;

    @Getter @Setter
    @NotNull @Past
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date birthdate;

    @Getter @Setter
    @NotBlank
    private String specie;

    @Getter @Setter
    @NotBlank
    private String race;

    @Getter @Setter
    @NotNull
    private float weight;

    @Getter @Setter
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_id")
    @JsonBackReference(value = "user-pets")
    private UserEntity user;

    @Getter @Setter
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pet", cascade = CascadeType.MERGE)
    @JsonManagedReference(value = "pet")
    private List<PrescriptionEntity> prescriptions;

}

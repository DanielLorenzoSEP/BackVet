package com.veterinaria.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class UserEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email @NotBlank @Size(max = 40) @Column(unique = true)
    private String email;

    @NotBlank @Size(max = 20) @Column(unique = true)
    private String phone;

    private String address;

    @NotBlank @Size(max = 40) @Column(unique = true)
    private String username;

    @NotBlank
    private String password;

    @Past
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date createdAt;

    @ManyToMany(fetch = FetchType.EAGER, targetEntity = RoleEntity.class, cascade = CascadeType.ALL)
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns =  @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private Set<RoleEntity> roles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.MERGE, fetch = FetchType.EAGER, targetEntity = PetEntity.class)
    @JsonManagedReference(value = "user-pets")
    private Set<PetEntity> pets;

    @OneToMany(mappedBy = "user", cascade = CascadeType.MERGE, fetch = FetchType.LAZY, targetEntity = AppointmentEntity.class)
    @JsonManagedReference(value = "user-appointments")
    private Set<AppointmentEntity> appointments;
}

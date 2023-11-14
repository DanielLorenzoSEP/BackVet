package com.veterinaria.repositories;

import com.veterinaria.controllers.request.EmailCodeDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailCodeDTORepository extends JpaRepository<EmailCodeDTO, Long> {
    Optional<EmailCodeDTO> findByEmail(String email);

    Optional<EmailCodeDTO> findByCode(Integer code);
}

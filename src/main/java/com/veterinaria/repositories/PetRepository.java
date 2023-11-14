package com.veterinaria.repositories;

import com.veterinaria.entities.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<PetEntity, Long> {
    List<PetEntity> findByUserId(Long id);

    int countBySpecie(String species);
}

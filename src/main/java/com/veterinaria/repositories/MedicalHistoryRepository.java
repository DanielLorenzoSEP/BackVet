package com.veterinaria.repositories;

import com.veterinaria.entities.MedicalHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistoryEntity, Long> {
    /*MedicalHistoryEntity findByPetId(Long pet_id);*/
}

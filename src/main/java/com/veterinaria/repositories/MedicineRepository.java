package com.veterinaria.repositories;

import com.veterinaria.entities.MedicineEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineRepository extends JpaRepository<MedicineEntity, Long> {

    MedicineEntity findByName(String name);
}

package com.veterinaria.repositories;

import com.veterinaria.entities.RelationPrescriptionMedicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelationPrescriptionMedicineRepository extends JpaRepository<RelationPrescriptionMedicine, Long> {

}

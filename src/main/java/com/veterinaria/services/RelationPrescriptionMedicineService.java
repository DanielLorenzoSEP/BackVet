package com.veterinaria.services;

import com.veterinaria.entities.RelationPrescriptionMedicine;

import java.util.List;

public interface RelationPrescriptionMedicineService {

    List<RelationPrescriptionMedicine> getAllRelationPrescriptionMedicine();

    RelationPrescriptionMedicine getRelationPrescriptionMedicineById(Long id);

    RelationPrescriptionMedicine saveRelationPrescriptionMedicine(RelationPrescriptionMedicine relationPrescriptionMedicine);

    void deleteRelationPrescriptionMedicine(Long id);
}

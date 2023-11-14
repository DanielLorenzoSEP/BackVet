package com.veterinaria.services.Impl;

import com.veterinaria.entities.RelationPrescriptionMedicine;
import com.veterinaria.repositories.RelationPrescriptionMedicineRepository;
import com.veterinaria.services.RelationPrescriptionMedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RelationPrescriptionMedicineImpl implements RelationPrescriptionMedicineService {

    @Autowired
    RelationPrescriptionMedicineRepository relationPrescriptionMedicineRepository;

    public List<RelationPrescriptionMedicine> getAllRelationPrescriptionMedicine() {
        return relationPrescriptionMedicineRepository.findAll();
    }

    public RelationPrescriptionMedicine getRelationPrescriptionMedicineById(Long id) {
        return relationPrescriptionMedicineRepository.findById(id).orElse(null);
    }

    public RelationPrescriptionMedicine saveRelationPrescriptionMedicine(RelationPrescriptionMedicine relationPrescriptionMedicine) {
        System.out.println(relationPrescriptionMedicine);
        return relationPrescriptionMedicineRepository.save(relationPrescriptionMedicine);
    }

    public void deleteRelationPrescriptionMedicine(Long id) {
        relationPrescriptionMedicineRepository.deleteById(id);
    }

}

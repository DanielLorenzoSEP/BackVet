package com.veterinaria.services.Impl;

import com.veterinaria.controllers.request.MedicinesCountDTO;
import com.veterinaria.entities.MedicineEntity;
import com.veterinaria.entities.PrescriptionEntity;
import com.veterinaria.entities.RelationPrescriptionMedicine;
import com.veterinaria.services.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MedicineCounter {

    @Autowired
    PrescriptionService prescriptionService;

        public List<MedicinesCountDTO> countMedicines() {
            List<PrescriptionEntity> prescriptions = prescriptionService.getAll();

            Map<String, Integer> medicineCountMap = new HashMap<>();

            for (PrescriptionEntity prescription : prescriptions) {
                List<RelationPrescriptionMedicine> relations = prescription.getRelations();
                for (RelationPrescriptionMedicine relation : relations) {
                    Set<MedicineEntity> medicines = relation.getMedicines();
                    for (MedicineEntity medicine : medicines) {
                        String medicineName = medicine.getName();
                        medicineCountMap.put(medicineName, medicineCountMap.getOrDefault(medicineName, 0) + 1);
                    }
                }
            }

            List<Map.Entry<String, Integer>> sortedMedicineCounts = new ArrayList<>(medicineCountMap.entrySet());
            sortedMedicineCounts.sort((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()));

            List<Map.Entry<String, Integer>> topFiveMedicines = sortedMedicineCounts.subList(0, Math.min(5, sortedMedicineCounts.size()));

            List<MedicinesCountDTO> medicinesCountDTOS = new ArrayList<>();

            for (Map.Entry<String, Integer> entry : topFiveMedicines) {
                MedicinesCountDTO medicinesCountDTO = new MedicinesCountDTO();
                String medicineName = entry.getKey();
                int count = entry.getValue();
                medicinesCountDTO.setName(medicineName);
                medicinesCountDTO.setValue(count);
                medicinesCountDTOS.add(medicinesCountDTO);
                System.out.println(medicineName + ": " + count);
            }
            return medicinesCountDTOS;
        }
}


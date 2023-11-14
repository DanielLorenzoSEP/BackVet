package com.veterinaria.services;

import com.veterinaria.entities.DoctorEntity;
import com.veterinaria.entities.PrescriptionEntity;

import java.util.List;

public interface PrescriptionService {

    PrescriptionEntity save(PrescriptionEntity prescriptionEntity);

    PrescriptionEntity getById(int id);

    boolean deleteById(int id);

    List<PrescriptionEntity> getAll();

}

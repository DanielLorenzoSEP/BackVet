package com.veterinaria.services;

import com.veterinaria.entities.DoctorEntity;
import com.veterinaria.entities.PrescriptionEntity;

import java.util.List;

public interface DoctorService {

    List<DoctorEntity> getAll();

    DoctorEntity save(DoctorEntity doctor);

    DoctorEntity getById(Long id);

    DoctorEntity deleteById(Long id);
}

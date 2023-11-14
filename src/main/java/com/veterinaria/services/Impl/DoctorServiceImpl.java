package com.veterinaria.services.Impl;

import com.veterinaria.entities.DoctorEntity;
import com.veterinaria.entities.PrescriptionEntity;
import com.veterinaria.repositories.DoctorRepository;
import com.veterinaria.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    DoctorRepository doctorRepository;

    public List<DoctorEntity> getAll() {
        return doctorRepository.findAll();
    }

    public DoctorEntity save(DoctorEntity doctor) {
        return doctorRepository.save(doctor);
    }

    public DoctorEntity getById(Long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    public DoctorEntity deleteById(Long id) {
        DoctorEntity doctor = doctorRepository.findById(id).orElse(null);
        doctorRepository.deleteById(id);
        return doctor;
    }

}

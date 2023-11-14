package com.veterinaria.services.Impl;

import com.veterinaria.entities.DoctorEntity;
import com.veterinaria.entities.PrescriptionEntity;
import com.veterinaria.repositories.PrescriptionRepository;
import com.veterinaria.services.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository repository;

    public PrescriptionEntity save(PrescriptionEntity prescriptionEntity){
        return repository.save(prescriptionEntity);
    }

    @Transactional
    public List<PrescriptionEntity> getAll() throws NullPointerException {
        List<PrescriptionEntity> prescriptionEntity = repository.findAll();
        System.out.println("prescriptions: " + prescriptionEntity);
        return repository.findAll();
    }

    public PrescriptionEntity getById(int id) {
        return repository.findById((long) id).orElse(null);
    }

    public boolean deleteById(int id){
        repository.deleteById((long) id);
        return true;
    }

}

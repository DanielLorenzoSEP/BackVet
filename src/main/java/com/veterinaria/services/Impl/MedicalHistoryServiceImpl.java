package com.veterinaria.services.Impl;

import com.veterinaria.entities.MedicalHistoryEntity;
import com.veterinaria.repositories.MedicalHistoryRepository;
import com.veterinaria.services.MedicalHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalHistoryServiceImpl implements MedicalHistoryService {
/*
    @Autowired
    private MedicalHistoryRepository repository;

    public MedicalHistoryEntity save(MedicalHistoryEntity medicalHistoryEntity){
        return repository.save(medicalHistoryEntity);
    }

    public MedicalHistoryEntity getById(int id){
        return repository.findById((long) id).orElse(null);
    }

    public List<MedicalHistoryEntity> getAll(){
        return repository.findAll();
    }

    public boolean deleteById(int id){
        repository.deleteById((long) id);
        return true;
    }

    public MedicalHistoryEntity getByPetId(int id){
        return repository.findByPetId((long) id);
    }*/


}

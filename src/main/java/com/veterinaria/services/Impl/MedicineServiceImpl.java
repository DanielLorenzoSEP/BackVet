package com.veterinaria.services.Impl;

import com.veterinaria.entities.MedicineEntity;
import com.veterinaria.repositories.MedicineRepository;
import com.veterinaria.services.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineServiceImpl implements MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    public MedicineEntity save(MedicineEntity medicineEntity) {
        return medicineRepository.save(medicineEntity);
    }

    public List<MedicineEntity> listAll() {
        return medicineRepository.findAll();
    }

    public MedicineEntity findById(int id) {
        return medicineRepository.findById((long) id).orElse(null);
    }

    public boolean delete(int id) {
        try {
            medicineRepository.deleteById((long) id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public MedicineEntity getByName(String name) {
        return medicineRepository.findByName(name);
    }
}

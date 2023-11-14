package com.veterinaria.services;

import com.veterinaria.entities.MedicineEntity;

import java.util.List;

public interface MedicineService {

    MedicineEntity save(MedicineEntity medicineEntity);

    List<MedicineEntity> listAll();

    MedicineEntity findById(int id);

    boolean delete(int id);

    MedicineEntity getByName(String name);
}

package com.veterinaria.services;

import com.veterinaria.controllers.request.PetDTO;
import com.veterinaria.entities.PetEntity;

import java.util.List;

public interface PetEntityService {

    PetEntity savePet(PetEntity petEntity);

    List<PetEntity> getPets();

    PetEntity getPet(Long id);

    List<PetEntity> getPetsByUser(Long id);

    PetEntity getPetById(Long id);

    PetEntity updatePet(PetEntity petEntity);

    PetDTO deletePet(Long id);

    int countBySpecies(String species);
}

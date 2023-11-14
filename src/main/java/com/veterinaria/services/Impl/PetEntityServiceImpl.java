package com.veterinaria.services.Impl;

import com.veterinaria.controllers.request.PetDTO;
import com.veterinaria.entities.AppointmentEntity;
import com.veterinaria.entities.PetEntity;
import com.veterinaria.entities.PrescriptionEntity;
import com.veterinaria.entities.UserEntity;
import com.veterinaria.exceptions.PetNotFoundException;
import com.veterinaria.exceptions.UserNotFoundException;
import com.veterinaria.repositories.AppointmentRepository;
import com.veterinaria.repositories.PetRepository;
import com.veterinaria.repositories.PrescriptionRepository;
import com.veterinaria.repositories.UserRepository;
import com.veterinaria.services.PetEntityService;
import com.veterinaria.services.UserEntityService;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class PetEntityServiceImpl implements PetEntityService {

    @Autowired
    PetRepository petRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserEntityService userEntityService;

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    PrescriptionRepository prescriptionRepository;
    public PetEntity savePet(PetEntity petEntity) {
        return petRepository.save(petEntity);
    }

    public List<PetEntity> getPets() {
        return petRepository.findAll();
    }

    public PetEntity getPet(Long id) {
        return petRepository.findById(id).orElse(null);
    }


    public PetEntity updatePet(PetEntity petEntity) {
        PetEntity petEntityToUpdate = petRepository.findById(petEntity.getId()).orElse(null);
        if (petEntityToUpdate != null) {
            petEntityToUpdate.setName(petEntity.getName());
            petEntityToUpdate.setBirthdate(petEntity.getBirthdate());
            petEntityToUpdate.setSex(petEntity.getSex());
            petEntityToUpdate.setSpecie(petEntity.getSpecie());
            petEntityToUpdate.setRace(petEntity.getRace());
            petEntityToUpdate.setWeight(petEntity.getWeight());
            petEntityToUpdate.setUser(petEntityToUpdate.getUser());
            petRepository.save(petEntityToUpdate);
        }
        return petEntityToUpdate;
    }

    public List<PetEntity> getPetsByUser(Long id) {
        return petRepository.findByUserId(id);
    }

    public PetEntity getPetById(Long id) {
        return petRepository.findById(id).orElse(null);
    }

    public PetDTO deletePet(Long id) {
        try {
            PetEntity petEntity = petRepository.findById(id).orElse(null);

            if (petEntity == null) {
                // Manejar el caso en el que petEntity es null, por ejemplo, lanzar una excepción personalizada
                throw new PetNotFoundException("No se encontró una mascota con el ID proporcionado.");
            }

            PetDTO petDTO = new PetDTO();
            petDTO.setId(id);
            petDTO.setName(petEntity.getName());
            petDTO.setBirthdate(petEntity.getBirthdate());
            petDTO.setSex(petEntity.getSex());
            petDTO.setSpecie(petEntity.getSpecie());
            petDTO.setRace(petEntity.getRace());
            petDTO.setWeight(petEntity.getWeight());

            List<AppointmentEntity> appointmentEntities = appointmentRepository.findAppointmentsByPetsIn(List.of(petEntity));

            if (!appointmentEntities.isEmpty()) {
                for (AppointmentEntity appointmentEntity : appointmentEntities) {
                    appointmentRepository.deleteById(appointmentEntity.getId());
                }
            }

            List<PrescriptionEntity> prescriptionsEntity = prescriptionRepository.findByPetId(id);

            if (!prescriptionsEntity.isEmpty()) {
                for (PrescriptionEntity prescriptionEntity : prescriptionsEntity) {
                    prescriptionRepository.deleteById(prescriptionEntity.getId());
                }
            }

            UserEntity userEntity = userRepository.findById(petEntity.getUser().getId()).orElse(null);

            if (userEntity == null) {
                // Manejar el caso en el que userEntity es null, por ejemplo, lanzar una excepción personalizada
                throw new UserNotFoundException("No se encontró al usuario asociado a la mascota.");
            }

            petDTO.setUserUsername(userEntity.getUsername());

            userEntity.getPets().remove(petEntity);
            userEntityService.updateUser(Optional.of(userEntity));

            petRepository.delete(petEntity);
            return petDTO;
        } catch (NullPointerException ex) {
            System.out.println(ex);
            throw ex;
        }
    }


    public int countBySpecies(String species) {
        return petRepository.countBySpecie(species);
    }

}

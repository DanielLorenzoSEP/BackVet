package com.veterinaria.controllers;

import com.veterinaria.controllers.request.CreatePetDTO;
import com.veterinaria.controllers.request.PetDTO;
import com.veterinaria.entities.PetEntity;
import com.veterinaria.entities.UserEntity;
import com.veterinaria.repositories.PetRepository;
import com.veterinaria.repositories.UserRepository;
import com.veterinaria.services.AppointmentService;
import com.veterinaria.services.PetEntityService;
import com.veterinaria.services.RelationPrescriptionMedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/pets")
@CrossOrigin(origins = "*")
public class PetEntityController {

    @Autowired
    PetEntityService petEntityService;

    @Autowired
    PetRepository petRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RelationPrescriptionMedicineService relationPrescriptionMedicineService;

    @Autowired
    AppointmentService appointmentService;

    @PostMapping("/")
    public PetEntity savePet(@RequestBody CreatePetDTO createPetDTO) {
        PetEntity petEntity = new PetEntity();
        petEntity.setName(createPetDTO.getName());
        petEntity.setSex(createPetDTO.getSex());
        petEntity.setBirthdate(createPetDTO.getBirthdate());
        petEntity.setSpecie(createPetDTO.getSpecie());
        petEntity.setRace(createPetDTO.getRace());
        petEntity.setWeight(createPetDTO.getWeight());
        UserEntity userEntity = userRepository.findById(createPetDTO.getUserId()).orElse(null);
        petEntity.setUser(userEntity);
        petEntityService.savePet(petEntity);
        return petEntity;
    }

    @GetMapping("/")
    public List<PetEntity> getPets() {
        System.out.println(petEntityService.getPets());
        return petEntityService.getPets();
    }

    @PutMapping("/")
    public PetEntity updatePet(@RequestBody PetEntity petEntity) {
        return petEntityService.updatePet(petEntity);
    }

    @GetMapping("/{id}")
    public PetEntity getPet(@PathVariable Long id) {
        return petEntityService.getPet(id);
    }

    @GetMapping("/user/{id}")
    public Iterable<PetEntity> getPetsByUser(@PathVariable int id) {
        return petEntityService.getPetsByUser((long) id);
    }

    @DeleteMapping("/{id}")
    public PetDTO deletePet(@PathVariable Long id) {
        return petEntityService.deletePet(id);
    }

    @GetMapping("/users")
    public List<PetDTO> getUserWithPets() {
        List<UserEntity> users = userRepository.findAll();
        List<PetDTO> pets = new ArrayList<>();

        users.forEach(user -> {
            List<PetEntity> tempListPet = petRepository.findByUserId(user.getId());

            tempListPet.forEach(temp -> {
                PetDTO tempPet = new PetDTO();  // Crear una instancia nueva en cada iteración
                tempPet.setId(temp.getId());
                tempPet.setName(temp.getName());
                tempPet.setRace(temp.getRace());
                tempPet.setSpecie(temp.getSpecie());
                tempPet.setUserId(Math.toIntExact(user.getId()));
                tempPet.setUserUsername(user.getUsername());
                pets.add(tempPet);
            });
        });

        return pets;
    }

}

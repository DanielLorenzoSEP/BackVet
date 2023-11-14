package com.veterinaria.controllers;

import com.veterinaria.controllers.request.DashboardPet;
import com.veterinaria.services.PetEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    PetEntityService petEntityService;

    @GetMapping("/pets")
    public DashboardPet getSpecies() {
        DashboardPet dashboardPet = new DashboardPet();
        int countCats = petEntityService.countBySpecies("Gato");
        int countDogs = petEntityService.countBySpecies("Perro");
        int countOthers = petEntityService.countBySpecies("Otra");
        dashboardPet.setCats(countCats);
        dashboardPet.setDogs(countDogs);
        dashboardPet.setOthers(countOthers);
        return dashboardPet;
    }
}

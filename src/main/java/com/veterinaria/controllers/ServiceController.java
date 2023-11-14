package com.veterinaria.controllers;

import com.veterinaria.controllers.request.ServicesCountDTO;
import com.veterinaria.entities.ServiceEntity;
import com.veterinaria.services.Impl.ServiceCounter;
import com.veterinaria.services.ServiceEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/service")
public class ServiceController {

    @Autowired
    ServiceEntityService serviceEntityService;

    @Autowired
    ServiceCounter serviceCounter;

    @GetMapping("/")
    public Iterable<ServiceEntity> findAll() {
        return serviceEntityService.findAll();
    }

    @GetMapping("/{id}")
    public ServiceEntity findById(@PathVariable Integer id) {
        return serviceEntityService.findById(id);
    }

    @PostMapping("/")
    public ServiceEntity save(@RequestBody ServiceEntity serviceEntity) {
        return serviceEntityService.save(serviceEntity);
    }

    @DeleteMapping("/{id}")
    public ServiceEntity deleteById(@PathVariable int id) {
        return serviceEntityService.deleteById(id);
    }

    @PutMapping("/")
    public ServiceEntity updateService(@RequestBody ServiceEntity serviceEntity) {
        return serviceEntityService.updateService(serviceEntity);
    }

    @GetMapping("/count")
    public List<ServicesCountDTO> countServices() {
        return serviceCounter.countServices();
    }
}

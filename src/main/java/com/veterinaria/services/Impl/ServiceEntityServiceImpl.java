package com.veterinaria.services.Impl;

import com.veterinaria.entities.ServiceEntity;
import com.veterinaria.repositories.ServiceRepository;
import com.veterinaria.services.ServiceEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServiceEntityServiceImpl implements ServiceEntityService {

    @Autowired
    ServiceRepository serviceRepository;

    public ServiceEntity save(ServiceEntity serviceEntity) {
        return serviceRepository.save(serviceEntity);
    }

    public ServiceEntity findById(Integer id) {
        return serviceRepository.findById(id).orElse(null);
    }

    public Iterable<ServiceEntity> findAll() {
        return serviceRepository.findAll();
    }

    public ServiceEntity deleteById(Integer id) {
        ServiceEntity serviceEntity = serviceRepository.findById(id).orElse(null);
        serviceRepository.deleteById(id);
        return serviceEntity;
    }

    public ServiceEntity updateService(ServiceEntity serviceEntity) {
        return serviceRepository.save(serviceEntity);
    }

}

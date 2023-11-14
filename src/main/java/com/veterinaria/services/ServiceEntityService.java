package com.veterinaria.services;

import com.veterinaria.entities.ServiceEntity;

public interface ServiceEntityService {

    ServiceEntity save(ServiceEntity serviceEntity);

    ServiceEntity findById(Integer id);

    Iterable<ServiceEntity> findAll();

    ServiceEntity deleteById(Integer id);

    ServiceEntity updateService(ServiceEntity serviceEntity);
}

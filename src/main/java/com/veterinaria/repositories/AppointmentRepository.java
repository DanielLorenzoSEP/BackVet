package com.veterinaria.repositories;

import com.veterinaria.entities.AppointmentEntity;
import com.veterinaria.entities.PetEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {

    List<AppointmentEntity> findAppointmentByUserId(Long id);

    AppointmentEntity findAppointmentByDoctorsId(Long id);

    List<AppointmentEntity> findAppointmentsByPetsIn(Collection<PetEntity> pets);

}

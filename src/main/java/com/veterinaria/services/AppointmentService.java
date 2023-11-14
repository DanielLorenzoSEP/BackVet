package com.veterinaria.services;

import com.veterinaria.controllers.request.AppointmentDTO;
import com.veterinaria.controllers.request.AppointmentWithUserDTO;
import com.veterinaria.controllers.request.UpdateAppointmentStatusDTO;
import com.veterinaria.entities.AppointmentEntity;

import java.util.List;

public interface AppointmentService {

    AppointmentEntity getAppointmentById(Long id);

    AppointmentEntity saveAppointment(AppointmentEntity appointment);

    AppointmentEntity deleteAppointment(Long id);

    List<AppointmentEntity> getAllAppointments();

    List<AppointmentEntity> findAppointmentByUserId(Long id);

    AppointmentEntity findAppointmentByDoctorsId(Long id);

    List<AppointmentWithUserDTO> getAllAppointmentsWithUsers();

    /*AppointmentEntity updateAppointment(AppointmentEntity appointment);*/

    UpdateAppointmentStatusDTO updateStatusAppointment(UpdateAppointmentStatusDTO updateAppointmentStatusDTO);

    AppointmentWithUserDTO getById(Long id);

    AppointmentEntity updateAppointment(AppointmentDTO appointmentDTO);
}

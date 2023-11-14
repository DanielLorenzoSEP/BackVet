package com.veterinaria.controllers;

import com.veterinaria.controllers.request.AppointmentDTO;
import com.veterinaria.controllers.request.AppointmentWithUserDTO;
import com.veterinaria.controllers.request.UpdateAppointmentStatusDTO;
import com.veterinaria.entities.AppointmentEntity;
import com.veterinaria.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    @Autowired
    AppointmentService appointmentService;

    @GetMapping("/")
    public List<AppointmentEntity> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public AppointmentEntity getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }

    @PostMapping("/")
    public AppointmentEntity saveAppointment(@RequestBody AppointmentEntity appointment) {
        return appointmentService.saveAppointment(appointment);
    }

    @DeleteMapping("/{id}")
    public AppointmentEntity deleteAppointmentById(@PathVariable int id) {
        return appointmentService.deleteAppointment((long) id);
    }

    @GetMapping("/user/{id}")
    public List<AppointmentEntity> findAppointmentByUserId(@PathVariable int id) {
        return appointmentService.findAppointmentByUserId((long) id);
    }

    @GetMapping("/doctor/{id}")
    public AppointmentEntity findAppointmentByDoctorId(@PathVariable int id) {
        return appointmentService.findAppointmentByDoctorsId((long) id);
    }

    @GetMapping("/all")
    public List<AppointmentWithUserDTO> getAllAppointmentsWithUsers() {
        return appointmentService.getAllAppointmentsWithUsers();
    }

    /*@PutMapping("/")
    public AppointmentEntity updateAppointment(@RequestBody AppointmentEntity appointment) {
        return appointmentService.updateAppointment(appointment);
    }*/

    @PutMapping("/status")
    public UpdateAppointmentStatusDTO updateAppointmentStatus(@RequestBody UpdateAppointmentStatusDTO updateAppointmentStatusDTO) {
        return appointmentService.updateStatusAppointment(updateAppointmentStatusDTO);
    }

    @GetMapping("/all/{id}")
    public AppointmentWithUserDTO getById(@PathVariable Long id) {
        return appointmentService.getById(id);
    }

    @PutMapping("/update")
    public AppointmentEntity updateAppointment(@RequestBody AppointmentDTO appointment) {
        return appointmentService.updateAppointment(appointment);
    }
}

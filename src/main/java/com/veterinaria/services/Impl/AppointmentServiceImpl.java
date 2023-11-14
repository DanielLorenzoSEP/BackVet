package com.veterinaria.services.Impl;

import com.veterinaria.controllers.request.AppointmentDTO;
import com.veterinaria.controllers.request.AppointmentWithUserDTO;
import com.veterinaria.controllers.request.UpdateAppointmentStatusDTO;
import com.veterinaria.entities.*;
import com.veterinaria.repositories.*;
import com.veterinaria.services.AppointmentService;
import com.veterinaria.services.UserEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    UserEntityService userEntityService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PetRepository petRepository;

    @Autowired
    DoctorRepository doctorRepository;

    @Autowired
    ServiceRepository serviceRepository;

    public List<AppointmentEntity> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public AppointmentEntity getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    public AppointmentWithUserDTO getById(Long id) {
        AppointmentEntity appointmentEntity = appointmentRepository.findById(id).orElse(null);
        AppointmentWithUserDTO appointmentWithUserDTO = new AppointmentWithUserDTO();
        assert appointmentEntity != null;
        appointmentWithUserDTO.setId(appointmentEntity.getId());
        appointmentWithUserDTO.setDate(appointmentEntity.getDate());
        appointmentWithUserDTO.setReason(appointmentEntity.getReason());
        appointmentWithUserDTO.setStatus(appointmentEntity.getStatus());
        appointmentWithUserDTO.setUserId(appointmentEntity.getUser().getId());
        appointmentWithUserDTO.setUser(appointmentEntity.getUser().getUsername());
        appointmentWithUserDTO.setPetId(appointmentEntity.getPets().stream().reduce((pet1, pet2) -> pet1).get().getId());
        appointmentWithUserDTO.setPet(appointmentEntity.getPets().stream().reduce((pet1, pet2) -> pet1).get().getName());
        appointmentWithUserDTO.setDoctorId(appointmentEntity.getDoctors().stream().reduce((doctor1, doctor2) -> doctor1).get().getId());
        appointmentWithUserDTO.setDoctor(appointmentEntity.getDoctors().stream().reduce((doctor1, doctor2) -> doctor1).get().getName());
        appointmentWithUserDTO.setServiceId(appointmentEntity.getServices().stream().reduce((service1, service2) -> service1).get().getId());
        appointmentWithUserDTO.setService(appointmentEntity.getServices().stream().reduce((service1, service2) -> service1).get().getName());
        return appointmentWithUserDTO;
    }

    public AppointmentEntity saveAppointment(AppointmentEntity appointment) {
        return appointmentRepository.save(appointment);
    }

    public AppointmentEntity deleteAppointment(Long id) {
        AppointmentEntity appointment = appointmentRepository.findById(id).orElse(null);
        appointmentRepository.deleteById(id);
        return appointment;
    }

    public List<AppointmentEntity> findAppointmentByUserId(Long id) {
        return appointmentRepository.findAppointmentByUserId(id);
    }

    public AppointmentEntity findAppointmentByDoctorsId(Long id) {
        return appointmentRepository.findAppointmentByDoctorsId(id);
    }

    public List<AppointmentWithUserDTO> getAllAppointmentsWithUsers() {
        List<AppointmentWithUserDTO> appointmentsDTO = new ArrayList<>();
        List<UserEntity> users = userEntityService.getAllUsers();

        for (UserEntity user : users) {
            List<AppointmentEntity> userAppointments = appointmentRepository.findAppointmentByUserId(user.getId());

            for (AppointmentEntity appointmentEntity : userAppointments) {
                AppointmentWithUserDTO appointmentWithUserDTO = new AppointmentWithUserDTO();
                appointmentWithUserDTO.setId(appointmentEntity.getId());
                appointmentWithUserDTO.setDate(appointmentEntity.getDate());
                appointmentWithUserDTO.setReason(appointmentEntity.getReason());
                appointmentWithUserDTO.setStatus(appointmentEntity.getStatus());
                appointmentWithUserDTO.setUserId(appointmentEntity.getUser().getId());
                appointmentWithUserDTO.setUser(appointmentEntity.getUser().getUsername());
                appointmentWithUserDTO.setPetId(appointmentEntity.getPets().stream().reduce((pet1, pet2) -> pet1).get().getId());
                appointmentWithUserDTO.setPet(appointmentEntity.getPets().stream().reduce((pet1, pet2) -> pet1).get().getName());
                appointmentWithUserDTO.setDoctorId(appointmentEntity.getDoctors().stream().reduce((doctor1, doctor2) -> doctor1).get().getId());
                appointmentWithUserDTO.setDoctor(appointmentEntity.getDoctors().stream().reduce((doctor1, doctor2) -> doctor1).get().getName());
                appointmentWithUserDTO.setServiceId(appointmentEntity.getServices().stream().reduce((service1, service2) -> service1).get().getId());
                appointmentWithUserDTO.setService(appointmentEntity.getServices().stream().reduce((service1, service2) -> service1).get().getName());
                appointmentsDTO.add(appointmentWithUserDTO);
            }
        }

        return appointmentsDTO;
    }

    public UpdateAppointmentStatusDTO updateStatusAppointment(UpdateAppointmentStatusDTO updateAppointmentStatusDTO) {
        AppointmentEntity appointmentEntity = appointmentRepository.findById(updateAppointmentStatusDTO.getId()).orElse(null);
        if (appointmentEntity != null) {
            appointmentEntity.setStatus(updateAppointmentStatusDTO.getStatus());
            appointmentRepository.save(appointmentEntity);
        }
        return updateAppointmentStatusDTO;
    }

    public AppointmentEntity updateAppointment(AppointmentDTO appointmentDTO) {
        System.out.println(appointmentDTO);
        AppointmentEntity appointment = appointmentRepository.findById(appointmentDTO.getId()).orElse(null);
        UserEntity user = userRepository.findById(appointmentDTO.getUserId()).orElse(null);
        List<PetEntity> pets = new ArrayList<>();
        PetEntity pet = petRepository.findById(appointmentDTO.getPetId()).orElse(null);
        pets.add(pet);
        List<DoctorEntity> doctors = new ArrayList<>();
        DoctorEntity doctor = doctorRepository.findById(appointmentDTO.getDoctorId()).orElse(null);
        doctors.add(doctor);
        List<ServiceEntity> services = new ArrayList<>();
        ServiceEntity service = serviceRepository.findById(Math.toIntExact(appointmentDTO.getServiceId())).orElse(null);
        services.add(service);

        if (appointment != null) {
            appointment.setDate(appointmentDTO.getDate());
            appointment.setReason(appointmentDTO.getReason());
            appointment.setStatus(appointmentDTO.getStatus());
            appointment.setUser(user);
            appointment.setPets(pets);
            appointment.setDoctors(doctors);
            appointment.setServices(services);
            appointmentRepository.save(appointment);
        }
        return appointment;
    }

}

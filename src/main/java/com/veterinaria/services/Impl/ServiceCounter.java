package com.veterinaria.services.Impl;

import com.veterinaria.controllers.request.ServicesCountDTO;
import com.veterinaria.entities.AppointmentEntity;
import com.veterinaria.entities.ServiceEntity;
import com.veterinaria.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ServiceCounter {

    @Autowired
    AppointmentService appointmentService;

    public List<ServicesCountDTO> countServices() {
        List<AppointmentEntity> appointments = appointmentService.getAllAppointments();

        Map<String, Integer> serviceCountMap = new HashMap<>();

        for (AppointmentEntity appointment : appointments) {
            List<ServiceEntity> services = appointment.getServices();
            for (ServiceEntity service : services) {
                String serviceName = service.getName();
                serviceCountMap.put(serviceName, serviceCountMap.getOrDefault(serviceName, 0) + 1);
            }
        }

        List<Map.Entry<String, Integer>> sortedServiceCounts = new ArrayList<>(serviceCountMap.entrySet());
        sortedServiceCounts.sort((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()));

        List<Map.Entry<String, Integer>> topFiveServices = sortedServiceCounts.subList(0, Math.min(5, sortedServiceCounts.size()));

        List<ServicesCountDTO> servicesCountDTOS = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : topFiveServices) {
            ServicesCountDTO servicesCountDTO = new ServicesCountDTO();
            String serviceName = entry.getKey();
            int count = entry.getValue();
            servicesCountDTO.setName(serviceName);
            servicesCountDTO.setValue(count);
            servicesCountDTOS.add(servicesCountDTO);
            System.out.println(serviceName + ": " + count);
        }
        return servicesCountDTOS;
    }
}


package com.veterinaria.controllers;

import com.veterinaria.controllers.request.MedicinesCountDTO;
import com.veterinaria.entities.DoctorEntity;
import com.veterinaria.entities.MedicineEntity;
import com.veterinaria.entities.PrescriptionEntity;
import com.veterinaria.entities.RelationPrescriptionMedicine;
import com.veterinaria.services.DoctorService;
import com.veterinaria.services.Impl.MedicineCounter;
import com.veterinaria.services.MedicineService;
import com.veterinaria.services.PrescriptionService;
import com.veterinaria.services.RelationPrescriptionMedicineService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medical")
public class MedicalController {

    @Autowired
    PrescriptionService prescriptionService;

    @Autowired
    DoctorService doctorService;

    @Autowired
    MedicineService medicineService;

    @Autowired
    RelationPrescriptionMedicineService relationPrescriptionMedicineService;

    @Autowired
    MedicineCounter medicineCounter;

    @GetMapping("/prescription")
    public List<PrescriptionEntity> getAllPrescription() {
        return prescriptionService.getAll();
    }

    @GetMapping("/prescription/all")
    public List<PrescriptionEntity> getAllPrescriptionWithRelations() {
        return prescriptionService.getAll();
    }

    @PostMapping("/prescription")
    public PrescriptionEntity createPrescription(@Valid @RequestBody PrescriptionEntity prescription) {
        return prescriptionService.save(prescription);
    }

    @GetMapping("/prescription/{id}")
    public PrescriptionEntity getPrescriptionById(@PathVariable int id) {
        return prescriptionService.getById(id);
    }

    @DeleteMapping("/prescription/{id}")
    public PrescriptionEntity deletePrescription(@PathVariable int id) {
        PrescriptionEntity prescription = prescriptionService.getById(id);
        prescriptionService.deleteById(id);
        prescription.getRelations().forEach(relation -> {
            relationPrescriptionMedicineService.deleteRelationPrescriptionMedicine(relation.getId());
        });
        return prescription;
    }

    @GetMapping("/doctor")
    public List<DoctorEntity> getAllDoctor() {
        return doctorService.getAll();
    }

    @GetMapping("/doctor/{id}")
    public DoctorEntity getDoctorById(@PathVariable int id) {
        return doctorService.getById((long) id);
    }

    @PostMapping("/doctor")
    public DoctorEntity createDoctor(@Valid @RequestBody DoctorEntity doctor) {
        return doctorService.save(doctor);
    }

    @DeleteMapping("/doctor/{id}")
    public DoctorEntity deleteDoctor(@PathVariable int id) {
        DoctorEntity doctor = doctorService.getById((long) id);
        doctorService.deleteById((long) id);
        return doctor;
    }

    @PutMapping("/doctor")
    public DoctorEntity updateDoctor(@Valid @RequestBody DoctorEntity doctor) {
        return doctorService.save(doctor);
    }


    @GetMapping("/medicine")
    public List<MedicineEntity> getAllMedicine() {
        return medicineService.listAll();
    }

    @PostMapping("/medicine")
    public MedicineEntity createMedicine(@Valid @RequestBody MedicineEntity medicine) {
        return medicineService.save(medicine);
    }

    @GetMapping("/medicine/{name}")
    public MedicineEntity getMedicineByName(@PathVariable String name) {
        return medicineService.getByName(name);
    }

    @GetMapping("/medicine/id/{id}")
    public MedicineEntity getMedicineById(@PathVariable int id) {
        return medicineService.findById(id);
    }

    @PutMapping("/medicine")
    public MedicineEntity updateMedicine(@Valid @RequestBody MedicineEntity medicine) {
        return medicineService.save(medicine);
    }

    @DeleteMapping("/medicine/delete/{id}")
    public MedicineEntity deleteMedicine(@PathVariable int id) {
        MedicineEntity medicine = medicineService.findById(id);
        medicineService.delete(id);
        return medicine;
    }

    @GetMapping("/relation")
    public List<RelationPrescriptionMedicine> getAllRelation() {
        return relationPrescriptionMedicineService.getAllRelationPrescriptionMedicine();
    }

    @PostMapping("/relation")
    public RelationPrescriptionMedicine createRelation(@Valid @RequestBody RelationPrescriptionMedicine relation) {
        return relationPrescriptionMedicineService.saveRelationPrescriptionMedicine(relation);
    }

    @GetMapping("/count")
    public List<MedicinesCountDTO> countMedicines() {
        return medicineCounter.countMedicines();
    }
}

package com.veterinaria.controllers.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppointmentDTO {

    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private Date date;
    private String reason;
    private String status;
    private Long userId;
    private Long petId;
    private Long doctorId;
    private Long serviceId;
}

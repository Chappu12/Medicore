package com.example.hospital.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class Address {
    private String line1;
    private String line2;

}

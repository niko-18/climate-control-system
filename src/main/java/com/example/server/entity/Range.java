package com.example.server.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "range")
public class Range {
    @Id
    private int frequency;
    private float temperatureMin;
    private float temperatureMax;
    private float humidityMin;
    private float humidityMax;
    private int light;
    private float wind;
}

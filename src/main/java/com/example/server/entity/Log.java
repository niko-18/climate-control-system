package com.example.server.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "log")
public class Log {
    @Id
    private long date;
    private float temperature;
    private float humidity;
    private int light;
    private float wind;
}

package com.klef.soa.docker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "learning_modules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningModule 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String moduleTitle;

    @Column(nullable = false)
    private String subjectArea;

    @Column(nullable = false)
    private Integer durationHours;

    @Column(nullable = false)
    private Boolean published;
}
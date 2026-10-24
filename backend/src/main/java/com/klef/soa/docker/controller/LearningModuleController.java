
package com.klef.soa.docker.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.LearningModuleRequest;
import com.klef.soa.docker.entity.LearningModule;
import com.klef.soa.docker.service.LearningModuleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/learning-modules")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LearningModuleController {

    private final LearningModuleService learningModuleService;

    @PostMapping
    public ResponseEntity<?> addLearningModule(
            @Valid @RequestBody LearningModuleRequest request) {

        LearningModule learningModule = LearningModule.builder()
                .moduleTitle(request.getModuleTitle())
                .subjectArea(request.getSubjectArea())
                .durationHours(request.getDurationHours())
                .published(request.getPublished())
                .build();

        LearningModule savedModule =
                learningModuleService.addLearningModule(learningModule);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedModule);
    }

    @GetMapping
    public ResponseEntity<List<LearningModule>> viewAllLearningModules() {
        return ResponseEntity.ok(
                learningModuleService.viewAllLearningModules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> viewLearningModuleById(
            @PathVariable Long id) {

        LearningModule learningModule =
                learningModuleService.viewLearningModuleById(id);

        if (learningModule == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Learning module not found with ID: " + id);
        }

        return ResponseEntity.ok(learningModule);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLearningModule(
            @PathVariable Long id,
            @Valid @RequestBody LearningModuleRequest request) {

        LearningModule learningModule = LearningModule.builder()
                .moduleTitle(request.getModuleTitle())
                .subjectArea(request.getSubjectArea())
                .durationHours(request.getDurationHours())
                .published(request.getPublished())
                .build();

        LearningModule updatedModule =
                learningModuleService.updateLearningModule(id, learningModule);

        if (updatedModule == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Learning module not found with ID: " + id);
        }

        return ResponseEntity.ok(updatedModule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLearningModule(
            @PathVariable Long id) {

        String result = learningModuleService.deleteLearningModule(id);

        if ("Learning module not found".equals(result)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }

        return ResponseEntity.ok(result);
    }
}

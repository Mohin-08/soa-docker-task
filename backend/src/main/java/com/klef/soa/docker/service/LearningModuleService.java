package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.entity.LearningModule;

public interface LearningModuleService
{
    public LearningModule addLearningModule(LearningModule learningModule);

    public List<LearningModule> viewAllLearningModules();

    public LearningModule viewLearningModuleById(Long id);

    public LearningModule updateLearningModule(Long id, LearningModule learningModule);

    public String deleteLearningModule(Long id);
}
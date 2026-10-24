package com.klef.soa.docker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.klef.soa.docker.entity.LearningModule;
import com.klef.soa.docker.repository.LearningModuleRepository;
import com.klef.soa.docker.service.LearningModuleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LearningModuleServiceImpl implements LearningModuleService
{
    private final LearningModuleRepository learningModuleRepository;

    @Override
    public LearningModule addLearningModule(LearningModule learningModule)
    {
        learningModule.setId(null);
        return learningModuleRepository.save(learningModule);
    }

    @Override
    public List<LearningModule> viewAllLearningModules()
    {
        return learningModuleRepository.findAll();
    }

    @Override
    public LearningModule viewLearningModuleById(Long id)
    {
        return learningModuleRepository.findById(id).orElse(null);
    }

    @Override
    public LearningModule updateLearningModule(Long id, LearningModule learningModule)
    {
        LearningModule existingModule = learningModuleRepository.findById(id).orElse(null);

        if (existingModule == null)
        {
            return null;
        }

        existingModule.setModuleTitle(learningModule.getModuleTitle());
        existingModule.setSubjectArea(learningModule.getSubjectArea());
        existingModule.setDurationHours(learningModule.getDurationHours());
        existingModule.setPublished(learningModule.getPublished());

        return learningModuleRepository.save(existingModule);
    }

    @Override
    public String deleteLearningModule(Long id)
    {
        LearningModule existingModule = learningModuleRepository.findById(id).orElse(null);

        if (existingModule == null)
        {
            return "Learning module not found";
        }

        learningModuleRepository.delete(existingModule);
        return "Learning module deleted successfully";
    }
}
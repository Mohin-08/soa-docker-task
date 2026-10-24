
package com.klef.soa.docker.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningModuleRequest {

    @NotBlank(message = "Module title is required")
    @Size(max = 20, message = "Module title must not exceed 20 characters")
    private String moduleTitle;

    @NotBlank(message = "Subject area is required")
    @Size(max = 25, message = "Subject area must not exceed 25 characters")
    private String subjectArea;

    @NotNull(message = "Duration in hours is required")
    @Min(value = 1, message = "Duration must be at least 1 hour")
    @Max(value = 50, message = "Duration must not exceed 50 hours")
    private Integer durationHours;

    @NotNull(message = "Published status is required")
    private Boolean published;
}

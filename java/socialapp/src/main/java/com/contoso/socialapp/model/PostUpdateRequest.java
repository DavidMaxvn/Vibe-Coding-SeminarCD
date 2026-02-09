package com.contoso.socialapp.model;

import jakarta.validation.constraints.NotBlank;

public record PostUpdateRequest(
        @NotBlank(message = "username is required") String username,
        @NotBlank(message = "content is required") String content
) {
}

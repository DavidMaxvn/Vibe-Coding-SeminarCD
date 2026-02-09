package com.contoso.socialapp.model;

import jakarta.validation.constraints.NotBlank;

public record LikeRequest(
        @NotBlank(message = "username is required") String username
) {
}

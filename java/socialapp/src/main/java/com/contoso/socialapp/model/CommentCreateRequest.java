package com.contoso.socialapp.model;

import jakarta.validation.constraints.NotBlank;

public record CommentCreateRequest(
        @NotBlank(message = "username is required") String username,
        @NotBlank(message = "content is required") String content
) {
}

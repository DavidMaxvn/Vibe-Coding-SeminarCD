package com.contoso.socialapp.model;

import jakarta.validation.constraints.NotBlank;

public record CommentUpdateRequest(
        @NotBlank(message = "username is required") String username,
        @NotBlank(message = "content is required") String content
) {
}

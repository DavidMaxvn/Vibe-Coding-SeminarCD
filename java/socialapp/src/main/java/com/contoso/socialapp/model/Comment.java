package com.contoso.socialapp.model;

public record Comment(
        String id,
        String postId,
        String username,
        String content,
        String createdAt,
        String updatedAt
) {
}

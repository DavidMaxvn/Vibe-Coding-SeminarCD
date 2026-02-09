package com.contoso.socialapp.model;

public record Post(
        String id,
        String username,
        String content,
        String createdAt,
        String updatedAt,
        int likeCount,
        int commentCount
) {
}

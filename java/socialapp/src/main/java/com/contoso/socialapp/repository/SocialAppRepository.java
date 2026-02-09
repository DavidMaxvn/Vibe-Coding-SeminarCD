package com.contoso.socialapp.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class SocialAppRepository {
    private final JdbcTemplate jdbcTemplate;

    public SocialAppRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<PostData> findAllPosts() {
        return jdbcTemplate.query(
                "SELECT id, username, content, createdAt, updatedAt FROM posts ORDER BY createdAt DESC",
                postRowMapper()
        );
    }

    public Optional<PostData> findPostById(String postId) {
        List<PostData> rows = jdbcTemplate.query(
                "SELECT id, username, content, createdAt, updatedAt FROM posts WHERE id=?",
                postRowMapper(),
                postId
        );
        return rows.stream().findFirst();
    }

    public void insertPost(String id, String username, String content, String createdAt, String updatedAt) {
        jdbcTemplate.update(
                "INSERT INTO posts (id, username, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
                id, username, content, createdAt, updatedAt
        );
    }

    public void updatePost(String postId, String username, String content, String updatedAt) {
        jdbcTemplate.update(
                "UPDATE posts SET username=?, content=?, updatedAt=? WHERE id=?",
                username, content, updatedAt, postId
        );
    }

    public void deletePost(String postId) {
        jdbcTemplate.update("DELETE FROM posts WHERE id=?", postId);
    }

    public List<CommentData> findCommentsByPostId(String postId) {
        return jdbcTemplate.query(
                "SELECT id, postId, username, content, createdAt, updatedAt FROM comments WHERE postId=? ORDER BY createdAt ASC",
                commentRowMapper(),
                postId
        );
    }

    public Optional<CommentData> findCommentById(String postId, String commentId) {
        List<CommentData> rows = jdbcTemplate.query(
                "SELECT id, postId, username, content, createdAt, updatedAt FROM comments WHERE id=? AND postId=?",
                commentRowMapper(),
                commentId, postId
        );
        return rows.stream().findFirst();
    }

    public void insertComment(String id, String postId, String username, String content, String createdAt, String updatedAt) {
        jdbcTemplate.update(
                "INSERT INTO comments (id, postId, username, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
                id, postId, username, content, createdAt, updatedAt
        );
    }

    public void updateComment(String postId, String commentId, String username, String content, String updatedAt) {
        jdbcTemplate.update(
                "UPDATE comments SET username=?, content=?, updatedAt=? WHERE id=? AND postId=?",
                username, content, updatedAt, commentId, postId
        );
    }

    public void deleteComment(String postId, String commentId) {
        jdbcTemplate.update("DELETE FROM comments WHERE id=? AND postId=?", commentId, postId);
    }

    public int countLikes(String postId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM likes WHERE postId=?",
                Integer.class,
                postId
        );
        return count == null ? 0 : count;
    }

    public int countComments(String postId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM comments WHERE postId=?",
                Integer.class,
                postId
        );
        return count == null ? 0 : count;
    }

    public boolean postExists(String postId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM posts WHERE id=?",
                Integer.class,
                postId
        );
        return count != null && count > 0;
    }

    public boolean commentExists(String postId, String commentId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM comments WHERE id=? AND postId=?",
                Integer.class,
                commentId, postId
        );
        return count != null && count > 0;
    }

    public boolean likeExists(String postId, String username) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM likes WHERE postId=? AND username=?",
                Integer.class,
                postId, username
        );
        return count != null && count > 0;
    }

    public void insertLike(String postId, String username) {
        jdbcTemplate.update(
                "INSERT INTO likes (postId, username) VALUES (?, ?)",
                postId, username
        );
    }

    public void deleteLike(String postId, String username) {
        jdbcTemplate.update(
                "DELETE FROM likes WHERE postId=? AND username=?",
                postId, username
        );
    }

    private RowMapper<PostData> postRowMapper() {
        return (rs, rowNum) -> new PostData(
                rs.getString("id"),
                rs.getString("username"),
                rs.getString("content"),
                rs.getString("createdAt"),
                rs.getString("updatedAt")
        );
    }

    private RowMapper<CommentData> commentRowMapper() {
        return (rs, rowNum) -> new CommentData(
                rs.getString("id"),
                rs.getString("postId"),
                rs.getString("username"),
                rs.getString("content"),
                rs.getString("createdAt"),
                rs.getString("updatedAt")
        );
    }

    public record PostData(String id, String username, String content, String createdAt, String updatedAt) {
    }

    public record CommentData(String id, String postId, String username, String content, String createdAt, String updatedAt) {
    }
}

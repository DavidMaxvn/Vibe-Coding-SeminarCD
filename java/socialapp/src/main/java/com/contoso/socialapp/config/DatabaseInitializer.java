package com.contoso.socialapp.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer {
    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initialize() {
        jdbcTemplate.execute("PRAGMA foreign_keys = ON");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS posts (" +
                "id TEXT PRIMARY KEY," +
                "username TEXT NOT NULL," +
                "content TEXT NOT NULL," +
                "createdAt TEXT NOT NULL," +
                "updatedAt TEXT NOT NULL" +
                ")");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS comments (" +
                "id TEXT PRIMARY KEY," +
                "postId TEXT NOT NULL," +
                "username TEXT NOT NULL," +
                "content TEXT NOT NULL," +
                "createdAt TEXT NOT NULL," +
                "updatedAt TEXT NOT NULL," +
                "FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE" +
                ")");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS likes (" +
                "postId TEXT NOT NULL," +
                "username TEXT NOT NULL," +
                "PRIMARY KEY (postId, username)," +
                "FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE" +
                ")");
    }
}

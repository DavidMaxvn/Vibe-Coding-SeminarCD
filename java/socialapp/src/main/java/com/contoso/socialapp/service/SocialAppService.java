package com.contoso.socialapp.service;

import com.contoso.socialapp.exception.BadRequestException;
import com.contoso.socialapp.exception.NotFoundException;
import com.contoso.socialapp.model.Comment;
import com.contoso.socialapp.model.CommentCreateRequest;
import com.contoso.socialapp.model.CommentUpdateRequest;
import com.contoso.socialapp.model.LikeRequest;
import com.contoso.socialapp.model.Post;
import com.contoso.socialapp.model.PostCreateRequest;
import com.contoso.socialapp.model.PostUpdateRequest;
import com.contoso.socialapp.repository.SocialAppRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class SocialAppService {
    private final SocialAppRepository repository;

    public SocialAppService(SocialAppRepository repository) {
        this.repository = repository;
    }

    public List<Post> listPosts() {
        return repository.findAllPosts().stream()
                .map(post -> new Post(
                        post.id(),
                        post.username(),
                        post.content(),
                        post.createdAt(),
                        post.updatedAt(),
                        repository.countLikes(post.id()),
                        repository.countComments(post.id())
                ))
                .toList();
    }

    public Post createPost(PostCreateRequest request) {
        String postId = UUID.randomUUID().toString();
        String now = Instant.now().toString();
        repository.insertPost(postId, request.username(), request.content(), now, now);
        return new Post(postId, request.username(), request.content(), now, now, 0, 0);
    }

    public Post getPost(String postId) {
        SocialAppRepository.PostData post = repository.findPostById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));
        return new Post(
                post.id(),
                post.username(),
                post.content(),
                post.createdAt(),
                post.updatedAt(),
                repository.countLikes(post.id()),
                repository.countComments(post.id())
        );
    }

    public Post updatePost(String postId, PostUpdateRequest request) {
        if (!repository.postExists(postId)) {
            throw new NotFoundException("Post not found");
        }
        String now = Instant.now().toString();
        repository.updatePost(postId, request.username(), request.content(), now);
        SocialAppRepository.PostData post = repository.findPostById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));
        return new Post(
                post.id(),
                post.username(),
                post.content(),
                post.createdAt(),
                post.updatedAt(),
                repository.countLikes(post.id()),
                repository.countComments(post.id())
        );
    }

    public void deletePost(String postId) {
        if (!repository.postExists(postId)) {
            throw new NotFoundException("Post not found");
        }
        repository.deletePost(postId);
    }

    public List<Comment> listComments(String postId) {
        return repository.findCommentsByPostId(postId).stream()
                .map(comment -> new Comment(
                        comment.id(),
                        comment.postId(),
                        comment.username(),
                        comment.content(),
                        comment.createdAt(),
                        comment.updatedAt()
                ))
                .toList();
    }

    public Comment createComment(String postId, CommentCreateRequest request) {
        if (!repository.postExists(postId)) {
            throw new NotFoundException("Post not found");
        }
        String commentId = UUID.randomUUID().toString();
        String now = Instant.now().toString();
        repository.insertComment(commentId, postId, request.username(), request.content(), now, now);
        return new Comment(commentId, postId, request.username(), request.content(), now, now);
    }

    public Comment getComment(String postId, String commentId) {
        SocialAppRepository.CommentData comment = repository.findCommentById(postId, commentId)
                .orElseThrow(() -> new NotFoundException("Comment not found"));
        return new Comment(
                comment.id(),
                comment.postId(),
                comment.username(),
                comment.content(),
                comment.createdAt(),
                comment.updatedAt()
        );
    }

    public Comment updateComment(String postId, String commentId, CommentUpdateRequest request) {
        if (!repository.commentExists(postId, commentId)) {
            throw new NotFoundException("Comment not found");
        }
        String now = Instant.now().toString();
        repository.updateComment(postId, commentId, request.username(), request.content(), now);
        SocialAppRepository.CommentData comment = repository.findCommentById(postId, commentId)
                .orElseThrow(() -> new NotFoundException("Comment not found"));
        return new Comment(
                comment.id(),
                comment.postId(),
                comment.username(),
                comment.content(),
                comment.createdAt(),
                comment.updatedAt()
        );
    }

    public void deleteComment(String postId, String commentId) {
        if (!repository.commentExists(postId, commentId)) {
            throw new NotFoundException("Comment not found");
        }
        repository.deleteComment(postId, commentId);
    }

    public void likePost(String postId, LikeRequest request) {
        if (!repository.postExists(postId)) {
            throw new NotFoundException("Post not found");
        }
        if (repository.likeExists(postId, request.username())) {
            throw new BadRequestException("Already liked");
        }
        repository.insertLike(postId, request.username());
    }

    public void unlikePost(String postId, LikeRequest request) {
        if (!repository.postExists(postId)) {
            throw new NotFoundException("Post not found");
        }
        repository.deleteLike(postId, request.username());
    }
}

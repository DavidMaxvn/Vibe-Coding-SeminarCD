package com.contoso.socialapp.api;

import com.contoso.socialapp.model.Comment;
import com.contoso.socialapp.model.CommentCreateRequest;
import com.contoso.socialapp.model.CommentUpdateRequest;
import com.contoso.socialapp.model.LikeRequest;
import com.contoso.socialapp.model.Post;
import com.contoso.socialapp.model.PostCreateRequest;
import com.contoso.socialapp.model.PostUpdateRequest;
import com.contoso.socialapp.service.SocialAppService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {
    private final SocialAppService service;

    public PostController(SocialAppService service) {
        this.service = service;
    }

    @GetMapping
    public List<Post> listPosts() {
        return service.listPosts();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Post createPost(@Valid @RequestBody PostCreateRequest request) {
        return service.createPost(request);
    }

    @GetMapping("/{postId}")
    public Post getPost(@PathVariable String postId) {
        return service.getPost(postId);
    }

    @PatchMapping("/{postId}")
    public Post updatePost(@PathVariable String postId, @Valid @RequestBody PostUpdateRequest request) {
        return service.updatePost(postId, request);
    }

    @DeleteMapping("/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable String postId) {
        service.deletePost(postId);
    }

    @GetMapping("/{postId}/comments")
    public List<Comment> listComments(@PathVariable String postId) {
        return service.listComments(postId);
    }

    @PostMapping("/{postId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public Comment createComment(@PathVariable String postId, @Valid @RequestBody CommentCreateRequest request) {
        return service.createComment(postId, request);
    }

    @GetMapping("/{postId}/comments/{commentId}")
    public Comment getComment(@PathVariable String postId, @PathVariable String commentId) {
        return service.getComment(postId, commentId);
    }

    @PatchMapping("/{postId}/comments/{commentId}")
    public Comment updateComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @Valid @RequestBody CommentUpdateRequest request
    ) {
        return service.updateComment(postId, commentId, request);
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable String postId, @PathVariable String commentId) {
        service.deleteComment(postId, commentId);
    }

    @PostMapping("/{postId}/likes")
    @ResponseStatus(HttpStatus.CREATED)
    public void likePost(@PathVariable String postId, @Valid @RequestBody LikeRequest request) {
        service.likePost(postId, request);
    }

    @DeleteMapping("/{postId}/likes")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unlikePost(@PathVariable String postId, @Valid @RequestBody LikeRequest request) {
        service.unlikePost(postId, request);
    }
}

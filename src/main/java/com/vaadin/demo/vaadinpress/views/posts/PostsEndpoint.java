package com.vaadin.demo.vaadinpress.views.posts;

import java.time.LocalDateTime;
import java.util.List;

import com.vaadin.demo.vaadinpress.db.PostRepo;
import com.vaadin.demo.vaadinpress.model.Comment;
import com.vaadin.demo.vaadinpress.model.Post;
import com.vaadin.flow.server.connect.Endpoint;
import com.vaadin.flow.server.connect.auth.AnonymousAllowed;

import lombok.RequiredArgsConstructor;

/**
 * The endpoint for the client-side view.
 */
@Endpoint
@AnonymousAllowed
@RequiredArgsConstructor
public class PostsEndpoint {
  final PostRepo repo;

  public List<Post> findAllPosts() {
    return repo.findAll();
  }

  public Post findPost(String id) {
    return repo.findById(id).orElseThrow();
  }

  public Post findPostBySlug(String slug) {
    return repo.findBySlug(slug).orElseThrow();
  }

  public Post savePost(Post post) {
    post.setPublished(LocalDateTime.now());
    return repo.save(post);
  }

  public void delete(Post post, String blogId) {
    repo.delete(post);
  }

  public Post addComment(Post post, Comment comment) {
    var dbPost = repo.findById(post.getId()).orElseThrow();
    comment.setPosted(LocalDateTime.now());
    dbPost.getComments().add(comment);
    return repo.save(dbPost);
  }
}

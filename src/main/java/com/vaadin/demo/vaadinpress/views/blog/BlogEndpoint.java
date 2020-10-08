package com.vaadin.demo.vaadinpress.views.blog;

import com.vaadin.demo.vaadinpress.db.BlogRepo;
import com.vaadin.demo.vaadinpress.model.Blog;
import com.vaadin.flow.server.connect.Endpoint;
import com.vaadin.flow.server.connect.auth.AnonymousAllowed;

import lombok.RequiredArgsConstructor;

@Endpoint
@AnonymousAllowed
@RequiredArgsConstructor
public class BlogEndpoint {
  final BlogRepo repo;

  public Blog getBlog() {
    return repo.findAll().stream().findAny().orElseThrow();
  }

  public Blog saveBlog(Blog blog) {
    return repo.save(blog);
  }
}

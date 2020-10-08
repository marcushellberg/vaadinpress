package com.vaadin.demo.vaadinpress.db;

import java.util.Optional;

import com.vaadin.demo.vaadinpress.model.Post;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepo extends MongoRepository<Post, String> {

  Optional<Post> findBySlug(String slug);

}

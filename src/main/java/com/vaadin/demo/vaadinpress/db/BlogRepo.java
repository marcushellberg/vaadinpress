package com.vaadin.demo.vaadinpress.db;

import com.vaadin.demo.vaadinpress.model.Blog;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BlogRepo extends MongoRepository<Blog, String> {

}

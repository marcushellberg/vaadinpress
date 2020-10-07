package com.vaadin.demo.vaadinpress.model;

import java.util.LinkedList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;

@Data
@Document
@RequiredArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Post {
  @EqualsAndHashCode.Include
  private String id;
  private String author;
  private String content;
  private List<Comment> comments = new LinkedList<>();
}

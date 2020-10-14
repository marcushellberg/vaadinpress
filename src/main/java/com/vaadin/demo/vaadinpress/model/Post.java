package com.vaadin.demo.vaadinpress.model;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

import javax.validation.constraints.NotBlank;

import org.springframework.data.mongodb.core.index.Indexed;
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

  @NotBlank
  private String author;
  @NotBlank
  private String title;
  @NotBlank
  @Indexed(unique = true)
  private String slug;
  @NotBlank
  private String content;
  private LocalDateTime published;

  private List<Comment> comments = new LinkedList<>();
}

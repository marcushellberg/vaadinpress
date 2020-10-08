package com.vaadin.demo.vaadinpress.model;

import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class Comment {
  @NotBlank
  private String author;
  @NotBlank
  private String comment;
  private LocalDateTime posted;
}

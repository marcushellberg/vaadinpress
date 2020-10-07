package com.vaadin.demo.vaadinpress.model;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Document
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Blog {
  @EqualsAndHashCode.Include
  private String id;
  private String name;
  private String tagline;
}

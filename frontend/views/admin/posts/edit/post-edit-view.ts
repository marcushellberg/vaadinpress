import { BeforeEnterObserver, Router, RouterLocation } from '@vaadin/router';
import {
  LitElement,
  html,
  css,
  customElement,
  internalProperty,
} from 'lit-element';

import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-text-area';
import '@vaadin/vaadin-button';
import { Binder, field } from '@vaadin/form';
import PostModel from '../../../../generated/com/vaadin/demo/vaadinpress/model/PostModel';
import { findPost, isSlugUnique, savePost } from '../../../../generated/PostsEndpoint';

import styles from './post-edit-view.css';

@customElement('post-edit-view')
export class PostEditView extends LitElement implements BeforeEnterObserver {
  @internalProperty()
  private message = '';
  private binder = new Binder(this, PostModel);

  constructor(){
    super();
    this.binder.for(this.binder.model.slug).addValidator({
      message: 'The slug has to be unique',
      validate: async(slug: string) => {
        return await isSlugUnique(slug, this.binder.value.id);
      }
    });
  }
  
  render() {
    const { model } = this.binder;
    return html`
      <h2>Edit post</h2>

      <div class="form">
        <vaadin-text-field
          label="Author"
          ...=${field(model.author)}
        ></vaadin-text-field>
        <vaadin-text-field
          label="Title"
          ...=${field(model.title)}
          @input=${this.titleToSlug}
        ></vaadin-text-field>
        <vaadin-text-field
          label="Slug"
          ...=${field(model.slug)}
        ></vaadin-text-field>
        <vaadin-text-area label="Content" ...=${field(model.content)}>
        </vaadin-text-area>
        <div class="buttons">
          <vaadin-button theme="primary" @click=${this.save}
            >Save</vaadin-button
          >
        </div>
      </div>
      <div class="message">${this.message}</div>
    `;
  }

  async onBeforeEnter(location: RouterLocation) {
    const postId = location.params.postId;
    if (postId && postId !== 'new') {
      this.binder.read(await findPost(postId.toString()));
    }
  }

  titleToSlug() {
    this.binder.value.slug = this.binder.value.title
      .toLowerCase()
      .replace(/[\W!?]/gi, '-')
      .replace(/^-+|-+$/g, '');
    
      this.requestUpdate();
  }

  async save() {
    try {
      const saved = await this.binder.submitTo(savePost);
      if (saved) {
        Router.go('admin/posts');
      } else {
        this.message = 'Failed to save';
      }
    } catch (e) {
      this.message = 'Failed to save';
      console.log(e);
    }
  }

  static styles = styles;
}

import '@vaadin/vaadin-grid/src/vaadin-grid-column';
import {
  LitElement,
  html,
  css,
  customElement,
  internalProperty,
} from 'lit-element';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-button';
import Post from '../../../generated/com/vaadin/demo/vaadinpress/model/Post';
import { findAllPosts } from '../../../generated/PostsEndpoint';
import { Router } from '@vaadin/router';
import { GridItemModel } from '@vaadin/vaadin-grid';
import { format } from 'date-fns';

@customElement('posts-view')
export class PostsView extends LitElement {
  @internalProperty()
  private posts: Post[] = [];

  render() {
    return html`
      <h2>Manage blog posts</h2>

      <div class="content">
        <vaadin-button
          theme="primary"
          class="create-post-button"
          @click=${this.createPost}
          >Create new post</vaadin-button
        >
        <vaadin-grid .items=${this.posts}>
          <vaadin-grid-column
            path="title"
            .renderer=${this.postLinkRenderer}
          ></vaadin-grid-column>
          <vaadin-grid-column path="author"></vaadin-grid-column>
          <vaadin-grid-column path="published"></vaadin-grid-column>
        </vaadin-grid>
      </div>
    `;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.posts = await findAllPosts();
  }

  postLinkRenderer(root: HTMLElement, _: any, rowData: GridItemModel) {
    const post = rowData.item as Post;
    root.innerHTML = `<a href="admin/posts/${post.id}">${post.title}</a>`;
  }

  postDateRenderer(root: HTMLElement, _: any, rowData: GridItemModel) {
    const post = rowData.item as Post;
    root.innerText = format(new Date(post.published), 'yyyy-MM-dd HH:mm');
  }

  createPost() {
    Router.go('admin/posts/new');
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--lumo-space-m) var(--lumo-space-l);
    }

    .content {
      display: grid;
      gap: var(--lumo-space-m);
      justify-items: end;
    }

    .create-post-button {
      min-width: calc(var(--lumo-button-size) * 4);
    }

    vaadin-grid {
      width: 100%;
    }
  `;
}

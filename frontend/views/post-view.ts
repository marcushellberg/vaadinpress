import {
  BeforeEnterObserver,
  PreventAndRedirectCommands,
  RouterLocation,
} from '@vaadin/router';
import {
  LitElement,
  html,
  css,
  customElement,
  internalProperty,
} from 'lit-element';
import { nothing } from 'lit-html';
import marked from 'marked';
import { getBlog } from '../generated/BlogEndpoint';
import Blog from '../generated/com/vaadin/demo/vaadinpress/model/Blog';
import Post from '../generated/com/vaadin/demo/vaadinpress/model/Post';
import { addComment, findPostBySlug } from '../generated/PostsEndpoint';
import sharedStyles from './shared-styles.css';

import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-text-area';
import '@vaadin/vaadin-button';
import CommentModel from '../generated/com/vaadin/demo/vaadinpress/model/CommentModel';
import { Binder, field } from '@vaadin/form';
import { formatRelative, parseISO } from 'date-fns/esm';

@customElement('post-view')
export class PostView extends LitElement implements BeforeEnterObserver {
  @internalProperty()
  private post!: Post;
  @internalProperty()
  private blog!: Blog;

  private binder = new Binder(this, CommentModel);

  render() {
    if (this.post) {
      const { model } = this.binder;
      return html`
        <header><a href="/" class="logo">${this.blog.name}</a></header>
        <div class="container">
          <h1>${this.post.title}</h1>

          <div class="text" .innerHTML=${marked(this.post.content)}></div>

          <a href="/">← Back to listing</a>

          <div class="comments">
            <h2>Comments</h2>

            ${this.post.comments.length ? nothing : 'No comments...yet'}
            ${this.post.comments.reverse().map(
              (comment) => html`
                <div class="comment">
                  <div class="author">
                    ${comment.author}
                    – ${formatRelative(parseISO(comment.posted), new Date())}
                  </div>
                  <div class="comment-text">${comment.comment}</div>
                </div>
              `
            )}

            <h3>Post a comment</h3>
            <div class="comment-form">
              <vaadin-text-field
                label="Name"
                ...=${field(model.author)}
              ></vaadin-text-field>
              <vaadin-text-area
                label="Comment"
                ...=${field(model.comment)}
              ></vaadin-text-area>
              <vaadin-button @click=${this.postComment}
                >Post comment</vaadin-button
              >
            </div>
          </div>
        </div>
      `;
    } else {
      return html`
        <div class="container">404. Post not found, please check the URL.</div>
      `;
    }
  }

  postComment() {
    try {
      this.binder.submitTo(async (comment) => {
        this.post = await addComment(this.post, comment);
        this.binder.clear();
      });
    } catch (e) {}
  }

  async connectedCallback() {
    super.connectedCallback();
    this.blog = await getBlog();
  }

  async onBeforeEnter(
    location: RouterLocation,
    commands: PreventAndRedirectCommands
  ) {
    const slug = location.params.slug;
    if (!slug) return commands.redirect('/');

    try {
      this.post = await findPostBySlug(slug.toString());
      document.title = this.post.title;
    } catch (e) {
      console.log(e);
    }
    return undefined;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }

      header {
        padding: var(--lumo-space-m) var(--lumo-space-l);
        box-shadow: var(--lumo-box-shadow-s);
        position: fixed;
        background: var(--lumo-base-color);
        top: 0;
        left: 0;
        right: 0;
      }

      header .logo,
      header .logo:hover,
      header .logo:visited,
      header .logo:active {
        text-transform: uppercase;
        color: var(--lumo-secondary-text-color);
        font-weight: 600;
        font-family: 'Montserrat', sans-serif;
      }

      .container {
        margin-top: calc(6 * var(--lumo-space-l));
      }

      .comments {
        padding: calc(2 * var(--lumo-space-xl)) 0;
      }

      .comment {
        display: grid;
        gap: var(--lumo-space-m);
        margin: var(--lumo-space-m) 0 var(--lumo-space-xl);
      }

      .comment .author {
        font-weight: 600;
        font-family: 'Montserrat', sans-serif;
      }

      .comment-form {
        display: grid;
        width: 400px;
      }

      .comment-form vaadin-text-area {
        height: 200px;
      }

      .comment-form vaadin-button {
        width: 200px;
        margin-top: var(--lumo-space-xl);
      }
    `,
  ];
}

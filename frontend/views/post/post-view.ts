import {
  BeforeEnterObserver,
  PreventAndRedirectCommands,
  RouterLocation,
} from '@vaadin/router';
import {
  LitElement,
  html,
  customElement,
  internalProperty,
} from 'lit-element';
import { nothing } from 'lit-html';
import marked from 'marked';
import { getBlog } from '../../generated/BlogEndpoint';
import Blog from '../../generated/com/vaadin/demo/vaadinpress/model/Blog';
import Post from '../../generated/com/vaadin/demo/vaadinpress/model/Post';
import { addComment, findPostBySlug } from '../../generated/PostsEndpoint';
import sharedStyles from '../shared-styles.css';
import styles from './post-view.css';

import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-text-area';
import '@vaadin/vaadin-button';
import CommentModel from '../../generated/com/vaadin/demo/vaadinpress/model/CommentModel';
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

          <a href="/">← Back to home page</a>

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
    styles,
  ];
}

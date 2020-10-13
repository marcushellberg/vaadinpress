import {
  LitElement,
  html,
  css,
  customElement,
  internalProperty,
} from 'lit-element';
import { getBlog } from '../../generated/BlogEndpoint';
import Blog from '../../generated/com/vaadin/demo/vaadinpress/model/Blog';
import Post from '../../generated/com/vaadin/demo/vaadinpress/model/Post';
import { findAllPosts } from '../../generated/PostsEndpoint';
import sharedStyles from '../shared-styles.css';
import styles from './list-view.css';
import marked from 'marked';
import { formatRelative } from 'date-fns';

@customElement('list-view')
export class ListView extends LitElement {
  @internalProperty()
  private blog!: Blog;
  @internalProperty()
  private posts: Post[] = [];
  render() {
    if (this.blog) {
      return html`
        <div id="banner">
          <div class="container">
            <h1>${this.blog.name}</h1>
            <p>${this.blog.tagline}</p>
          </div>
        </div>
        <div class="container">
          ${this.posts.map(
            (post) => html`
              <div class="post">
                <h2>${post.title}</h2>
                <div class="author">
                  By ${post.author},
                  ${formatRelative(new Date(post.published), new Date())}
                </div>
                <div class="exerpt" .innerHTML=${this.getExcerpt(post)}></div>

                <a href="/${post.slug}">Read post →</a>
              </div>
            `
          )}
        </div>

        <footer>&copy; ${this.blog.name}</footer>
      `;
    } else {
      return html`
        <div class="intro">
          <h1>Building forms is fun!</h1>
          <ol>
            <li>Create a model</li>
            <li>Define validations</li>
            <li>Create input fields and buttons</li>
            <li>Bind model to fields</li>
            <li>Validate as user is typing</li>
            <li>Validate before submit</li>
            <li>Send model to server</li>
            <li>Validate again</li>
          </ol>

          <a href="/admin">Let's begin...</a>
        </div>
      `;
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    try {
      this.blog = await getBlog();
      this.posts = await findAllPosts();
      document.title = this.blog.name;
    } catch (e) {
      console.log(e);
    }
  }

  getExcerpt(post: Post) {
    const exerpt = post.content.split('\n\n')[0] || post.content;
    return marked(exerpt);
  }

  static styles = [
    sharedStyles,
    styles
  ];
}

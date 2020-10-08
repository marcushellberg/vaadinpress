import {
  LitElement,
  html,
  css,
  customElement,
  internalProperty,
} from 'lit-element';
import { getBlog } from '../generated/BlogEndpoint';
import Blog from '../generated/com/vaadin/demo/vaadinpress/model/Blog';
import Post from '../generated/com/vaadin/demo/vaadinpress/model/Post';
import { findAllPosts } from '../generated/PostsEndpoint';
import sharedStyles from './shared-styles.css';
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
        <div class="container">
          <blockquote class="intro">
            <i>Building complex forms is fun</i><br />&ndash;Nobody, ever
          </blockquote>
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
    css`
      :host {
        display: block;
      }

      #banner {
        background-image: url('https://picsum.photos/1000/500');
        background-size: cover;
        padding: 120px 0px;
        color: white;
      }

      #banner h1 {
        font-size: 38px;
      }

      #banner p {
        font-style: italic;
        font-weight: lighter;
        font-size: 30px;
        opacity: 0.8;
      }

      #banner h1,
      #banner p {
        background: rgba(0, 0, 0, 0.8);
        padding: 12px;
        display: table;
      }

      .author {
        font-size: 0.8em;
        font-style: italic;
      }

      footer {
        padding: var(--lumo-space-l);
        text-align: center;
      }

      .intro {
        font-size: 4rem;
      }
    `,
  ];
}

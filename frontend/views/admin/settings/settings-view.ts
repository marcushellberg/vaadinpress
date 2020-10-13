import {
  LitElement,
  html,
  customElement,
  internalProperty,
} from 'lit-element';
import { getBlog, saveBlog } from '../../../generated/BlogEndpoint';

import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';

import styles from './settings-view.css';

import { Binder, field } from '@vaadin/form';
import BlogModel from '../../../generated/com/vaadin/demo/vaadinpress/model/BlogModel';

@customElement('settings-view')
export class SettingsView extends LitElement {
  @internalProperty()
  private binder = new Binder(this, BlogModel);
  @internalProperty()
  private message = '';

  render() {
    const { model } = this.binder;
    return html`
      <h2>Configure blog settings</h2>

      <div class="form">
        <vaadin-text-field
          label="Blog title"
          ...=${field(model.name)}
        ></vaadin-text-field>
        <vaadin-text-field
          label="Tagline"
          ...=${field(model.tagline)}
        ></vaadin-text-field>
        <vaadin-button class="save-button" theme="primary" @click=${this.save}
          >Save</vaadin-button
        >
      </div>

      <div class="message">${this.message}</div>
    `;
  }

  async save() {
    try {
      const saved = await this.binder.submitTo(saveBlog);
      if (saved) {
        this.binder.read(saved);
        this.message = 'Settings saved successfully.';
      }
    } catch (e) {
      this.message = 'Failed to save, try again';
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    try {
      const blog = await getBlog();
      this.binder.read(blog);
    } catch (e) {
      //initialize new
    }
  }

  static styles = styles;
}

// eagerly import theme styles so as we can override them
import '@vaadin/vaadin-lumo-styles/all-imports';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `
<custom-style>
  <style>
    html {
      --lumo-border-radius: 0;
    }
  </style>
</custom-style>

<dom-module id="text-field-style" theme-for="vaadin-text-field">
  <template>
    <style>[part="input-field"]{box-shadow:inset 0 0 0 1px var(--lumo-contrast-30pct);background-color:var(--lumo-base-color);}:host([invalid]) [part="input-field"]{box-shadow:inset 0 0 0 1px var(--lumo-error-color);}
    </style>
  </template>
</dom-module>

<dom-module id="text-area-style" theme-for="vaadin-text-area">
  <template>
    <style>[part="input-field"]{box-shadow:inset 0 0 0 1px var(--lumo-contrast-30pct);background-color:var(--lumo-base-color);}:host([invalid]) [part="input-field"]{box-shadow:inset 0 0 0 1px var(--lumo-error-color);}
    </style>
  </template>
</dom-module>


<dom-module id="app-layout" theme-for="vaadin-app-layout">
  <template>
    <style>
      :host(:not([dir='rtl']):not([overlay])) [part='drawer'] {
        border-right: none;
        box-shadow: var(--lumo-box-shadow-s);
        background-color: var(--lumo-base-color);
        z-index: 1;
      }
      :host([dir='rtl']:not([overlay])) [part='drawer'] {
        border-left: none;
        box-shadow: var(--lumo-box-shadow-s);
        background-color: var(--lumo-base-color);
        z-index: 1;
      }
      [part='navbar'] {
        box-shadow: var(--lumo-box-shadow-s);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);

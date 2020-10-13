import '@vaadin/vaadin-button/src/vaadin-button';
import { css, customElement, html, internalProperty, LitElement, property } from 'lit-element';
import '@vaadin/vaadin-app-layout/theme/lumo/vaadin-app-layout';
// @ts-ignore
import { AppLayoutElement } from '@vaadin/vaadin-app-layout/src/vaadin-app-layout';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle';
import '@vaadin/vaadin-tabs/theme/lumo/vaadin-tab';
import '@vaadin/vaadin-tabs/theme/lumo/vaadin-tabs';
import { CSSModule } from '@vaadin/flow-frontend/css-utils';
import { router } from '../../routes';
import styles from './admin-view.css';

interface MenuTab {
  route: string;
  name: string;
}

@customElement('admin-view')
export class AdminView extends LitElement {
  @internalProperty() 
  private location = router.location;

  @internalProperty() 
  private menuTabs: MenuTab[] = [
    { route: 'admin/settings', name: 'Settings' },
    { route: 'admin/posts', name: 'Posts' },
  ];

  @internalProperty() 
  private projectName = '';

  render() {
    return html`
      <vaadin-app-layout primary-section="drawer">
        <header slot="navbar" theme="dark">
          <vaadin-drawer-toggle></vaadin-drawer-toggle>
          <h1>${this.getSelectedTabName(this.menuTabs)}</h1>
          <img src="images/user.svg" alt="Avatar" />
        </header>

        <div slot="drawer">
          <div id="logo">
            <img src="images/logo.png" alt="${this.projectName} logo" />
            <span>${this.projectName}</span>
          </div>
          <hr />
          <vaadin-tabs
            orientation="vertical"
            theme="minimal"
            id="tabs"
            .selected="${this.getIndexOfSelectedTab()}"
          >
            ${this.menuTabs.map(
              (menuTab) => html`
                <vaadin-tab>
                  <a href="${router.urlForPath(menuTab.route)}" tabindex="-1"
                    >${menuTab.name}</a
                  >
                </vaadin-tab>
              `
            )}
          </vaadin-tabs>
        </div>
        <slot></slot>
      </vaadin-app-layout>
    `;
  }

  private _routerLocationChanged() {
    // @ts-ignore
    AppLayoutElement.dispatchCloseOverlayDrawerEvent();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      'vaadin-router-location-changed',
      this._routerLocationChanged
    );
    this.projectName = 'VaadinPress';
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      'vaadin-router-location-changed',
      this._routerLocationChanged
    );
  }

  private isCurrentLocation(route: string): boolean {
    return router.urlForPath(route) === this.location.getUrl();
  }

  private getIndexOfSelectedTab(): number {
    const index = this.menuTabs.findIndex((menuTab) =>
      this.isCurrentLocation(menuTab.route)
    );

    // Select first tab if there is no tab for home in the menu
    if (index === -1 && this.isCurrentLocation('')) {
      return 0;
    }

    return index;
  }

  private getSelectedTabName(menuTabs: MenuTab[]): string {
    const currentTab = menuTabs.find((menuTab) =>
      this.isCurrentLocation(menuTab.route)
    );
    let tabName = '';
    if (currentTab) {
      tabName = currentTab.name;
    } else {
      tabName = 'Settings';
    }
    return tabName;
  }

  static styles = [
    CSSModule('lumo-typography'),
    CSSModule('lumo-color'),
    CSSModule('app-layout'),
    styles,
  ];
}

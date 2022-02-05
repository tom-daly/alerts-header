import "@pnp/polyfill-ie11";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { override } from "@microsoft/decorators";
import { Log } from "@microsoft/sp-core-library";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from "@microsoft/sp-application-base";
import { Alerts } from "./components/Alerts/Alerts";
import * as strings from "AlertsHeaderApplicationCustomizerStrings";
import { sp } from "@pnp/sp";

export interface IAlertsHeaderApplicationCustomizerProperties {}

export default class AlertsHeaderApplicationCustomizer extends BaseApplicationCustomizer<IAlertsHeaderApplicationCustomizerProperties> {
  private topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    return super.onInit().then((_) => {
      sp.setup({
        spfxContext: this.context,
      });

      this.context.placeholderProvider.changedEvent.add(
        this,
        this.renderPlaceHolders
      );
    });
  }

  @override
  public onDispose(): Promise<void> {
    this.context.placeholderProvider.changedEvent.remove(
      this,
      this.renderPlaceHolders
    );
    return Promise.resolve();
  }

  private renderPlaceHolders(): void {
    if (!this.topPlaceholder) {
      this.topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top
      );
      this._renderControls(100);
    }
  }

  private _renderControls = (delay: number) => {
    try {
      // The event is getting called before the page navigation happens
      // Due to this, the onScroll event that we are adding (for BackToTop)
      // is getting reset when the partial page load is finished
      // There is an open issue regarding this - https://github.com/SharePoint/sp-dev-docs/issues/5321
      // So, I have added a 3 seconds delay for the child components to load.
      // This is a temporary fix untill the actual issue in SPFx is resolved.
      setTimeout(async () => {
        if (this.topPlaceholder) {

            // Render the local alerts below default header
          let alertsContainer = document.getElementById("spfx-alerts-container");
          if (!alertsContainer) {
            const headerDiv = document.getElementById("spSiteHeader");
            alertsContainer = document.createElement("div");
            alertsContainer.id = "spfx-alerts-container";
            headerDiv.appendChild(alertsContainer);
          }
          const alertElement: React.ReactElement<any> = React.createElement(
            Alerts,
            { siteId: this.context.pageContext.web.id.toString() }
          );
          ReactDOM.render(alertElement, alertsContainer);
        } else {
          this.renderPlaceHolders();
        }
      }, delay);
    } catch (ex) {
      console.dir(ex);
      console.warn(ex);
    }
  };
}

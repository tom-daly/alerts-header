import * as React from "react";
import styles from "./Alerts.module.scss";
import { IAlertProps, IAlertState } from "./index";
import { PnPClientStorage, dateAdd } from "@pnp/common";
import { IAlertItem } from "./IAlerts.types";
import { AlertItem } from "./AlertItem/AlertItem";
import { AlertsService } from "./AlertsService";

export class Alerts extends React.Component<IAlertProps, IAlertState> {
  private _storage: PnPClientStorage;
  private _storageKey: string;

  private cache_key: string;
  private readonly CACHE_DURATION = 15; //in minutes

  public constructor(props: IAlertProps) {
    super(props);
    if (this.props.showRemoteAlerts) {
      this._storageKey = "DEClosedAlerts";
      this.cache_key = "DEBUGlobalAlerts";
    } else {
      this._storageKey = `${this.props.siteId}ClosedAlerts`;
      this.cache_key = `${this.props.siteId}AllAlerts`;
    }

    this.state = {
      alerts: [],
    };

    this._storage = new PnPClientStorage();
  }

  public render(): React.ReactElement<IAlertProps> {
    return (
      <div className={styles.alerts}>
        <div className={styles.container}>
          {this.state.alerts.map((val, index) => {
            return (
              <AlertItem item={val} remove={this._removeAlert}></AlertItem>
            );
          })}
        </div>
      </div>
    );
  }

  public componentWillMount() {
    // sp.setup({
    //   sp: {
    //     headers: {
    //       Accept: "application/json;odata=verbose"
    //     },
    //     baseUrl: `${window.location.protocol}//${window.location.hostname}`
    //   },
    //   defaultCachingStore: "session",
    //   globalCacheDisable: false
    // });
  }

  public async componentDidMount() {
    var dateTimeNow: Date = new Date();
    let items = this._storage.local.get(this.cache_key);

    if (!items) {
      items = await AlertsService.getAlerts(
        this.props.showRemoteAlerts,
        this.props.remoteAlertsSource
      );
      //this._storage.local.put(this.cache_key, items, dateAdd(new Date(), "minute", this.CACHE_DURATION));
    }

    var alerts: Array<IAlertItem> = new Array<IAlertItem>();
    var closedAlerts = this._getClosedAlerts();
    items.map((val, index) => {
      if (!closedAlerts || closedAlerts.indexOf(val.Id) < 0) {
        alerts.push({
          Id: val["Id"],
          title: val["Title"],
          description: val["Description"],
          iconOverride: val["IconOverride"],
          type: val["AlertType"],
          link: val["Link"],
        });
      }
      return;
    });

    this.setState({
      alerts: alerts,
    });
  }

  private _removeAlert = (id: number) => {
    const items: any = [...this.state.alerts];
    var itemIndex = -1;
    this.state.alerts.some((val, index) => {
      if (val.Id == id) {
        itemIndex = index;
        return true;
      }
    });

    // Store the removed item id in session storage
    this._addClosedAlerts(id);

    items.splice(itemIndex, 1);
    this.setState({
      alerts: items,
    });
  };

  private _getClosedAlerts = (): Array<number> => {
    var obj: Array<number> = this._storage.session.get(this._storageKey);
    return obj;
  };

  private _addClosedAlerts = (id: number): void => {
    var closedAlerts = this._getClosedAlerts();
    if (closedAlerts) {
      const t = [...closedAlerts];
      if (t.indexOf(id) < 0) {
        closedAlerts.push(id);
      }
    } else {
      closedAlerts = new Array<number>();
      closedAlerts.push(id);
    }
    this._storage.session.put(this._storageKey, closedAlerts);
  };
}

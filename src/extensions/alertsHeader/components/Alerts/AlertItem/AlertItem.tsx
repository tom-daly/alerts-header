import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faInfoCircle,
  faBullhorn,
} from "@fortawesome/free-solid-svg-icons";
import { AlertType, IAlertItem } from "../index";
import { IStackItemStyles, IconButton, Stack } from "office-ui-fabric-react";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { css } from "@uifabric/utilities/lib/css";
import styles from "./AlertItem.module.scss";

export interface IAlertItemState {
  hidden: boolean;
  expanded: boolean;
}
export interface IAlertItemProps {
  item: IAlertItem;
  remove: (id: number) => void;
}

const stackItemStyles: IStackItemStyles = {
  root: {
    display: "flex",
    justifyContent: "inherit",
    overflow: "hidden",
  },
};

export class AlertItem extends React.Component<
  IAlertItemProps,
  IAlertItemState
> {
  private _nodeRef: any;

  public constructor(props: IAlertItemProps) {
    super(props);
    this.state = {
      hidden: false,
      expanded: false,
    };
  }
  public render(): React.ReactElement<IAlertItem> {
    let alertType: string;
    var iconName: any;

    if (this.props.item.type == AlertType.Actionable) {
      alertType = styles.actionable;
      iconName = faBullhorn;
    } else if (this.props.item.type == AlertType.Warning) {
      alertType = styles.warning;
      iconName = faExclamationTriangle;
    } else {
      alertType = styles.info;
      iconName = faInfoCircle;
    }

    let el = !this.state.hidden ? (
      <div className={styles.alertItem} ref={(node) => (this._nodeRef = node)}>
        <div className={css(styles.container, alertType)}>
          <Stack horizontal className={styles.stack}>
            <Stack.Item
              align="center"
              grow={1}
              styles={stackItemStyles}
              className={styles.stackIcon}
            >
              <span className={styles.alertIcon}>
                {/* <FontAwesomeIcon icon={solid("user-secret")} /> */}
              </span>
            </Stack.Item>
            <Stack.Item
              align="center"
              grow={15}
              styles={stackItemStyles}
              className={styles.stackMessage}
            >
              <span
                className={
                  this.state.expanded
                    ? styles.alertDescriptionExp
                    : styles.alertDescription
                }
              >
                {this.props.item.title} : {this.props.item.description}
                {this.state.expanded && this.props.item.link ? (
                  <span className={css(styles.alertLink, styles.hideInDesktop)}>
                    <a
                      href={this.props.item.link.Url}
                      title={this.props.item.link.Description}
                    >
                      {this.props.item.link.Description}
                    </a>
                  </span>
                ) : null}
              </span>
            </Stack.Item>
            <Stack.Item
              align="center"
              grow={1}
              styles={stackItemStyles}
              className={css(styles.stackIcon, styles.hideInMobile)}
            >
              <span className={styles.alertClose}>
                <IconButton
                  onClick={() =>
                    this.setState({ expanded: !this.state.expanded })
                  }
                >
                  {this.state.expanded ? (
                    <Icon iconName="ChevronUp"></Icon>
                  ) : (
                    <Icon iconName="ChevronDown"></Icon>
                  )}
                </IconButton>
              </span>
            </Stack.Item>
            <Stack.Item
              align="center"
              grow={1}
              styles={stackItemStyles}
              className={css(styles.stackIcon, styles.hideInDesktop)}
            >
              <span className={styles.alertClose}>
                {this.state.expanded ? (
                  <IconButton
                    onClick={() => {
                      this.props.remove(this.props.item.Id);
                    }}
                  >
                    <Icon iconName="ChromeClose"></Icon>
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() =>
                      this.setState({ expanded: !this.state.expanded })
                    }
                  >
                    <Icon iconName="ChevronDown"></Icon>
                  </IconButton>
                )}
              </span>
            </Stack.Item>

            {this.props.item.link && (
              <Stack.Item
                align="center"
                grow={4}
                styles={stackItemStyles}
                className={css(styles.stackLink, styles.hideInMobile)}
              >
                <span className={styles.alertLink}>
                  <a
                    href={this.props.item.link.Url}
                    title={this.props.item.link.Description}
                  >
                    {this.props.item.link.Description}
                  </a>
                </span>
              </Stack.Item>
            )}
            <Stack.Item
              align="center"
              grow={1}
              styles={stackItemStyles}
              className={css(styles.stackIcon, styles.hideInMobile)}
            >
              <span className={styles.alertClose}>
                <IconButton
                  onClick={() => {
                    this.props.remove(this.props.item.Id);
                  }}
                >
                  <Icon iconName="ChromeClose"></Icon>
                </IconButton>
              </span>
            </Stack.Item>
          </Stack>
        </div>
      </div>
    ) : null;
    return el;
  }

  public componentDidMount() {
    document.addEventListener("mousedown", this._onOutsideClick);
  }

  public componentWillUnmount() {
    document.removeEventListener("mousedown", this._onOutsideClick);
  }

  private _onOutsideClick = (event) => {
    if (this._nodeRef && !this._nodeRef.contains(event.target)) {
      this.setState({
        expanded: false,
      });
    }
  };
}

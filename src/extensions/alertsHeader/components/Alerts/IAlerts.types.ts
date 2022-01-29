export interface IAlertProps {
    showRemoteAlerts?:boolean;
    remoteAlertsSource?: string;
    siteId?:string;
}

export interface IAlertState {
    alerts: Array<IAlertItem>;
}

export interface IAlertItem {
    Id:number;
    title:string;
    description:string;
    type:string;
    link:IAlertLink;
}

export interface IAlertLink{
    Url:string;
    Description:string;
}

export enum AlertType{
    Info = "Info",
    Warning = "Warning",
    Actionable = "Actionable"
}

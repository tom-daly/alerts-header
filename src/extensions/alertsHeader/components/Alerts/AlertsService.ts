import { sp, Web } from '@pnp/sp';

export class AlertsService {
    public static readonly LIST_TITLE:string = "Alerts";
    public static readonly CONFIG_KEY:string = "AlertsSource";

    public static async getAlerts(isRemote:boolean, srcPath?:string):Promise<Array<any>> {

      var dateTimeNow: Date = new Date();

      if(isRemote){
        if(srcPath == null){
          return Promise.resolve([]);
        }

        const _web = new Web(`${window.location.protocol}//${window.location.hostname}/${srcPath}`);
        return _web.lists
        .getByTitle("Alerts")
        .items.select("ID", "Title", "AlertType", "IconOverride", "Description", "Link")
        .filter(
          `StartDateTime le datetime'${dateTimeNow.toISOString()}' and EndDateTime ge datetime'${dateTimeNow.toISOString()}'`
        )
        .orderBy("StartDateTime", false)
        .get();
      }
      else
      {
        return sp.web.lists
        .getByTitle("Alerts")
        .items.select("ID", "Title", "AlertType", "IconOverride", "Description", "Link", "EndDateTime")
        .filter(
          `StartDateTime le datetime'${dateTimeNow.toISOString()}' and EndDateTime ge datetime'${dateTimeNow.toISOString()}'`
        )
        .orderBy("StartDateTime", false)
        .get();
      }
    }
}

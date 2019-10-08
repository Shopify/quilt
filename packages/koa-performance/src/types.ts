// this should eventually be replace by official Typings for Network Information
export interface BrowserConnection {
  downlink: number;
  effectiveType: string;
  rtt: number;
  type: string;
  saveData: boolean;
}

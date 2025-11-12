
import config from "mc/config";
import Time from "time";
import Wifi from "wifi";
import Net from "net";
import Client from "websocket";

class NetAccess {
  constructor() {
    /**  */
    this.ws = null;
    this.address = '192.168.0.9';
  }

  setInfo(param) {
    this.address = param.address;
  }

  /**
   * 
   * @param {Object} param 
   * @param {string} param.ssid
   * @param {string} param.password
   */
  scan(param) {
    let monitor = new Wifi(param, msg => {
      switch (msg) {
      case Wifi.connected:
        trace(`${connected}`);
        break;
      case Wifi.gotIP:
        trace(`gotIP ${Net.get('IP')}`);
        this.ready();
        break;
      case Wifi.disconnected:
        break;
      }
    });
  }

  ready() {

    const ws = new Client({address: this.address,
      port: 5555});
    ws.callback = function(message, value) {
      switch (message) {
      case Client.connect:
        trace(`connect\n`);
        break;
      case Client.handshake:
        trace(`handshake\n`);
        break;
      case Client.receive:
        trace (`${value}\n`);
        break;
      case Client.disconnect:
        break;
      }
    };
    this.ws = ws;
  }

}

export {NetAccess}

/*
 * Copyright (c) 2022 Moddable Tech, Inc.
 *
 *   This file is part of the Moddable SDK.
 * 
 *   This work is licensed under the
 *       Creative Commons Attribution 4.0 International License.
 *   To view a copy of this license, visit
 *       <http://creativecommons.org/licenses/by/4.0>.
 *   or send a letter to Creative Commons, PO Box 1866,
 *   Mountain View, CA 94042, USA. 
 *
 * 
 * This code is a modified version of the above work.
 * hta39393
 * Button action, etc.
 */

import Modules from "modules";
import { NetAccess } from "./hidkeyboard";
import config from "mc/config";
import Net from "net";
import Timer from "timer";

const BLUE = "blue";
const WHITE = "white";

const BackgroundSkin = Skin.template({ fill: WHITE });
const OpenSans24 = Style.template({ font: "24px Open Sans", color: BLUE });

class FooBehavior extends Behavior {
  onCreate(application, data) {
    this.x_ = data.x_;
    this.y_ = data.y_;
  }
  onDraw(target) {
    // 
  }


};

const _misc = {
  temp: {},
};

class MediaBehavior extends Behavior {
  onCreate(application, data) {
    this.data = data;

    trace(`onCreate`);
    trace(`gotIP, ${Net.get('IP')}`);

    this.mode = 0;
    this.submode = 0;

    if (Modules.has("UI")) {
      globalThis.modExport = Modules.importNow("UI");
      this.UI = new modExport.container({modifiers: null})
      application.add(this.UI);
    } else {
      application.add(new NoModUI());
    }

    {
      const np = globalThis.lights;
      if (np) {
        //np.fill(np.makeRGB(32,32,32));
        //np.update();
      }
    }

    {
      const _this = this;
      const a = globalThis.button?.a;
      const b = globalThis.button?.b;
      const c = globalThis.button?.c;
      if (a) {
        a.onChanged = function() {
          const up = this.read();
          if (up === 0) {
            return;
          }
          _this.next();
          trace(`${_this.mode}\n`);
        };
      }
      if (b) {
        b.onChanged = function() {
          const up = this.read();
          switch (_this.mode) {
          case 0:
          case 2:
          case 4:
          case 6:
            if (up === 1) {
              _this.submodeNext();
            } else {

            }
            break;
          case 1:
          case 3:
          case 5:
            break;
          }
        };
      }
      if (c) {
        c.onChanged = function() {
          const up = this.read();
          trace(`c${up} ${_this.mode}`);
          switch (_this.mode) {
            case 0:
            case 2:
            case 4:
            case 6:
              break;
            case 1:
            case 3:
            case 5:
              break;
          }

        }
      }
    }

    
    Timer.set(() => {
      const netaccess = new NetAccess();
      netaccess.setInfo({
        address: `192.168.0.7`,
      });
      /*
      netaccess.scan({
        ssid: config.ssid,
        password: config.password,
      });
      */
      netaccess.ready();
    }, 1);
    
  }

  next() {
    this.mode = (this.mode + 1) % 7;
  }

  submodeNext() {
    this.submode = (this.submode + 1) % 7;
  }

}

const NoModUI = Container.template($ => ({
  Skin: BackgroundSkin, left: 0, right: 0, top: 0, bottom: 0,
  contents: [
    Text($, {
      left: 0, right: 0, Style: OpenSans24,
      // 画面表示
      string: "hacon1 installed.\nReady for mod." 
    })
  ]
}));

const MediaController = Application.template($ => ({
  Skin: BackgroundSkin,
  Behavior: MediaBehavior
}));

export default function () {
  return new MediaController({  }, {
    commandListLength: 2448,
    displayListLength: 3072, touchCount: 1 });
}

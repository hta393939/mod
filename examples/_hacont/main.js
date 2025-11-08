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
 */

import {default as KeyboardService} from "keyboardService";
import Modules from "modules";

const BLUE = "blue";
const WHITE = "white";

const BackgroundSkin = Skin.template({ fill: WHITE });
const OpenSans24 = Style.template({ font: "24px Open Sans", color: BLUE });

class MediaBehavior extends Behavior {
  onCreate(application, data) {
    this.data = data;

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

    this.ble = new KeyboardService({
      onKeyboardBound: () => {
        if (this.UI)
          this.UI.delegate("onKeyboardBound");
        const np = globalThis.lights;
        if (np) {
          np.setPixel(10, np.makeRGB(0,0,255));
          np.setPixel(6, np.makeRGB(255,255,255));
          np.update();
        }
      },
      onKeyboardUnbound: () => {
        if (this.UI)
          this.UI.delegate("onKeyboardUnbound");
        const np = globalThis.lights;
        np?.setPixel(9, np?.makeRGB(255,0,0));
        np?.update();
      }
    });

    {
      const _ble = this.ble;
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
              if (up === 1) {
                _ble.setAxis(2, 0.75);
                _ble.setAxis(3, 0.75);
                _ble.setButton(0, 0);
                _ble.setButton(_this.submode, 0);
                _ble.setHat(0);
              } else {
                _ble.setAxis(2, 0.5);
                _ble.setAxis(3, 0.5);
                _ble.setButton(0, 1);
                _ble.setButton(_this.submode, 1);
                _ble.setHat(1);
              }
              break;
            case 1:
            case 3:
            case 5:
              if (up === 1) {
                _ble.setAxis(0, 0.25);
                _ble.setAxis(5, 0);
                _ble.setButton(9, 0);
              } else {
                _ble.setAxis(0, 1);
                _ble.setAxis(5, 1);
                _ble.setButton(9, 1);
              }
              break;
          }

        }
      }
    }
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
      string: "hacon*#+=:; installed.\nReady for mod." 
    })
  ]
}));

const MediaController = Application.template($ => ({
  Skin: BackgroundSkin,
  Behavior: MediaBehavior
}));

export default function () {
  return new MediaController({  }, { commandListLength: 2448, displayListLength: 3072, touchCount: 1 });
}

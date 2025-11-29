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
 * This code is a modified version of the above work.
 * hta393939
 * HID, etc.
 */

import {default as KeyboardService, HID_MODIFIERS} from "keyboardService";
import Modules from "modules";

const BLUE = "blue";
const WHITE = "white";

const BackgroundSkin = Skin.template({ fill: WHITE });
const OpenSans24 = Style.template({ font: "24px Open Sans", color: BLUE });

class MediaBehavior extends Behavior {
  onCreate(application, data) {
    this.data = data;

    if (Modules.has("UI")) {
      globalThis.modExport = Modules.importNow("UI");
      this.UI = new modExport.container({modifiers: HID_MODIFIERS})
      application.add(this.UI);
    } else {
      application.add(new NoModUI());
    }

    this.ble = new KeyboardService({
      onKeyboardBound: () => {
        if (this.UI)
          this.UI.delegate("onKeyboardBound");
      },
      onKeyboardUnbound: () => {
        if (this.UI)
          this.UI.delegate("onKeyboardUnbound");
      }
    });

    {
      const _ble = this.ble;
      const a = globalThis.button?.a;
      const b = globalThis.button?.b;
      const c = globalThis.button?.c;
      if (a) {
        a.onChanged = function() {
          const up = this.read();
          if (up === 0) {
            return;
          }
          _ble.setPNAxis(1, -0.5);
          _ble.setAxis(6, 0.125);
          _ble.setAxis(7, 0.75);
          _ble.setAxis(8, 0.25);
          _ble.setButton(0, 1);
          _ble.setButton(1, 1);
          _ble.setHat(0, 2);
        };
      }
      if (b) {
        b.onChanged = function() {
          const up = this.read();
          if (up === 0) {
            return;
          }
          _ble.setPNAxis(0, -0.5);
          _ble.setButton(23, 1);
          _ble.setHat(1, 4);


        };
      }
      if (c) {
        c.onChanged = function() {
          const up = this.read();
          if (up === 0) {
            _ble.setButton(16, 1);
            _ble.setButton(24, 0);

            return;
          }
          trace(`c up`);
        }
      }
    }
  }
  
}

const NoModUI = Container.template($ => ({
  Skin: BackgroundSkin, left: 0, right: 0, top: 0, bottom: 0,
  contents: [
    Text($, {
      left: 0, right: 0, Style: OpenSans24,
      // 画面表示
      string: "BLE HID Host installed.\nReady for mod." 
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

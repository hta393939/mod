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
      this.UI = new modExport.container({hidKeys: KEYINFO, modifiers: HID_MODIFIERS})
      application.add(this.UI);

      trace(`UI 234`);
    } else {
      application.add(new NoModUI());

      trace(`no UI 235`);
    }

    // 0-6
    this.mode = 0;

    const _this = this;
    { // 実機でOK
      const a = globalThis.button?.a;
      const b = globalThis.button?.b;
      const c = globalThis.button?.c;
      if (a) {
        a.onChanged = function() {
          const up = this.read();

          trace(`a up ${up}`);
          if (up === 1) {
            _this.mode = (_this.mode + 1) % 7;
            _this.setNP(_this.npcols[_this.mode + 1]);
          }
        }
      } else {
        trace('button A no');
      }
      if (b) {
        b.onChanged = function() {
          const up = this.read();

          trace(`b up ${up}`);
        }
      }
      if (c) {
        this.ready();

        c.onChanged = function() {
          const up = this.read();

          trace(`c up ${up}`);
          if (up === 1) {
            _this.setNP(_this.npcols[1]);
          }
        }
      }

    }


  }
  doKeyDown(application, options){
    trace(`do key down ${123}`);
  }
  doKeyUp(application, options) {
    Console.line('do key up');
  }
  //doKeyTap(application, options) {
    // 
  //}

  setNP(col) {
    const np = globalThis.lights;
    if (!np) {
      return;
    }
    for (let i = 1; i <= 4; ++i) {
      np.setPixel(i, col);
    }
    np.update();
  }

  ready() {
    const np = globalThis.lights;
    if (np) {
      const col = np.makeRGB(64, 64, 64);
      np.fill(col);
      np.update();

      const cols = [
        [0,0,0], [0,0,255],[255,0,0],[255,0,255],
        [0,255,0],[0,255,255],[255,255,0],[255,255,255],
      ];
      this.npcols = cols.map(col => np.makeRGB(...col));
    }

    let firstA = true;
    let firstB = true;
    globalThis.accelerometer.onreading = (data) => {
      if (firstA) {
        firstA = false;
        trace(`acceler ${data.y}`);
      }
    };
    globalThis.gyro.onreading = (data) => {
      if (firstB) {
        firstB = false;
        trace(`gyro ${data.x}`);
      }
    };
    globalThis.accelerometer.start(30);
    globalThis.gyro.start(30);
  }

}

const NoModUI = Container.template($ => ({
  Skin: BackgroundSkin, left: 0, right: 0, top: 0, bottom: 0,
  contents: [
    Text($, {
      left: 0, right: 0, Style: OpenSans24,
      // 画面表示
      string: "installed.\nReady for mod." 
    })
  ]
}));

const MediaController = Application.template($ => ({
  Skin: BackgroundSkin,
  Behavior: MediaBehavior
}));


export default function () {

  // global とか globalThis そのものにアクセスできない感じ
  try {
    const buttonA = globalThis.button?.a;
    trace(`buttonA ${buttonA}\n`);
  } catch (ec) {
    trace(`catch`, ec.message);
  }

  return new MediaController({  }, { commandListLength: 2448, displayListLength: 3072, touchCount: 1 });
}

// modules/drivers/neopixel


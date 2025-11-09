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

// Application
// @see https://github.com/Moddable-OpenSource/moddable/blob/public/modules/piu/MC/piuMC.js#L148

// piu Application doc
// @see https://github.com/Moddable-OpenSource/moddable/blob/public/documentation/piu/piu.md#application-object

// Label は1行．
// Text は複数行．

import Modules from "modules";
import Time from "timer";

const BLUE = "blue";
const OpenSans24 = Style.template({ font: "24px Open Sans",
  color: BLUE });

const _misc = {
  _val: `${1}`,
};

const PortClass1 = Port.template($ => ({
  top: 0, bottom: 180, left: 240, right: 0,
  skin: new Skin({fill: 'gray'}),
  Behavior: class extends Behavior {
		onCreate(port, data) {
			this.data = data;
		}
		onDraw(port) {
			let x = 0, y = 0;
			{
				port.fillColor('black', x, y, 16, 16);
				x += 16;
				y += 16;
			}
      let text = `${this.data._val}`;
      
      //let size = _style1.measure(text);
      let size = _misc._style1.measure(text);
      const w = size.width;
      const h = size.height;
      port.drawStyle(text, _misc._style1, x, y, w, h, false, 1);
		}
	}
}));

const _fcontainer = ($) => {
  const ret = {
    Skin: BackgroundSkin, left: 0, right: 0, top: 0, bottom: 0,
    contents: [
      Text($, {left: 0, right: 0, Style: OpenSans24, string: `gui\ngui!`}),
      Text($, {left: 0, right: 160, Style: OpenSans24, string: `2`}),
      new PortClass1(_misc),
    ]
  };
  _misc.contents = ret.contents;
  return ret;
};


const WHITE = "white";

const BackgroundSkin = Skin.template({ fill: 'red' });

class MediaBehavior extends Behavior {
  onCreate(application, data) {
    this.data = data;

    const _style1 = new Style({ font: "24px Open Sans",
      color: [BLUE, 'yellow', 'green'] });
    _misc._style1 = _style1;

    application.add(new NoModUI());
    trace(`no UI 235\n`);

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
        c.onChanged = function() {
          const up = this.read();

          trace(`c up ${up}`);
          if (up === 1) {
            _this.setNP(_this.npcols[1]);

            trace (`c release, ${_misc.contents.length}`);
            const port1 = _misc.contents[2];
            if (port1) {
              _misc._val = `123`;
              port1.invalidate();
            }
          }
        }
      }

      let first = true;
      Time.repeat(timer => {
        if (first) {
          first = false;
          this.ready();
        }
      }, 1000);

    }


  }

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
    trace(`ready`);

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

    if (false) {
      let firstA = false;
      let firstB = false;
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

    //const scr = globalThis.screen;
    // 240, 320
    //trace('scr', scr, scr?.width, scr?.height, '\n');
  }

}

const NoModUI = Container.template($ => (_fcontainer($)));

const MediaController = Application.template($ => ({
  Skin: BackgroundSkin,
  Behavior: MediaBehavior
}));


export default function () {

  return new MediaController({  }, // data
    { commandListLength: 2448, displayListLength: 3072,
      //touchCount: 1
    }
  );
}

// modules/drivers/neopixel


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
 * hta39393
 * Centering class, etc.
 */

// Application
// @see https://github.com/Moddable-OpenSource/moddable/blob/public/modules/piu/MC/piuMC.js#L148

// piu Application doc
// @see https://github.com/Moddable-OpenSource/moddable/blob/public/documentation/piu/piu.md#application-object

// Label は1行．
// Text は複数行．

import Modules from "modules";
import Time from "timer";
import Timer from "timer";

const SCRW = 320;
const SCRH = 240;
const LINEH = 30;

/** 値を書き換えるのでフリーズできなくていいみたい */
const _misc = {
  mode: 7,
};

const cols = ['black', 'blue', '#ff0000',
        //'magenta',
        'purple',
        'green', 'cyan', 'yellow', '#ffffff'];
Object.freeze(cols);

const PortClass1 = Port.template($ => {
  const top = + ($.y || 0);
  const bottom = SCRH - (top + $.height);
  const left = + ($.x || 0);
  const right = SCRW - (left + $.width);
  return {
    top, bottom, left, right,
    skin: new Skin({fill: '#333333'}),
  Behavior: class extends Behavior {
		onCreate(target, data) {
		}
		onDraw(target) {
			let x = 0, y = 0;
			{
				//target.fillColor('black', x, y, SCRW, LINEH);
			}
      {
        x = SCRW / 4;
        target.fillColor('#666666', x, y, SCRW * 0.5, LINEH);
      }
      let text = target.string;

      let size = _misc._style1.measure(text);
      const w = size.width;
      const h = size.height;
      x = ($.width - w) / 2;
      //y = ($.height - h) / 2;
      //y = LINEH * 0.5;
      //target.drawString(text, _misc._style1, 'white', x, y, w, h);
      target.drawString(text, _misc._style1, cols[7], x, y, w, h);
      //target.drawStyle(text, _misc._style1, x, y, w, h, false, 7);

      //target.delegate('func', 1, 2, 3);
		}

	}

  };
});

const PortClass2 = Port.template($ => {
  const top = + ($.y || 0);
  const bottom = SCRH - (top + $.height);
  const left = + ($.x || 0);
  const right = SCRW - (left + $.width);
  const frontcol = $.frontcol ?? '#ffffff';
  const backcol = $.backcol ?? '#000000';
  const style = new Style({font: "24px Open Sans"});
  return {
    top, bottom, left, right,
    skin: new Skin({fill: backcol}),
    Behavior: class extends Behavior {
      onCreate(target, data) {
        target.string = data?.string || '';
      }
      onDraw(target) {
        let y = 0;
        let text = target.string;
        let size = style.measure(text);
        const w = size.width;
        const h = size.height;
        let x = ($.width - w) / 2;
        //y = ($.height - h) / 2;
        //y = LINEH * 0.5;
        target.drawString(text, style, frontcol, x, y, w, h);
      }
    }
  };
});

const _fcontainer = ($) => {
  trace(`_fcontainer, ${$?._foo}\n`);
  const ret = {
    Skin: BackgroundSkin,
    left: 0, right: 0, top: 0, bottom: 0,
    contents: [],
  };
  _misc.y = SCRH - LINEH;
  _misc.width = SCRW;
  _misc.height = LINEH;
  ret.contents.push(new PortClass1(_misc));

  ret.contents.push(new PortClass2({
    x: SCRW * 0.5,
    y: LINEH * 2,
    width: SCRW * 0.25,
    height: LINEH,
    frontcol: '#ccc',
    backcol: '#000033',
  }));
  _misc.contents = ret.contents;
  return ret;
};

const BackgroundSkin = Skin.template({ fill: '#000000' });

class MediaBehavior extends Behavior {
  onCreate(application, data) {
    this.data = data;

    const _style1 = new Style({ font: "24px Open Sans",
      color: cols });
    _misc._style1 = _style1;

    application.add(new NoModUI({_foo: 'bar'}));

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
            _misc.mode = + _this.mode;

            const port1 = _misc.contents[1];
            if (port1) {
              port1.string = `${_misc.mode * 100}`;
              port1.invalidate();
            }
          }
        }
      } else {
        trace('button A no');
      }
      if (b) {
        b.onChanged = function() {
          const up = this.read();

          trace(`b up ${up}`);

          if (up === 1) {
            const port1 = _misc.contents[1];
            port1.string = `456`;
            port1.invalidate();
          }
        }
      }
      if (c) {
        c.onChanged = function() {
          const up = this.read();

          trace(`c up ${up}`);
          if (up === 1) {
            _this.setNP(_this.npcols[1]);

            trace (`c release, ${_misc.contents.length}`);
            const port0 = _misc.contents[0];
            if (port0) {
              port0.string = `123`;
              port0.invalidate();
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

    Timer.set(() => {
      const port1 = _misc.contents[1];
      port1.string = `456`;
      port1.invalidate();
    }, 1000);
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


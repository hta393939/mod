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
 * hta393939
 * Button action, etc.
 */

import {default as KeyboardService} from "keyboardService";
import Modules from "modules";
import config from "mc/config";

const SCRW = 320;
const SCRH = 240;
const LINEH = 30;

const BackgroundSkin = Skin.template({ fill: 'black' });

const _misc = {
  temp: {},
  mode: 0,
};


const CenterPortClass = Port.template($ => {
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
          np.setPixel(6, np.makeRGB(0,255,0)); // 6は手前
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

    /*
    Timer.set(() => {
      const netaccess = new NetAccess();
      netaccess.setInfo({
        address: `192.168.0.9`,
      });
      netaccess.scan({
        ssid: config.ssid,
        password: config.password,
      });
    }, 1);
    */

  }

  next() {
    this.mode = (this.mode + 1) % 7;
    const port = _misc.contents[0];
    if (!port) {
      return;
    }
    port.string = `${this.mode * 100}`;
    port.invalidate();
  }

  submodeNext() {
    this.submode = (this.submode + 1) % 7;
    const port = _misc.contents[1];
    if (!port) {
      return;
    }
    port.string = `${this.submode}`;
    port.invalidate();
  }

}


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

  ret.contents.push(new CenterPortClass({
    x: SCRW * 0,
    y: LINEH * 7,
    width: SCRW * 0.25,
    height: LINEH,
    frontcol: '#ccc',
    backcol: '#0000ff',
  }));

  ret.contents.push(new CenterPortClass({
    x: SCRW * 6 / 16,
    y: LINEH * 7,
    width: SCRW / 4,
    height: LINEH,
    frontcol: '#ccc',
    backcol: '#ff0000',
  }));

  ret.contents.push(new CenterPortClass({
    x: SCRW * 12 / 16,
    y: LINEH * 7,
    width: SCRW * 0.25,
    height: LINEH,
    frontcol: '#000',
    backcol: '#0f0',
  }));

  _misc.contents = ret.contents;
  return ret;
};

const NoModUI = Container.template($ => _fcontainer($));

const MediaController = Application.template($ => ({
  Skin: BackgroundSkin,
  Behavior: MediaBehavior
}));

export default function () {
  return new MediaController({  }, {
    commandListLength: 2448,
    displayListLength: 3072, touchCount: 1 });
}

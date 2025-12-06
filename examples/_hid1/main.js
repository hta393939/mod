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

import {default as KeyboardService, HID_MODIFIERS, KEYINFO} from "keyboardService";
import Modules from "modules";

const SCRW = 320;
const SCRH = 240;
const LINEH = 30;

const _misc = {
  mode: 0,
  submode: 0,
};

const CenterPortClass = Port.template($ => {
  const top = + ($.y || 0);
  const bottom = SCRH - (top + $.height);
  const left = + ($.x || 0);
  const right = SCRW - (left + $.width);
  const frontcol = $.frontcol ?? '#ffffff';
  const backcol = $.backcol ?? '#000000';
  const style = new Style({font: "24px Open Sans"});
  const text = $.string || '';
  return {
    top, bottom, left, right,
    skin: new Skin({fill: backcol}),
    Behavior: class extends Behavior {
      onCreate(target, data) {
        target.string = data?.string || text;
      }
      onDraw(target) {
        let y = 0;
        let text = target.string;
        let size = style.measure(text);
        const w = size.width;
        const h = size.height;
        let x = ($.width - w) / 2;
        target.drawString(text, style, frontcol, x, y, w, h);
      }
    }
  };
});

class MediaBehavior extends Behavior {
  onCreate(application, data) {
    this.data = data;

    application.add(new NoModUI());

    this.ble = new KeyboardService({
      onKeyboardBound: () => {},
      onKeyboardUnbound: () => {}
    });

    const _m00up = (ble) => {
      ble.setPNAxis(0, 0);
      ble.setPNAxis(1, 0);
      ble.setPNAxis(2, 0);
      ble.setPNAxis(3, 0);
      ble.setPNAxis(4, 0);
      ble.setPNAxis(5, 0);
      ble.setAxis(6, 0);
      ble.setAxis(7, 0);
      ble.setAxis(8, 0);
      ble.setButton(0, 0);
      ble.setButton(1, 0);
      ble.setHat(0, 15);
    };
    const _m00down = (ble) => {
      ble.setPNAxis(0, -1);
      ble.setPNAxis(1, -0.5);
      ble.setPNAxis(2, -0.25);
      ble.setPNAxis(3, 0.25);
      ble.setPNAxis(4, 0.5);
      ble.setPNAxis(5, 1);
      ble.setAxis(6, 0.125);
      ble.setAxis(7, 0.25);
      ble.setAxis(8, 0.5);
      ble.setButton(0, 1);
      ble.setButton(1, 1);
      ble.setHat(0, 2);
    };

    const _m10up = (ble) => {
      ble.setPNAxis(0, 0);
      ble.setPNAxis(1, 0);
      ble.setPNAxis(2, 0);
      ble.setAxis(8, 0);
      ble.setButton(2, 0);
      ble.setButton(3, 0);
      ble.setHat(1, 15);
    };
    const _m10down = (ble) => {
      ble.setPNAxis(0, 1);
      ble.setPNAxis(1, 0.75);
      ble.setPNAxis(2, -0.5);
      ble.setAxis(8, 0.25);
      ble.setButton(2, 1);
      ble.setButton(3, 1);
      ble.setHat(1, 2);
    };

    const _code = (srv, hidCode, up) => {
      const opt = {
        hidCode,
      };
      if (up) {
        srv.onKeyUp(opt);
      } else {
        srv.onKeyDown(opt);
      }
    };

    const _char = (srv, character, up) => {
      const opt = {
        character,
      };
      if (up) {
        srv.onKeyUp(opt);
      } else {
        srv.onKeyDown(opt);
      }
    };

    {
      const _ble = this.ble;
      const a = globalThis.button?.a;
      const b = globalThis.button?.b;
      const c = globalThis.button?.c;
      if (a) {
        a.onChanged = function() {
          const up = this.read();
          if (up === 1) {
            return;
          }
          _misc.mode = (_misc.mode + 1) % 7;
          const port = _misc.contents[0];
          if (!port) {
            return;
          }
          port.string = `${_misc.mode}`;
          port.invalidate();
        };
      }
      if (b) {
        b.onChanged = function() {
          const up = this.read();
          if (up === 1) {
            return;
          }
          _misc.submode = (_misc.submode + 1) % 7;
          const port = _misc.contents[1];
          if (!port) {
            return;
          }
          port.string = `${_misc.submode}`;
          port.invalidate();
        };
      }
      if (c) {
        c.onChanged = function() {
          const up = this.read();
          switch (_misc.mode) {
          case 0:
          case 3:
          case 6:
            if (up === 1) {
              _m00up(_ble);
            } else {
              _m00down(_ble);
            }
            break;
          case 1:
          case 4:
            if (up === 1) {
              _m10up(_ble);
            } else {
              _m10down(_ble);
            }
            break;
          case 2:
            switch (_misc.submode) {
            case 0:
              if (up === 1) {
                _char(_ble, '\u000d', true);
              } else {
                _char(_ble, '\u000d', false);
              }
              break;
            case 1:
              if (up === 1) {
                _char(_ble, 'a', true);
              } else {
                _char(_ble, 'a', false);
              }
              break;
            case 2:
              if (up === 1) {
                _code(_ble, KEYINFO.VALUME_DOWN.HID, true);
              } else {
                _code(_ble, KEYINFO.VOLUME_DOWN.HID, false);
              }
              break;
            case 3:
              if (up === 1) {
                _code(_ble, KEYINFO.VALUME_UP.HID, true);
              } else {
                _code(_ble, KEYINFO.VOLUME_UP.HID, false);
              }
              break;
            }
          }

        }
      }

    }
  }
  
}

const _fcontainer = ($) => {
  trace(`_fcontainer\n`);
  const ret = {
    //Skin: Skin.template({ fill: 'black' }),
    left: 0, right: 0, top: 0, bottom: 0,
    contents: [],
  };
  _misc.y = SCRH - LINEH;
  _misc.width = SCRW;
  _misc.height = LINEH;

  ret.contents.push(new CenterPortClass({
    x: SCRW * 0,
    y: LINEH * 6,
    width: SCRW * 0.25,
    height: LINEH,
    frontcol: '#ccc',
    backcol: '#0000ff',
  }));

  ret.contents.push(new CenterPortClass({
    x: SCRW * 6 / 16,
    y: LINEH * 6,
    width: SCRW / 4,
    height: LINEH,
    frontcol: '#ffffff',
    backcol: '#ff0000',
  }));

  ret.contents.push(new CenterPortClass({
    x: SCRW * 12 / 16,
    y: LINEH * 6,
    width: SCRW * 0.25,
    height: LINEH,
    frontcol: '#000',
    backcol: '#0f0',
  }));

  ret.contents.push(new CenterPortClass({
    x: SCRW * 0.5,
    y: LINEH * 1,
    width: SCRW * 0.5,
    height: LINEH,
    frontcol: '#ffffff',
    backcol: '#000000',
    string: 'hid1',
  }));

  _misc.contents = ret.contents;
  return ret;
};

const NoModUI = Container.template($ => _fcontainer($));

const MediaController = Application.template($ => ({
  Skin: Skin.template({ fill: 'black' }),
  Behavior: MediaBehavior
}));

export default function () {
  return new MediaController({  }, { commandListLength: 2448, displayListLength: 3072, touchCount: 1 });
}

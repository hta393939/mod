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

class HIDMedia {
  static XY_MAX = 65535;
  static Z_MAX = 1023;

  constructor() {
    /** 17バイト */
    this.report = new Uint8Array(17);

    // X,X,Y,Y,Rx,Rx,Ry,Ry,Z,Z,Rz,Rz: 12バイト
    // b,b,h: 3バイト
    // system ctrl system main menu: 1バイト
    // battery strength: 1バイト
    this.report[16] = 0x02;
    // 計17バイト

    // output
    // 1バイト
    // 4バイト
    // 1,1,1バイト
    // 計8バイト
  }

  /**
   * 
   * @param {number} index 0 - 5
   * @param {number} inval 0.0 - 1.0
   * @returns 
   */
  setAxis(index, inval) {
    if (index < 0 || index > 5) {
      return;
    }
    let max = (index >= 4) ? HIDMedia.Z_MAX : HIDMedia.XY_MAX;
    let val16 = Math.floor(inval * max);
    val16 = Math.max(0, Math.min(max, val16));
    this.report[index * 2] = val16 & 0xff;
    this.report[index * 2 + 1] = (val16 >> 8) & 0xff; 
  }

  /**
   * 45度ずつ
   * @param {number} val 1-8
   */
  setHat(val) {
    let val8 = this.report[14];
    val8 = (val8 & 0xf0) | val;
    this.report[14] = val;
  }

  /**
   * 
   * @param {number} index 0 から 9 
   * @param {number} down 0 - 1
   */
  setButton(index, down) {
    if (index < 0 || index > 9) {
      return;
    }
    const mod = index & 7;
    const index8 = (index >> 3);
    const shift = mod;
    let val = this.report[12 + index8];
    val = val & (0xff ^ (1 << shift));
    this.report[12 + index8] = val | (down << shift);
  }

}

export {HIDMedia};

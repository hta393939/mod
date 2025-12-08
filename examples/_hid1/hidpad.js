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
 * Pad report class, etc.
 */

class HIDPad {
  /** 15bit */
  static SLIDER_MAX = 32767;
  /** 振幅1.0相当 */
  static PN_MAX = 32767;

  static LEVEL_OFFSET = 3;
  static AXIS_OFFSET = HIDPad.LEVEL_OFFSET + 0;
  static HAT_OFFSET = HIDPad.AXIS_OFFSET + 18;

  /* levelボタンチャレンジ
  static LEVEL_OFFSET = 3;
  static AXIS_OFFSET = HIDPad.LEVEL_OFFSET + 4;
  static HAT_OFFSET = HIDPad.AXIS_OFFSET + 18;
  */

  constructor() {
    /** 22バイト */
    this.report = new Uint8Array(HIDPad.HAT_OFFSET + 1);

    this.setHat(0, 15);
    this.setHat(1, 15);
  }

  /**
   * 
   * @param {number} index 0 - 8 の9軸
   * @param {number} inval -1.0 - +1.0 
   */
  setPNAxis(index, inval) {
    if (index < 0 || index > 8) {
      return;
    }

    let val16 = Math.max(-HIDPad.PN_MAX,
      Math.min(+HIDPad.PN_MAX,
        inval * HIDPad.PN_MAX));
    const buf = new Int16Array(1);
    buf[0] = val16;
    const p = new DataView(buf.buffer);
    this.report[HIDPad.AXIS_OFFSET + index * 2] = p.getUint8(0);
    this.report[HIDPad.AXIS_OFFSET + index * 2 + 1] = p.getUint8(1);
  }

  /**
   * ダイヤルとスライダーだけ見えるがホイールは見えてない
   * @param {number} index 6 - 8
   * @param {number} inval 0.0 - 1.0
   * @returns 
   */
  setAxis(index, inval) {
    if (index < 6 || index > 8) {
      return;
    }
    let val16 = Math.floor(inval * HIDPad.SLIDER_MAX);
    val16 = Math.max(0, Math.min(HIDPad.SLIDER_MAX, val16));
    this.report[3 + index * 2] = val16 & 0xff;
    this.report[3 + index * 2 + 1] = (val16 >> 8) & 0xff; 
  }

  /**
   * 
   * @param {number} index 0-1
   * @param {number} val 0-15
   */
  setHat(index, val) {
    if (index < 0 || index > 1) {
      return;
    }
    let val8 = this.report[21];
    if (index === 1) {
      val8 = (val8 & 0xf0) | val; // 下位
    } else {
      val8 = (val8 & 0x0f) | (val << 4); // 上位
    }
    this.report[HIDPad.HAT_OFFSET] = val8;
  }

  /**
   * 
   * @param {number} index 0 から 23 
   * @param {number} down 0 - 1
   */
  setButton(index, down) {
    if (index < 0 || index >= 24) {
      return;
    }
    const mod = index & 7;
    const index8 = (index >> 3);
    const shift = mod;
    let val = this.report[index8];
    val = val & (0xff ^ (1 << shift));
    this.report[index8] = val | (down << shift);
  }

  /**
   * 
   * @param {number} index 0 or 1
   * @param {number} val 0.0-1.0 
   */
  setLevelButton(index, inval) {
    if (index < 0 || index > 1) {
      return;
    }
    let val16 = Math.max(0,
      Math.min(HIDPad.PN_MAX, inval * HIDPad.PN_MAX)
    );
    const buf = new Int16Array(1);
    buf[0] = val16;
    const p = new DataView(buf.buffer);
    this.report[HIDPad.LEVEL_OFFSET + index * 2] = p.getUint8(0);
    this.report[HIDPad.LEVEL_OFFSET + index * 2 + 1] = p.getUint8(1);
  }

}

export {HIDPad};

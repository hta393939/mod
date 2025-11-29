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
 * pad, media, keyboard, etc.
 */

import BLEServer from "bleserver";
import { uuid } from "btutils";
import {HIDKeyboard, HID_MODIFIERS} from "hidkeyboard";
import {HIDMedia, KEYINFO} from "hidmedia";
import {HIDPad} from 'hidpad';

class KeyboardService extends BLEServer {
  constructor(options) {
    super(options);

    this.keyboard = new HIDKeyboard();
    this.media = new HIDMedia();
    this.pad = new HIDPad();
    this.bound = false;

    this.boundCallback = options.onKeyboardBound;
    this.unboundCallback = options.onKeyboardUnbound;
  }
  onReady() {
    this.deviceName = "Mhid2";
    this.securityParameters = { encryption: true, bonding: true };

    this.keyboardReportCharacteristic = null;
    this.mediaReportCharacteristic = null;
    this.padReportCharacteristic = null;
    this.onDisconnected();
  }
  onConnected() {
    this.stopAdvertising();
  }
  onDisconnected() {
    this.unboundCallback?.();
    this.mediaReportCharacteristic = null;
    this.keyboardReportCharacteristic = null;
    this.padReportCharacteristic = null;
    this.startAdvertising({
      advertisingData: { flags: 6, completeName: this.deviceName,
        incompleteUUID16List:[uuid`1812`, uuid`180f`],
        appearance: 964 } // 961 HID Keyboard, 964 HID Gamepad
    });
  }
  onCharacteristicNotifyEnabled(characteristic) {
    if ("pad_input_report" == characteristic.name) {
      this.padReportCharacteristic = characteristic;
      trace(`pad report bound by request\n`);
      if (!this.bound) {
        this.bound = true;
        this.boundCallback?.();
      }
    } else if ("keyboard_input_report" == characteristic.name) {
      this.keyboardReportCharacteristic = characteristic;
      trace(`keyboard report bound by request\n`);
      if (!this.bound) {
        this.bound = true;
        this.boundCallback?.();
      }
    } else if ('media_input_report' == characteristic.name) {
      this.mediaReportCharacteristic = characteristic;
      trace(`media report bound by request\n`);
      if (!this.bound) {
        this.bound = true;
        this.boundCallback?.();
      }
    } else if ("battery" == characteristic.name) {
      this.batteryCharacteristic = characteristic;
      this.notifyValue(this.batteryCharacteristic, 39);
    } else {
      trace(`request to bind characteristic: ${JSON.stringify(characteristic)}\n`);
    }
  }
  /** キャラクタ読み取り要求があったときの動作 */
  onCharacteristicRead(characteristic) {
    switch (characteristic.name) {
      case "pad_input_report":
        return this.pad.report;
      case "keyboard_input_report":
        return this.keyboard.report;
      case 'media_input_report':
        return this.media.report;
      case "control_point":
        return [0,0];
      default:
        trace(`unhandled read of characteristic: ${characteristic.name}\n`);
        break;
    }
  }
  notifyKeyboard() {
    if (this.keyboardReportCharacteristic)
      this.notifyValue(this.keyboardReportCharacteristic, this.keyboard.report);
    else
      trace(`not connected ${this.keyboard.report}`);
  }
  /** API */
  notifyMedia() {
    if (this.mediaReportCharacteristic)
      this.notifyValue(this.mediaReportCharacteristic, this.media.report);
    else
      trace(`not connected: ${this.media.report}\n`);
  }
  notifyPad() {
    if (this.padReportCharacteristic)
      this.notifyValue(this.padReportCharacteristic, this.pad.report);
    else
      trace(`not connected: ${this.pad.report}\n`);
  }


  onKeyUp(options) {    
    if (this.keyboard.canHandle(options)) {
      this.keyboard.onKeyUp(options);
      this.notifyKeyboard();
    }
  }
  onKeyDown(options) { 
    if (this.keyboard.canHandle(options)) {
      this.keyboard.onKeyDown(options);
      this.notifyKeyboard();
    }
  }

  setPNAxis(index, inval) {
    this.pad?.setPNAxis(index, inval);
    this.notifyPad();
  }
  setAxis(index, inval) {
    this.pad?.setAxis(index, inval);
    this.notifyPad();
  }
  setButton(index, down) {
    this.pad?.setButton(index, down);
    this.notifyPad();
  }
  setHat(index, val) {
    this.pad?.setHat(index, val);
    this.notifyPad();
  }

}

export { KeyboardService as default, HID_MODIFIERS };

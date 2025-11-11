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

import BLEServer from "bleserver";
import { uuid } from "btutils";
import {HIDKeyboard} from "hidkeyboard";
import {HIDMedia} from "hidmedia";

class KeyboardService extends BLEServer {
  constructor(options) {
    super(options);

    this.consumerMedia = new HIDKeyboard();
    this.media = new HIDMedia();
    this.bound = false;

    this.boundCallback = options.onKeyboardBound;
    this.unboundCallback = options.onKeyboardUnbound;
  }
  onReady() {
    this.deviceName = "_boxcontroller";
    //this.deviceName = "_hacontrol";
    this.securityParameters = { encryption: true, bonding: true };

    this.consumerMediaReportCharacteristic = null;
    this.mediaReportCharacteristic = null;
    this.onDisconnected();
  }
  onConnected() {
    this.stopAdvertising();
  }
  onDisconnected() {
    this.unboundCallback?.();
    this.mediaReportCharacteristic = null;
    this.consumerMediaReportCharacteristic = null;
    this.startAdvertising({
      advertisingData: { flags: 6, completeName: this.deviceName,
        incompleteUUID16List:[uuid`1812`, uuid`180f`],
        appearance: 964 } // 961 HID Keyboard, 964 HID Gamepad
    });
  }
  onCharacteristicNotifyEnabled(characteristic) {
    if ("pad_input_report" == characteristic.name) {
      this.mediaReportCharacteristic = characteristic;
      trace(`pad report bound by request\n`);
      if (!this.bound) {
        this.bound = true;
        this.boundCallback?.();
      }
    } else if ("consumermedia_input_report" == characteristic.name) {
      this.consumerMediaReportCharacteristic = characteristic;
      trace(`consumer media report bound by request\n`);
      if (!this.bound) {
        this.bound = true;
        this.boundCallback?.();
      }
    } else if ("battery" == characteristic.name) {
      this.batteryCharacteristic = characteristic;
      this.notifyValue(this.batteryCharacteristic, 100);
    } else {
      trace(`request to bind characteristic: ${JSON.stringify(characteristic)}\n`);
    }
  }
  /** キャラクタ読み取り要求があったときの動作 */
  onCharacteristicRead(characteristic) {
    switch (characteristic.name){
      case "pad_input_report":
        return this.media.report;
      case "consumermedia_input_report":
        return this.consumerMedia.report;
      case "control_point":
        return [0,0];
      default:
        trace(`unhandled read of characteristic: ${characteristic.name}\n`);
        break;
    }
  }
  notifyConsumerMedia() {
    if (this.consumerMediaReportCharacteristic)
      this.notifyValue(this.consumerMediaReportCharacteristic,
      this.consumerMedia.report);
    else
      trace(`not connected ${this.consumerMedia.report}`);
  }
  /** API */
  notifyMedia() {
    if (this.mediaReportCharacteristic) {
      this.notifyValue(this.mediaReportCharacteristic, this.media.report);
      trace(`connected: ${this.media.report}\n`);
    } else {
      trace(`not connected: ${this.media.report}\n`);
    }
  }

  setAxis(index, inval) {
    this.media?.setAxis(index, inval);
    this.notifyMedia();
  }
  setButton(index, down) {
    this.media?.setButton(index, down);
    this.notifyMedia();
  }
  setHat(val) {
    this.media?.setHat(val);
    this.notifyMedia();
  }

}

export { KeyboardService as default };

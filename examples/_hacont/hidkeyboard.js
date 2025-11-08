
class HIDKeyboard {

  constructor() {
    /** 1バイト */
    this.report = Uint8Array.from([0]);
  }
}

export {HIDKeyboard}

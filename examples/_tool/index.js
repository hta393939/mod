
class Misc {
  async init() {
    this.hexToD();

    {
      const obj = {
        uuid: "2A4B",
        maxBytes: reportmap0.length,
        type: "Uint8Array",
        permissions: "readEncrypted,writeEncrypted",
        properties: "read",
        //value: reportmap2,
        //value: reportmap1, // 6軸+10ボタン+1ボタン
        value: reportmap0, // 元のまま
      };
      const text = JSON.stringify(obj);
      console.log('_boxctrl', obj.maxBytes);
      console.log(text);
      await navigator.clipboard.writeText(text);
    }
  }

  /** ble サンプルの分解例 */
  setSample() {
    const obj = {};   
    obj.value = [
// (1) Generic Desktop
                        5,1,
// Usage 6 Keyboard in Generic. Game Pad は 5
                        9,6,
// Collection (Application) a1
                        161,1,
// 確か識別用の数値 (1) 85
                        133,1,
// Usage Page (Key Codes)
                        5,7,
// Usage Minimum (224) 19
                        25,224,
// Usage Maximum (231) 29
                        41,231,
// Logical Minimum (0) 15
                        21,0,
// Logical Maximum (1) 25
                        37,1,
// Report Size (1) 75
                        117,1,
// Report Count (8) 95
                        149,8,
// Input (Data, Var, Abs) 81
                        129,2,

// Report Count (1) 95
                        149,1,
// Report Size (8) 75
                        117,8,
// Input (Constant) 81 定数配列絶対値(1)
                        129,1,

// Report Count (5) 95
                        149,5,
// Report Size (1) 75
                        117,1,
// Usage Page (LEDs)
                        5,8,
// Usage Mini (1) 19
                        25,1,
// Usage Maxi (5) 29
                        41,5,
// Output (Data, Var, Abs) 91 2
                        145,2,

// Report Count (1) 95
                        149,1,
// Report Size (3) 75
                        117,3,
// Output (Constant) 91 1 
                        145,1,

// Report Count (6) 95 
                        149,6,
// Report Size (8) 75
                        117,8,
// Logical Minimum (0) 15
                        21,0,
// Logical Maximu (101), 25
                        37,101,
// Usage Page (Key Codes)
                        5,7,
// Usage Mini 19
                        25,0,
// Usage Maxi 29
                        41,101,
// Input 81 データ配列絶対値(0)
                        129,0,

// END
                        192,

// Usage Page (多分 media controller 0x0c)
                        5,12,
// Usage 
                        9,1,
// Collection A1
                        161,1,
// 確か識別用の数値 (2) 85
                        133,2,
// Usage Page
                        5,12,
// Logical Minimum (0) 15
                        21,0,
// Logical Maximum (1) 25
                        37,1,
// Report Size (1) 75
                        117,1,
// Report Count (8) 95
                        149,8,
// Usage
                        9,233,
                        9,234,
                        9,226,
                        9,182,
                        9,181,
                        9,176,
                        9,205,
                        9,185,
// Input (Data, Var, Abs) 81 2 変数
                        129,2,
// END
                        192
    ];
    obj.maxBytes = obj.value.length;
    return obj;
  }

  /** 後半をパッドにしたい
   * 一旦ボタンが見えるようになった構成
   * ボタン24個 3バイト
   * 軸6 12バイト
   * 追加3 6バイト
   * ハット2 1バイト
   * 
   * 22バイト
   */
  setPadKeep() {
    const obj = {
      uuid: "2A4B",
      maxBytes: 0,
      type: "Uint8Array",
      permissions: "readEncrypted,writeEncrypted",
      properties: "read",
      value: [],
    };
    obj.value = [
// (1) Generic Desktop
                        5,1,
// Usage 6 Keyboard in Generic. Game Pad は 5
                        9,6,
// Collection (Application) a1
                        161,1,
// 確か識別用の数値 (1) 85
                        133,1,
// Usage Page (Key Codes)
                        5,7,
// Usage Minimum (224) 19
                        25,224,
// Usage Maximum (231) 29
                        41,231,
// Logical Minimum (0) 15
                        21,0,
// Logical Maximum (1) 25
                        37,1,
// Report Size (1) 75
                        117,1,
// Report Count (8) 95
                        149,8,
// Input (Data, Var, Abs) 81
                        129,2,

// Report Count (1) 95
                        149,1,
// Report Size (8) 75
                        117,8,
// Input (Constant) 81 定数配列絶対値(1)
                        129,1,

// Report Count (5) 95
                        149,5,
// Report Size (1) 75
                        117,1,
// Usage Page (LEDs)
                        5,8,
// Usage Mini (1) 19
                        25,1,
// Usage Maxi (5) 29
                        41,5,
// Output (Data, Var, Abs) 91 2
                        145,2,

// Report Count (1) 95
                        149,1,
// Report Size (3) 75
                        117,3,
// Output (Constant) 91 1 
                        145,1,

// Report Count (6) 95 
                        149,6,
// Report Size (8) 75
                        117,8,
// Logical Minimum (0) 15
                        21,0,
// Logical Maximu (101), 25
                        37,101,
// Usage Page (Key Codes)
                        5,7,
// Usage Mini 19
                        25,0,
// Usage Maxi 29
                        41,101,
// Input 81 データ配列絶対値(0)
                        129,0,

// END
                        192,

// Usage Page (1) generic
                        5, 1,
// Usage (5) Game Pad
                        9, 5,
// Collection A1
                        161, 1,
// 確か識別用の数値 (2) 85
                        133, 2,
// Usage Page (ボタン)
                        5, 9,
// ボタン 24個 Logical 0-1
            0x15, 0,
            0x25, 1,
// Usage Mini
            0x19, 0x01,
// Usage Maxi
            0x29, 0x18,
// 1bit
            0x75, 1,
// 24個
            0x95, 24,
// Input (Data, Var, Abs) 81 2 変数
                        129,2,

// Logical Minimum (-32767) 2バイトLE
                        0x16, 0x01, 0x80,
// Logical Maximum (+32767) 2バイトLE
                        0x26, 0xff, 0x7f,

// Physical Mini -1 最小値
            0x35, 0xff,
// Physical Maxi 1 最大値
            0x45, 0x01,

// Report Size (16)
                        0x75, 16,
// Report Count (6) 95
                        0x95, 6,
// Usage
                        9, 0x30,
                        9, 0x31,
                        9, 0x32,
                        9, 0x33,
                        9, 0x34,
                        9, 0x35,
// Input (Data, Var, Abs) 81 2 変数
                        129,2,

// Logical Minimum (0)
                        0x16, 0x00, 0x00,
// Logical Maximum (32767)
                        0x26, 0x00, 0x7f,

// Physical Mini 0 最小値
            0x35, 0,
// Physical Maxi 1 最大値
            0x45, 1,

// Report Size (16)
                        0x75, 16,
// Report Count (3) 95
                        0x95, 3,

            9,0x36, // slider
            9,0x37, // dial
            9,0x38, // wheel
// Input (Data, Var, Abs) 81 2 変数
                        129,2,

// Logical Minimum (0) 15
                        0x15, 0,
// Logical Maximum (7) 25
                        0x25, 7,

// Physical Mini -1 最小値
            0x35, 0xff,
// Physical Maxi 1 最大値
            0x45, 0x01,

// Report Size (4) 75
                        0x75, 4,
// Report Count (2) 95
                        0x95, 2,

            9, 0x39, // hat switch
            9, 0x3a, // hat switch 2 であってほしい
// Input (Data, Var, Abs) 81 2 変数
                        129,2,

// END
                        192
    ];
    obj.maxBytes = obj.value.length;
    return obj;
  }


  /** 
   * 後半をパッドにしたい
   * ボタン24個 3バイト
   * 軸6 12バイト
   * 追加3 6バイト
   * ハット2 1バイト
   * 
   * 22バイト
   */
  setPad() {
    const obj = {
      uuid: "2A4B",
      maxBytes: 0,
      type: "Uint8Array",
      permissions: "readEncrypted,writeEncrypted",
      properties: "read",
      value: [],
    };
    obj.value = [
// (1) Generic Desktop
5,1,
// Usage 6 Keyboard in Generic. Game Pad は 5
9,6,
// Collection (Application) a1
161, 1,
// 確か識別用の数値 (1) 85
133, 1,
// Usage Page (Key Codes)
                        5,7,
// Usage Minimum (224) 19
                        25,224,
// Usage Maximum (231) 29
                        41,231,
// Logical Minimum (0) 15
                        21,0,
// Logical Maximum (1) 25
                        37,1,
// Report Size (1) 75
                        117,1,
// Report Count (8) 95
                        149,8,
// Input (Data, Var, Abs) 81
                        129,2,

// Report Count (1) 95
                        149,1,
// Report Size (8) 75
                        117,8,
// Input (Constant) 81 定数配列絶対値(1)
                        129,1,

// Report Count (5) 95
                        149,5,
// Report Size (1) 75
                        117,1,
// Usage Page (LEDs)
                        5,8,
// Usage Mini (1) 19
                        25,1,
// Usage Maxi (5) 29
                        41,5,
// Output (Data, Var, Abs) 91 2
                        145,2,

// Report Count (1) 95
                        149,1,
// Report Size (3) 75
                        117,3,
// Output (Constant) 91 1 
                        145,1,

// Report Count (6) 95 
                        149,6,
// Report Size (8) 75
                        117,8,
// Logical Minimum (0) 15
                        21,0,
// Logical Maximu (101), 25
                        37,101,
// Usage Page (Key Codes)
                        5,7,
// Usage Mini 19
                        25,0,
// Usage Maxi 29
                        41,101,
// Input 81 データ配列絶対値(0)
129,0,
// END
192,


//// 2つめのリポート
// Usage Page (1) generic
5, 1,
// Usage (5) Game Pad
9, 5,
// Collection A1
161, 1,
// 確か識別用の数値 (2) 85
133, 2,
// Usage Page (ボタン)
                        5, 9,
// ボタン 24個 Logical 0-1
            0x15, 0,
            0x25, 1,
// Usage Mini
            0x19, 0x01,
// Usage Maxi
            0x29, 0x18,
// 1bit
            0x75, 1,
// 24個
            0x95, 24,
// Input (Data, Var, Abs) 81 2 変数
            129,2,

// ボタンページのままではだめだ Generic Desktop を指定する
            5, 1,

// Logical Minimum (-32767) 2バイトLE
            0x16, 0x01, 0x80,
// Logical Maximum (+32767) 2バイトLE
            0x26, 0xff, 0x7f,

// Physical Mini -1 最小値
            0x35, 0xff,
// Physical Maxi 1 最大値
            0x45, 0x01,

// Report Size (16)
                        0x75, 16,
// Report Count (6) 95
                        0x95, 6,
// Usage
                        9, 0x30,
                        9, 0x31,
                        9, 0x32,
                        9, 0x33,
                        9, 0x34,
                        9, 0x35,
// Input (Data, Var, Abs) 81 2 変数
                        129,2,

// Logical Minimum (0)
                        0x16, 0x00, 0x00,
// Logical Maximum (32767)
                        0x26, 0x00, 0x7f,

// Physical Mini 0 最小値
            0x35, 0,
// Physical Maxi 1 最大値
            0x45, 1,

// Report Size (16)
                        0x75, 16,
// Report Count (3) 95
                        0x95, 3,

            9,0x36, // slider
            9,0x37, // dial
            9,0x38, // wheel
// Input (Data, Var, Abs) 81 2 変数
                        129,2,

// Logical Minimum (0) 15
                        0x15, 0,
// Logical Maximum (7) 25
                        0x25, 7,

// Physical Mini -1 最小値
            0x35, 0xff,
// Physical Maxi 1 最大値
            0x45, 0x01,

// Report Size (4) 75
                        0x75, 4,
// Report Count (2) 95
                        0x95, 2,

            9, 0x39, // hat switch
            9, 0x3a, // hat switch 2 であってほしい
// Input (Data, Var, Abs) 81 2 変数
            129,2,

// END
        192
    ];
    obj.maxBytes = obj.value.length;
    return obj;
  }

  hexToD() {
    const el = document.getElementById('hex');
    const viewel = document.getElementById('hexview');
    const _update = () => {
      const text = el.value;
      const val = Number.parseInt(text, 16);
      const u16 = new Uint16Array(64);
      u16[0] = val;
      const p = new DataView(u16.buffer);
      const bs = [p.getUint8(0), p.getUint8(1)];

      const str = `${bs[0]}, ${bs[1]}`;
      viewel.textContent = str;
      //navigator.clipboard.writeText(str);
      console.log('hexToD', str);
    };
    el.addEventListener('input', _update);
    _update();
  }

}

const misc = new Misc();
globalThis.misc = misc;
misc.init();

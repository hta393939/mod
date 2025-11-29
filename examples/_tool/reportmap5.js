
/**
 *
 */
var reportmap5 = [
// (1) Generic Desktop
5,1,
// Usage 6 Keyboard in Generic. Game Pad は 5
9,6,
// Collection (Application) a1
0xa1, 1,
// リポートID 確か識別用の数値 (1) 85
0x85, 1,
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
0x81, 2,

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
0x81, 2,

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
0x81, 2,

// END
0xc0,

//// 3つめのリポート
// 
// 
// 
// END
0xc0,

];

console.log('reportmap5', reportmap5.length);

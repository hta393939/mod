// こっちの方が新しい

// @see https://www.angelcode.com/products/bmfont/doc/file_format.html

/**
 * 無視されることも多いらしい。
 * u8メンバが多い。
 */
class Info {
  static type = 1;
  constructor() {
    /** s16 */
    this.fontSize = 0;
    /** b8 */
    this.bitField = 0;
    this.charSet = 0;
    /** u16 パーセント単位 100%はストレッチしない */
    this.stretchH = 100;
    /** u8 supersampling 1は使用しない */
    this.aa = 1;
    this.paddingUp = 0;
    this.paddingRight = 0;
    this.paddingDown = 0;
    this.paddingLeft = 0;
    this.spacingHoriz = 0;
    this.spacingVert = 0;
    /** u8 アウトラインの太さ */
    this.outline = 0;
    this.fontName = 'org';
  }
}

class Common {
  static type = 2;
  constructor() {
    /** u16 */
    this.lineHeight = 0;
    /** u16 */
    this.base = 0;
    /** u16 */
    this.scaleW = 0;
    /** u16 */
    this.scaleH = 0;
    /** u16 テクスチャページ数 */
    this.pages = 0;
    this.bitField = 0;
    /**
     * u8
     * 0: このチャンネルはグリフデータを持つ
     * 1: アウトラインを持つ
     * 2: グリフとアウトラインを持つ
     * 3: ゼロ
     * 4: ワン
     */
    this.alphaChnl = 0;
    this.redChnl = 0;
    this.greenChnl = 0;
    this.blueChnl = 0;
  }
}

class Page {
  static type = 3;
  constructor() {
    this.pageNames = '';
  }
}

class Char {
  static type = 4;
  constructor() {
    /**   */
    this.id = 0;

    this.tx = 0;
    this.ty = 0;
    this.w = 0;
    this.h = 0;
    this.ox = 0;
    this.oy = 0;
    this.xadvance = 0;

    this.page = 1;
    this.ch = 0;
  }
}

class Kerning {
  static type = 5;
  constructor() {
    /** u32 */
    this.first = 0;
    /** u32 */
    this.second = 0;
    /** s16 */
    this.amount = 0;
  }
}


class Misc {
  constructor() {

  }

  async init() {
    this.addListener();
  }

  addListener() {
    {
      const _mkf = (type) => {
        return (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          ev.dataTransfer.dropEffect = type;
        };
      };
      document.body.addEventListener('dragover', _mkf('none'));
      document.body.addEventListener('drop', _mkf('none'));
      const el = document.getElementById('receive');
      el?.addEventListener('dragenter', _mkf('link'));
      el?.addEventListener('drop', ev => {
        _mkf('link')(ev);

        const re = /^(?<body>.+)(?<ext>\.[\.]+)$/;
        const file = ev.dataTransfer.files[0];
        const m = re.exec(file.name);
        if (!m) {
          return;
        }
        const name = m.groups['body'];        

        const fnt = this.readyFnt({name});
        const buf = this.makeFnt(fnt);
        this.download(buf, `${name}.fnt`);
      });
    }
  }

  /**
   * 
   * @param {*} param 
   * @returns 
   */
  readyFnt(param) {
    const size = 24;
    const ret = {chars: [], kernings: []};
    ret.info = new Info();
    ret.common = new Common();
    ret.page = new Page();
    ret.page.pageNames = param.name;
    for (let i = 0; i < 64; ++i) {
      const char = new Char();
      char.id = i + 0x20;
      let bx = (i & 15) * size;
      let by = Math.floor(i / 16) * size;
      char.tx = bx;
      char.ty = by;
      char.w = size;
      char.h = size;
      char.ox = 0;
      char.oy = 0;
      char.xadvance = size;
      ret.chars.push(char);
    }
    return ret;
  }

  /**
   * バイナリ生成する
   * @param {*} data 
   * @returns 
   */
  makeFnt(data) {
    const buf = new Array(65536);
    const p = new DataView(buf);
    /** 全体オフセット */
    let c = 0;
    { // magic and version
      p.setUint8(c, 0x42);
      p.setUint8(c + 1, 0x4d);
      p.setUint8(c + 2, 0x46);
      p.setUint8(c + 3, 3);
      c += 4;
    }

    const _wntt = (text) => {
      const _buf = new TextEncoder().encode(text);
      for (let i = 0; i < _buf.byteLength; ++i) {
        p.setUint8(c, _buf[i]);
        c += 1;
      }
      p.setUint8(c, 0); // null-term
      c += 1;
    };

    { // info
      const text = new TextEncoder().encode(data.info.name);
      const len = text.byteLength;
      const body = 14 + len + 1;
      p.setUint8(c, Info.type);
      p.setUint32(c + 1, body);
      c += 5;
      {
        /** @type {Info} */
        const info = data.info;
        p.setInt16(c,      info.fontSize, true);
        p.setUint8(c + 2,  info.bitField);
        p.setUint8(c + 3,  info.charSet);
        p.setUint16(c + 4, info.stretchH, true);
        p.setUint8(c +  6, info.aa);
        p.setUint8(c +  7, info.paddingUp);
        p.setUint8(c +  8, info.paddingRight);
        p.setUint8(c +  9, info.paddingDown);
        p.setUint8(c + 10, info.paddingLeft);
        p.setUint8(c + 11, info.spacingHoriz);
        p.setUint8(c + 12, info.spacingVert);
        p.setUint8(c + 13, info.outline);
        c += 14;
      }

      _wntt(data.info.name);
    }
    { // common
      const body = 15;
      p.setUint8(c, Common.type);
      p.setUint32(c + 1, body);
      c += 5;
      {
        /** @type {Common} */
        const cm = data.common;
        p.setUint16(c,     cm.lineHeight, true);
        p.setUint16(c + 2, cm.base, true);
        p.setUint16(c + 4, cm.scaleW, true);
        p.setUint16(c + 6, cm.scaleH, true);
        p.setUint16(c + 8, cm.pages, true);
        p.setUint8(c + 10, cm.bitField);
        p.setUint8(c + 11, cm.alphaChnl);
        p.setUint8(c + 12, cm.redChnl);
        p.setUint8(c + 13, cm.greenChnl);
        p.setUint8(c + 14, cm.blueChnl);
        c += body;
      }
    }
    { // filename
      const text = new TextEncoder().encode(data.page.pageNames);
      const len = text.byteLength;

      const body = len + 1;
      p.setUint8(c, Page.type);
      p.setUint32(c + 1, body);
      c += 5;

      _wntt(text);
    }
    { // char
      const body = data.chars.length * 20;
      p.setUint8(c, Char.type);
      p.setUint32(c + 1, body);
      c += 5;
      for (let i = 0; i < data.chars.length; ++i) {
        const char = data.chars[i];
        p.setUint32(c, char.id, true);
        p.setUint16(c + 4, char.tx, true);
        p.setUint16(c + 6, char.ty, true);
        p.setUint16(c + 8, char.w, true);
        p.setUint16(c + 10, char.h, true);
        p.setInt16(c + 12, char.ox, true);
        p.setInt16(c + 14, char.oy, true);
        p.setUint16(c + 16, char.xadvance, true);
        p.setUint8(c + 18, char.page);
        p.setUint8(c + 19, char.ch);
        c += 20;
      }
    }
    { // pair 0組
      const body = data.kernings.length * 10;
      p.setUint8(c, Kerning.type);
      p.setUint32(c + 1, body);
      c += 5;
      for (let i = 0; i < data.kernings.length; ++i) {
        const kp = data.kernings[i];
        p.setUint32(c, kp.first, true);
        p.setUint32(c + 4, fp.second, true);
        p.setInt16(c + 8, fp.amount, true);
        c += 10;
      }
    }
    const ret = buf.slice(0, c);
    return ret;
  }

  /**
   * 
   * @param {Blob} blob 
   * @param {string} name 
   */
  download(blob, name) {
    const a = document.createElement('a');
    a.download = name;
    a.href = URL.createObjectURL(blob);
    a.click();
  }

}

const misc = new Misc();
globalThis.misc = misc;
misc.init();

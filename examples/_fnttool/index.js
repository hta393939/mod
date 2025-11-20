
class Char {
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

  readyFnt(param) {
    const size = 24;
    const ret = {chars: []};
    ret.info = {};
    ret.common = {};
    ret.name = param.name;
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

  makeFnt(data) {
    const buf = new Array(65536);
    const p = new DataView(buf);
    let c = 0;
    { // magic and version
      p.setUint8(c, 0x66);
      p.setUint8(c + 1, 0x66);
      p.setUint8(c + 2, 0x66);
      p.setUint8(c + 3, 3);
      c += 4;
    }

    { // info
      const text = new TextEncoder().encode('font');
      const len = text.byteLength;
      const body = 20 + len + 1;
      p.setUint8(c, 1);
      p.setUint32(c + 1, body);
      c += 5;


      c += len + 1;
    }
    { // common
      const body = 20;
      p.setUint8(c, 2);
      p.setUint32(c + 1, body);
      c += 5;
      

    }
    { // filename
      const body = 0 + 1;
      p.setUint8(c, 3);
      p.setUint32(c + 1, body);

      // null-term
      c += body;
    }
    { // char
      const body = data.chars.length * 20;
      p.setUint8(c, 4);
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
      p.setUint8(c, 5);
      p.setUint32(c + 1, 0);
      c += 5;
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


class Misc {
  constructor() {

  }

  init() {
    this.convertTo();
  }

  async convertTo() {
    const obj = {
      uuid: "2A4B",
      maxBytes: 0,
      type: "Uint8Array",
      permission: "readEncrypted,writeEncrypted",
      properties: "read",
      value: [],
    };
    const lines = this.set().split('\n');
    for (const line of lines) {
      if (line == '') {
        continue;
      }
      if (line.startsWith('#')) {
        continue;
      }

      const ss = line.trim().split(' ');
      for (const one of ss) {
        let val = null;
        if (one == '') {
          continue;
        }
        if (one.startsWith('0x')) {
          val = Number.parseInt(one.slice(2), 16);
        } else {
          val = Number.parseInt(one);
        }
        if (Number.isFinite(val)) {
          obj.value.push(val);
        }
      }
    }
    obj.maxBytes = obj.value.length;

    const text = JSON.stringify(obj);
    console.log('convertTo', obj.maxBytes);
    console.log(text);
    await navigator.clipboard.writeText(text);
  }

  set() {
    const lines = `
# USAGE_PAGE (Generic Desktop)
5,1,
# 
9, 0

# COLLECTION (Application)
0xa1, 0x01,

# USAGE_PAGE (Button)
0x05, 0x09
# USAGE_MINIMUM 0x19 MAXIMUM 0x29
# LOGICAL_MINIMUM (0) MAXIMUM (1)
0x15, 0x00, 0x25, 0x01

# REPORT_COUNT (1), REPORT_SIZE (3)
0x95, 0x01, 0x75, 0x03,

# INPUT (Data,Var,Abs)
0x81, 0x02,

#   END_COLLECTION
192,
# END_COLLECTION
192
`;
    return lines;
  }
}

const misc = new Misc();
globalThis.misc = misc;
misc.init();

import Fraction from 'fraction.js';

const OP = {
  '|': 'abs',
  '!': 'neg',
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div',
  '^': 'pow',
  '~': 'log',
  'o': 'round',
};

class Fric {
  #value;
  #ops;

  constructor(value) {
    if (value instanceof Fric) {
      this.#value = value.#value.clone();
      this.#ops = value.#ops.slice();
      return;
    }

    const fract = new Fraction(value);
    this.#ops = [['', fract]];
    this.#value = fract.clone();
  }

  #op(op, value) {
    const m = new Fric(this);
    const fract = new Fraction(value);
    value = fract.toFraction();
    const $value = m.#value[OP[op]](value);
    if (!$value) {
      throw new Error(`The result is non-rational`);
    }
    m.#value = $value;
    m.#ops.push([op, fract]);
    return m;
  }

  abs(value) {
    return this.#op('|', value);
  }

  neg(value) {
    return this.#op('!', value);
  }

  add(value) {
    return this.#op('+', value);
  }

  sub(value) {
    return this.#op('-', value);
  }

  mul(value) {
    return this.#op('*', value);
  }

  div(value) {
    return this.#op('/', value);
  }

  pow(value) {
    return this.#op('^', value);
  }

  log(value) {
    return this.#op('~', value);
  }

  round(places) {
    return this.#op('o', places);
  }

  squash() {
    this.#ops = [['', this.#value.clone()]];
  }

  toFraction() {
    return this.#value.toFraction();
  }

  valueOf() {
    return this.#value.toString();
  }

  toString() {
    return this.#value.toString();
  }

  static deserialize(expr) {
    let m;
    const arr = expr.split(':');
    for (const it of arr) {
      const op = it[0];
      m = OP[op] && m ? m[OP[op]](it.slice(1)) : new Fric(it);
    }
    return m;
  }

  serialize() {
    let expr = '';
    for (const [op, value] of this.#ops) {
      expr += `${op && ':'}${op}${value.toFraction()}`;
    }
    return expr;
  }

  explain() {
    let res;
    let s = '';
    for (const [op, value] of this.#ops) {
      if (!op) {
        res = value.clone();
        s += value.toFraction();
        continue;
      }
      res = res[OP[op]](value.toFraction());
      s += ` → ${OP[op]}(${value.toFraction()})`;
    }
    s += ` = ${res.toFraction()}`;
    return s;
  }
}

export default Fric;

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

const m1 = new Fric('-10'); //             -10
const m2 = m1.div('3'); //              -10 / 3
const m3 = m2.mul('8.1').div('100'); // -10 / 3 * 8.1%

console.log('EXPLAIN:   ', m1.explain());
console.log('VALUEOF:   ', m1.valueOf());
console.log('');

console.log('EXPLAIN:   ', m2.explain());
console.log('VALUEOF:   ', m2.valueOf());
const m7 = m2.round(2);
console.log('EXPLAIN:   ', m7.explain());
console.log('VALUEOF:   ', m7.valueOf());
const s3 = m7.serialize();
console.log('SERIALIZED:', s3);

console.log('');

console.log('EXPLAIN:   ', m3.explain());
console.log('VALUEOF:   ', m3.valueOf());
const s = m3.serialize();
console.log('SERIALIZED:', s);
console.log('');

const m4 = Fric.deserialize(s);
console.log('EXPLAIN:   ', m4.explain());
m4.squash();
console.log('EXPLAIN:   ', m4.explain());
const s4 = m4.serialize();
console.log('SERIALIZED:', s4);
console.log('');

const m5 = new Fric('2');
const m6 = m5.pow('3').log('2').add('50.5').mul('8.1').div('100');
console.log('EXPLAIN:   ', m6.explain());
console.log('VALUEOF:   ', m6.valueOf());
const m8 = m6.round(2);
console.log('EXPLAIN:   ', m8.explain());
console.log('VALUEOF:   ', m8.valueOf());
const s2 = m8.serialize();
console.log('SERIALIZED:', s2);

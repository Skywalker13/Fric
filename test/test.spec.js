import {expect} from 'chai';
import Fric from '../lib/index.js';

describe('fric', function () {
  it('simple', function () {
    const fric = new Fric('4.2');
    expect(fric.toFraction()).to.be.equal('21/5');
    expect(fric.serialize()).to.be.equal('21/5');
  });

  it('mul', function () {
    const fric = new Fric('4.2').mul('8.1').div(100);
    expect(fric.toFraction()).to.be.equal('1701/5000');
    expect(fric.serialize()).to.be.equal('21/5:*81/10:/100');
  });

  it('round', function () {
    const fric = new Fric('4.2').mul('8.1').div(100).round(2);
    expect(fric.toFraction()).to.be.equal('17/50');
    expect(fric.serialize()).to.be.equal('21/5:*81/10:/100:o2');
  });
});

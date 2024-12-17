# Fric

Very simple PoC for an idea to keep the whole history of a number without precision lose.

```js
import Fric from 'fric.js';

const f1 = new Fric('4.2');
f1.toFraction(); // '21/5'
f1.serialize(); // '21/5'

const f2 = new Fric('4.2').mulr('8.1').div(100);
f2.toFraction(); // '1701/5000'
f2.serialize(); // '21/5:*81/10:/100'

const f3 = Fric.deserialize('21/5:*81/10:/100');
f3.toFraction(); // '1701/5000'
```

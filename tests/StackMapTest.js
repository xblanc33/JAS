sm = require('../StackMap.js');

var m = new sm.StackMap();
m.put('a', 32);
m.put('b', 35);

if (m.get('b') === 35) console.log('test (1) ok');
else console.log('test (1) not ok');

if (m.containsKey('a')) console.log('test (2) ok');
else console.log('test (2) not ok');

if (!m.containsKey('c')) console.log('test (3) ok');
else console.log('test (3) not ok');

var inner = new sm.StackMap(m);

if (inner.get('b') === 35) console.log('test (4) ok');
else console.log('test (4) not ok');

if (inner.containsKey('a')) console.log('test (5) ok');
else console.log('test (5) not ok');

if (!inner.containsKey('c')) console.log('test (6) ok');
else console.log('test (6) not ok');

inner.put('a','chg');

if (inner.get('a') === 'chg') console.log('test (7) ok');
else console.log('test (7) not ok');

if (m.get('a') === 'chg') console.log('test (8) ok');
else console.log('test (8) not ok');

inner.map.put('a','mask');

if (inner.get('a') === 'mask') console.log('test (9) ok');
else console.log('test (9) not ok');

if (m.get('a') === 'chg') console.log('test (10) ok');
else console.log('test (10) not ok');

var ks = inner.keySet();

if ((ks.length === 2) && (ks.indexOf('a') != -1 ) && (ks.indexOf('b') != -1 )) console.log('test (11) ok');
else console.log('test (11) not ok');

var clone = inner.clone();

var ksc = clone.keySet();

if ((ksc.length === 2) && (ksc.indexOf('a') != -1 ) && (ksc.indexOf('b') != -1 )) console.log('test (12) ok');
else console.log('test (12) not ok');



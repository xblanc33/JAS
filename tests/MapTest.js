Map = require('../Map.js');

var m = new Map();
m.put('a', 32);
m.put('b', 35);

if (m.get('b') === 35) console.log('test (1) ok');
else console.log('test (1) not ok');

if (m.containsKey('a')) console.log('test (2) ok');
else console.log('test (2) not ok');

if (!m.containsKey('c')) console.log('test (3) ok');
else console.log('test (3) not ok');

var clone = m.clone();


if (clone.get('b') === 35) console.log('test (4) ok');
else console.log('test (4) not ok');

if (clone.containsKey('a')) console.log('test (5) ok');
else console.log('test (5) not ok');

if (!clone.containsKey('c')) console.log('test (6) ok');
else console.log('test (6) not ok');


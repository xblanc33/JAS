//var a;
//var b;
//a = 42;
//b = a + input;
//a = a - b;

var state = require('./state.js');
var lat = require('./lattice.js');

l = new lat.Lattice(['+', '-']);
l.lift('B');
l.down('?');
l.enforceAll();
console.log(l.elements);

var s1 = new state.State(1, l);
var s2 = new state.State(2, l);
var s3 = new state.State(3, l);
var s4 = new state.State(4, l);
var s5 = new state.State(5, l);

//s1.addChild(s2);
//s2.addChild(s3);
s2.parents.push(s1);
//s3.addChild(s4);
s3.parents.push(s2);
s4.parents.push(s3);
s5.parents.push(s4);

var states = [s1, s2, s3, s4, s5];




s1.f = function() {
    console.log("f applied to " + this.id);
    var changed = false;
    return s1.join('a', '?');
};

s2.f = function() {
    console.log("f applied to " + this.id);
    var changed = false;
    return s2.join('b', '?');
};

s3.f = function() {
    console.log("f applied to " + this.id);
    return s3.join('a', '+');
};

s4.f = function() {
    console.log("f applied to " + this.id);
    return s4.join('b', '?');
};

s5.f = function() {
    console.log("f applied to " + this.id);
    var oa = s3.map['a'];
    var ob = s3.map['b'];

    if ((oa.indexOf('?') != -1) || (ob.indexOf('?') != -1)) na = '?';
    if ((oa.indexOf('+') != -1) && (ob.indexOf('-') != -1)) na = '+';
    if ((oa.indexOf('-') != -1) && (ob.indexOf('+') != -1)) na = '-';
    if ((oa.indexOf('+') != -1) && (ob.indexOf('+') != -1)) na = '?';
    if ((oa.indexOf('-') != -1) && (ob.indexOf('-') != -1)) na = '?';
    if ((oa.indexOf('B') != -1) || (ob.indexOf('B') != -1)) na = 'B';
    return s5.join('a', na);
};

console.log('Fixed point');
var fixed = false;
var start = 0;
var next_start = 0;
while (!fixed) {
	fixed=true;
    for (var i = 0; i < states.length; i++) {
    	var j = (i + start) % states.length;
        if (states[j].applyF()) {
        	next_start = i;
        	fixed = false;
        };
    };
    start = next_start+1;
}

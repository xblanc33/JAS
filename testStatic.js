//var a,b;
//a = 42;
//b = a + input;
//a = a - b;

var state = require('./state.js');
var lat = require('./lattice.js');

var s1 = new state.State(1);
var s2 = new state.State(2);
var s3 = new state.State(3);
var s4 = new state.State(4);

//s1.addChild(s2);
//s2.addChild(s3);
s2.addParent(s1);
//s3.addChild(s4);
s3.addParent(s2);
s4.addParent(s3);

l = new lat.Lattice(['+','-']);
l.lift('B');
l.down('?');
l.enforceAll();



s1.setF(function() {
	console.log("f applied to "+this.id);
	var changed = false;
	if (this.v.indexOf('a') === -1) {
		this.v.push('a');
		this.v.a = '?';
		changed = true;
	} else {
		var na = l.getLeastUpper([this.v.a,'?']);
		if (this.v.a != na) {
			this.v.a = na;
			changed = true;
		}
	};
	if (this.v.indexOf('b') === -1) {
		this.v.push('b');
		this.v.b = '?';
		changed=true;
	} else {
		var nb = l.getLeastUpper([this.v.b,'?']);
		if (this.v.b != nb) {
			console.log('s1:'+this.v.b+'->'+nb);
			this.v.b = nb;
			changed = true;
		}
	};
	return changed;
});

s2.setF(function() {
	console.log("f applied to "+this.id);
	var changed = false;
	if (this.v.indexOf('a') === -1) {
		this.v.push('a');
		this.v.a = '+';
		changed = true;
	} else {
		var oa = [];//old values for a
		for (var i = 0; i < this.parents.length; i++) {
			if (this.parents[i].v.indexOf('a') != -1) oa.push(this.parents[i].v.a)
		};
		oa.push(this.v.a);
		var na = l.getLeastUpper(oa)[0];
		if (this.v.a != na) {
			console.log('s2:'+this.v.a+'->'+na);
			this.v.a = na;
			changed = true;
		}
	};
	return changed;
});

s3.setF(function() {
	console.log("f applied to "+this.id);
	var changed = false;
	if (this.v.indexOf('b') === -1) {
		this.v.push('b');
		this.v.b = '?';
		changed = true;
	} else {
		var nb = l.getLeastUpper([this.v.b,'?'])[0];
		if (this.v.b != nb) {
			console.log('s3:'+this.v.b+'->'+nb);
			this.v.b = nb;
			changed = true;
		}
	};
	return changed;
});

s4.setF(function() {
	console.log("f applied to "+this.id);
	var changed = false;
	if (this.v.indexOf('a') === -1) {
		this.v.push('a');
		this.v.a = '?';
		changed = true;
	} else {
		var oa = [];//old values for a
		for (var i = 0; i < this.parents.length; i++) {
			if (this.parents[i].v.indexOf('a') != -1) oa.push(this.parents[i].v.a)
		};
		var glua = l.getLeastUpper(oa)[0];

		var ob = [];//old values for b
		for (var i = 0; i < this.parents.length; i++) {
			if (this.parents[i].v.indexOf('b') != -1) ob.push(this.parents[i].v.b)
		};
		var glub = l.getLeastUpper(ob)[0];

		var na = 'B';
		if ((glua.indexOf('?')!=-1) || (glub.indexOf('?') !=-1)) na = '?';
		if ((glua.indexOf('+')!=-1) && (glub.indexOf('-') !=-1)) na = '+';
		if ((glua.indexOf('-')!=-1) && (glub.indexOf('+') !=-1)) na = '-';
		if ((glua.indexOf('+')!=-1) && (glub.indexOf('+') !=-1)) na = '?';
		if ((glua.indexOf('-')!=-1) && (glub.indexOf('-') !=-1)) na = '?';
		if ((glua.indexOf('B')!=-1) || (glub.indexOf('B') !=-1)) na = 'B';
		if (this.v.a != na) {
			console.log('s4:'+this.v.a+'->'+na);
			this.v.a = na;
			changed = true;

		}
	};
	return changed;
});

console.log('FIRST');
console.log(s1.applyF());
console.log(s2.applyF());
console.log(s3.applyF());
console.log(s4.applyF());


console.log('SECOND');
console.log(s1.applyF());
console.log(s2.applyF());
console.log(s3.applyF());
console.log(s4.applyF());

console.log('THIRD');
console.log(s1.applyF());
console.log(s2.applyF());
console.log(s3.applyF());
console.log(s4.applyF());

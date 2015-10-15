var a;

function f() {
	a++;
};

function g() {
	a=5;
	f();
};

g();

console.log(a);
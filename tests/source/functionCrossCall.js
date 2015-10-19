var a;

function f() {
	a=5;
};

function g() {
	a=5;
	f();
};

g();

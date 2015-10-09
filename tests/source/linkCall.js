function f() {
	a = 43;
};

function g() {
	a = -43;
};

function h() {
	a = 43;
};


var b = g;
var c;

if (true) {
	c = b;
} else {
	c = h;
}


c();
function f(a) {
	a();
};

f(function(){ var b; b=5;});
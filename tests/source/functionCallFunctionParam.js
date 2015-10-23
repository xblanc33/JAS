var b;
function f(a , b) {
	if (true) a();
	else b();
};

f(function(){ b=5;} , function() {b=-5});
var val;
function f(a , b , c) {
	if (c) a();
	else b();
	//console.log('f has been called');
};

var ok = function(){ val=5;};
var nok = function() {val=-5;};

f( ok , nok , true);
//f( ok , nok , false);


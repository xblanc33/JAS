var a = 0;

//calling f here is not possible since f is a variable and is now undefined
f();


//f = function() {
function f() {
	//console.log("f declare");
    a = 5;
};

f = function () {
		//console.log("f expression");
	a = 6;
};

//calling f here is possible since f is a variable and its value is a function
f();

//console.log(a);

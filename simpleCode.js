// var a;
// var b;
// var c;
// a = 42;
// b = 60;
// b = a;
// a = a + b;
// b = a - b;
// a = (a + b) + 44  + 50; // -42;
// b = c;
// c = a;

// if (true) {
// 	a = 42;
// }
// else {
// 	a = -42;
// };

// for (var d=3 ; d <3 ; d++) {
// 	c=4;
// };

// b=c;
// b++;
// var c;

// while (true) {
// 	b = c;
// 	c = a;
// 	a = -1;
// }


// while (true) {
//     a = b;
//     if (a == 3) {
//         b = 3;
//         // if (true) {
//         // 	b=-3;
//         // }
//     } else {
//         b = 3;
//     }
//     c = a;
// };


// e = 'test';
// for (a=0 ; a < 5 ; a++) {
// 	a = b;
// };


// for (i = 0 ; i < 5 ; i++) {
// 	i =5;
// };

function f() {
  	a = -42;
  	if (true) g();
  	else a=20;
};


function g() {
	a = 43;
	if (true) g();
	else a = -55;
};


f();


function h() {
	a = 4;
};

f();

if (true) {
	c = f;
} else {
	c = g;
}


b = c;

b();

(function() {a=50})();

g();

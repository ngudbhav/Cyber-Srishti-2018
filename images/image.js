var j = require("jimp");
j.read("logo.png", function(err, lenna){
console.log("executing");
	if(err) throw err;
	else{
		lenna.resize(500,500)//720x1280//4x2.5
		.write("logo1.png");
		console.log("done");	
		}
});
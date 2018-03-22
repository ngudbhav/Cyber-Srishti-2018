var j = require("jimp");
j.read("cyber srishti_logo3.png", function(err, lenna){
console.log("executing");
	if(err) throw err;
	else{
		lenna.resize(600,400)//720x1280//4x2.5
		.write("cyber srishti_logo3.png");
		console.log("done");	
		}
});
var j = require("jimp");
j.read("./sponsors/10.png", function(err, lenna){
console.log("executing");
	if(err) throw err;
	else{
		lenna.resize(150,150)//720x1280//4x2.5
		.write("./sponsors/10.png");
		console.log("done");	
		}
});
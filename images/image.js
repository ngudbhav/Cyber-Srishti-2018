var j = require("jimp");
j.read("udbhav.png", function(err, lenna){
	if(err) throw err;
	else{
		lenna.resize(300,360)//720x1280//4x2.5
		.write("udbhav.png");
		console.log("done");	
		}
});
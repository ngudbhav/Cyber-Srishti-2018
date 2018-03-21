var j = require("jimp");
j.read("gallery9.jpg", function(err, lenna){
console.log("executing");
	if(err) throw err;
	else{
		lenna.resize(200,200)//720x1280//4x2.5
		.write("gallery9-mini.jpg");
		console.log("done");	
		}
});
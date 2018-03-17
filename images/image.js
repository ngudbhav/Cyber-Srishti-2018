var j = require("jimp");
j.read("test.jpg", function(err, lenna){
console.log("executing");
	if(err) throw err;
	else{
		lenna.resize(413,536)//720x1280//4x2.5
		.write("test.jpg");
		console.log("done");	
		}
});
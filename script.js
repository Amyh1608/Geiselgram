var num_images = 560;
var img_idx = Math.floor(Math.random() * num_images);

function random_img_idx() {
	if(img_idx == num_images) {
		img_idx = 0;
	}

	return img_idx++;
}


var init_top = 15;
var init_left = 27;
var delta_top = 9.5;
var delta_left = 4.5;

var dims = [
	{
		width_start: 0,
		width_end: 10
	},
	{
		width_start: -3,
		width_end: 13
	},
	{
		width_start: -5,
		width_end: 15
	},
	{
		width_start: -2,
		width_end: 12
	},
	{
		width_start: 0,
		width_end: 10
	},
	{
		width_start: 3,
		width_end: 7
	}   
];

var width = 4.6;
var sixth_top = 85.4;

var pane_parent_context = document.getElementById("geisel_pane_parent");
var imagenodes = [];

for( i = 0; i < dims.length; i++ ) {
	var new_top = init_top + delta_top*i;

	if(i == 5) {
		new_top = sixth_top;
	}

	imagenodes.push([]);

	for( j = dims[i].width_start; j < dims[i].width_end; j++ ) {
		var new_left = init_left + delta_left*j;
		var imagenode = document.createElement("IMG");

		imagenode.style.position = "absolute";
		imagenode.style.top = new_top.toString() + "%";
		imagenode.style.left = new_left.toString() + "%";
		imagenode.style.width = width.toString() + "%";
		imagenode.setAttribute("src", "resources/instagram/" + random_img_idx().toString() + ".jpg");
		imagenode.setAttribute("hidden", true);

		console.log("Creating node - new_top = " + new_top.toString() + "%, left = " + new_left.toString() + "%");

		pane_parent_context.appendChild(imagenode);
		imagenodes[i].push(imagenode);
	}
}

/******************************************************************************************
	getUserMedia
	Gets permission from the user to use microphone and measures audio levels
******************************************************************************************/
var getUserMedia = (navigator.webkitGetUserMedia || navigator.getUserMedia);
getUserMedia({audio: true, video: false}, function(stream) {
	var audioContext = new (window.AudioContext || window.webkitAudioContext)(); //or webkitAudioContext
	var analyser = audioContext.createAnalyser();
	var microphone = audioContext.createMediaStreamSource(stream);
	var javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

	analyser.smoothingTimeConstant = 0.3;
	analyser.fftSize = 1024;
	
	//turn off the speakers
	var volume = audioContext.createGain();
	microphone.connect(volume);
	volume.connect(audioContext.destination);
	volume.gain.value = 0;

	microphone.connect(analyser);
	analyser.connect(javascriptNode);
	javascriptNode.connect(audioContext.destination);

	var context = document.getElementById("text");

	javascriptNode.onaudioprocess = function() {
		var array =  new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(array);
		var values = 0;

		var length = array.length;
		for (var i = 0; i < length; i++) {
			values += array[i];
		}

		var rowsshown = Math.floor(((values / length)/90)*dims.length);

		if (rowsshown > dims.length) {
			rowsshown = dims.length;
		}
		//for showing images based on sound intensity
		for(i = 0; i < rowsshown; i++) {
			for(j = 0; j < imagenodes[i].length; j++) {
				imagenodes[i][j].removeAttribute("hidden");
				imagenodes[i][j].setAttribute("src", "resources/instagram/" + random_img_idx().toString() + ".jpg");
			}
		}

		//hides images based on sound intensity
		for(i = rowsshown; i < imagenodes.length; i++){
			for(j = 0; j < imagenodes[i].length; j++){
				imagenodes[i][j].setAttribute("hidden", true);
			}
		}

		console.log(rowsshown);
	}
}, function(err) {
	console.log('error', err);
});


function textCloud(speed) {

}

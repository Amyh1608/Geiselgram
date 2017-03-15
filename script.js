/******************************************************************************************
	random_img_ind()
	Picks a random start point in the image directory and fills windows counting upwards.
******************************************************************************************/
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
	Gets permission from the user to use microphone and measures audio levels to use as an 
	input for the program. 
	-Modified with reference to Microphone Volume.
******************************************************************************************/
navigator.getUserMedia({audio: true, video: false}, function(stream) {
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

		var rowsshown = Math.floor(((values / length)/80)*dims.length); //sensitivity of the mic


		if (rowsshown > dims.length) {
			rowsshown = dims.length;
		}
		
		textCloud(rowsshown);
		//for showing images based on sound intensity
		for(i = 0; i < rowsshown; i++) {
			for(j = 0; j < imagenodes[i].length; j++) {
				if(imagenodes[i][j].hasAttribute("hidden"))
				{
					imagenodes[i][j].removeAttribute("hidden");
					imagenodes[i][j].setAttribute("src", "resources/instagram/" + random_img_idx().toString() + ".jpg");
				}
			}
		}

		//hides images based on sound intensity
		for(i = rowsshown; i < imagenodes.length; i++){
			for(j = 0; j < imagenodes[i].length; j++){
				imagenodes[i][j].setAttribute("hidden", true);
			}
		}
	}
}, function(err) {
	console.log('error', err);
});

/******************************************************************************************
	textCloud
	The textcloud will display more strings in the background based on how loud the feedback
	the mic is picking up. The text is displayed in a gradient from Red -> Yellow.
	-Modified with reference to Sidescrolling Text.
******************************************************************************************/
var context = document.getElementById("textCloud");
var counter = 0;
var animContent = [
	"#GeiselLibrary has earned a place among the top 50 most amazing college libraries in the country!",
	"#GeiselLibrary makes an appearance in the brand new #BrutalistColoringBook featuring iconic Brutalist buildings!",
	"The de-stressing activities at #GeiselLibrary continue today w/games and activities from 3-5pm in the East Commons, Study Rm 2072! ",
	'Image Preview - "Geisel Library" FULL STORY BY @zfastech360 #geisellibrary #geisel #universityofsandiego',
	"Fantastic #LEGO #MOC by #TomAlphin of the #GeiselLibrary! Love seeing our custom printed pieces on amazing LEGO creations!",
	"Lines on lines @ucsdlibrary. #GeiselLibrary #DesignInspiration #ConcreteDesign",
	"So after an hour the 5 students stuck between 2nd & 4th floor #GeiselLibrary ARE FREE AT LAST FREE AT LAST @ucsdlibrary @UCSD #UCSD",
	"Happy Birthday to long time La Jolla resident Dr. Seuss! @UCSanDiego #ReadAcrossAmerica #GeiselLibrary",
	"We're getting our party on w/@ucsdBECS in front of #GeiselLibrary come grab a cupcake until they last! #HappyBirthdayDrSeuss #UCSanDiego",
	"Special Hours: Tmrw #GeiselLibrary will be open 10am-6pm. On 2/20 Biomed will be closed & #GeiselLibrary will be open 10am-midnight.",
	"Congratulations to our friends at UCSD #GeiselLibrary for making the @Curbed list!",
	"The famous #UCSD #library. Some ppl say this beautiful building shows up in the movie #Inception (2010) #LaJolla #SanDiego #GeiselLibrary",
	"Browse all of the new additions to the #popsci collection at #GeiselLibrary located on the 2nd floor in Geisel West",
	"Now my 2nd favorite appearance of #GeiselLibrary in a book, after Vernor Vinge, _Rainbows End_. @ucsdlibrary @UCSanDiego @imagineUCSD",
	"Monday // #Architecture : UCSD research #Library, La Jolla, 1970, #WilliamPereira, renamed #GeiselLibrary after benefactor Theodor Geisel",
	"Check out this article from @AtlasObscura capturing the intricate architectural beauty of #GeiselLibrary",
	"Don't miss Short Tales from the Mothership event tonight 7:30-8:30 at the #GeiselLibrary hosted by @ucsdlibrary",
	"#FacultyFile Feature: #GeiselLibrary to undergo exciting transformation in the coming years.",
	"Please Note: #GeiselLibrary will close early at 8pm from Monday, Dec. 12 thru Thursday, Dec. 15 due to Intersession",
	"Reminder: #GeiselLibrary will open two hours later than usual tomorrow (12/11) at noon due to Intersession.",
];

function textCloud(speed) {
	var r = Math.floor(Math.random()*20);
	counter++;
	if(counter > 50 - 15*speed) //limits number of tweets on screen
	{
		counter = 0;
		shootText(animContent[r], speed);
	}
}

function shootText(animContent, animSpeed) {

	var stringnode = document.createElement("DIV");
	var stringcontent = document.createTextNode(animContent);
	var randval = Math.random();
	var textspd = (24 - animSpeed*2); //speed of text based on sound

	stringnode.style["position"] = "absolute";
	stringnode.style["animation-name"] = "sidescroll";
	stringnode.style["animation-duration"] = textspd.toString() + "s";
	stringnode.style["top"] = (randval * 95).toString() + "vh";
	stringnode.style["color"] = "rgba(" + "255" + "," + Math.floor(randval*250).toString()  + "," + Math.floor(randval*150).toString() + "," + "100)"
	stringnode.style["font-size"] = "200%";
	
	stringnode.appendChild(stringcontent);
	context.appendChild(stringnode);

	setTimeout(function() {
		context.removeChild(stringnode);
	}, 	textspd*1000 - 50);
}
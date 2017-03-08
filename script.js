var init_top = 15;
var init_left = 27;

var width = 4.6;

var delta_top = 10;
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

var sixth_top = 85.4;

var pane_parent_context = document.getElementById("geisel_pane_parent");

var img_idx = 0;

for( i = 0; i < dims.length; i++ ) {
	var new_top = init_top + delta_top*i;

	if(i == 5) {
		new_top = sixth_top;
	}

	for( j = dims[i].width_start; j < dims[i].width_end; j++ ) {
		var new_left = init_left + delta_left*j;
		var imagenode = document.createElement("IMG");

		imagenode.style.position = "absolute";
		imagenode.style.top = new_top.toString() + "%";
		imagenode.style.left = new_left.toString() + "%";
		imagenode.style.width = width.toString() + "%";
		imagenode.setAttribute("src", "resources/instagram/" + img_idx.toString() + ".jpg");

		console.log("Creating node - new_top = " + new_top.toString() + "%, left = " + new_left.toString() + "%");

		pane_parent_context.appendChild(imagenode);

		img_idx++;
	}
}

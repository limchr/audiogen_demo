var cid = 'selection_canvas'; // selection canvas id
var cs = 500; // internal canvas pixel size (for calculating background image)
var c = null;
var cctx = null

// specific variables for one generator model visualization
var models = {
	'Drums': {
		'classes': ['kick', 'hihat', 'snare'],
		'path': 'data/samples/drums',
		'num_samples': 10, // number of audio samples for x and y dimension 
		
		}
	
	
	
	} 



document.addEventListener("DOMContentLoaded", function(event) {
	c = document.getElementById(cid);
	cctx = c.getContext('2d');
	square_canvas(c);
	
	c.addEventListener('mousemove', e => {
			let mouse_xy = get_mouse_position(e);
			let relative_xy = [(mouse_xy[0]/e.target.clientWidth),(mouse_xy[1]/e.target.clientHeight)];
			relative_xy = [clamp(relative_xy[0],0.0,1.0), clamp(relative_xy[1],0.0,1.0)];
			console.log(relative_xy[0] + ' ' + relative_xy[1]);
		}, true);
});


//
// helper functions
//

// make canvas squared in shape
function square_canvas(canvas) {
    let s = canvas.clientWidth; // offsetWidth for adding the 2px borders
	canvas.style.width = s+'px';
	canvas.style.height = s+'px';
}

//change canvas image
function set_canvas_image(canvas, context, image, csize) {
	context.drawImage(image, 0, 0, csize, csize, 0, 0, canvas.clientWidth, canvas.clientHeight);
}


// padding numbers with trailing 0's
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
// padding numbers with appending 0's
function pada(num, size) {
    var s = num+"";
    while (s.length < size) s =  s+"0";
    return s;
}

// clamp numeric value
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
};

// get mouse position on canvas
function get_mouse_position(e) {
  let element = e.target, offsetX = 0, offsetY = 0, mx, my;
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }
  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  return [mx,my];
}


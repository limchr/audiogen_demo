var cid = 'selection_canvas'; // selection canvas id
var cs = 500; // internal canvas pixel size (for calculating background image)
var canvas = null;
var canvas_context = null
var svg = null;

// specific variables for one generator model visualization
var models = {
	'Drums': {
		'classes': ["tom","kick","snare","hihat","clap","synth"],
		'colors': ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff','#bbbbbb','#000000'],
		'path': 'data/models/drums',
		'num_samples': 50, // number of audio samples for x and y dimension 
	}
} 

var active_model = 'Drums';


document.addEventListener("DOMContentLoaded", function(event) {
	canvas = document.getElementById(cid);
	canvas_context = canvas.getContext('2d');
	svg = document.getElementById('selection_svg');
	let s = square_elem(canvas);
	square_elem(svg, s);
	square_elem(document.getElementById('selection_div'), s);

	svg.addEventListener('click', e => {
			let mouse_xy = get_mouse_position(e);
			let relative_xy = [(mouse_xy[0]/e.target.clientWidth),(mouse_xy[1]/e.target.clientHeight)];
			relative_xy = [clamp(relative_xy[0],0.0,0.999), clamp(relative_xy[1],0.0,0.999)];
			let sn = models[active_model].num_samples;
			let square = [Math.floor(relative_xy[0]*sn), Math.floor(relative_xy[1]*sn)];
			let wav_path = models[active_model].path + '/samples/generated_' + pad(square[0], 5) + '_' + pad(square[1], 5) + '.wav';
			console.log(mouse_xy[0] + ' ' + mouse_xy[1] + ' - ' + square[0] + ' ' + square[1] + ' ' + wav_path);
			play_wav(wav_path);
		}, true);


	// load csv file y.csv from server

	let csv_path = models[active_model].path + '/zy.csv';

	// Create an XMLHttpRequest object to load the CSV file
	const xhr = new XMLHttpRequest();
	xhr.open('GET', csv_path, true);

	// Set the callback function to handle the response
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			const data = parse_csv(xhr.responseText);

			const zx = data.map(d => parseFloat(d[0]));
			const zy = data.map(d => parseFloat(d[1]));
			const y_numeric = data.map(d => parseInt(d[2]));

			for (let i = 0; i < zx.length; i++) {
				const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
				circle.setAttribute('cx', zx[i]);
				circle.setAttribute('cy', zy[i]);
				circle.setAttribute('r', 0.01); // Set the radius of the circles

				circle.setAttribute('fill', models[active_model].colors[y_numeric[i]]);

				// Set the outline or stroke color and width
				circle.setAttribute('stroke', 'black'); // Set the outline color
				circle.setAttribute('stroke-width', 0.002); // Set the outline width



				svg.appendChild(circle);

			}

			// Create circles for each data point
			data.forEach(d => {
			});
		}
	};

	// Send the request to load the CSV file
	xhr.send();

	classesdiv = document.getElementById('classes_div');

	for (let i = 0; i < models[active_model].classes.length; i++) {
		const div = document.createElement('div');
		div.setAttribute('class', 'class_div');
		div.setAttribute('id', 'class_div_' + i);
		div.setAttribute('style', 'background-color: ' + models[active_model].colors[i+1]);
		div.innerHTML = models[active_model].classes[i];
		classesdiv.appendChild(div);
	}



	
});


//
// helper functions
//


// Function to parse CSV data
function parse_csv(csvText) {
	const lines = csvText.split('\n');
	const headers = lines[0].split(',');
	let data = [];
	for (let i = 0; i < lines.length; i++) {
		let values = lines[i].split(',');
		if(values.length != headers.length) continue;
		for (let j = 0; j < headers.length; j++) {
			values[j] = values[j].trim();
		}
		data.push(values);
	}

	return data;
}




function play_wav(path) {
  var audio = new Audio(path);
  audio.play();
}

// make html element squared in shape (s is side length (width and height, if null use width of passed element))
function square_elem(elem, s=null) {
    if(s==null) s = elem.clientWidth; // offsetWidth for adding the 2px borders
	elem.style.width = s+'px';
	elem.style.height = s+'px';
	return s;
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
  while(element !== null) {
	if (element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
		break;
	}
	element = element.parentNode;
  }
  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  return [mx,my];
}


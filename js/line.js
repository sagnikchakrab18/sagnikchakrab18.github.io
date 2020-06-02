/*Master variable*/
var width = {};
var height = {};
var paddingx = {};
var paddingy = {};
var x_division_nos = {};
var y_division_nos = {};


var datas = {};
var main_datas = {};
var instructions = {};
var path_details = {};
var current_graph_id = "" ;
var paper = null;
var elems = {};
var maxs = {};
var max_values = {};
var min_values = {};
var popup_point_xs = {};
var popup_point_ys = {};
var max_point_values = {};
var min_point_values = {};
var icon_effect_status_arrays = {};
var line_path_icon_effect_status_arrays = {};
var round_path_icon_effect_status_arrays = {};
var stepline_path_icon_effect_status_arrays = {};
var line_area_icon_effect_status_arrays = {};
var round_area_icon_effect_status_arrays = {};
var stepline_area_icon_effect_status_arrays = {};
var label_icon_effect_status_arrays = {};
var circle_icon_effect_status_arrays = {};
var graph_id = {};
var flag = {};
var sync_chart = {};


function check(data, instruction, path_detail){
	if(!graph_id[instruction.id]){
		graph_id[instruction.id] = instruction.id;	
		flag[instruction.id] = 0;
		if(data.length > 2){
			if(parseInt(instruction.path_no)==path_detail.length){
				for(var i = 0 ; i<data.length; i++){
					if(Object.keys(data[i].value).length == path_detail.length){						
						flag[instruction.id] = 1;
					}else{
						flag[instruction.id] = 0;
					}
				}
				if(flag[instruction.id] == 0){
					alert("Check the data values");
				}
			}else{
				alert("Check the path no and path details");
			}
		}else{
			alert("Give atleast 3 data");
		}
	}else{
		alert("Check the graph id");
	}
	if(flag[instruction.id] === 1){
		load_all_data(data, instruction, path_detail);				
		all_function();
	}
}
var main_data_flag = {};
//Load instruction
function load_all_data(data,  instruction, path_detail){//data_min_point = 1st array index & data_min_point = last array index
	current_graph_id = instruction.id;
	if(!main_data_flag[instruction.id]){
		main_data_flag[instruction.id] = 0;
	}
	datas[instruction.id] = data;
	instructions[instruction.id] = instruction;
	path_details[instruction.id] = path_detail;
	
	//Default paper width, height[current_graph_id]
	//Max width : 950, Max-height[current_graph_id] : 510
	//Min width : 780,  Min-height[current_graph_id] : 400
	//Max padding : 40
	//Min padding : 25
	//width[current_graph_id] = parseInt(instruction.width) > 950 ? 950 : parseInt(instruction.width) < 780 ? 780 : parseInt(instruction.width) || 950;
	//height[current_graph_id] = parseInt(instruction.height) > 510 ? 510 : parseInt(instruction.height) < 420 ? 420 : parseInt(instruction.height) || 510;
	paddingx[current_graph_id] = parseInt(instruction.paddingx) > 40 ? 40 : parseInt(instruction.paddingx) /*< 25 ? 25 : parseInt(instruction.paddingx)*/ || 40;
	paddingy[current_graph_id] = parseInt(instruction.paddingy) > 40 ? 40 : parseInt(instruction.paddingy) /*< 25 ? 25 : parseInt(instruction.paddingy)*/ || 40;
	width[current_graph_id] = parseInt(instruction.width) > (screen.width-(4*paddingx[current_graph_id])) ? (screen.width-(4*paddingx[current_graph_id])) : parseInt(instruction.width) /*< 780 ? 780 : parseInt(instruction.width)*/ || 950;
	height[current_graph_id] = parseInt(instruction.height) > (screen.height-(4*paddingy[current_graph_id])) ? (screen.height-(4*paddingy[current_graph_id])) : parseInt(instruction.height) /*< 420 ? 420 : parseInt(instruction.height)*/ || 510;
	
	if(instruction.type == "tiny"){
		width[current_graph_id] = parseInt(instruction.width) > 400 ? 400 : parseInt(instruction.width) < 1 ? 360 : parseInt(instruction.width) || 400;
		height[current_graph_id] = parseInt(instruction.height) > 235 ? 235 : parseInt(instruction.height) < 1 ? 200 : parseInt(instruction.height) || 235;
		paddingx[current_graph_id] = parseInt(instruction.paddingx) > 25 ? 25 : parseInt(instruction.paddingx) < 10 ? 10 : parseInt(instruction.paddingx) || 25;
		paddingy[current_graph_id] = parseInt(instruction.paddingy) > 25 ? 25 : parseInt(instruction.paddingy) < 10 ? 10 : parseInt(instruction.paddingy) || 25;	
	}
	x_division_nos[current_graph_id] = parseInt(instruction.x_division_no) > data.length ? (data.length > 18 ? 18 : data.length) : (parseInt(instruction.x_division_no) > 18 ? 18 : parseInt(instruction.x_division_no)) || (data.length > 18 ? 18 : data.length );
	y_division_nos[current_graph_id] = parseInt(instruction.y_division_no) > 12 ? 12 : (parseInt(instruction.y_division_no) < 2 ? 2 : parseInt(instruction.y_division_no) ) || 12;
	//max for division of y axis
	max_values[current_graph_id] = Math.max(...(Object.values(data[0].value)));
	for(var i = 0; i<data.length; i++){
		if((Math.max(...(Object.values(data[i].value))))>max_values[current_graph_id]){
			max_values[current_graph_id] = Math.max(...(Object.values(data[i].value)));
		}
	}
	min_values[current_graph_id] = 0;
	for(var i = 0; i<data.length; i++){
		if((Math.min(...(Object.values(data[i].value))))< min_values[current_graph_id]){
			min_values[current_graph_id] = Math.min(...(Object.values(data[i].value)));
		}
	}
	max = ((Math.ceil((max_values[current_graph_id]-min_values[current_graph_id])/(y_division_nos[current_graph_id]-1)))*(y_division_nos[current_graph_id]-1))+(1*(y_division_nos[current_graph_id]-1));
	maxs[current_graph_id] = max;
	//For main value
	if(main_data_flag[instruction.id] == 0){	
		create_paper();
		main_data = data;
		main_datas[current_graph_id] = data;
		//Max point
		max_point_values[current_graph_id] = Math.max(...(Object.values(main_datas[current_graph_id][0].value)));
		for(var i = 0; i<main_datas[current_graph_id].length; i++){
			if((Math.max(...(Object.values(main_datas[current_graph_id][i].value))))>max_point_values[current_graph_id]){
				max_point_values[current_graph_id] = Math.max(...(Object.values(main_datas[current_graph_id][i].value)));
			}
		}
		//Min point value
		min_point_values[current_graph_id] = Math.min(...(Object.values(main_datas[current_graph_id][0].value)));
		for(var i = 0; i<main_datas[current_graph_id].length; i++){
			if((Math.min(...(Object.values(main_datas[current_graph_id][i].value))))< min_point_values[current_graph_id]){
				min_point_values[current_graph_id] = Math.min(...(Object.values(main_datas[current_graph_id][i].value)));
			}
		}
		//For SYNC chart
		if(instruction.sync_id){
			sync_chart[current_graph_id] = instruction.sync_id;			
			for(var i = 0; i < (Object.keys(sync_chart).length); i++){
				if(instruction.sync_id == Object.values(sync_chart)[i]){
					if(datas[current_graph_id].length != datas[Object.keys(sync_chart)[i]].length){
						delete sync_chart[current_graph_id];
					}
				}
			}
		}
	}
	main_data_flag[instruction.id] = 1;
}
//Paper set
function create_paper(){
	paper = new Raphael(document.getElementById(instructions[current_graph_id].container), width[current_graph_id], height[current_graph_id]);	
	elems["paper_"+current_graph_id] = paper;
}
//All function
function all_function(){
	if(instructions[current_graph_id].main_title == true){
		main_title();
	}
	if(instructions[current_graph_id].icon == true){
		icon_design();
	}
	if(instructions[current_graph_id].x_axis == true){
		x_axis();
	}
	if(instructions[current_graph_id].x_axis_division == true){
		x_axis_division();
	}
	if(instructions[current_graph_id].x_axis_title == true){
		x_axis_title();
	}
	if(instructions[current_graph_id].x_axis_label == true){
		x_axis_label();
	}
	if(instructions[current_graph_id].y_axis == true){
		y_axis();
	}
	if(instructions[current_graph_id].y_axis_division == true){
		y_axis_division();
	}
	if(instructions[current_graph_id].y_axis_title == true){
		y_axis_title();
	}
	if(instructions[current_graph_id].y_axis_label == true){
		y_axis_label();
	}
	draw_line_area();
	draw_round_area();
	draw_stepline_area();
	draw_line_path();	
	draw_round_path();	
	draw_stepline_path();
	draw_circle();
	//Collect max data on every point for view popup on that point
	collect_popup_point();
	if(instructions[current_graph_id].x_axis_hover_design == true){
		x_axis_hover_design();
	}
	if(instructions[current_graph_id].y_axis_hover_design == true){
		y_axis_hover_design();
	}
	label();
	draw_annotations();
	if(instructions[current_graph_id].popup_design == true){
		popup_design();
	}
	if(instructions[current_graph_id].popup_footer_design == true){
		popup_footer_design();
	}
	if(instructions[current_graph_id].select_area == true){
		select_area();
	}
	//*****Draw rectangle for popup
	draw_popup_rect();
}
//All title
function main_title(){
	var position = "";
	var x = 0, y = 0;
	var text_anchor = "start";
	if(instructions[current_graph_id].main_title_position){
		position = (instructions[current_graph_id].main_title_position+"").toLowerCase() || "top-left";
	}
	if(position == "top-left"){
		x = (2*paddingx[current_graph_id]);
		y = paddingy[current_graph_id];
		text_anchor = "start";
	}
	else if(position == "top-middle"){
		x = (width[current_graph_id]/2);
		y = paddingy[current_graph_id];
		text_anchor = "middle";
	}
	else if(position == "top-right"){
		x = width[current_graph_id] -(2*paddingx[current_graph_id]);
		y = paddingy[current_graph_id];
		text_anchor = "end";
	}	
	else if(position == "bottom-left"){
		x = (2*paddingx[current_graph_id]);
		y = height[current_graph_id]-paddingy[current_graph_id];
		text_anchor = "start";
	}
	else if(position == "bottom-middle"){
		x = (width[current_graph_id]/2);
		y = height[current_graph_id]-paddingy[current_graph_id];
		text_anchor = "middle";
	}
	else if(position == "bottom-right"){
		x = width[current_graph_id] -(2*paddingx[current_graph_id]);
		y = height[current_graph_id]-paddingy[current_graph_id];
		text_anchor = "end";
	}
	else{
		x = (2*paddingx[current_graph_id]);
		y = paddingy[current_graph_id];
		text_anchor = "start";
	}
	
	elems["paper_"+current_graph_id].text(x, y, instructions[current_graph_id].title).attr({
		'font-weight' : 'bold',
		'text-anchor': text_anchor,
		'font-size' : instructions[current_graph_id].main_title_font_size || '15px',
		fill : instructions[current_graph_id].main_title_color || "#000",
	});
	
}
//Icon design
function icon_design(){
	var icon_effect_status_array = [];
	var line_path_icon_effect_status_array = [];
	var round_path_icon_effect_status_array = [];
	var stepline_path_icon_effect_status_array = [];
	var line_area_icon_effect_status_array = [];
	var round_area_icon_effect_status_array = [];
	var stepline_area_icon_effect_status_array = [];
	var label_icon_effect_status_array = [];
	var circle_icon_effect_status_array = [];
	var position = "";
	if(instructions[current_graph_id].icon_position){
		position = (instructions[current_graph_id].icon_position+"").toLowerCase() || "top-right";
	}
	var x = 0, y = 0;
	var text_x = 0, text_y = 0, text_width = 0;
	var	circle_x = 0, circle_y = 0;
	var	rect_x = 0, rect_y = 0 , rect_y_width = 0;
	var total_length = 0 , length = 0;
	//For get the icon's total length
	for(var i = 0; i < path_details[current_graph_id].length; i++){		
		var text = elems["paper_"+current_graph_id].text(0, 0, path_details[current_graph_id][i].name).attr({
			'font-weight' : 'bold',
			'text-anchor': 'start',
			'font-size' : '13px',
			opacity : 0,
		});
		text_width = text.getBBox().width;
		text.remove();
		total_length += 15 + text_width +5;
	}
	//Draw icon
	for(var i = 0; i < path_details[current_graph_id].length; i++){
		if(position == "top-right"){
			x = width[current_graph_id] - (2*paddingx[current_graph_id]) - total_length;
			y =(1*paddingy[current_graph_id]);
			circle_x = x + length + 5;
			circle_y = y;
			icon_circle();
			text_x = 5 + 10 + x + length;
			text_y = y;
			text_width = icon_text();
			rect_x =  x + length;
			rect_y = y - (18/2);
			rect_width = 15 + text_width;
			icon_rect();
			length += rect_width +5;
		}
		else if(position == "top-middle"){
			x = (width[current_graph_id]/2) - (total_length/2);
			y =(1*paddingy[current_graph_id]);
			circle_x = x + length + 5;
			circle_y = y;
			icon_circle();
			text_x = 5 + 10 + x + length;
			text_y = y;
			text_width = icon_text();
			rect_x =  x + length;
			rect_y = y - (18/2);
			rect_width = 15 + text_width;
			icon_rect();
			length += rect_width +5;
		}
		else if(position == "top-left"){
			x = 2*paddingx[current_graph_id];
			y =(1*paddingy[current_graph_id]);
			circle_x = x + length + 5;
			circle_y = y;
			icon_circle();
			text_x = 5 + 10 + x + length;
			text_y = y;
			text_width = icon_text();
			rect_x =  x + length;
			rect_y = y - (18/2);
			rect_width = 15 + text_width;
			icon_rect();
			length += rect_width +5;
		}	
		else if(position == "bottom-right"){
			x = width[current_graph_id] - (2*paddingx[current_graph_id]) - total_length
			y =(height[current_graph_id] - (1*paddingy[current_graph_id]));
			circle_x = x + length + 5;
			circle_y = y;
			icon_circle();
			text_x = 5 + 10 + x + length;
			text_y = y;
			text_width = icon_text();
			rect_x =  x + length;
			rect_y = y - (18/2);
			rect_width = 15 + text_width;
			icon_rect();
			length += rect_width +5;
		}
		else if(position == "bottom-middle"){
			x = (width[current_graph_id]/2) - (total_length/2);
			y =(height[current_graph_id] - (1*paddingy[current_graph_id]));
			circle_x = x + length + 5;
			circle_y = y;
			icon_circle();
			text_x = 5 + 10 + x + length;
			text_y = y;
			text_width = icon_text();
			rect_x =  x + length;
			rect_y = y - (18/2);
			rect_width = 15 + text_width;
			icon_rect();
			length += rect_width +5;
		}
		else if(position == "bottom-left"){
			x = 2*paddingx[current_graph_id];
			y =(height[current_graph_id] - (1*paddingy[current_graph_id]));
			circle_x = x + length + 5;
			circle_y = y;
			icon_circle();
			text_x = 5 + 10 + x + length;
			text_y = y;
			text_width = icon_text();
			rect_x =  x + length;
			rect_y = y - (18/2);
			rect_width = 15 + text_width;
			icon_rect();
			length += rect_width +5;
		}
		else{
			x = width[current_graph_id] - (2*paddingx[current_graph_id]) - total_length;
			y =(1*paddingy[current_graph_id]);
			circle_x = x + length + 5;
			circle_y = y;
			icon_circle();
			text_x = 5 + 10 + x + length;
			text_y = y;
			text_width = icon_text();
			rect_x =  x + length;
			rect_y = y - (18/2);
			rect_width = 15 + text_width;
			icon_rect();
			length += rect_width +5;
		}
		function icon_text(){
			var text = elems["paper_"+current_graph_id].text(text_x, text_y, path_details[current_graph_id][i].name).attr({
				'font-weight' : 'bold',
				'text-anchor': 'start',
				'font-size' : '13px',
				fill : path_details[current_graph_id][i].color,
			});
			return text.getBBox().width;
		}
		function icon_circle(){
			var circle = elems["paper_"+current_graph_id].circle(circle_x , circle_y, 5).attr({
				fill : path_details[current_graph_id][i].color,
				stroke : path_details[current_graph_id][i].color,
			});
		}
		function icon_rect(){
			var rect = elems["paper_"+current_graph_id].rect(rect_x, rect_y, rect_width , 18).attr({
				fill : '#ff0000',
				opacity : 0,
				cursor : 'pointer',
			});
			rect.node.id = "icon_"+current_graph_id+"_"+i;
			rect.node.addEventListener('click', icon_effect_click);
			rect.node.addEventListener('mouseover', icon_effect_mouseover);
			rect.node.addEventListener('mouseout', icon_effect_mouseout);
			icon_effect_status_array.push(0);
			elems["icon_"+current_graph_id+"_"+i] = rect;
		}
	}
	icon_effect_status_arrays[current_graph_id] = icon_effect_status_array;///////////For icon effect changes*/
	
	for(var i = 0; i < parseInt(instructions[current_graph_id].path_no); i++){
		line_path_icon_effect_status_array.push(0);
		round_path_icon_effect_status_array.push(0);
		stepline_path_icon_effect_status_array.push(0);
		line_area_icon_effect_status_array.push(0);
		round_area_icon_effect_status_array.push(0);
		stepline_area_icon_effect_status_array.push(0);
		label_icon_effect_status_array.push(0);
		circle_icon_effect_status_array.push(0);
	}
	line_path_icon_effect_status_arrays[current_graph_id] = line_path_icon_effect_status_array;
	round_path_icon_effect_status_arrays[current_graph_id] = round_path_icon_effect_status_array;
	stepline_path_icon_effect_status_arrays[current_graph_id] = stepline_path_icon_effect_status_array;
	line_area_icon_effect_status_arrays[current_graph_id] = line_area_icon_effect_status_array;
	round_area_icon_effect_status_arrays[current_graph_id] = round_area_icon_effect_status_array;
	stepline_area_icon_effect_status_arrays[current_graph_id] = stepline_area_icon_effect_status_array;
	label_icon_effect_status_arrays[current_graph_id] = label_icon_effect_status_array;
	circle_icon_effect_status_arrays[current_graph_id] = circle_icon_effect_status_array;
}

//Icon click effect
function icon_effect_click(){
	var id = this.id.replace('icon_', '');
	var res = id.split("_");
	id = parseInt(res[1]);
	var graph_id = res[0];
	//id = (path_details[graph_id].length-1) - id;
	//Icon effect
	if(icon_effect_status_arrays[graph_id][id] == 0){
		elems["icon_"+graph_id+"_"+(id)].attr({
			fill : "#fff",
			stroke : "#fff",
			opacity : .6,
		});
		icon_effect_status_arrays[graph_id][id] = 1;
		
	}else{
		elems["icon_"+graph_id+"_"+(id)].attr({
			opacity : 0,
		});
		icon_effect_status_arrays[graph_id][id] = 0;
	}
	//For Line path
	for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
		if(i == id){
			if(line_path_icon_effect_status_arrays[graph_id][id] == 0){
				line_path_icon_effect_status_arrays[graph_id][id] = 1;
				if(elems["line_path_"+graph_id+"_"+i]){
					elems["line_path_"+graph_id+"_"+i].animate({
						opacity: 0,
					});
				}
				for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
					if(i != id && line_path_icon_effect_status_arrays[graph_id][i] == 0){
						if(elems["line_path_"+graph_id+"_"+i]){
							elems["line_path_"+graph_id+"_"+i].animate({
								opacity: 1,
							});
						}
					}
				}
			}
			else{
				line_path_icon_effect_status_arrays[graph_id][id] = 0;
				if(elems["line_path_"+graph_id+"_"+i]){
					elems["line_path_"+graph_id+"_"+i].animate({
						opacity: 1,
					});
				}
			}
		}
	}
	//For Round path
	for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
		if(i == id){
			if(round_path_icon_effect_status_arrays[graph_id][id] == 0){
				round_path_icon_effect_status_arrays[graph_id][id] = 1;
				if(elems["round_path_"+graph_id+"_"+i]){
					elems["round_path_"+graph_id+"_"+i].animate({
						opacity: 0,
					});
				}
				for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
					if(i != id && round_path_icon_effect_status_arrays[graph_id][i] == 0){
						if(elems["round_path_"+graph_id+"_"+i]){
							elems["round_path_"+graph_id+"_"+i].animate({
								opacity: 1,
							});
						}
					}
				}
			}
			else{
				round_path_icon_effect_status_arrays[graph_id][id] = 0;
				if(elems["round_path_"+graph_id+"_"+i]){
					elems["round_path_"+graph_id+"_"+i].animate({
						opacity: 1,
					});
				}
			}
		}
	}
	//For stepline path
	for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
		if(i == id){
			if(stepline_path_icon_effect_status_arrays[graph_id][id] == 0){
				stepline_path_icon_effect_status_arrays[graph_id][id] = 1;
				if(elems["stepline_path_"+graph_id+"_"+i]){
					elems["stepline_path_"+graph_id+"_"+i].animate({
						opacity: 0,
					});
				}
				for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
					if(i != id && stepline_path_icon_effect_status_arrays[graph_id][i] == 0){
						if(elems["stepline_path_"+graph_id+"_"+i]){
							elems["stepline_path_"+graph_id+"_"+i].animate({
								opacity: 1,
							});
						}
					}
				}
			}
			else{
				stepline_path_icon_effect_status_arrays[graph_id][id] = 0;
				if(elems["stepline_path_"+graph_id+"_"+i]){
					elems["stepline_path_"+graph_id+"_"+i].animate({
						opacity: 1,
					});
				}
			}
		}
	}
	//For Line area
	for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
		if(i == id){
			if(line_area_icon_effect_status_arrays[graph_id][id] == 0){
				line_area_icon_effect_status_arrays[graph_id][id] = 1;
				if(elems["line_area_"+graph_id+"_"+i]){
					elems["line_area_"+graph_id+"_"+i].attr({
						fill : "#fff",
						opacity: 0,
					});
				}
				for(var j = 0; j < parseInt(instructions[graph_id].path_no); j++){
					if(j != id && line_area_icon_effect_status_arrays[graph_id][j] == 0){
						if(elems["line_area_"+graph_id+"_"+j]){
							elems["line_area_"+graph_id+"_"+j].attr({
								fill : "270-"+path_details[graph_id][j].color+"-#fff",
								opacity: .1,
							});
						}
					}
				}
			}
			else{
				line_area_icon_effect_status_arrays[graph_id][id] = 0;
				if(elems["line_area_"+graph_id+"_"+i]){
					elems["line_area_"+graph_id+"_"+i].attr({
						fill : "270-"+path_details[graph_id][i].color+"-#fff",
						opacity: .1,
					});
				}
			}
		}
	}
	//For Round area
	for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
		if(i == id){
			if(round_area_icon_effect_status_arrays[graph_id][id] == 0){
				round_area_icon_effect_status_arrays[graph_id][id] = 1;
				if(elems["round_area_"+graph_id+"_"+i]){
					elems["round_area_"+graph_id+"_"+i].attr({
						fill : "#fff",
						opacity: 0,
					});
				}
				for(var j = 0; j < parseInt(instructions[graph_id].path_no); j++){
					if(j != id && round_area_icon_effect_status_arrays[graph_id][j] == 0){
						if(elems["round_area_"+graph_id+"_"+j]){
							elems["round_area_"+graph_id+"_"+j].attr({
								fill : "270-"+path_details[graph_id][j].color+"-#fff",
								opacity: .1,
							});
						}
					}
				}
			}
			else{
				round_area_icon_effect_status_arrays[graph_id][id] = 0;
				if(elems["round_area_"+graph_id+"_"+i]){
					elems["round_area_"+graph_id+"_"+i].attr({
						fill : "270-"+path_details[graph_id][i].color+"-#fff",
						opacity: 0.1,
					});
				}
			}
		}
	}
	//For Stepline area
	for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
		if(i == id){
			if(stepline_area_icon_effect_status_arrays[graph_id][id] == 0){
				stepline_area_icon_effect_status_arrays[graph_id][id] = 1;
				if(elems["stepline_area_"+graph_id+"_"+i]){
					elems["stepline_area_"+graph_id+"_"+i].attr({
						fill : "#fff",
						opacity: 0,
					});
				}
				for(var j = 0; j < parseInt(instructions[graph_id].path_no); j++){
					if(j != id && stepline_area_icon_effect_status_arrays[graph_id][j] == 0){
						if(elems["stepline_area_"+graph_id+"_"+j]){
							elems["stepline_area_"+graph_id+"_"+j].attr({
								fill : "270-"+path_details[graph_id][j].color+"-#fff",
								opacity: 0.1,
							});
						}
					}
				}
			}
			else{
				stepline_area_icon_effect_status_arrays[graph_id][id] = 0;
				if(elems["stepline_area_"+graph_id+"_"+i]){
					elems["stepline_area_"+graph_id+"_"+i].attr({
						fill : "270-"+path_details[graph_id][i].color+"-#fff",
						opacity: 0.1,
					});
				}
			}
		}
	}
	//For Circle
	
	for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
		if(i == id){
			if(circle_icon_effect_status_arrays[graph_id][id] == 0){
				circle_icon_effect_status_arrays[graph_id][id] = 1;					
				for(var k =0;k< datas[graph_id].length ; k++){
					if(elems["c_"+graph_id+"_"+i+""+k]){
						elems["c_"+graph_id+"_"+i+""+k].attr({
							fill : "#fff",
							opacity: 0,
						});
					}
					for(var j = 0; j < parseInt(instructions[graph_id].path_no); j++){
						if(j != id && circle_icon_effect_status_arrays[graph_id][j] == 0){
							if(elems["c_"+graph_id+"_"+j+""+k]){
								elems["c_"+graph_id+"_"+j+""+k].attr({
									fill : path_details[graph_id][j].color,
									opacity: 1,
								});
							}
						}
					}
				}
			}
			else{
				circle_icon_effect_status_arrays[graph_id][id] = 0;
				for(var k =0;k< datas[graph_id].length; k++){
					if(elems["c_"+graph_id+"_"+i+""+k]){
						elems["c_"+graph_id+"_"+i+""+k].attr({
							fill : path_details[graph_id][i].color,
							opacity: 1,
						});
					}
				}
			}
		}
	}
	//For Label	
	for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
		if(i == id){
			if(label_icon_effect_status_arrays[graph_id][id] == 0){
				label_icon_effect_status_arrays[graph_id][id] = 1;
				var m = 0;
				for(var k =0;m< datas[graph_id].length ; k++){
					if(elems["label_rect_"+graph_id+"_"+i+""+k]){
						elems["label_rect_"+graph_id+"_"+i+""+k].attr({
							fill : "#fff",
							opacity: 0,
						});
					}
					if(elems["label_text_"+graph_id+"_"+i+""+k]){
						elems["label_text_"+graph_id+"_"+i+""+k].animate({
							//fill : path_details[graph_id][i].color,
							opacity: 0,
						});
					}
					for(var j = 0; j < parseInt(instructions[graph_id].path_no); j++){
						if(j != id && label_icon_effect_status_arrays[graph_id][j] == 0){
							if(elems["label_rect_"+graph_id+"_"+j+""+k]){
								elems["label_rect_"+graph_id+"_"+j+""+k].attr({
									fill : path_details[graph_id][j].color,
									opacity: 1,
								});
							}
							if(elems["label_text_"+graph_id+"_"+j+""+k]){
								elems["label_text_"+graph_id+"_"+j+""+k].animate({
									//fill : path_details[graph_id][i].color,
									opacity: 1,
								});
							}
						}
					}
					m = m + (Math.ceil(datas[graph_id].length/(x_division_nos[graph_id])));
				}
			}
			else{
				label_icon_effect_status_arrays[graph_id][id] = 0;
				var m = 0;
				for(var k =0;m< datas[graph_id].length; k++){
					if(elems["label_rect_"+graph_id+"_"+i+""+k]){
						elems["label_rect_"+graph_id+"_"+i+""+k].attr({
							fill : path_details[graph_id][i].color,
							opacity: 1,
						});
					}
					if(elems["label_text_"+graph_id+"_"+i+""+k]){
						elems["label_text_"+graph_id+"_"+i+""+k].animate({
							//fill : path_details[graph_id][i].color,
							opacity: 1,
						});
					}
					m = m + (Math.ceil(datas[graph_id].length/(x_division_nos[graph_id])));
				}
			}
		}
	}
}

//Icon mouseover effect
function icon_effect_mouseover(){
	var id = this.id.replace('icon_', '');
	var res = id.split("_");
	id = parseInt(res[1]);
	var graph_id = res[0];
	//id = (path_details[graph_id].length-1) - id;
	var c = 0;
	for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
		if(line_path_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(round_path_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(stepline_path_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(line_area_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(round_area_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(stepline_area_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(circle_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(label_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
	}
	if(c == 0){
		
		//For line path
	
		for(var i = 0; i< parseInt(instructions[graph_id].path_no); i++){
			if(id != i){
				if(elems["line_path_"+graph_id+"_"+i]){
					elems["line_path_"+graph_id+"_"+i].animate({
						opacity: 0.1,
					});
				}
			}
		}
		
		//For round path		
		for(var i = 0; i< parseInt(instructions[graph_id].path_no); i++){
			if(id != i){
				if(elems["round_path_"+graph_id+"_"+i]){
					elems["round_path_"+graph_id+"_"+i].animate({
						opacity: 0.1,
					});
				}
			}
		}
		
		//For stepline path
		for(var i = 0; i< parseInt(instructions[graph_id].path_no); i++){
			if(id != i){
				if(elems["stepline_path_"+graph_id+"_"+i]){
					elems["stepline_path_"+graph_id+"_"+i].animate({
						opacity: 0.1,
					});
				}
			}
		}
		
		//For line area
		for(var i = 0; i< parseInt(instructions[graph_id].path_no); i++){
			if(id != i){
				if(elems["line_area_"+graph_id+"_"+i]){
					elems["line_area_"+graph_id+"_"+i].animate({
						fill : "#fff",
						opacity: 0.1,
					});
				}
			}
		}
		
		//For round area		
		for(var i = 0; i< parseInt(instructions[graph_id].path_no); i++){
			if(id != i){
				if(elems["round_area_"+graph_id+"_"+i]){
					elems["round_area_"+graph_id+"_"+i].attr({
						fill : "#fff",
						opacity: 0.1,
					});
				}
			}
		}
			
		//For stepline area
		for(var i = 0; i< parseInt(instructions[graph_id].path_no); i++){
			if(id != i){
				if(elems["stepline_area_"+graph_id+"_"+i]){
					elems["stepline_area_"+graph_id+"_"+i].attr({
						fill : "#fff",
						opacity: 0.1,
					});
				}
			}
		}
			
		//For Circle
		for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
			if(id != i){					
				for(var k =0;k< datas[graph_id].length ; k++){
					if(elems["c_"+graph_id+"_"+i+""+k]){
						elems["c_"+graph_id+"_"+i+""+k].animate({
							fill : path_details[graph_id][i].color,
							opacity: 0.1,
						});
					}
				}
			}
		}
			
		//For Label
		for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
			if(id != i){
				var m = 0;
				for(var k =0;m< datas[graph_id].length ; k++){
					
					if(elems["label_rect_"+graph_id+"_"+i+""+k]){
						elems["label_rect_"+graph_id+"_"+i+""+k].animate({
							opacity: 0.05,
						});
					}
					if(elems["label_text_"+graph_id+"_"+i+""+k]){
						elems["label_text_"+graph_id+"_"+i+""+k].animate({
							opacity: 0.05,
						});
					}
					m = m + (Math.ceil(datas[graph_id].length/(x_division_nos[graph_id])));
				}
			}
		}
	}
}


//Icon mouseout effect
function icon_effect_mouseout(){
	var id = this.id.replace('icon_', '');
	var res = id.split("_");
	id = parseInt(res[1]);
	var graph_id = res[0];
	//id = (path_details[graph_id].length-1) - id;
	var c = 0;
	for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
		if(line_path_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(round_path_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(stepline_path_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(line_area_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(round_area_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(stepline_area_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(circle_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
		if(label_icon_effect_status_arrays[graph_id][i] == 1){
			c++;
		}
	}
	if(c == 0){
		//For line path
		
		for(var i = 0; i< parseInt(instructions[graph_id].path_no); i++){
			if(elems["line_path_"+graph_id+"_"+i]){
				elems["line_path_"+graph_id+"_"+i].animate({
					opacity: 1,
				});
			}
		}
		
		//For round path
		for(var i = 0; i< parseInt(instructions[graph_id].path_no); i++){
			if(elems["round_path_"+graph_id+"_"+i]){
				elems["round_path_"+graph_id+"_"+i].animate({
					opacity: 1,
				});
			}
		}
		
		//For stepline path		
		for(var i = 0; i< parseInt(instructions[graph_id].path_no); i++){
			if(elems["stepline_path_"+graph_id+"_"+i]){
				elems["stepline_path_"+graph_id+"_"+i].animate({
					opacity: 1,
				});
			}
		}
		
		//For line area
		for(var i = 0; i< parseInt(instructions[graph_id].path_no); i++){
			if(elems["line_area_"+graph_id+"_"+i]){
				elems["line_area_"+graph_id+"_"+i].animate({
					opacity: 0.1,
					fill : "270-"+path_details[graph_id][i].color+"-#fff",
				});
			}
		}
			
		//For round area
		for(var i = 0; i< parseInt(instructions[graph_id].path_no); i++){
			if(elems["round_area_"+graph_id+"_"+i]){
				elems["round_area_"+graph_id+"_"+i].animate({
					opacity: 0.1,
					fill : "270-"+path_details[graph_id][i].color+"-#fff",
				});
			}
		}
			
		//For stepline area
		for(var i = 0; i< parseInt(instructions[graph_id].path_no); i++){
			if(elems["stepline_area_"+graph_id+"_"+i]){
				elems["stepline_area_"+graph_id+"_"+i].animate({
					opacity: 0.1,
					fill : "270-"+path_details[graph_id][i].color+"-#fff",
				});
			}
		}
			
		//For circle
		for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
			for(var k =0;k< datas[graph_id].length ; k++){
				if(elems["c_"+graph_id+"_"+i+""+k]){
					elems["c_"+graph_id+"_"+i+""+k].animate({
						fill : path_details[graph_id][i].color,
						opacity: 1,
					});
				}
			}
		}
			
		//For Label
		for(var i = 0; i < parseInt(instructions[graph_id].path_no); i++){
			var m = 0;
			for(var k =0;m< datas[graph_id].length ; k++){
				if(elems["label_rect_"+graph_id+"_"+i+""+k]){
					elems["label_rect_"+graph_id+"_"+i+""+k].animate({
						fill : path_details[graph_id][i].color,
						opacity: 1,
					});
				}
				if(elems["label_text_"+graph_id+"_"+i+""+k]){
					elems["label_text_"+graph_id+"_"+i+""+k].animate({
						//fill : path_details[graph_id][i].color,
						opacity: 1,
					});
				}
				m = m + (Math.ceil(datas[graph_id].length/(x_division_nos[graph_id])));
			}
		}
	}
}

//x axis title
function x_axis_title(){
	var position = "";
	if(instructions[current_graph_id].x_axis_position){
		position = (instructions[current_graph_id].x_axis_position+"").toLowerCase() || "bottom";
	}
	if(position == "top"){
		elems["paper_"+current_graph_id].text(width[current_graph_id]/2, 1.25*paddingy[current_graph_id], instructions[current_graph_id].x_axis_name);
	}
	else{
		elems["paper_"+current_graph_id].text(width[current_graph_id]/2, height[current_graph_id]-(1.25*paddingy[current_graph_id]), instructions[current_graph_id].x_axis_name);
	}
}


//Draw x axis
function x_axis(){
	var position = "";
	if(instructions[current_graph_id].x_axis_position){
		position = (instructions[current_graph_id].x_axis_position+"").toLowerCase() || "bottom";
	}
	if(0 > min_values[current_graph_id]){
		elems["paper_"+current_graph_id].path("M " + (2*paddingx[current_graph_id]) + " " + ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(0 - min_values[current_graph_id]))/maxs[current_graph_id]) + "l "+ (width[current_graph_id] - (4*paddingx[current_graph_id])) + " 0").attr({
			stroke : instructions[current_graph_id].axis_color || "#9d9d9d",
		});
	}else{
		if(position == "top"){
			elems["paper_"+current_graph_id].path("M " + (2*paddingx[current_graph_id]) + " " + ( (2*paddingy[current_graph_id]) ) + "l "+ (width[current_graph_id] - (4*paddingx[current_graph_id])) + " 0").attr({
				stroke : instructions[current_graph_id].axis_color || "#9d9d9d",
			});
		}else{
			elems["paper_"+current_graph_id].path("M " + (2*paddingx[current_graph_id]) + " " + ( (height[current_graph_id]-(2*paddingy[current_graph_id])) ) + "l "+ (width[current_graph_id] - (4*paddingx[current_graph_id])) + " 0").attr({
				stroke : instructions[current_graph_id].axis_color || "#9d9d9d",
			});
		}
	}
}
//y axis title
function y_axis_title(){
	var position = "";
	if(instructions[current_graph_id].y_axis_position){
		position = (instructions[current_graph_id].y_axis_position+"").toLowerCase() || "left";
	}
	if(position == "right"){
		elems["paper_"+current_graph_id].text(width[current_graph_id]-paddingx[current_graph_id], height[current_graph_id]/2, instructions[current_graph_id].y_axis_name).attr({
			transform : "r270",
		});	
	}
	else{
		elems["paper_"+current_graph_id].text(paddingx[current_graph_id], height[current_graph_id]/2, instructions[current_graph_id].y_axis_name).attr({
			transform : "r270",
		});	
	}
}
//Draw y axis
function y_axis(){
	var position = "";
	if(instructions[current_graph_id].y_axis_position){
		position = (instructions[current_graph_id].y_axis_position+"").toLowerCase() || "left";
	}
	if(position == "right"){
		elems["paper_"+current_graph_id].path("M " + (width[current_graph_id]-(2*paddingx[current_graph_id])) + " " + (2*paddingy[current_graph_id]) +" l  0 " + (height[current_graph_id]-(4*paddingy[current_graph_id])) ).attr({
			stroke : instructions[current_graph_id].axis_color || "#9d9d9d",
		});
	}else{
		elems["paper_"+current_graph_id].path("M " + (2*paddingx[current_graph_id]) + " " + (2*paddingy[current_graph_id]) +" l  0 " + (height[current_graph_id]-(4*paddingy[current_graph_id])) ).attr({
			stroke : instructions[current_graph_id].axis_color || "#9d9d9d",
		});
	}
}

/* x */
/* x axis division */
function x_axis_division(){
	var j = 0;
	for(var i = 0; j< datas[current_graph_id].length; i++){	
		elems["paper_"+current_graph_id].path("M " + ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*j) + " "+ (height[current_graph_id] - (2*paddingy[current_graph_id])) + " l 0 " + (-(height[current_graph_id]-(4*paddingy[current_graph_id]))) ).attr({
			stroke : "#cdcdcd",
			opacity : .8,
		});
		j = j + (Math.ceil(datas[current_graph_id].length/(x_division_nos[current_graph_id])));
	}
}
/* x axis label */
function x_axis_label(){
	var j = 0;		
	var position = "";
	if(instructions[current_graph_id].x_axis_position){
		position = (instructions[current_graph_id].x_axis_position+"").toLowerCase() || "bottom";
	}
	for(var i = 0; j< datas[current_graph_id].length; i++){	
		if(position == "top"){
			elems["paper_"+current_graph_id].path( "M " + ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*j) + " "+ ((2*paddingy[current_graph_id])) + " l 0 -3" ).attr({
				stroke : instructions[current_graph_id].axis_color || "#9d9d9d",
			});
			if(x_division_nos[current_graph_id]>15){
				elems["paper_"+current_graph_id].text(((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*j) , (height[current_graph_id] - (1.5*paddingy[current_graph_id])), datas[current_graph_id][j].month).attr({
					fill : instructions[current_graph_id].axis_color || "#9d9d9d",
					transform : "r325",
				});
			}else{
				elems["paper_"+current_graph_id].text(((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*j) , ((1.5*paddingy[current_graph_id])), datas[current_graph_id][j].month).attr({
					fill : instructions[current_graph_id].axis_color || "#9d9d9d",
				});
			}
		}else{
			elems["paper_"+current_graph_id].path( "M " + ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*j) + " "+ (height[current_graph_id] - (2*paddingy[current_graph_id])) + " l 0 3" ).attr({
				stroke : instructions[current_graph_id].axis_color || "#9d9d9d",
			});
			if(x_division_nos[current_graph_id]>15){
				elems["paper_"+current_graph_id].text(((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*j) , (height[current_graph_id] - (1.5*paddingy[current_graph_id])), datas[current_graph_id][j].month).attr({
					fill : instructions[current_graph_id].axis_color || "#9d9d9d",
					transform : "r325",
				});
			}else{
				elems["paper_"+current_graph_id].text(((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*j) , (height[current_graph_id] - (1.5*paddingy[current_graph_id])), datas[current_graph_id][j].month).attr({
					fill : instructions[current_graph_id].axis_color || "#9d9d9d",
				});
			}
		}
		j = j + (Math.ceil(datas[current_graph_id].length/(x_division_nos[current_graph_id])));		
	}
}

/* y */
function y_axis_division(){
				
	for(var i = 0 ; i<y_division_nos[current_graph_id] ; i++){		
		elems["paper_"+current_graph_id].path( "M "+ 2*paddingx[current_graph_id] +" " + ( (height[current_graph_id]-(2*paddingy[current_graph_id]))-((height[current_graph_id]-(4*paddingy[current_graph_id]))/(y_division_nos[current_graph_id]-1))*i ) + " l "+  (width[current_graph_id]-(4*paddingx[current_graph_id])) +" 0").attr({
			stroke : "#cdcdcd",
			opacity : .5,
		});
	}
}
/* y axis label */
function y_axis_label(){
	var position = "";
	if(instructions[current_graph_id].y_axis_position){
		position = (instructions[current_graph_id].y_axis_position+"").toLowerCase() || "left";
	}
	for(var i = 0 ; i<y_division_nos[current_graph_id] ; i++){
		if(position == "right"){
			elems["paper_"+current_graph_id].path( "M "+ (width[current_graph_id] - 2*paddingx[current_graph_id]) +" " + ( (height[current_graph_id]-(2*paddingy[current_graph_id]))-((height[current_graph_id]-(4*paddingy[current_graph_id]))/(y_division_nos[current_graph_id]-1))*i ) + " l 3 0").attr({
				stroke : instructions[current_graph_id].axis_color || "#9d9d9d",
			});
			elems["paper_"+current_graph_id].text((width[current_graph_id] -2*paddingx[current_graph_id] + 5), (height[current_graph_id]-(2*paddingy[current_graph_id]))-((height[current_graph_id]-(4*paddingy[current_graph_id]))/(y_division_nos[current_graph_id]-1))*i, number_format(((maxs[current_graph_id]/(y_division_nos[current_graph_id]-1))*i)+min_values[current_graph_id])).attr({
				fill : instructions[current_graph_id].axis_color || "#9d9d9d",
				'text-anchor' : "start",
			});	
		}else{
			elems["paper_"+current_graph_id].path( "M "+ 2*paddingx[current_graph_id] +" " + ( (height[current_graph_id]-(2*paddingy[current_graph_id]))-((height[current_graph_id]-(4*paddingy[current_graph_id]))/(y_division_nos[current_graph_id]-1))*i ) + " l -3 0").attr({
				stroke : instructions[current_graph_id].axis_color || "#9d9d9d",
			});
			elems["paper_"+current_graph_id].text(2*paddingx[current_graph_id] - 5, (height[current_graph_id]-(2*paddingy[current_graph_id]))-((height[current_graph_id]-(4*paddingy[current_graph_id]))/(y_division_nos[current_graph_id]-1))*i, number_format(((maxs[current_graph_id]/(y_division_nos[current_graph_id]-1))*i)+min_values[current_graph_id])).attr({
				fill : instructions[current_graph_id].axis_color || "#9d9d9d",
				'text-anchor' : "end",
			});	
		}	
	}
}
//Draw path
function draw_line_path(){
	for(var i = 0; i < parseInt(instructions[current_graph_id].path_no); i++){
		for(var x = 0; x<path_details[current_graph_id][i].type.length; x++){
			if(path_details[current_graph_id][i].type[x] == "line_path"){
				p = "M "+ (2*paddingx[current_graph_id]) + " "+ ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(0 - min_values[current_graph_id]))/maxs[current_graph_id]) + " ";
				for(var j = 1; j < datas[current_graph_id].length ; j++){
					p += " l "+ (width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1) + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*0)/maxs[current_graph_id] + "";
				}
				var path1 = elems["paper_"+current_graph_id].path(p).attr({
					'stroke-width' : path_details[current_graph_id][i].stroke[x],
					stroke : path_details[current_graph_id][i].color,
					opacity : 1,
				});
				elems["line_path_"+current_graph_id+"_"+i] = path1;
				
				p = "M "+ (2*paddingx[current_graph_id]) + " "+ ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(Object.values(datas[current_graph_id][0].value)[i] - min_values[current_graph_id]))/maxs[current_graph_id]) + " ";
				for(var j = 1; j < datas[current_graph_id].length ; j++){
					p += " l "+ (width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1) + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(Object.values(datas[current_graph_id][j-1].value)[i] - Object.values(datas[current_graph_id][j].value)[i]))/maxs[current_graph_id] + "";
				}
				elems["line_path_"+current_graph_id+"_"+i].animate({
					path : p,
				}, 400 + (150*i), "<>" );
			}
		}
	}
}
//Draw round path
function draw_round_path(){
	for(var i = 0; i < parseInt(instructions[current_graph_id].path_no); i++){
		for(var x = 0; x<path_details[current_graph_id][i].type.length; x++){
			if(path_details[current_graph_id][i].type[x] == "round_path"){
				p = "M "+ (2*paddingx[current_graph_id]) + " "+ ((height[current_graph_id] - (2*paddingy[current_graph_id])) - ((0   - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id]))) + " R ";
				for(var j = 1; j < datas[current_graph_id].length ; j++){
					p += ", "+ ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ", "+ ((height[current_graph_id] - (2*paddingy[current_graph_id])) - ((0 - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id]))) + " ";
				}
				var path1 = elems["paper_"+current_graph_id].path(p).attr({
					'stroke-width' : path_details[current_graph_id][i].stroke[x],
					stroke : path_details[current_graph_id][i].color,
					opacity : 1,
				});
				elems["round_path_"+current_graph_id+"_"+i] = path1;
				p = "M "+ (2*paddingx[current_graph_id]) + " "+ ((height[current_graph_id] - (2*paddingy[current_graph_id])) - ((Object.values(datas[current_graph_id][0].value)[i]   - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id]))) + " R ";
				for(var j = 1; j < datas[current_graph_id].length ; j++){
					p += ", "+ ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ", "+ ((height[current_graph_id] - (2*paddingy[current_graph_id])) - ((Object.values(datas[current_graph_id][j].value)[i]  - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id]))) + " ";
				}
				elems["round_path_"+current_graph_id+"_"+i].animate({
					path : p,
				}, 400 + (150*i), "<>" );
			}
		}
	}
}

//Draw stepline path
function draw_stepline_path(){
	for(var i = 0; i < parseInt(instructions[current_graph_id].path_no); i++){
		for(var x = 0; x<path_details[current_graph_id][i].type.length; x++){
			if(path_details[current_graph_id][i].type[x] == "stepline_path"){
				p = "M "+ (2*paddingx[current_graph_id]) + " "+ ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(0  - min_values[current_graph_id]))/maxs[current_graph_id]) + " ";
				for(var j = 1; j < datas[current_graph_id].length ; j++){
					p += " l "+ (width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1) + " "+ 0 + "";
					p += " l "+ 0 + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*0)/maxs[current_graph_id] + "";
				}
				var path1 = elems["paper_"+current_graph_id].path(p).attr({
					'stroke-width' : path_details[current_graph_id][i].stroke[x],
					stroke : path_details[current_graph_id][i].color,
					opacity : 1,
				});
				elems["stepline_path_"+current_graph_id+"_"+i] = path1;
			
				p = "M "+ (2*paddingx[current_graph_id]) + " "+ ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(Object.values(datas[current_graph_id][0].value)[i]  - min_values[current_graph_id]))/maxs[current_graph_id]) + " ";
				for(var j = 1; j < datas[current_graph_id].length ; j++){
					p += " l "+ (width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1) + " "+ 0 + "";
					p += " l "+ 0 + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(Object.values(datas[current_graph_id][j-1].value)[i] - Object.values(datas[current_graph_id][j].value)[i]))/maxs[current_graph_id] + "";
				}
				elems["stepline_path_"+current_graph_id+"_"+i].animate({
					path : p,
				}, 400 + (150*i), "backOut" );
			}
		}
	}
}
//Draw circle on path
function draw_circle(){
	for(var i = 0; i < parseInt(instructions[current_graph_id].path_no); i++){
		if(path_details[current_graph_id][i].circle == true){
			for(var j = 0; j < datas[current_graph_id].length ; j++){
				var circle1 = elems["paper_"+current_graph_id].circle( ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))), (height[current_graph_id] - (2*paddingy[current_graph_id])) - ((0  - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id])) ,path_details[current_graph_id][i].circle_zoom_out).attr({
					opacity : 1,
					fill : path_details[current_graph_id][i].color,
					stroke : path_details[current_graph_id][i].color,
				});
				circle1.animate({
					cx : ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))),
					cy : (height[current_graph_id] - (2*paddingy[current_graph_id])) - ((Object.values(datas[current_graph_id][j].value)[i] - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id])),
					
				}, 400 + (150*i), "<>" );			
				elems["c_"+current_graph_id+"_"+i+""+j] = circle1;
			}
		}
	}
}
//Draw line area
function draw_line_area(){
	for(var i = 0; i < parseInt(instructions[current_graph_id].path_no); i++){
		for(var x = 0; x<path_details[current_graph_id][i].type.length; x++){
			if(path_details[current_graph_id][i].type[x] == "line_area"){
				p = "M "+ (2*paddingx[current_graph_id]) + " "+ ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(0 - min_values[current_graph_id]))/maxs[current_graph_id]) + " ";
				for(var j = 1; j < datas[current_graph_id].length ; j++){
					p += " l "+ (width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1) + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*0)/maxs[current_graph_id] + "";
				}
				p += " l "+ 0 + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(0 - 0))/maxs[current_graph_id] + "l -" + (width[current_graph_id] - (4*paddingx[current_graph_id])) + " 0z";
				var path1 = elems["paper_"+current_graph_id].path(p).attr({
					fill : "270-"+path_details[current_graph_id][i].color+"-#fff",
					stroke : path_details[current_graph_id][i].color,
					'stroke-width' : path_details[current_graph_id][i].stroke[x],
					opacity : .1,
				});
				elems["line_area_"+current_graph_id+"_"+i] = path1;
				p = "M "+ (2*paddingx[current_graph_id]) + " "+ ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(Object.values(datas[current_graph_id][0].value)[i] - min_values[current_graph_id]))/maxs[current_graph_id]) + " ";
				for(var j = 1; j < datas[current_graph_id].length ; j++){
					p += " l "+ (width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1) + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(Object.values(datas[current_graph_id][j-1].value)[i] - Object.values(datas[current_graph_id][j].value)[i]))/maxs[current_graph_id] + "";
				}
				p += " l "+ 0 + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(Object.values(datas[current_graph_id][j-1].value)[i] - 0))/maxs[current_graph_id] + "l -" + (width[current_graph_id] - (4*paddingx[current_graph_id])) + " 0z";
				elems["line_area_"+current_graph_id+"_"+i].animate({
					path : p,
				}, 400 + (150*i), "<>");
			}
		}
	}
}

//Draw round area
function draw_round_area(){
	for(var i = 0; i < parseInt(instructions[current_graph_id].path_no); i++){	
		for(var x = 0; x<path_details[current_graph_id][i].type.length; x++){	
			if(path_details[current_graph_id][i].type[x] == "round_area"){
				p = "M "+ (2*paddingx[current_graph_id]) + " "+ ((height[current_graph_id] - (2*paddingy[current_graph_id])) - ((0  - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id]))) + " R ";
				for(var j = 1; j < datas[current_graph_id].length ; j++){
					p += ", "+ ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ", "+ ((height[current_graph_id] - (2*paddingy[current_graph_id])) - ((0  - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id]))) + " ";
				}
				p+= ", "+ ((2*paddingx[current_graph_id])+(datas[current_graph_id].length-1)*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ", "+ ((height[current_graph_id] - (2*paddingy[current_graph_id])) - ((0  - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id]))) + " z";
				var path1 = elems["paper_"+current_graph_id].path(p).attr({
					'stroke-width' : path_details[current_graph_id][i].stroke[x],
					stroke : path_details[current_graph_id][i].color,
					opacity : .1,
					fill : "270-"+path_details[current_graph_id][i].color+"-#ffffff",
				});
				elems["round_area_"+current_graph_id+"_"+i] = path1;
				p = "M "+ (2*paddingx[current_graph_id]) + " "+ ((height[current_graph_id] - (2*paddingy[current_graph_id])) - ((Object.values(datas[current_graph_id][0].value)[i]  - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id]))) + " R ";
				for(var j = 1; j < datas[current_graph_id].length ; j++){
					p += ", "+ ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ", "+ ((height[current_graph_id] - (2*paddingy[current_graph_id])) - ((Object.values(datas[current_graph_id][j].value)[i]  - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id]))) + " ";
				}
				p += " l "+ 0 + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(Object.values(datas[current_graph_id][j-1].value)[i] - 0))/maxs[current_graph_id] + "l -" + (width[current_graph_id] - (4*paddingx[current_graph_id])) + " 0z";
				elems["round_area_"+current_graph_id+"_"+i].animate({
					path : p,
				}, 400 + (150*i), "<>" );
			}
		}
	}
}

//Draw stepline area
function draw_stepline_area(){
	for(var i = 0; i < parseInt(instructions[current_graph_id].path_no); i++){	
		for(var x = 0; x<path_details[current_graph_id][i].type.length; x++){
			if(path_details[current_graph_id][i].type[x] == "stepline_area"){
				p = "M "+ (2*paddingx[current_graph_id]) + " "+ ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(0  - min_values[current_graph_id]))/maxs[current_graph_id]) + " ";
				for(var j = 1; j < datas[current_graph_id].length ; j++){
					p += " l "+ (width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1) + " "+ 0 + "";
					p += " l "+ 0 + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*0)/maxs[current_graph_id] + "";
				}
				p += " l "+ 0 + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(0 - 0))/maxs[current_graph_id] + "l -" + (width[current_graph_id] - (4*paddingx[current_graph_id])) + " 0z";
				var path1 = elems["paper_"+current_graph_id].path(p).attr({
					fill : "270-"+path_details[current_graph_id][i].color+"-#fff",
					stroke : path_details[current_graph_id][i].color,
					'stroke-width' : path_details[current_graph_id][i].stroke[x],
					opacity : .1,
				});
				elems["stepline_area_"+current_graph_id+"_"+i] = path1;
				p = "M "+ (2*paddingx[current_graph_id]) + " "+ ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(Object.values(datas[current_graph_id][0].value)[i]  - min_values[current_graph_id]))/maxs[current_graph_id]) + " ";
				for(var j = 1; j < datas[current_graph_id].length ; j++){
					p += " l "+ (width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1) + " "+ 0 + "";
					p += " l "+ 0 + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(Object.values(datas[current_graph_id][j-1].value)[i] - Object.values(datas[current_graph_id][j].value)[i]))/maxs[current_graph_id] + "";
				}
				p += " l "+ 0 + " "+ ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(Object.values(datas[current_graph_id][j-1].value)[i] - 0))/maxs[current_graph_id] + "l -" + (width[current_graph_id] - (4*paddingx[current_graph_id])) + " 0z";
				elems["stepline_area_"+current_graph_id+"_"+i].animate({
					path : p,
				}, 400 + (150*i), "backOut");
			}
		}
	}
}

//Draw label on path
function label(){
	for(var i = 0; i < parseInt(instructions[current_graph_id].path_no); i++){
		if(path_details[current_graph_id][i].label == true){
			var j = 0;		
			for(var k = 0; j< datas[current_graph_id].length; k++){
				var rect1 = elems["paper_"+current_graph_id].rect( ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((((Object.values(datas[current_graph_id][j].value)[i]+"").length*7) + 10)/2) ,(height[current_graph_id] - (2*paddingy[current_graph_id]))- ((0  - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id])), ((Object.values(datas[current_graph_id][j].value)[i]+"").length*7) + 10 , 16, 2).attr({
					fill : path_details[current_graph_id][i].color,		
					stroke : "#fff",		
				});
				rect1.animate({
					opacity : 1,
					y : (height[current_graph_id] - (2*paddingy[current_graph_id])) - ((Object.values(datas[current_graph_id][j].value)[i]  - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id])) - 8,
				}, 400 + (150*i), "<>" );
				elems["label_rect_"+current_graph_id+"_"+i+""+k] = rect1;
				var text1 = elems["paper_"+current_graph_id].text( ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))), (height[current_graph_id] - (2*paddingy[current_graph_id])) - ((0  - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id])) ,Object.values(datas[current_graph_id][j].value)[i]).attr({
					fill : "#fff",
				});
				text1.animate({
					opacity : 1,
					x : ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))),
					y : (height[current_graph_id] - (2*paddingy[current_graph_id])) - ((Object.values(datas[current_graph_id][j].value)[i]  - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id])),
					
				}, 400 + (150*i), "<>" );			
				elems["label_text_"+current_graph_id+"_"+i+""+k] = text1;
				j = j + (Math.ceil(datas[current_graph_id].length/(x_division_nos[current_graph_id])));		
			}
		}
	}
}

//Draw annotations
function draw_annotations(){
	if(instructions[current_graph_id].annotations){
		//x axis annotations
		if(instructions[current_graph_id].annotations.xaxis){
			if(instructions[current_graph_id].annotations.xaxis.length > 0){				
			var x_area_annotation_count = 0;
				for(var i = 0; i< instructions[current_graph_id].annotations.xaxis.length; i++){
					//Path annotations
					if(instructions[current_graph_id].annotations.xaxis[i].x){
						for(var j = 0; j < datas[current_graph_id].length; j++){
							if(datas[current_graph_id][j].month == instructions[current_graph_id].annotations.xaxis[i].x){
								elems["paper_"+current_graph_id].path("M " + ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*j) + " "+ (height[current_graph_id] - (2*paddingy[current_graph_id])) + " l 0 " + (-(height[current_graph_id]-(4*paddingy[current_graph_id]))) ).attr({
									stroke : instructions[current_graph_id].annotations.xaxis[i].borderColor,
								}).toBack();
								var rect_x, rect_y, text_x, text_y;
								if(j < datas[current_graph_id].length/2){
									rect_x = ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*j);
									rect_y = 2*paddingy[current_graph_id] +10;//+ (j*5);
									text_x = rect_x + 10;
									text_y = rect_y + ((instructions[current_graph_id].annotations.xaxis[i].label.text.length*7)+20)/2;
								}else{
									rect_x = ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*j)-20;
									rect_y = 2*paddingy[current_graph_id] +10;//+ (j*5);
									text_x = rect_x + 10;
									text_y = rect_y + ((instructions[current_graph_id].annotations.xaxis[i].label.text.length*7)+20)/2;
								}
								elems["paper_"+current_graph_id].rect(rect_x, rect_y, 20, (instructions[current_graph_id].annotations.xaxis[i].label.text.length*7)+20).attr({
									fill : instructions[current_graph_id].annotations.xaxis[i].label.style.background,
									stroke : instructions[current_graph_id].annotations.xaxis[i].label.borderColor,
								});
								elems["paper_"+current_graph_id].text(text_x,text_y,(instructions[current_graph_id].annotations.xaxis[i].label.text)).attr({
									fill : instructions[current_graph_id].annotations.xaxis[i].label.style.color,
									transform : "r270",
								});
							}
							
						}
					}
					//Area annotations
					if(instructions[current_graph_id].annotations.xaxis[i].x1){
						if(instructions[current_graph_id].annotations.xaxis[i].x2){							
							var main_x1, main_x2;
							var x1 = -1, x2 =-1;
							for(var j = 0; j < main_datas[current_graph_id].length; j++){
								if(main_datas[current_graph_id][j].month == instructions[current_graph_id].annotations.xaxis[i].x1){
									main_x1 = j;
								}
								if(main_datas[current_graph_id][j].month == instructions[current_graph_id].annotations.xaxis[i].x2){
									main_x2 = j;
								}
							}
							if(main_x1 > main_x2){
								var a = main_x1;
								main_x1 = main_x2;
								main_x2 = a;
							}
							for(var j = 0; j < datas[current_graph_id].length; j++){
								if(datas[current_graph_id][j].month == instructions[current_graph_id].annotations.xaxis[i].x1){
									x1 = j;
								}
								if(datas[current_graph_id][j].month == instructions[current_graph_id].annotations.xaxis[i].x2){
									x2 = j;
								}
							}
							var inner_flag = 0;
							for(var k = main_x1; k <= main_x2; k++){
								if(datas[current_graph_id][0].month == main_datas[current_graph_id][k].month){
									inner_flag++;
								}
								
								if(datas[current_graph_id][datas[current_graph_id].length-1].month == main_datas[current_graph_id][k].month){
									inner_flag++;
								}
							}
							var area_rect_x, area_rect_y,area_rect_width, area_rect_height;
							var rect_x = -5000, rect_y = -5000, text_x = -5000, text_y = -5000;
							if(x1 >=0 && x2 >= 0){
								if(x1 > x2){
									var a = x1;
									x1= x2;
									x2= a;
								}
								area_rect_x = ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*x1);
								area_rect_y = (2*paddingy[current_graph_id]);
								area_rect_width = ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*(x2-x1);
								area_rect_height = (height[current_graph_id]-(4*paddingy[current_graph_id]));
								rect_x = ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*x1);
								rect_y = height[current_graph_id] - (4*paddingy[current_graph_id]) -30 - (x_area_annotation_count*30);
								text_x = rect_x + 10;
								text_y = rect_y + ((instructions[current_graph_id].annotations.xaxis[i].label.text.length*7)+20)/2;
							}
							if(x1 == -1 && x2 >=0){
								area_rect_x = (2*paddingx[current_graph_id]);
								area_rect_y = (2*paddingy[current_graph_id]);
								area_rect_width = ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*x2;
								area_rect_height = (height[current_graph_id]-(4*paddingy[current_graph_id]));
								if(x2==0){
									rect_x = ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*0) - 5000;
								}else{
									rect_x = ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*0);
								}
								rect_y = height[current_graph_id] - (4*paddingy[current_graph_id]) -30 - (x_area_annotation_count*30);
								text_x = rect_x + 10;
								text_y = rect_y + ((instructions[current_graph_id].annotations.xaxis[i].label.text.length*7)+20)/2;
							}
							if(x1 >=0 && x2 == -1){
								area_rect_x = ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*x1);
								area_rect_y = (2*paddingy[current_graph_id]);
								area_rect_width = (width[current_graph_id]-(4*paddingx[current_graph_id])) - ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*x1;
								area_rect_height = (height[current_graph_id]-(4*paddingy[current_graph_id]));								
								if(datas[current_graph_id].length == x1+1){
									rect_x = ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*x1) +5000;									
								}else{
									rect_x = ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*x1);
								}
								rect_y = height[current_graph_id] - (4*paddingy[current_graph_id]) -30 - (x_area_annotation_count*30);
								text_x = rect_x + 10;
								text_y = rect_y + ((instructions[current_graph_id].annotations.xaxis[i].label.text.length*7)+20)/2;
							}
							if(inner_flag == 2){
								area_rect_x = ((2*paddingx[current_graph_id]));
								area_rect_y = (2*paddingy[current_graph_id]);
								area_rect_width = (width[current_graph_id]-(4*paddingx[current_graph_id]));
								area_rect_height = (height[current_graph_id]-(4*paddingy[current_graph_id]));
								rect_x = ((2*paddingx[current_graph_id]) + ((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))*0);
								rect_y = height[current_graph_id] - (4*paddingy[current_graph_id]) -30 - (x_area_annotation_count*30);
								text_x = rect_x + 10;
								text_y = rect_y + ((instructions[current_graph_id].annotations.xaxis[i].label.text.length*7)+20)/2;
							}
							elems["paper_"+current_graph_id].rect(area_rect_x, area_rect_y, area_rect_width, area_rect_height).attr({
								stroke : instructions[current_graph_id].annotations.xaxis[i].borderColor,
								fill : instructions[current_graph_id].annotations.xaxis[i].fillColor,
								opacity : instructions[current_graph_id].annotations.xaxis[i].opacity,
							}).toBack();
							elems["paper_"+current_graph_id].rect(rect_x, rect_y, 20, (instructions[current_graph_id].annotations.xaxis[i].label.text.length*7)+20).attr({
								fill : instructions[current_graph_id].annotations.xaxis[i].label.style.background,
								stroke : instructions[current_graph_id].annotations.xaxis[i].label.borderColor,
							});
							elems["paper_"+current_graph_id].text(text_x,text_y,(instructions[current_graph_id].annotations.xaxis[i].label.text)).attr({
								fill : instructions[current_graph_id].annotations.xaxis[i].label.style.color,
								transform : "r270",
							});
							x_area_annotation_count++;
						}
					}
				}
			}
		}
		//y axis annotations
		if(instructions[current_graph_id].annotations.yaxis){
			if(instructions[current_graph_id].annotations.yaxis.length > 0){
				for(var i = 0; i< instructions[current_graph_id].annotations.yaxis.length; i++){
					//Path annotations
					if(instructions[current_graph_id].annotations.yaxis[i].y || instructions[current_graph_id].annotations.yaxis[i].y == 0){
						if(instructions[current_graph_id].annotations.yaxis[i].y < max_values[current_graph_id] && instructions[current_graph_id].annotations.yaxis[i].y > min_values[current_graph_id]){
							elems["paper_"+current_graph_id].path("M "+ 2*paddingx[current_graph_id] +" " + ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(instructions[current_graph_id].annotations.yaxis[i].y - min_values[current_graph_id]))/maxs[current_graph_id]) + " l "+  (width[current_graph_id]-(4*paddingx[current_graph_id])) +" 0").attr({
								stroke : instructions[current_graph_id].annotations.yaxis[i].borderColor,
							}).toBack();
							if((instructions[current_graph_id].annotations.yaxis[i].y - min_values[current_graph_id]) > maxs[current_graph_id]/2){
								elems["paper_"+current_graph_id].rect((2*paddingx[current_graph_id]) + (i*50+50), (( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(instructions[current_graph_id].annotations.yaxis[i].y - min_values[current_graph_id]))/maxs[current_graph_id])), (instructions[current_graph_id].annotations.yaxis[i].label.text.length*7)+20, 20).attr({
									fill : instructions[current_graph_id].annotations.yaxis[i].label.style.background,
									stroke : instructions[current_graph_id].annotations.yaxis[i].label.borderColor,
								});
								elems["paper_"+current_graph_id].text((2*paddingx[current_graph_id]) + (i*50+50) + ((instructions[current_graph_id].annotations.yaxis[i].label.text.length*7)+20)/2, (( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(instructions[current_graph_id].annotations.yaxis[i].y - min_values[current_graph_id]))/maxs[current_graph_id]))+10, (instructions[current_graph_id].annotations.yaxis[i].label.text)).attr({
									fill : instructions[current_graph_id].annotations.yaxis[i].label.style.color,
								});
							}else{
								elems["paper_"+current_graph_id].rect((2*paddingx[current_graph_id]) + (i*50+50), (( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(instructions[current_graph_id].annotations.yaxis[i].y - min_values[current_graph_id]))/maxs[current_graph_id]))-20, (instructions[current_graph_id].annotations.yaxis[i].label.text.length*7)+20, 20).attr({
									fill : instructions[current_graph_id].annotations.yaxis[i].label.style.background,
									stroke : instructions[current_graph_id].annotations.yaxis[i].label.borderColor,
								});
								elems["paper_"+current_graph_id].text((2*paddingx[current_graph_id]) + (i*50+50) + ((instructions[current_graph_id].annotations.yaxis[i].label.text.length*7)+20)/2, (( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(instructions[current_graph_id].annotations.yaxis[i].y - min_values[current_graph_id]))/maxs[current_graph_id]))+10-20, (instructions[current_graph_id].annotations.yaxis[i].label.text)).attr({
									fill : instructions[current_graph_id].annotations.yaxis[i].label.style.color,
								});
							}
						}
					}
					//Area annotations
					if((instructions[current_graph_id].annotations.yaxis[i].y1 && instructions[current_graph_id].annotations.yaxis[i].y2) || (instructions[current_graph_id].annotations.yaxis[i].y1 == 0 || instructions[current_graph_id].annotations.yaxis[i].y2 == 0)){
						var y1 = instructions[current_graph_id].annotations.yaxis[i].y1;
						var y2 = instructions[current_graph_id].annotations.yaxis[i].y2;
						if(y1 > y2){
							var a = y1;
							y1 = y2;
							y2 = a;
						}
						if(y1 < min_values[current_graph_id]){
							y1=min_values[current_graph_id];
						}
						if(y2 > (maxs[current_graph_id]+min_values[current_graph_id])){
							y2 = maxs[current_graph_id]+min_values[current_graph_id];
						}
						elems["paper_"+current_graph_id].rect((2*paddingx[current_graph_id]),  (( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(y2 - min_values[current_graph_id]))/maxs[current_graph_id])), width[current_graph_id] - (4*paddingx[current_graph_id]) , ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(y2 -y1))/maxs[current_graph_id]).attr({
							stroke : instructions[current_graph_id].annotations.yaxis[i].borderColor,
							fill : instructions[current_graph_id].annotations.yaxis[i].fillColor,
							opacity : instructions[current_graph_id].annotations.yaxis[i].opacity,
						}).toBack();
						if((y2-min_values[current_graph_id]) > maxs[current_graph_id]/2){
							elems["paper_"+current_graph_id].rect((2*paddingx[current_graph_id]) + (i*50+50), (( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(y2 - min_values[current_graph_id]))/maxs[current_graph_id])), (instructions[current_graph_id].annotations.yaxis[i].label.text.length*7)+20, 20).attr({
								fill : instructions[current_graph_id].annotations.yaxis[i].label.style.background,
								stroke : instructions[current_graph_id].annotations.yaxis[i].label.borderColor,
							});
							elems["paper_"+current_graph_id].text((2*paddingx[current_graph_id]) + (i*50+50) + ((instructions[current_graph_id].annotations.yaxis[i].label.text.length*7)+20)/2, (( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(y2 - min_values[current_graph_id]))/maxs[current_graph_id]))+10, (instructions[current_graph_id].annotations.yaxis[i].label.text)).attr({
								fill : instructions[current_graph_id].annotations.yaxis[i].label.style.color,
							});
							
						}else{
							elems["paper_"+current_graph_id].rect((2*paddingx[current_graph_id]) + (i*50+50), (( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(y2 - min_values[current_graph_id]))/maxs[current_graph_id]))-20, (instructions[current_graph_id].annotations.yaxis[i].label.text.length*7)+20, 20).attr({
								fill : instructions[current_graph_id].annotations.yaxis[i].label.style.background,
								stroke : instructions[current_graph_id].annotations.yaxis[i].label.borderColor,
							});
							elems["paper_"+current_graph_id].text((2*paddingx[current_graph_id]) + (i*50+50) + ((instructions[current_graph_id].annotations.yaxis[i].label.text.length*7)+20)/2, ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(y2 - min_values[current_graph_id]))/maxs[current_graph_id])-10, (instructions[current_graph_id].annotations.yaxis[i].label.text)).attr({
								fill : instructions[current_graph_id].annotations.yaxis[i].label.style.color,
							});
						}
					}
				}
			}
		}
		//Point annotations
		if(instructions[current_graph_id].annotations.points){
			try{
				if(instructions[current_graph_id].annotations.points.length > 0){
					for(var i = 0; i<instructions[current_graph_id].annotations.points.length; i++){
						for(var j = 0; j < datas[current_graph_id].length ; j ++){
							if(datas[current_graph_id][j].month == instructions[current_graph_id].annotations.points[i].x){
								if(instructions[current_graph_id].annotations.points[i].y <= max_values[current_graph_id] && instructions[current_graph_id].annotations.points[i].y >= min_values[current_graph_id]){
									paper.circle(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))), (height[current_graph_id] - (2*paddingy[current_graph_id])) - ((parseInt(instructions[current_graph_id].annotations.points[i].y) - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id])), instructions[current_graph_id].annotations.points[i].marker.radius).attr({
										fill : instructions[current_graph_id].annotations.points[i].marker.fillColor,
										'stroke-width' : instructions[current_graph_id].annotations.points[i].marker.strokeWidth,
										stroke : instructions[current_graph_id].annotations.points[i].marker.strokeColor,
									});
									var rect_x = 0, rect_y = 0, text_x = 0, text_y = 0;
									if(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]) > maxs[current_graph_id]/2){
										if(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) < 1*((width[current_graph_id]-(4*paddingx[current_graph_id]))/4)){
											rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1)))  + (instructions[current_graph_id].annotations.points[i].marker.radius + instructions[current_graph_id].annotations.points[i].marker.strokeWidth + 3);
											rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]))/maxs[current_graph_id]))- 10;
											text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20)/2 + (instructions[current_graph_id].annotations.points[i].marker.radius + instructions[current_graph_id].annotations.points[i].marker.strokeWidth + 3);
											text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]))/maxs[current_graph_id])) ;
										}
										else if(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) > 3*((width[current_graph_id]-(4*paddingx[current_graph_id]))/4)){
											rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20) - (instructions[current_graph_id].annotations.points[i].marker.radius + instructions[current_graph_id].annotations.points[i].marker.strokeWidth + 3);
											rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]))/maxs[current_graph_id])) - 10;
											text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20)/2 - ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20) - (instructions[current_graph_id].annotations.points[i].marker.radius + instructions[current_graph_id].annotations.points[i].marker.strokeWidth + 3);
											text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]))/maxs[current_graph_id]));
										}else {
											rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20)/2;
											rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]))/maxs[current_graph_id])) + (instructions[current_graph_id].annotations.points[i].marker.radius + instructions[current_graph_id].annotations.points[i].marker.strokeWidth + 3);
											text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20)/2 - ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20)/2;
											text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]))/maxs[current_graph_id]))+10 + (instructions[current_graph_id].annotations.points[i].marker.radius + instructions[current_graph_id].annotations.points[i].marker.strokeWidth + 3);
										}
									}else{
										if(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) < 1*((width[current_graph_id]-(4*paddingx[current_graph_id]))/4)){
											rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1)))  + (instructions[current_graph_id].annotations.points[i].marker.radius + instructions[current_graph_id].annotations.points[i].marker.strokeWidth + 3);
											rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]))/maxs[current_graph_id]))- 10;
											text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20)/2 + (instructions[current_graph_id].annotations.points[i].marker.radius + instructions[current_graph_id].annotations.points[i].marker.strokeWidth + 3);
											text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]))/maxs[current_graph_id])) ;
										}
										else if(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) > 3*((width[current_graph_id]-(4*paddingx[current_graph_id]))/4)){
											rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20) - (instructions[current_graph_id].annotations.points[i].marker.radius + instructions[current_graph_id].annotations.points[i].marker.strokeWidth + 3);
											rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]))/maxs[current_graph_id])) - 10;
											text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20)/2 - ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20) - (instructions[current_graph_id].annotations.points[i].marker.radius + instructions[current_graph_id].annotations.points[i].marker.strokeWidth + 3);
											text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]))/maxs[current_graph_id]));
										}else {
											rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20)/2;
											rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]))/maxs[current_graph_id])) - 20 - (instructions[current_graph_id].annotations.points[i].marker.radius + instructions[current_graph_id].annotations.points[i].marker.strokeWidth + 3);
											text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20)/2 - ((instructions[current_graph_id].annotations.points[i].label.text.length*7)+20)/2;
											text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(instructions[current_graph_id].annotations.points[i].y - min_values[current_graph_id]))/maxs[current_graph_id])) - 10 - (instructions[current_graph_id].annotations.points[i].marker.radius + instructions[current_graph_id].annotations.points[i].marker.strokeWidth + 3);
										}
									}
									paper.rect(rect_x, rect_y, (instructions[current_graph_id].annotations.points[i].label.text.length*7)+20, 20).attr({
										fill : instructions[current_graph_id].annotations.points[i].label.style.background,
										stroke : instructions[current_graph_id].annotations.points[i].label.borderColor,
									});
									paper.text(text_x, text_y, (instructions[current_graph_id].annotations.points[i].label.text)).attr({
										fill : instructions[current_graph_id].annotations.points[i].label.style.color,
									});	
								}
							}
						}
					}
				}
			}catch(err){}
		}
		
		//Max point annotations
		if(instructions[current_graph_id].annotations.max){
			if(instructions[current_graph_id].annotations.max.length > 0){	
				if(max_point_values[current_graph_id] <= max_values[current_graph_id] && max_point_values[current_graph_id] >= min_values[current_graph_id]){
					var j = 0;
					for(var i = 0; i<datas[current_graph_id].length; i++){
						if((Math.max(...(Object.values(datas[current_graph_id][i].value)))) == max_point_values[current_graph_id]){
							j = i;
						}
					}
					elems["paper_"+current_graph_id].circle(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))), (height[current_graph_id] - (2*paddingy[current_graph_id])) - ((parseInt(max_point_values[current_graph_id]) - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id])), instructions[current_graph_id].annotations.max[0].marker.radius).attr({
						fill : instructions[current_graph_id].annotations.max[0].marker.fillColor,
						'stroke-width' : instructions[current_graph_id].annotations.max[0].marker.strokeWidth,
						stroke : instructions[current_graph_id].annotations.max[0].marker.strokeColor,
					});
					var rect_x = 0, rect_y = 0, text_x = 0, text_y = 0;
					if(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]) > maxs[current_graph_id]/2){
						if(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) < 1*((width[current_graph_id]-(4*paddingx[current_graph_id]))/4)){
							rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1)))  + (instructions[current_graph_id].annotations.max[0].marker.radius + instructions[current_graph_id].annotations.max[0].marker.strokeWidth + 3);
							rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id]))- 10;
							text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20)/2 + (instructions[current_graph_id].annotations.max[0].marker.radius + instructions[current_graph_id].annotations.max[0].marker.strokeWidth + 3);
							text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) ;
						}
						else if(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) > 3*((width[current_graph_id]-(4*paddingx[current_graph_id]))/4)){
							rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20) - (instructions[current_graph_id].annotations.max[0].marker.radius + instructions[current_graph_id].annotations.max[0].marker.strokeWidth + 3);
							rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) - 10;
							text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20)/2 - ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20) - (instructions[current_graph_id].annotations.max[0].marker.radius + instructions[current_graph_id].annotations.max[0].marker.strokeWidth + 3);
							text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id]));
						}else {
							rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20)/2;
							rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) + (instructions[current_graph_id].annotations.max[0].marker.radius + instructions[current_graph_id].annotations.max[0].marker.strokeWidth + 3);
							text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20)/2 - ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20)/2;
							text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id]))+10 + (instructions[current_graph_id].annotations.max[0].marker.radius + instructions[current_graph_id].annotations.max[0].marker.strokeWidth + 3);
						}
					}else{
						if(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) < 1*((width[current_graph_id]-(4*paddingx[current_graph_id]))/4)){
							rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1)))  + (instructions[current_graph_id].annotations.max[0].marker.radius + instructions[current_graph_id].annotations.max[0].marker.strokeWidth + 3);
							rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id]))- 10;
							text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20)/2 + (instructions[current_graph_id].annotations.max[0].marker.radius + instructions[current_graph_id].annotations.max[0].marker.strokeWidth + 3);
							text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) ;
						}
						else if(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) > 3*((width[current_graph_id]-(4*paddingx[current_graph_id]))/4)){
							rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20) - (instructions[current_graph_id].annotations.max[0].marker.radius + instructions[current_graph_id].annotations.max[0].marker.strokeWidth + 3);
							rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) - 10;
							text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20)/2 - ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20) - (instructions[current_graph_id].annotations.max[0].marker.radius + instructions[current_graph_id].annotations.max[0].marker.strokeWidth + 3);
							text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id]));
						}else {
							rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20)/2;
							rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) - 20 - (instructions[current_graph_id].annotations.max[0].marker.radius + instructions[current_graph_id].annotations.max[0].marker.strokeWidth + 3);
							text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20)/2 - ((instructions[current_graph_id].annotations.max[0].label.text.length*7)+20)/2;
							text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(max_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) - 10 - (instructions[current_graph_id].annotations.max[0].marker.radius + instructions[current_graph_id].annotations.max[0].marker.strokeWidth + 3);
						}
					}
					elems["paper_"+current_graph_id].rect(rect_x, rect_y, (instructions[current_graph_id].annotations.max[0].label.text.length*7)+20, 20).attr({
						fill : instructions[current_graph_id].annotations.max[0].label.style.background,
						stroke : instructions[current_graph_id].annotations.max[0].label.borderColor,
					});
					elems["paper_"+current_graph_id].text(text_x, text_y, (instructions[current_graph_id].annotations.max[0].label.text)).attr({
						fill : instructions[current_graph_id].annotations.max[0].label.style.color,
					});
				}
			}
		}
		//Min point annotations
		if(instructions[current_graph_id].annotations.min){
			if(instructions[current_graph_id].annotations.min.length > 0){	
				if(min_point_values[current_graph_id] <= max_values[current_graph_id] && min_point_values[current_graph_id] >= min_values[current_graph_id]){
					var j = 0;
					for(var i = 0; i<datas[current_graph_id].length; i++){
						if((Math.min(...(Object.values(datas[current_graph_id][i].value)))) == min_point_values[current_graph_id]){
							j = i;
						}
					}
					elems["paper_"+current_graph_id].circle(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))), (height[current_graph_id] - (2*paddingy[current_graph_id])) - ((parseInt(min_point_values[current_graph_id]) - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id])), instructions[current_graph_id].annotations.min[0].marker.radius).attr({
						fill : instructions[current_graph_id].annotations.min[0].marker.fillColor,
						'stroke-width' : instructions[current_graph_id].annotations.min[0].marker.strokeWidth,
						stroke : instructions[current_graph_id].annotations.min[0].marker.strokeColor,
					});
					var rect_x = 0, rect_y = 0, text_x = 0, text_y = 0;
					if(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]) > maxs[current_graph_id]/2){
						if(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) < 1*((width[current_graph_id]-(4*paddingx[current_graph_id]))/4)){
							rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1)))  + (instructions[current_graph_id].annotations.min[0].marker.radius + instructions[current_graph_id].annotations.min[0].marker.strokeWidth + 3);
							rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id]))- 10;
							text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20)/2 + (instructions[current_graph_id].annotations.min[0].marker.radius + instructions[current_graph_id].annotations.min[0].marker.strokeWidth + 3);
							text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) ;
						}
						else if(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) > 3*((width[current_graph_id]-(4*paddingx[current_graph_id]))/4)){
							rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20) - (instructions[current_graph_id].annotations.min[0].marker.radius + instructions[current_graph_id].annotations.min[0].marker.strokeWidth + 3);
							rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) - 10;
							text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20)/2 - ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20) - (instructions[current_graph_id].annotations.min[0].marker.radius + instructions[current_graph_id].annotations.min[0].marker.strokeWidth + 3);
							text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id]));
						}else {
							rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20)/2;
							rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) + (instructions[current_graph_id].annotations.min[0].marker.radius + instructions[current_graph_id].annotations.min[0].marker.strokeWidth + 3);
							text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20)/2 - ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20)/2;
							text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id]))+10 + (instructions[current_graph_id].annotations.min[0].marker.radius + instructions[current_graph_id].annotations.min[0].marker.strokeWidth + 3);
						}
					}else{
						if(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) < 1*((width[current_graph_id]-(4*paddingx[current_graph_id]))/4)){
							rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1)))  + (instructions[current_graph_id].annotations.min[0].marker.radius + instructions[current_graph_id].annotations.min[0].marker.strokeWidth + 3);
							rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id]))- 10;
							text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20)/2 + (instructions[current_graph_id].annotations.min[0].marker.radius + instructions[current_graph_id].annotations.min[0].marker.strokeWidth + 3);
							text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) ;
						}
						else if(((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) > 3*((width[current_graph_id]-(4*paddingx[current_graph_id]))/4)){
							rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20) - (instructions[current_graph_id].annotations.min[0].marker.radius + instructions[current_graph_id].annotations.min[0].marker.strokeWidth + 3);
							rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) - 10;
							text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20)/2 - ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20) - (instructions[current_graph_id].annotations.min[0].marker.radius + instructions[current_graph_id].annotations.min[0].marker.strokeWidth + 3);
							text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id]));
						}else {
							rect_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) - ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20)/2;
							rect_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) - 20 - (instructions[current_graph_id].annotations.min[0].marker.radius + instructions[current_graph_id].annotations.min[0].marker.strokeWidth + 3);
							text_x = ((2*paddingx[current_graph_id])+j*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))) + ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20)/2 - ((instructions[current_graph_id].annotations.min[0].label.text.length*7)+20)/2;
							text_y = ( (height[current_graph_id]-(2*paddingy[current_graph_id])) - ((height[current_graph_id]-(4*paddingy[current_graph_id]))*(parseInt(min_point_values[current_graph_id] - min_values[current_graph_id]))/maxs[current_graph_id])) - 10 - (instructions[current_graph_id].annotations.min[0].marker.radius + instructions[current_graph_id].annotations.min[0].marker.strokeWidth + 3);
						}
					}
					elems["paper_"+current_graph_id].rect(rect_x, rect_y, (instructions[current_graph_id].annotations.min[0].label.text.length*7)+20, 20).attr({
						fill : instructions[current_graph_id].annotations.min[0].label.style.background,
						stroke : instructions[current_graph_id].annotations.min[0].label.borderColor,
					});
					elems["paper_"+current_graph_id].text(text_x, text_y, (instructions[current_graph_id].annotations.min[0].label.text)).attr({
						fill : instructions[current_graph_id].annotations.min[0].label.style.color,
					});
				}
			}
		}
	}
}




/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// For x axis hover design -----------------------------
function x_axis_hover_design(){
	if(instructions[current_graph_id].x_axis_hover_design == true){
		for(var i=0; i<1; i++){
			var  p = "M "+ 2*paddingx[current_graph_id] +" " + 2*paddingy[current_graph_id] + " l 0 "+  (height[current_graph_id]-(4*paddingy[current_graph_id])) +" 0";
			var path1 = elems["paper_"+current_graph_id].path(p).attr({
				'stroke-width' : .5,
				stroke : '#949494',
				opacity : 0,
			});
			elems["px_"+current_graph_id+"_"+i] = path1;
		}
	}
}
// For y axis hover design-----------------------------
function y_axis_hover_design(){
	if(instructions[current_graph_id].y_axis_hover_design == true){
		for(var i=0; i<instructions[current_graph_id].path_no; i++){
			var  p = "M "+ 2*paddingx[current_graph_id] +" " + ( (height[current_graph_id]-(2*paddingy[current_graph_id]))-((height[current_graph_id]-(4*paddingy[current_graph_id]))/(y_division_nos[current_graph_id]-1))*i ) + " l "+  (width[current_graph_id]-(4*paddingx[current_graph_id])) +" 0";
			var path1 = elems["paper_"+current_graph_id].path(p).attr({
				'stroke-width' : .5,
				stroke : '#949494',
				opacity : 0,
			});
			elems["py_"+current_graph_id+"_"+i] = path1;
		}
	}
}
//Draw popup
function popup_design(){	
	var pop_rect = elems["paper_"+current_graph_id].rect(0, (height[current_graph_id] - (4*paddingy[current_graph_id])), 0, instructions[current_graph_id].path_no*30, 2).attr({
		fill : '#fcfcfc',
		stroke : '#b8b8b8',
		opacity : 0,
	});	
	pop_rect.blur(1);
	elems["pop_rect_"+current_graph_id] = pop_rect;
	for(var i=0; i<instructions[current_graph_id].path_no; i++){
		var text1 = elems["paper_"+current_graph_id].text(20, /*(15 + (30*i))*/(height[current_graph_id] - (4*paddingy[current_graph_id])), "").attr({
			fill : path_details[current_graph_id][i].color,
			'font-size' : '13px',
			'text-anchor' : 'start',
			'font-weight' : 'bold',
			opacity : 0,
		});
		elems["tt_"+current_graph_id+"_"+i] = text1;
	}
}

//Draw popup footer design
function popup_footer_design(){
	var position = "";
	if(instructions[current_graph_id].x_axis_position){
		position = (instructions[current_graph_id].x_axis_position+"").toLowerCase() || "bottom";
	}
	if(position == "top"){
		//for rect
		var rect1 = elems["paper_"+current_graph_id].rect(2*paddingx[current_graph_id], (2*paddingy[current_graph_id])-40, 0, 40, 5).attr({
			fill : '#f1f1f1',
			stroke : '#b6b6b6',
			opacity : 0,
		});
		elems["pfd_r_"+current_graph_id] = rect1;
		//for text
		var text1 = elems["paper_"+current_graph_id].text(2*paddingx[current_graph_id], (2*paddingy[current_graph_id]) - 20, "2019").attr({
			'font-size' : '13px',
				'font-weight' : 'bold',
			opacity : 0,
		});
		elems["pfd_t_"+current_graph_id] = text1;
	}else{
		//for rect
		var rect1 = elems["paper_"+current_graph_id].rect(2*paddingx[current_graph_id], height[current_graph_id] - (2*paddingy[current_graph_id]), 0, 40, 5).attr({
			fill : '#f1f1f1',
			stroke : '#b6b6b6',
			opacity : 0,
		});
		elems["pfd_r_"+current_graph_id] = rect1;
		//for text
		var text1 = elems["paper_"+current_graph_id].text(2*paddingx[current_graph_id], height[current_graph_id] - (2*paddingy[current_graph_id]) + 20, "2019").attr({
			'font-size' : '13px',
				'font-weight' : 'bold',
			opacity : 0,
		});
		elems["pfd_t_"+current_graph_id] = text1;
	}
}
//Collect max data on every point for view popup on that point
function collect_popup_point(){
	var popup_point_x = [];
	var popup_point_y = [];
	for(var i = 0; i < datas[current_graph_id].length; i++){
		popup_point_x.push(((2*paddingx[current_graph_id])+i*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))));
		popup_point_y.push((height[current_graph_id] - (2*paddingy[current_graph_id])) - ((Math.max(...Object.values(datas[current_graph_id][i].value))  - min_values[current_graph_id])*((height[current_graph_id]-(4*paddingy[current_graph_id]))/maxs[current_graph_id])));
	}
	popup_point_xs[current_graph_id] = popup_point_x;
	popup_point_ys[current_graph_id] = popup_point_y;
}

//*****Draw rectangle for popup
function draw_popup_rect(){
	for(var i = 0; i< datas[current_graph_id].length; i++){
		var rect = elems["paper_"+current_graph_id].rect((((2*paddingx[current_graph_id])-(((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))/2))+i*((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1))),2*paddingy[current_graph_id],((width[current_graph_id]-(4*paddingx[current_graph_id]))/(datas[current_graph_id].length-1)),(height[current_graph_id] - (4*paddingy[current_graph_id])));
		rect.attr({
			fill : "transparent",
			opacity : 0,
		});
		rect.node.id = "r_"+current_graph_id+"_"+i;
		rect.node.addEventListener('mouseover', popup);
		rect.node.addEventListener('mouseout', popdown);
		rect.node.addEventListener('mouseup', mouseup);
		rect.node.addEventListener('mousemove', mousemove);
		rect.node.addEventListener('mousedown', mousedown);
	}
}


//////////////////////////////////////////////////PopUp////////////////////////////////////////////////////
function popup(){	
	var id = this.id.replace('r_','');	
	circle_popup(id);
	x_axis_hover(id);
	y_axis_hover(id);
	popup_hover(id);
	popup_footer_hover(id);
}

function popdown(){	
	var id = this.id.replace('r_','');	
	circle_popdown(id);
	x_axis_hover_out(id);
	y_axis_hover_out(id);
	popup_hover_out(id);
	popup_footer_hover_out(id);
	
}
//Popup hover
function popup_hover(id){
	var res = id.split("_");
	var id = parseInt(res[1]);
	var graph_id = res[0];
	if(sync_chart[graph_id]){
		for(var i = 0; i < Object.keys(sync_chart).length; i++){
			if(sync_chart[graph_id] == Object.values(sync_chart)[i]){
				popup_hover_inner(id, Object.keys(sync_chart)[i])
			}
		}
	}
	else{
		popup_hover_inner(id, graph_id);
	}
}
function popup_hover_inner(id, graph_id){
	if(instructions[graph_id].popup_design == true){
		var a = 0, b = 0;
		for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
			if(Object.values(datas[graph_id][id].value)[i].toString().length > a){
				a = (path_details[graph_id][i].name+" : "+Object.values(datas[graph_id][id].value)[i]).toString().length;
			}
		} 
		a = (a*7)+40;
		if(id<datas[graph_id].length/2){
			if(Math.max(...(Object.values(datas[graph_id][id].value)))>(maxs[graph_id]/2)){
				//for rect			
				elems["pop_rect_"+graph_id].animate({
					opacity : 1,
					x : popup_point_xs[graph_id][id] ,
					y : popup_point_ys[graph_id][id] + 15,
					width : a,
				},150);
				//for text change
				for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
					elems["tt_"+graph_id+"_"+i].attr({
						text : path_details[graph_id][i].name+" : "+Object.values(datas[graph_id][id].value)[i],
					});
				}
				//for text animation
				for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
					elems["tt_"+graph_id+"_"+i].animate({
						opacity : 1,
						x : popup_point_xs[graph_id][id]+20,
						y : popup_point_ys[graph_id][id] + (15 + (30*i) + 15),
					}, 150);
				}
			}else{
				//for rect
				elems["pop_rect_"+graph_id].animate({
					opacity : 1,
					x : popup_point_xs[graph_id][id] ,
					y : popup_point_ys[graph_id][id] - (instructions[graph_id].path_no*30) - 15,
					width : a,
				},150);
				//for text change
				for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
					elems["tt_"+graph_id+"_"+i].attr({
						text : path_details[graph_id][i].name+" : "+Object.values(datas[graph_id][id].value)[i],
					});
				}
				//for text animation
				for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
					elems["tt_"+graph_id+"_"+i].animate({
						opacity : 1,
						x : popup_point_xs[graph_id][id] + 20,
						y : popup_point_ys[graph_id][id] + (15 + (30*i)) - (instructions[graph_id].path_no*30) - 15,
					}, 150);
				}
			}
		}else{
			if(Math.max(...(Object.values(datas[graph_id][id].value)))>(maxs[graph_id]/2)){
				//for rect
				elems["pop_rect_"+graph_id].animate({
					opacity : 1,
					x : popup_point_xs[graph_id][id] - a,
					y : popup_point_ys[graph_id][id] + 15,
					width : a,
				},150);
				//for text change
				for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
					elems["tt_"+graph_id+"_"+i].attr({
						text : path_details[graph_id][i].name+" : "+Object.values(datas[graph_id][id].value)[i],
					});
				}
				//for text animation
				for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
					elems["tt_"+graph_id+"_"+i].animate({
						opacity : 1,
						x : popup_point_xs[graph_id][id] + 20 - a,
						y : popup_point_ys[graph_id][id] + (15 + (30*i))  + 15,
					}, 150);
				}
			}else{
				//for rect
				elems["pop_rect_"+graph_id].animate({
					opacity : 1,
					x : popup_point_xs[graph_id][id] - a,
					y : popup_point_ys[graph_id][id] - (instructions[graph_id].path_no*30) - 15,
					width : a,
				},150);
				//for text change
				for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
					elems["tt_"+graph_id+"_"+i].attr({
						text : path_details[graph_id][i].name+" : "+Object.values(datas[graph_id][id].value)[i],
					});
				}
				//for text animation
				for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
					elems["tt_"+graph_id+"_"+i].animate({
						opacity : 1,
						x : popup_point_xs[graph_id][id] + 20 - a,
						y : popup_point_ys[graph_id][id] + (15 + (30*i)) - (instructions[graph_id].path_no*30) - 15,
					}, 150);
				}
			}
		}
	}
}
//Popup hover out
function popup_hover_out(id){
	var res = id.split("_");
	var id = parseInt(res[1]);
	var graph_id = res[0];
	if(sync_chart[graph_id]){
		for(var i = 0; i < Object.keys(sync_chart).length; i++){
			if(sync_chart[graph_id] == Object.values(sync_chart)[i]){
				popup_hover_out_inner(id, Object.keys(sync_chart)[i])
			}
		}
	}
	else{
		popup_hover_out_inner(id, graph_id);
	}	
}
function popup_hover_out_inner(id, graph_id){
	if(instructions[graph_id].popup_design == true){
		//for rect
		elems["pop_rect_"+graph_id].animate({
			opacity : 0,
		}, 150);
		//for text
		for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
			elems["tt_"+graph_id+"_"+i].animate({
				opacity : 0,
			}, 150);
		}
	}
}

//Popup footer hover
function popup_footer_hover(id){
	var res = id.split("_");
	var id = parseInt(res[1]);
	var graph_id = res[0];
	if(sync_chart[graph_id]){
		for(var i = 0; i < Object.keys(sync_chart).length; i++){
			if(sync_chart[graph_id] == Object.values(sync_chart)[i]){
				popup_footer_hover_inner(id, Object.keys(sync_chart)[i])
			}
		}
	}
	else{
		popup_footer_hover_inner(id, graph_id);
	}	
	
}
function popup_footer_hover_inner(id, graph_id){
	if(instructions[graph_id].popup_footer_design == true){
		//for rect
		elems["pfd_r_"+graph_id].animate({
			opacity : 1,
			x : popup_point_xs[graph_id][id] - (((datas[graph_id][id].month.length*7)+20)/2),
			width : (datas[graph_id][id].month.length*7) + 20,
		},150);
		//for text change
		elems["pfd_t_"+graph_id].attr({
			text : datas[graph_id][id].month,
		});
		//for text
		elems["pfd_t_"+graph_id].animate({
			opacity : 1,
			x : popup_point_xs[graph_id][id] ,
		}, 150);
	}
}
//Popup footer hover out
function popup_footer_hover_out(id){
	var res = id.split("_");
	var id = parseInt(res[1]);
	var graph_id = res[0];
	if(sync_chart[graph_id]){
		for(var i = 0; i < Object.keys(sync_chart).length; i++){
			if(sync_chart[graph_id] == Object.values(sync_chart)[i]){
				popup_footer_hover_out_inner(id, Object.keys(sync_chart)[i])
			}
		}
	}
	else{
		popup_footer_hover_out_inner(id, graph_id);
	}
	
}
function popup_footer_hover_out_inner(id, graph_id){
	if(instructions[graph_id].popup_footer_design == true){
		//for rect
		elems["pfd_r_"+graph_id].animate({
			opacity : 0,
		},150);
		//for text
		elems["pfd_t_"+graph_id].animate({
			opacity : 0,
		}, 150);
	}
}
//Circle effect on popup
function circle_popup(id){
	var res = id.split("_");
	var id = parseInt(res[1]);
	var graph_id = res[0];
	if(sync_chart[graph_id]){
		for(var i = 0; i < Object.keys(sync_chart).length; i++){
			if(sync_chart[graph_id] == Object.values(sync_chart)[i]){
				circle_popup_inner(id, Object.keys(sync_chart)[i])
			}
		}
	}
	else{
		circle_popup_inner(id, graph_id);
	}
}
function circle_popup_inner(id, graph_id){
	for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
		if(elems["c_"+graph_id+"_"+i+""+id]){
			elems["c_"+graph_id+"_"+i+""+id].animate({
				opacity : 1,
				r : path_details[graph_id][i].circle_zoom_in,
			},25);
		}
	}
}
//Circle effect on popdown
function circle_popdown(id){
	var res = id.split("_");
	var id = parseInt(res[1]);
	var graph_id = res[0];
	if(sync_chart[graph_id]){
		for(var i = 0; i < Object.keys(sync_chart).length; i++){
			if(sync_chart[graph_id] == Object.values(sync_chart)[i]){
				circle_popdown_inner(id, Object.keys(sync_chart)[i])
			}
		}
	}
	else{
		circle_popdown_inner(id, graph_id);
	}
}
function circle_popdown_inner(id, graph_id){
	for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
		if(elems["c_"+graph_id+"_"+i+""+id]){
			elems["c_"+graph_id+"_"+i+""+id].animate({
				r : path_details[graph_id][i].circle_zoom_out,
			},25);
		}
	}
}
//X axis hover
function x_axis_hover(id){
	var res = id.split("_");
	var id = parseInt(res[1]);
	var graph_id = res[0];
	if(sync_chart[graph_id]){
		for(var i = 0; i < Object.keys(sync_chart).length; i++){
			if(sync_chart[graph_id] == Object.values(sync_chart)[i]){
				x_axis_hover_inner(id, Object.keys(sync_chart)[i])
			}
		}
	}
	else{
		x_axis_hover_inner(id, graph_id);
	}
	
}
function x_axis_hover_inner(id, graph_id){
	if(instructions[graph_id].x_axis_hover_design == true){
		for(var i = 0; i<1; i++){
			var  p  = "M "+ ((2*paddingx[graph_id])+id*((width[graph_id]-(4*paddingx[graph_id]))/(datas[graph_id].length-1))) +" " + (2*paddingy[graph_id]) + " l 0 "+  ( (height[graph_id] - (4*paddingy[graph_id])) ) ;
			if(elems["px_"+graph_id+"_"+i]){
				elems["px_"+graph_id+"_"+i].animate({
					opacity : 1,
					path : p,
				}, 150);
			}		
		}
		
	}
}
//X axis hover out
function x_axis_hover_out(id){
	var res = id.split("_");
	var id = parseInt(res[1]);
	var graph_id = res[0];
	if(sync_chart[graph_id]){
		for(var i = 0; i < Object.keys(sync_chart).length; i++){
			if(sync_chart[graph_id] == Object.values(sync_chart)[i]){
				x_axis_hover_out_inner(id, Object.keys(sync_chart)[i])
			}
		}
	}
	else{
		x_axis_hover_out_inner(id, graph_id);
	}
}
function x_axis_hover_out_inner(id, graph_id){
	for(var i = 0; i<1; i++){
		if(elems["px_"+graph_id+"_"+i]){
			elems["px_"+graph_id+"_"+i].animate({
				opacity : 0,
			}, 150);
		}
	}
}
//Y axis hover
function y_axis_hover(id){
	var res = id.split("_");
	var id = parseInt(res[1]);
	var graph_id = res[0];	
	if(sync_chart[graph_id]){
		for(var i = 0; i < Object.keys(sync_chart).length; i++){
			if(sync_chart[graph_id] == Object.values(sync_chart)[i]){
				y_axis_hover_inner(id, Object.keys(sync_chart)[i])
			}
		}
	}
	else{
		y_axis_hover_inner(id, graph_id);
	}	
}
function y_axis_hover_inner(id, graph_id){
	if(instructions[graph_id].y_axis_hover_design == true){
		for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
			var  p  = "M "+ 2*paddingx[graph_id] +" " + ( (height[graph_id] - (2*paddingy[graph_id])) - ((Object.values(datas[graph_id][id].value)[i] - min_values[graph_id])*((height[graph_id]-(4*paddingy[graph_id]))/maxs[graph_id])) ) + " l "+  (width[graph_id]-(4*paddingx[graph_id])) +" 0";
			if(elems["py_"+graph_id+"_"+i]){
				elems["py_"+graph_id+"_"+i].animate({
					opacity : 1,
					path : p,
				}, 150);
			}
		}
	}
}
//Y axis hover out
function y_axis_hover_out(id){
	var res = id.split("_");
	var id = parseInt(res[1]);
	var graph_id = res[0];
	if(sync_chart[graph_id]){
		for(var i = 0; i < Object.keys(sync_chart).length; i++){
			if(sync_chart[graph_id] == Object.values(sync_chart)[i]){
				y_axis_hover_out_inner(id, Object.keys(sync_chart)[i])
			}
		}
	}
	else{
		y_axis_hover_out_inner(id, graph_id);
	}
}
function y_axis_hover_out_inner(id, graph_id){
	for(var i = 0; i<parseInt(instructions[graph_id].path_no); i++){
		if(elems["py_"+graph_id+"_"+i]){
			elems["py_"+graph_id+"_"+i].animate({
				opacity : 0,
			}, 150);
		}
	}
}

//////////////////////////////////////////////////SELECT AREA//////////////////////////////////////////////////////
//Draw select area
function select_area(){
	var rect1 = elems["paper_"+current_graph_id].rect(((2*paddingx[current_graph_id])), 2*paddingy[current_graph_id] , 0, (height[current_graph_id]-(4*paddingy[current_graph_id]))).attr({
		opacity : 0,
	});
	elems['zoom_rect_'+current_graph_id] = rect1;
}
var clicked_position = 0;
var val1 = 0;
var clicked_id = 0, unclicked_id = 0;

function mousedown(e){
	var id = this.id.replace('r_','');
	var res = id.split("_");
	id = parseInt(res[1]);
	var graph_id = res[0];
	if(instructions[graph_id].select_area == true){
		var id = parseInt(this.id.replace('r_'+graph_id+"_",''));
		clicked_id = id;
		elems['zoom_rect_'+graph_id].attr({
			x : ((2*paddingx[graph_id])+id*((width[graph_id]-(4*paddingx[graph_id]))/(datas[graph_id].length-1))),
			y :  2*paddingy[graph_id],
			'stroke-width' : 2,
			stroke : '#00376e',
			fill : '#0068d0',
			opacity : .1,
			width : 0,
		});
		clicked_position = e.clientX;
		val1 = ((2*paddingx[graph_id])+id*((width[graph_id]-(4*paddingx[graph_id]))/(datas[graph_id].length-1)));
	}
	
}
function mousemove(e){
	var id = this.id.replace('r_','');
	var res = id.split("_");
	id = parseInt(res[1]);
	var graph_id = res[0];
	if(instructions[graph_id].select_area == true){
		try{
			if(e.clientX  >= clicked_position){
				elems['zoom_rect_'+graph_id].attr({
					width : e.clientX - clicked_position,
				});
			}else{		
				elems['zoom_rect_'+graph_id].attr({
					x : val1 - (clicked_position - e.clientX),
					width : (clicked_position - e.clientX),
				});	
			}
		}catch(err){
		}
	}
}
function mouseup(){
	var id = this.id.replace('r_','');
	var res = id.split("_");
	id = parseInt(res[1]);
	var graph_id = res[0];
	unclicked_id = id;
	if(instructions[graph_id].select_area == true){
		elems['zoom_rect_'+graph_id].attr({
			opacity : 0,
		});
		if(clicked_id>unclicked_id){
			var a = clicked_id;
			clicked_id = unclicked_id;
			unclicked_id = a;
		}
		if(clicked_id != unclicked_id && unclicked_id > (clicked_id + 1)){	
			if(sync_chart[graph_id]){
				for(var i = 0; i < Object.keys(sync_chart).length; i++){
					if(sync_chart[graph_id] == Object.values(sync_chart)[i]){
						mouseup_inner(clicked_id, unclicked_id, Object.keys(sync_chart)[i])
					}
				}
			}
			else{
				mouseup_inner(clicked_id, unclicked_id, graph_id);
			}
			
		}
	}
}
function mouseup_inner(clicked_id, unclicked_id, graph_id){
	elems["paper_"+graph_id].clear();
			
	//Load instruction
	load_all_data(datas[graph_id].slice(clicked_id, unclicked_id+1), instructions[graph_id], path_details[graph_id]);			
	all_function();
}


////////////Common function ///////////////////
function number_format(number){
	try{
		var flag = false;
		var new_number = "";
		if(number<0){
			number = Math.abs(number);
			flag = true;
		}
		if(number >= 1000000000000000000){
			new_number = (number/1000000000000000000).toFixed(2) + "E";
		}
		else if(number >= 1000000000000000){
			new_number = (number/1000000000000000).toFixed(2) + "P";
		}
		else if(number >= 1000000000000){
			new_number = (number/1000000000000).toFixed(2) + "T";
		}
		else if(number >= 1000000000){
			new_number = (number/1000000000).toFixed(2) + "G";
		}
		else if(number >= 1000000){
			new_number = (number/1000000).toFixed(2) + "M";
		}
		else if(number >= 1000){
			new_number = (number/1000).toFixed(2) + "K";
		}
		else{
			new_number = number;
		}
		if(flag == true){
			new_number = "-"+new_number;
		}
		return new_number;		
	}catch(err){}
}

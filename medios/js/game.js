var color_alianza = "#514BEB";
var color_orda = "#FF2222";
var ANIMATE_TYPE = ">";
var ANIMATE_SPEED = 1000;

function Player(obj){
	this.name = obj.player_name;
	this.pos_x = obj.pos_x;
	this.pos_y = obj.pos_y;
	this.player_id = obj.player_id;
	this.player_type = obj.player_type;
	this.size = 10;
	this.speed = ANIMATE_SPEED;
	this.text_time_out = 5000;
}

Player.prototype.dibujar = function(){
	
	
	this.circle = paper.circle(this.pos_x, this.pos_y, this.size);
	this.player_text_name = paper.text(this.pos_x, this.pos_y + this.size + 8, this.name);
	
	
	if (this.player_type == "Alianza"){ this.circle.attr("fill", color_alianza );}
	else { this.circle.attr("fill", color_orda );}
	
	this.circle.attr("stroke", "#fff");
	
	this.circle.click(function(e){

		if (!e) var e = window.event
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		
		
	});
}


Player.prototype.move = function(x,y){
	this.pos_x = x;
	this.pos_y = y;
	this.clean_msg_text();
	this.circle.animate({cx: this.pos_x, cy: this.pos_y}, this.speed, ANIMATE_TYPE);
	this.player_text_name.animateWith(this.circle, {x: this.pos_x, y: this.pos_y + this.size + 8}, this.speed, ANIMATE_TYPE);
	
}


Player.prototype.say = function(msg){
	
	this.clean_msg_text();
	this.msg_text = paper.text(this.pos_x, this.pos_y - 20, msg);
	
	this.msg_text.attr("font-size","14px");
	this.msg_text.attr("text-anchor","start");
	
	//timer para autolimpiar el texto
	if (this.my_timer){  clearTimeout(this.my_timer);}
	this.my_timer = setTimeout(function(thisObj){ thisObj.clean_msg_text(); },this.text_time_out, this);
	
}

Player.prototype.clean_msg_text = function(){
	if (this.msg_text){ this.msg_text.remove(); }
}

Player.prototype.remove = function(){
	if (this.msg_text){ this.msg_text.remove(); }
	if (this.circle){ this.circle.remove(); }
	if (this.player_text_name) { this.player_text_name.remove(); }
}



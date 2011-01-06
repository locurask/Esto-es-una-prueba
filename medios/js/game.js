var color_alianza = "#514BEB";
var color_orda = "#FF2222";

function Player(obj){
	this.name = obj.name;
	this.pos_x = obj.pos_x;
	this.pos_y = obj.pos_y;
	this.player_id = obj.player_id;
	this.type = obj.type;
	this.size = 10;
	this.speed = 1500;
}

Player.prototype.dibujar = function(){
	this.circle = paper.circle(this.pos_x, this.pos_y, this.size);
	if (this.type == "Alianza"){ this.circle.attr("fill", color_alianza );}
	else { this.circle.attr("fill", color_orda ); }
	this.circle.attr("stroke", "#fff");
}


Player.prototype.move = function(x,y){
	this.pos_x = x;
	this.pos_y = y;
	this.circle.animate({cx: this.pos_x, cy: this.pos_y}, this.speed, "<>");
}



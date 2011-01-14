/**
 * Game Tag
 */


/**
 * Un tag
 */

var tags = {};
var relaciones= {};
var MAX_X = 898;
var MAX_Y = 400;
var ANIMATION_TYPE = ">"

function Tag(obj){
	this.x = obj.x;
	this.y = obj.y;
	this.size = obj.size;
	this.color = obj.color;
	this.dibujar();
}

Tag.prototype.dibujar = function(){
	this.circle = paper.circle(this.x, this.y, this.size);
	try{
		//paper.attr({cx:this.x, cy:this.y});
	}catch(e){
		console.log(e)
	}
	this.circle.attr("fill", this.color );
	
}


Tag.prototype.aumentar = function(){
	this.size += 1;
	this.circle.animate({r: this.size}, 500);
}

Tag.prototype.mover = function(mover_x, mover_y){
	
	this.x = this.x + mover_x;
	this.y = this.y + mover_y;
	this.circle.animate({cx:this.x, cy:this.y}, 1000, ANIMATION_TYPE);
}

Tag.prototype.efectoUltimo = function(){
	this.circle.animate({
		"20%": {r: this.size+10},
		"50%": {r: this.size+20},
		"100%": {r: this.size},
	}, 1000);
	//this.circle.animate({r: this.size}, 1000);
}


function RelacionTag(obj){
	this.x1 = obj.x1;
	this.x2 = obj.x2;
	this.y1 = obj.y1;
	this.y2 = obj.y2;
	this.color = obj.color;
	this.dibujar();
}

RelacionTag.prototype.dibujar = function(){
	this.path = paper.path("M"+this.x1+" "+this.y1+"L"+this.x2+" "+this.y2);
	this.path.attr({stroke: this.color, opacity: 0.5});
}

RelacionTag.prototype.mover = function(mover_x, mover_y){
	//this.path.translate(mover_x, mover_y);
	this.x1 = this.x1 + mover_x;
	this.y1 = this.y1 + mover_y;
	this.x2 = this.x2 + mover_x;
	this.y2 = this.y2 + mover_y;
	
	this.new_path = {path: "M"+this.x1+" "+this.y1+"L"+this.x2+" "+this.y2}
	//this.circle.translate(mover_x, mover_y);
	this.path.animate(this.new_path, 1000, ANIMATION_TYPE);
}


function myRand(max){
	//hasta 99
	
	var x = Math.floor(Math.random(1)*100) * Math.floor(Math.random(1)*10) 
	while(x > max || x == 0){
		var x = Math.floor(Math.random(1)*100) * Math.floor(Math.random(1)*10)
	}
	//console.log(x);
	return x;
	
}



function init_gametag(){

		dibujarPaper();
		
}

function agregarTag(){

		var valor = document.getElementById('id_input_tags').value;
		valor = valor.trim();
		if ( valor == '') return false;
		document.getElementById('id_input_tags').value = '';
		
		
		nombres = valor.split(' ');
		
		//creamos o agrandamos los tags
		for (i=0; i< nombres.length; i++){
				
			nombre = nombres[i];
		
			if (tags[nombre]){
	
				tags[nombre].aumentar();
				
			}else{
				oconf = {
						'x': myRand(MAX_X),
						'y': myRand(MAX_Y),
						'size': 5,
						'color': "#0095FF",
				};
				tags[nombre] = new Tag(oconf);
			}
			
			tag = tags[nombre];

			try{
				
				var mover_x=0;
				var mover_y=0;
				
				if(tag.x > MAX_X/2){
					mover_x = -1 * (tag.x - MAX_X/2);
				}else{
					mover_x = MAX_X/2 - tag.x;
					
				}
				
				if(tag.y > MAX_Y/2){
					mover_y = -1 * (tag.y - MAX_Y/2);
				}else{
					mover_y =  MAX_Y/2 - tag.y;
				}
				
				//console.log('x:'+tag.x+' y:'+tag.y+' MAX_X/2:'+MAX_X/2+' MAX_Y/2:'+MAX_Y/2);
				//console.log(mover_x);
				//console.log(mover_y);
				
				for(key in tags){
					tag = tags[key];
					tag.mover(mover_x, mover_y)
				}
				for(key in relaciones){
					//relaciones[key].translate(mover_x, mover_y);
					//relaciones[key].animate({cx:mover_x, cy:mover_y}, 1000, "bounce");
					//paper.path(relaciones[key].getSubpath(10,10)).attr({stroke: "#f00"})
					relaciones[key].mover(mover_x, mover_y);
				}
				//tags[nombre].circle.translate(mover_x,mover_y);
			}catch(e){
				console.log(e);
			}
		}
		
		//ahora las relaciones
		for (i=0; i < nombres.length; i++){
			nombre1 = nombres[i];
			for (j=0; j < nombres.length; j++){
				nombre2 = nombres[j];
				if (nombre1 != nombre2){
					if(!relaciones[nombre1+"-"+nombre2]){
						rconf = {
								'x1':tags[nombre1].x, 
								'y1':tags[nombre1].y, 
								'x2':tags[nombre2].x, 
								'y2':tags[nombre2].y,
								'color': '#0095FF'
						}
						try{
							relaciones[nombre1+"-"+nombre2] = new RelacionTag(rconf);
						}catch(e){
							console.log(e);
						}
					}
				}
			}
		}
		
		
		//efecto ultimo
		//efectoUltimo
		tags[ nombres[nombres.length -1] ].efectoUltimo();
		
		return false;
		
}





function linea(x1,y1, x2, y2){
	//console.log("M"+x1+" "+y1+"L"+x2+" "+y2);
	return paper.path("M"+x1+" "+y1+"L"+x2+" "+y2);
	
} 
function dibujarPaper(){
		paper = Raphael("the_paper", MAX_X, MAX_Y);
		paper.canvas.style.cssText = "background-color:#efefef;border:1px solid #cccccc;";
		
		
		/*var p = paper.path("M10,50c0,50,80-50,80,0c0,50-80-50-80,0z");
	    var path = p.getSubpath(10, 60);
	    paper.path(path).attr({stroke: "#f00"});
	    */
		
		/*
		for(i=1; i<400; i+=10){
			linea(0,i, i, 400);
		}
		*/
		
		/*
		x = ['a','b','c'];
		for (i=0; i < x.length; i++){
			y = x[i];
			for (j=0; j < x.length; j++){
				y2 = x[j];
				if (y != y2){
					console.log(y+" => "+y2);
				}
			}
		}
		*/
		
		
		
}








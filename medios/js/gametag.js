/**
 * Game Tag
 */


/**
 * Un tag
 */
var DEBUG = true;
var tags = {};
var relaciones= {};
var MAX_X = 898;
var MAX_Y = 400;
var ANIMATION_TYPE = ">"
var ANIMATION_SPEED = 2000;
var ultimoTag = false;

/**
 * Tag Object
 * @param obj
 * @returns {Tag}
 */
function Tag(obj){
	this.x = obj.x;
	this.y = obj.y;
	this.size = obj.size;
	this.color = obj.color;
	this.name = obj.name;
	this.dibujar();
}

Tag.prototype.dibujar = function(){
	
	this.circle = paper.circle(this.x, this.y, this.size);
	this.circle.attr("fill", this.color );
	this.text_name = paper.text(this.x, this.y, this.name);
	this.text_name.attr("fill", "#000000");
	this.text_name.attr("font-size", this.size+5);
	this.text_name.attr("weight", "bold");
	
}


Tag.prototype.aumentar = function(){
	this.size += 1;
	this.circle.animate({r: this.size}, ANIMATION_SPEED);
	this.text_name.attr("font-size", this.size+5);
	
}

Tag.prototype.mover = function(mover_x, mover_y){
	
	this.x = this.x + mover_x;
	this.y = this.y + mover_y;
	this.circle.animate({cx:this.x, cy:this.y}, ANIMATION_SPEED, ANIMATION_TYPE);
	this.text_name.animateWith(this.circle, {x: this.x, y: this.y}, ANIMATION_SPEED, ANIMATION_TYPE);
}

Tag.prototype.efectoUltimo = function(){
	this.circle.animate({
		"20%": {r: this.size+4, "fill": '#222222'},
		"50%": {r: this.size+8, "fill": '#999999'},
		"70%": {r: this.size+4, "fill": '#EEEEEE'},
		"100%": {r: this.size, "fill": this.color},
	}, 1000);
}



/**
 * RelacionTag 
 * @param obj  objeto de configuracion
 * @returns {RelacionTag}
 */
function RelacionTag(obj){
	this.x1 = obj.x1;
	this.x2 = obj.x2;
	this.y1 = obj.y1;
	this.y2 = obj.y2;
	this.name = obj.name;
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
	this.path.animate(this.new_path, ANIMATION_SPEED, ANIMATION_TYPE);
}


/**
 *  ////////////////////////////////////////////////////////////////////////
 */


function myRand(max){
	var x = Math.floor(Math.random(1)*100) * Math.floor(Math.random(1)*10) 
	while(x == 0){
		var x = Math.floor(Math.random(1)*100) * Math.floor(Math.random(1)*10)
	}
	logear('RANDOM: '+x);
	return x;
	
	
}

function espar(){
	if( (Math.floor(Math.random(1)*10))%2 == 0 ) {
		return true
	}
	return false
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
				
				var x = 0
				var y = 0;

				if(espar())	x = (ultimoTag)? ultimoTag.x + myRand(MAX_X):myRand(MAX_X)
				else x = (ultimoTag)? ultimoTag.x - myRand(MAX_X):myRand(MAX_X)

				if(espar())	y = (ultimoTag)? ultimoTag.y + myRand(MAX_Y):myRand(MAX_Y);
				else y = (ultimoTag)? ultimoTag.y - myRand(MAX_Y):myRand(MAX_Y);
				oconf = {
						'x': x,
						'y': y,
						'size': 10,
						'color': "#0095FF",
						'name': nombre,
				};
				logear("oconf x: "+oconf.x);
				tags[nombre] = new Tag(oconf);
			}
			
			tag = tags[nombre];
			tag.efectoUltimo();
			
			
			try{
				var mover_x=0;
				var mover_y=0;
				
				if(tag.x > MAX_X/2){
					mover_x =  -1 * (tag.x - MAX_X/2);
				}else{
					mover_x = MAX_X/2 - tag.x;
				}
				
				if(tag.y > MAX_Y/2){
					mover_y = -1 *  (tag.y - MAX_Y/2);
				}else{
					mover_y =  MAX_Y/2 - tag.y;
				}
				
				logear('mover_x: '+mover_x+' mover_y: '+mover_y);
				
				for(key in tags){
					tag = tags[key];
					tag.mover(mover_x, mover_y)
				}
				
				for(key in relaciones){
					relaciones[key].mover(mover_x, mover_y);
				}

			}catch(e){
				logear("ERROR: "+e)
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
		ultimoTag = tags[ nombres[nombres.length -1] ];
		return false;
		
}

function linea(x1,y1, x2, y2){
	return paper.path("M"+x1+" "+y1+"L"+x2+" "+y2);
}

function dibujarPaper(){
		
		the_paper = document.getElementById('the_paper');
		
		MAX_X = $('#the_paper').css('width').split('px')[0]/1
		MAX_Y = $('#the_paper').css('height').split('px')[0]/1
		paper = Raphael("the_paper", MAX_X, MAX_Y);
		
		
		onkeydown = function(e){
			mover = false;
			MOVER_CANT = 100;
			switch(e.keyIdentifier){
				case "Up":{
					//logear("ARRIBA");
					mover_x = 0;
					mover_y = +MOVER_CANT;
					mover = true;
				}break;
				case "Left":{
					//logear("IZQUIERDA");
					mover_x = +MOVER_CANT;
					mover_y = 0;
					mover = true;
				}break;
				case "Right":{
					//logear("DERECHA");
					mover_x = -MOVER_CANT;
					mover_y = 0;
					mover = true;
				}break;
				case "Down":{
					//logear("ABAJO");
					mover_x = 0;
					mover_y = -MOVER_CANT;
					mover = true;
				}break;
			}
			
			if(mover){
				AUX_SPEED = ANIMATION_SPEED;
				ANIMATION_SPEED = 500;
				for(key in tags){
					tag = tags[key];
					tag.mover(mover_x, mover_y);
				}
				for(key in relaciones){
					relaciones[key].mover(mover_x, mover_y);
				}
				ANIMATION_SPEED = AUX_SPEED;
			}
		}//end onkeydown
			
		//paper.canvas.style.cssText = "background-color:#efefef;border:1px solid #cccccc;";
		//paper.canvas.style.cssText = "background-color:#000000;";
		
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





function logear(msg){
	if (DEBUG){
		var log = document.getElementById('log');
		var p = document.createElement('p');
		p.innerHTML = msg;
		log.appendChild(p);
		log.scrollByLines(10);
	}
	return;
}


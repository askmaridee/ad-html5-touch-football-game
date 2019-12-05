
WIDTH  				= 280;
HEIGHT 				= 380;

WINDOW_WIDTH 		= window.innerWidth;
WINDOW_HEIGHT 		= window.innerHeight;

FROG_SPEED 			= 0.5;
FROG_FILL           = '#66cc00';//new Gradient({ endX:0, endY:80, colorStops:[[1, "#339900"], [0, "#66cc00"]] }); //'#00cc00';
FROG_LEGS_FILL		= '#66cc00';
FROG_WIDTH			= 48;//30;
FROG_HEIGHT			= 17;//30;
FROG_DEATH_MESSAGES = ["SPLAT!","OUCH, THAT ONE HURT","ROADKILL!","...AND YOU'RE DEAD","BEEEEEEEP! OUTTA THE WAY!","YEP, THAT WAS A CAR"];
FROG_SAFE_MESSAGES = ["BOOM-SHAK-A-LACKA!","GOOOOAAAAALLLLLLLL!","ONE SMALL STEP FOR FROG...","SCORE!","YOU MADE IT!","YOU'RE SAFE"];

CAR_DEFAULT_SPEED 	= 0.1;
CAR_SIZE 			= 15;
CAR_FILL 			= '#a9a9a9';
CAR_EXPLODE			= 'rgba(240,195,96,0.5)';
CAR_FILL_OPACITY 	= 1;
CAR_STROKE 			= '#464646';
CAR_STROKE_OPACITY 	= 0.25;
CAR_STROKE_WIDTH 	= 2;

PLAIN_CAR_WIDTH		= 48;//80;
PLAIN_CAR_HEIGHT	= 17;//40;
PLAIN_CAR_SPEED		= 0.06; // had to lower because of latency of websockets joystick, was 0.08
TRUCK_WIDTH 		= 48;//110;
TRUCK_HEIGHT		= 17;//40;
TRUCK_SPEED			= 0.04; // had to lower because of latency of websockets joystick, was 0.06
RACECAR_WIDTH		= 48;//80;
RACECAR_HEIGHT		= 17;//40;
RACECAR_SPEED		= .1; // had to lower because of latency of websockets joystick, was 0.12

ENDZONE_HEIGHT      = 65;
FROG_RECEIVER_HEIGHT= 58;//50;
FROG_RECEIVER_SPACE = 10;
FROG_RECEIVER_TOTAL_HEIGHT = FROG_RECEIVER_SPACE + FROG_RECEIVER_HEIGHT;

NUM_FROG_RECEIVERS	= 8;//5;

POINTS_FOR_SAFE_FROG = 7;//100;
SECONDS             = 14;
POINTS_FOR_CLEARED_LEVEL = 250;

GAME_BG_COLOR 		= '#111';

LOGBUFFERSIZE		= 12;
var logBuffer = new Array();
for (tempn=0;tempn<=LOGBUFFERSIZE-1;tempn++) {
	logBuffer[tempn] = "";
}

var downs = 0;

NodesCollided = function(obj1, obj2){
		//     ^       ^
		//  <--F--> <--C-->
		//     ^       ^

		if (obj1.x + obj1.w < obj2.x) {
			return false;
		}
		
		
		//     ^
		// <-- C -->
		//     ^
		//     ^
		// <-- F -->
		//     ^
		if (obj1.y + obj1.h < obj2.y) {
			return false;
		}
		
		
		//     ^       ^
		//  <--C--> <--F-->
		//     ^       ^
		if (obj1.x > obj2.x + obj2.w) {
			return false;
		}
		
		//     ^
		// <-- F -->
		//     ^
		//     ^
		// <-- C -->
		//     ^
		if (obj1.y > obj2.y + obj2.h){
			return false;
		}

		return true;
}

Frog = function(root, x, y) {

	this.isAlive = true;
    this.speed = FROG_SPEED;
    this.initial_points = 0;
    this.points = 0;
	this.animatePosition = 1;
    
    this.initialize = function(root, x, y) {

        this.node = new Rectangle(FROG_WIDTH, FROG_HEIGHT);
        this.node.w = FROG_WIDTH;
        this.node.h = FROG_HEIGHT;
        //this.node.x = x - FROG_WIDTH/2;
        this.node.x = WIDTH/2 - FROG_WIDTH/2;
        //this.node.y = y - FROG_HEIGHT/2; 
        this.node.y = HEIGHT - (FROG_HEIGHT * 2);
        this.node.zIndex = 1;
        
        //console.log(this.node.x);

        // Reset the x/y since frog position is relative to the node wrapper:
        x = 0;
        y = FROG_HEIGHT;
        var xPart = FROG_WIDTH/10;
        var yPart = FROG_HEIGHT/10;
        
        var frog_background = new Image();
        frog_background.src = "images/football/41030.png";
        var pattern = new Pattern(frog_background, 'repeat');
                
		/*this.frog = new Path([
		    ['moveTo',           [x+4*xPart,y-yPart*9]],
			['quadraticCurveTo', [x+5*xPart,y-FROG_HEIGHT, 	x+6*xPart,y-yPart*9]],
			['quadraticCurveTo', [x+9*xPart,y-yPart*4,	x+6*xPart,y-yPart*2]],
			['quadraticCurveTo', [x+5*xPart,y-yPart,		x+4*xPart,y-yPart*2]],
			['quadraticCurveTo', [x+1*xPart,y-yPart*4,	x+4*xPart,y-yPart*9]],
		],{
			fill: FROG_FILL,
            //fill: true,
            //fillStyle: pattern,
			fillOpacity:1
		});*/
            
        this.frog = new Rectangle(FROG_WIDTH,FROG_HEIGHT,{
			//fill: FROG_FILL,
            fill: pattern,
            fillOpacity:1
		});
		
		this.frogRightArm = new Path([
			['moveTo', [x+7*xPart,y-yPart*4]],
			['lineTo', [x+9*xPart,y-yPart*6]],
			['lineTo', [x+8*xPart,y-yPart*7]],
			['lineTo', [x+8*xPart,y-yPart*6]],
			['lineTo', [x+6*xPart,y-yPart*4]],
			['lineTo', [x+7*xPart,y-yPart*4]],
		],{
			fill: FROG_FILL,
			fillOpacity:1
		});
		
		this.frogLeftArm = new Path([
			['moveTo', [x+3*xPart,y-yPart*4]],
			['lineTo', [x+xPart,y-yPart*6]],
			['lineTo', [x+2*xPart,y-yPart*7]],
			['lineTo', [x+2*xPart,y-yPart*6]],
			['lineTo', [x+4*xPart,y-yPart*4]],
			['lineTo', [x+3*xPart,y-yPart*4]],
		],{
			fill: FROG_FILL,
			fillOpacity:1
		});
		
		this.frogLegs = new Path([
			['moveTo', [x+6*xPart,y-yPart*3]],
			['lineTo', [x+7*xPart,y-yPart]],
			['lineTo', [x+6*xPart,y]],
			['lineTo', [x+7*xPart,y]],			
			['lineTo', [x+9*xPart,y-yPart*2]],
			['lineTo', [x+8*xPart,y-yPart*3]],
			['lineTo', [x+7*xPart,y-yPart*4]],
            
            ['moveTo', [x+4*xPart,y-yPart*3]],
            ['lineTo', [x+3*xPart,y-yPart]],
            ['lineTo', [x+4*xPart,y]],
            ['lineTo', [x+3*xPart,y]],
            ['lineTo', [x+xPart,y-yPart*2]],
            ['lineTo', [x+2*xPart,y-yPart*3]],
            ['lineTo', [x+3*xPart,y-yPart*4]],
		],{
			fill: FROG_LEGS_FILL,
			fillOpacity:1
		});

		this.frog.fillOpacity = 1;

        this.node.append(this.frog);
		//this.node.append(this.frogRightArm);
		//this.node.append(this.frogLeftArm);
		//this.node.append(this.frogLegs);

        this.root.append(this.node);
        
        (this.node).className = "pep";
        
        //console.log((this.node).className);
        //console.log((this.node));

    }

	this.up = function(upratio) {
		//console.log("moving up: node.y= "+this.node.y);
		if (this.node.y>0){
			this.node.y -= this.node.h*this.speed*upratio;
		}
	}
    
    this.uptap = function(upratio) {
		//console.log("moving up: node.y= "+this.node.y);
		if (this.node.y>0){
			this.node.y -= this.node.h*this.speed*upratio;
		}
	}
    
    this.currentX = function () {
        
        //console.log(this.node.x);
        //console.log(this.node.y);
        return this.node.x;
        
    }
    
    this.currentY = function () {
        
        //console.log(this.node.y);
        //console.log(this.node.y);
        return this.node.y;
        
    }
	
	this.down = function(downratio) {
		//console.log("moving down: node.y= "+this.node.y);
		if (this.node.y<(HEIGHT-30)){
			this.node.y += this.node.h*this.speed*downratio;
		}
	}
    
    this.downtap = function(downratio) {
		//console.log("moving down: node.y= "+this.node.y);
        //console.log(this.node.y);
		if (this.node.y<(HEIGHT-30)){
			this.node.y += this.node.h*this.speed*downratio;
		}
	}
    
    this.moveLeft = function(leftratio) {
		// log("moving left: node.x= "+this.node.x);
		if (this.node.x>0){
			this.node.x -= (this.node.w*this.speed*leftratio) -10;
            //console.log(this.node.w*this.speed*leftratio);
		}
	}
	
	this.moveRight = function(rightratio) {	
		// log("moving right: node.x= "+this.node.x+"Width="+WIDTH);
		if (this.node.x<(WIDTH-30)){
			this.node.x += (this.node.w*this.speed*rightratio) - 10;
            //console.log(this.node.w*this.speed*rightratio);
		}
	}

	this.runOver = function() {
        this.frog.animateTo('fillOpacity', 0, 200, 'sine');
		this.frogRightArm.animateTo('fillOpacity', 0, 200, 'sine');
		this.frogLeftArm.animateTo('fillOpacity', 0, 200, 'sine');
		this.frogLegs.animateTo('fillOpacity', 0, 200, 'sine');
	}
	
	this.destroy = function(){
	    this.node.removeSelf();
	}
    

	this.handleMove = function(){

		if (this.animatePosition==1){
			this.frogRightArm.y -= 3;
			this.frogLeftArm.y += 3;
			this.frogLegs.y += 4;
			this.animatePosition = 0;
		}else{
			this.frogRightArm.y += 3;
			this.frogLeftArm.y -= 3;
			this.frogLegs.y -= 4;
			this.animatePosition = 1;
		}
		
	}

	this.animate = function(t, dt){
		
        if (this.root.keys["Up"]==1){
        	// log("Detected -Up- Move");
			//this.handleMove();     	
			this.up(1);
        } 
        
        if (this.root.taps["Up"]==1){
        	//console.log("Detected -Up- Move");
			//this.handleMove();     	
			this.up(1);
        } 
        
        if (this.root.sjoystick["Up"]>0 ){
        	// log("Detected -Up- Move with joystick");
			//this.handleMove();     	
			this.up(this.root.sjoystick["Up"]);
        } 
        
        if (this.root.keys["Down"]==1){
        	// log("Detected -Down- Move");
        	//this.handleMove();
        	this.down(1);
        } 
        
        if (this.root.taps["Down"]==1){
        	//console.log("Detected -Down- Move");
			//this.handleMove();     	
			this.down(1);
        }
        
        if (this.root.sjoystick["Down"]>0){
        	// log("Detected -Down- Move with joystick");
        	//this.handleMove();
        	this.down(this.root.sjoystick["Down"]);
        } 
        
        
        if (this.root.keys["Left"]==1){
        	// log("Detected -Left- Move");
			//this.handleMove();
        	this.moveLeft(1);
        } 
        
        if (this.root.taps["Left"]==1){
        	// log("Detected -Up- Move");
			//this.handleMove();     	
			this.moveLeft(1);
        }

        if (this.root.sjoystick["Left"]>0){
        	// console.log("Detected -Left- Move with joystick");
			//this.handleMove();
        	this.moveLeft(this.root.sjoystick["Left"]);
        } 

        
        if (this.root.keys["Right"]==1){
        	// log("Detected -Right- Move");
			//this.handleMove();
        	this.moveRight(1);
        }
        
        if (this.root.taps["Right"]==1){
        	// log("Detected -Up- Move");
			//this.handleMove();     	
			this.moveRight(1);
        }

        if (this.root.sjoystick["Right"]>0){
        	// console.log("Detected -Right- Move with joystick");
			//this.handleMove();
        	this.moveRight(this.root.sjoystick["Right"]);
        }
        
        //if (this

	
	}

    this.root = root;
    this.initialize(root, x, y);
}


CarFactory = {
	
	makeCar: function(type,x,y,direction,color){
		switch(type){
			case "TRUCK":
				return this._makeTruck(x,y,direction,color);
				break;
			case "RACECAR":
				return this._makeRaceCar(x,y,direction,color);
				break;
			case "PLAINCAR":
				return this._makePlainCar(x,y,direction,color);
				break;
		}
	},
	
	_makeCarWrapper: function(x,y,w,h){
		var wrapper = new Rectangle(w, h);
        wrapper.x = x;
        wrapper.y = y;
        wrapper.w = w;
        wrapper.h = h;
        return wrapper;
	},
	
	_makeTruck: function(x, y, direction,color){
		var base_w = TRUCK_WIDTH;
		var base_h = TRUCK_HEIGHT;
        
        /*var truck_background = new Image();
        truck_background.src = "http://a.aug.me/augmeimg/42000/41031.png";
        var pattern = new Pattern(truck_background, 'no-repeat');*/
		
		var car = this._makeCarWrapper(x,y,base_w,base_h);
		//car.fill = pattern;
        //car.fillOpacity = 1;
        
		// update w and x based on direction
		var w = (direction=="LEFT") ? base_w : -base_w;
		var h = base_h;
		x = (direction=="LEFT") ? 0 : base_w;
        
		var hPart = h/8

		/*var path1 = new Path([
          ['moveTo', [x+0		,hPart*2]],
	      ['lineTo', [x+2*w/11	,hPart]],
	      ['lineTo', [x+2*w/11	,0]],
	      ['lineTo', [x+4*w/11	,0]],
	      ['lineTo', [x+4*w/11	,hPart]],
	      ['lineTo', [x+5*w/11	,hPart]],
	      ['lineTo', [x+5*w/11	,0]],
	      ['lineTo', [x+w		,0]],
	      ['lineTo', [x+w		,h]],
	      ['lineTo', [x+5*w/11	,h]],
	      ['lineTo', [x+5*w/11	,7*hPart]],
	      ['lineTo', [x+4*w/11	,7*hPart]],
	      ['lineTo', [x+4*w/11	,h]],
	      ['lineTo', [x+2*w/11	,h]],
	      ['lineTo', [x+2*w/11	,7*hPart]],
	      ['lineTo', [x			,6*hPart]],
	      ['lineTo', [x			,2*hPart]]
        ],{
        	fill: color
        })*/
        
        var truck_background = new Image();
        truck_background.src = "images/football/41032.png";
        var pattern = new Pattern(truck_background, 'no-repeat');
        
        var path1 = new Rectangle(base_w,base_h,{
			//fill: FROG_FILL,
            fill: pattern,
            fillOpacity:1
		});

		//path1.w = w;
		//path1.h = h;
		car.append(path1)
		return car;
	},
	
	_makeRaceCar: function(x, y, direction,color){
		var base_w = RACECAR_WIDTH;
		var base_h = RACECAR_HEIGHT;
		
		var car = this._makeCarWrapper(x,y,base_w,base_h)
		
		// Reinitialize w / h / x, based on direction
		var w = (direction=="LEFT") ? base_w : -base_w;
		var h = base_h;
		x = (direction=="LEFT") ? 0 : base_w;
				
		//Car body
		/*var path1 = new Path([
		    ['moveTo', [x+0,h]],
		    ['lineTo', [x+15*w/120,h]],
		    ['lineTo', [x+15*w/120,55*h/70]],
		    ['lineTo', [x+100*w/120,55*h/70]],
		    ['lineTo', [x+100*w/120,h]],
		    ['lineTo', [x+w,h]],
		    ['lineTo', [x+w,0]],
		    ['lineTo', [x+100*w/120,0]],
		    ['lineTo', [x+100*w/120,15*h/70]],
		    ['lineTo', [x+15*w/120,15*h/70]],
		    ['lineTo', [x+15*w/120,0]],
		    ['lineTo', [x+0,0]]
	    ],{
	    	fill:color
	    });*/
	    
        
        var car_background = new Image();
        car_background.src = "images/football/41032.png";
        var pattern = new Pattern(car_background, 'no-repeat');
        
        var path1 = new Rectangle(base_w,base_h,{
			fill: pattern,
            fillOpacity:1
		});
        
        car.append(path1);
	    
	    //Bottom Left Tire
	    /*var path2 = new Path([
		    ['moveTo', [x+w/6,55*h/70]],
		    ['lineTo', [x+w/3,55*h/70]],
		    ['lineTo', [x+w/3,65*h/70]],
		    ['lineTo', [x+w/6,65*h/70]],
	    ],{
	    	fill:"#000"
	    });
		car.append(path2);
	      
	    //Top Left Tire
	    var path3 = new Path([
		    ['moveTo', [x+w/6,5*h/70]],
		    ['lineTo', [x+w/3,5*h/70]],
		    ['lineTo', [x+w/3,15*h/70]],
		    ['lineTo', [x+w/6,15*h/70]]
		],{
			fill:"#000"
		});
	    car.append(path3);
		
	    //Top Right Tire
	    var path4 = new Path([
		    ['moveTo', [x+7*w/12,15*h/70]],
		    ['lineTo', [x+7*w/12,0]],
		    ['lineTo', [x+3*w/4,0]],
		    ['lineTo', [x+3*w/4,15*h/70]]
		],{
			fill:"#000"
		});
	    car.append(path4)
		
	    //Bottom Right Tire
	    var path5 = new Path([
		    ['moveTo', [x+7*w/12,55*h/70]],
		    ['lineTo', [x+3*w/4,55*h/70]],
		    ['lineTo', [x+3*w/4,h]],
		    ['lineTo', [x+7*w/12,h]]
		],{
			fill:"#000"
		});
		car.append(path5)
	    
	    //Racing Strip
	    var path6 = new Path([
		    ['moveTo', [x+0,3*h/7]],
		    ['lineTo', [x+w,3*h/7]],
		    ['lineTo', [x+w,4*h/7]],
		    ['lineTo', [x+0,4*h/7]]
		],{
			fill:"#2E3192"
		});
		car.append(path6)
	    
	    //Windshield
	    var path7 = new Path([
		    ['moveTo', [x+w/2,2*h/7]],
		    ['lineTo', [x+2*w/3,2*h/7]],
		    ['lineTo', [x+2*w/3,5*h/7]],
		    ['lineTo', [x+w/2,5*h/7]]
		],{
			fill:"#000"
		});
	    car.append(path7)*/
		
		return car
	},
	
	_makePlainCar: function(x, y, direction,color){
		var base_w = PLAIN_CAR_WIDTH;
		var base_h = PLAIN_CAR_HEIGHT;
		
		var car = this._makeCarWrapper(x,y,base_w,base_h)
		
		// Reinitialize w / h / x, based on direction
		var w = (direction=="LEFT") ? base_w : -base_w;
		var h = base_h;
		x = (direction=="LEFT") ? 0 : base_w;
				
		var wPart = w/7;
		var hPart = h/8;
				
		//Car body
		/*var path1 = new Path([
		    ['moveTo', [x+0,h]],
		    ['moveTo', [x+1*wPart,0]],
			['lineTo', [x+2*wPart,0]],
			['lineTo', [x+2*wPart,hPart]],
			['lineTo', [x+3*wPart,hPart]],
			['lineTo', [x+3*wPart,0]],
			['lineTo', [x+5*wPart,0]],
			['lineTo', [x+5*wPart,hPart]],
			['lineTo', [x+6*wPart,hPart]],
			['lineTo', [x+6*wPart,0]],
			['quadraticCurveTo', [x+w,0, x+w,hPart*2]],
			['lineTo', [x+w,3*h/4]],
			['quadraticCurveTo', [x+w,h, x+6*wPart,h]],
			['lineTo', [x+6*wPart,h]],
			['lineTo', [x+6*wPart,7*hPart]],
			['lineTo', [x+5*wPart,7*hPart]],
			['lineTo', [x+5*wPart,h]],
			['lineTo', [x+3*wPart,h]],
			['lineTo', [x+3*wPart,7*hPart]],
			['lineTo', [x+2*wPart,7*hPart]],
			['lineTo', [x+2*wPart,h]],
			['lineTo', [x+wPart,h]],
			['quadraticCurveTo', [x+0,h/2, x+wPart,0]]
		],{
			fill: color
		});*/
        
        var car_background = new Image();
        car_background.src = "images/football/41032.png";
        var pattern = new Pattern(car_background, 'no-repeat');
        
        var path1 = new Rectangle(base_w,base_h,{
			fill: pattern,
            fillOpacity:1
		});
		
		car.append(path1);
		return car;
	}
}

Car = function(root, x, y, speed, direction, color, type) {

    this.initialize = function(root, x, y, speed, direction, color, type) {
		this.speed = speed;
		this.direction = direction;

        this.node = CarFactory.makeCar(type,x, y, direction,color);
	    this.root.append(this.node);
    }

    this.destroy = function() {
        this.root.unregister(this);
    	this.node.removeSelf();
    }

    this.animate = function(t, dt) {
    	
        if (this.direction=="LEFT"){
    		this.node.x -= this.speed;
    		if((this.node.x + this.node.w)<10){
        		this.destroy();
        	}
    	} else {
    		this.node.x += this.speed;
    		if((this.node.x)>WIDTH){
        		this.destroy();
        	}
    	}
        
    }

    this.root = root;
    this.speed = speed;
    this.initialize(root, x, y, speed, direction, color, type);
}


CarDispatcher = function(root, x, y, speed, direction,type) {
	this.speed = CAR_DEFAULT_SPEED;
	this.space_between_cars = 150;
	this.carColor = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255),1.0];

    this.initialize = function(root, x, y, speed, direction,type) {
		//this.speed = Math.floor(Math.random()*8+1);
        this.speed = Math.floor(Math.random()*4+1);
		this.space_between_cars = Math.random()*50+180;
		this.y = y;
		this.x = x;
		this.direction = direction; // LEFT or RIGHT
		this.max_cars = 3;
		this.cars = new Array();
    }

    this.new_car = function() {
	    var car = new Car(this, this.x, this.y, this.speed, this.direction, this.carColor,type);
	    this.cars.push(car);
	    this.num_cars = this.cars.length;
    }

	this.append = function(obj){
		this.root.append(obj);
	}

	this.unregister = function(car){
		this.cars.deleteFirst(car);
	}
	
	this.destroy = function(){
    	for(var i=0;i<this.cars.length;i++){
			this.cars[i].node.removeSelf();
		}
	}
	
    this.animate = function(t, dt) {
    	for(var i=0;i<this.cars.length;i++){
    		this.cars[i].animate(t, dt);
    	}

    	// If there's no cars, add one
    	if (this.cars.length==0){
    		this.new_car();
    	}
    	
		// if the cur number of cars isn't the max, see if we're ready to add one:
    	if(this.cars.length!=this.max_cars){
			
    		// get the last car that was added
    		var last_car = this.cars[this.cars.length-1];
    		
    		// If cars are moving to the left, and the top right corner of the car is more than the required space between cars away from the right side of canvas,
    		// then add another car
			if (this.direction=="LEFT" && last_car.node.x+last_car.node.w < (WIDTH-this.space_between_cars)){
    			this.new_car();
    			
    		// opposite of above condition, for cars moving to the right.  If there is enough spacing add another car
    		} else if (this.direction=="RIGHT" && last_car.node.x > this.space_between_cars){
    			this.new_car();
    		}
        }
        
    }

    this.root = root;
    this.initialize(root, x, y, speed, direction,type);
}

FrogReceiver = function(root,x,y,w,h){
	isEmpty: true;
	
	this.initialize = function(x,y,w,h) {
		this.isEmpty=true;
		
		this.node =  new Path([
	      ['moveTo', [x, y]],
	      ['lineTo', [x, y-h]],
	      ['lineTo', [x+w,y-h]],
	      ['lineTo', [x+w,y]],
	      ['bezierCurveTo', [x+w,y-h, x,y-h, x,y]],
	    ], {
	    	//stroke: '#fff',
      		//fill: '#996600'
	    });
            
        /*this.node = new Rectangle(w,h,{
			fill: '#996600',
            fillOpacity:1
		});*/
	    
	    this.x = x;
	    this.y = y;
	    this.w = w;
	    this.h = h;

		//this.root.append(this.node);
    }

    this.holdFrog = function(frog){
    	this.isEmpty=false;
		this.frog = frog;
        
        // remove the frog from the canvas;
        this.frog.destroy();

        var x = this.x;
        var y = this.y;
        var xPart = this.w/10;
        var yPart = this.h/6;
        
        this.star =  new Path([
            ['moveTo', [x+5*xPart, y]],
            ['lineTo', [x+xPart, y]],
            ['lineTo', [x+3*xPart, y-yPart]],
            ['lineTo', [x+2*xPart, y-4*yPart]],
            ['lineTo', [x+4*xPart, y-3*yPart]],
            ['lineTo', [x+5*xPart, y-5*yPart]],
            ['lineTo', [x+6*xPart, y-3*yPart]],
            ['lineTo', [x+8*xPart, y-4*yPart]],
            ['lineTo', [x+7*xPart, y-yPart]],
            ['lineTo', [x+9*xPart, y]],
            ['lineTo', [x+5*xPart, y]]
        ], {
            //fill: '#cccc00'
        });
    	
		//this.node.fill = "#663300";
        //this.root.append(this.star);
    }
	
	this.destroy = function(){
		if(this.frog){
			this.frog.destroy();
		}
		if(this.star){
			this.star.removeSelf();
		}
		this.node.removeSelf();
	}
	
    this.root = root;
    this.initialize(x,y,w,h);
}


Scoreboard = function(root){
	score: 0;
	lives: 4;
	level: 1;
	
	this.initialize = function(root){
		this.score = 0;
		this.lives = 4;
		this.level = 1;
		
		this.scoreDiv = document.getElementById("score");
		this.livesDiv = document.getElementById("lives");
		this.levelDiv = document.getElementById("level");
	}
	
	this.scoreSafeFrog = function(){
		this.score += POINTS_FOR_SAFE_FROG;
		this.updateStats();
	}

	this.scoreKilledFrog = function(){
		this.lives -= 1;
		if (this.lives==0){
			this.updateStats();
            //console.log(this.root);
			//this.root.endGame();
		}
		this.updateStats();
	}

	this.scoreFinishedLevel = function(){
		this.score += POINTS_FOR_SAFE_FROG;
		this.score += POINTS_FOR_CLEARED_LEVEL;
		this.level += 1;
	}

	this.updateStats = function(){
		//this.scoreDiv.innerHTML = this.score + "pts";
		//this.livesDiv.innerHTML = "x" + this.lives;
		//this.levelDiv.innerHTML = "Level: " + this.level;
	}

	this.root = root;
	this.initialize(root);
}


FroggerGame = Klass(CanvasNode, {
	paused: false,

    initialize : function(canvasElem) {
        CanvasNode.initialize.call(this);
        this.canvas = new Canvas(canvasElem);
        this.canvas.frameDuration = 35;
        this.canvas.append(this);
        this.canvas.fixedTimestep = true;
        this.canvas.clear = false;

		// setup the background
		this.setupBg();
		this.setupMessage();
		
		this.user = null; // Put fbUser here
		
		// Add the scoreboard
		this.scoreboard = new Scoreboard(this);
		
		// number of frogs + targets at the top for frogs to reach
		this.numFrogs = NUM_FROG_RECEIVERS;
		
		// setup the mapping for catching key presses
        this.keys = { "Up" : 0, "Down" : 0, "Left" : 0, "Right" : 0, "Ctrl" : 0 };
        // setup the mapping for catching key presses
        this.taps = { "Up" : 0, "Down" : 0, "Left" : 0, "Right" : 0, "Ctrl" : 0 };

		// setup the mapping for catching sockets joystick moves
        this.sjoystick = { "Up" : 0, "Down" : 0, "Left" : 0, "Right" : 0, "Ctrl" : 0 };        
        
        // show the get ready message while we start things...:
		//this.showMessage("Get Ready...",1000);
        this.showMessage("playy",1000);
		
		// Initialize a new game
        this.startGame();
    },
    
    setupBg : function() {
        this.bg = new Rectangle(WIDTH, HEIGHT);
        
        var bg_background = new Image();
        bg_background.src = "images/football/46506.png";
        var pattern = new Pattern(bg_background, 'no-repeat');
        
        //this.bg.fill = GAME_BG_COLOR;
        this.bg.fill = pattern;
        this.bg.fillOpacity = 1;
        
        this.bg.zIndex = -1000;
        this.append(this.bg);

		var middleGrass = new Rectangle(WIDTH,50);
		middleGrass.fill = new Gradient({ endX:0, endY:50, colorStops:[[1, "#003300"], [0.5, "#115500"], [0,"#003300"]] });
		middleGrass.y = FROG_RECEIVER_TOTAL_HEIGHT + 180;
		//this.append(middleGrass);

		var bottomGrass = new Rectangle(WIDTH,80);
		bottomGrass.fill = new Gradient({ endX:0, endY:80, colorStops:[[1, "#339900"], [0, "#003300"]]});
		bottomGrass.y = FROG_RECEIVER_TOTAL_HEIGHT + 360;
		this.append(bottomGrass);
    },

	setupMessage : function() {
		// Setup the basic message box we'll use for telling the user stuff
		this.message = document.getElementById("message");
		//this.message.style.top = (FROG_RECEIVER_TOTAL_HEIGHT + 225) + "px";
        //this.message.style.top = (FROG_RECEIVER_TOTAL_HEIGHT + 100) + "px";
	    //this.message.style.left = WINDOW_WIDTH/2-150 + "px";
	},
	
	showMessage : function(klass,duration){
        
        //var context = this;
		//this.message.innerHTML = message;
		//context.message.style.display = "block";
        $("#message").css("display", "block");
        
        switch (klass) {
                case "playy":
                    $("#message").addClass(klass);
                    $("#message").removeClass("touchdown");
                    $("#message").removeClass("tackle");
                    $("#message").removeClass("over");
                    break;
                case "touchdown":
                    $("#message").addClass(klass);
                    $("#message").removeClass("tackle");
                    $("#message").removeClass("playy");
                    $("#message").removeClass("over");
                    break;
                case "over":
                    $("#message").addClass(klass);
                    $("#message").removeClass("tackle");
                    $("#message").removeClass("playy");
                    $("#message").removeClass("touchdown");
                    break;
                default:
                    $("#message").addClass(klass);
                    $("#message").removeClass("playy");
                    $("#message").removeClass("touchdown");
                    $("#message").removeClass("over");
                    break;
        }
        
		var context = this;
		setTimeout(function(){
			var msg = document.getElementById("message");
			msg.style.display = "none";
		},duration)
	},
    
	startGame: function() {
        
        var time = 1;
        
		this.addNewFrog();
		
		this.carDispatchers = [];
		this.frogReceivers = [];
		this.frogsLeft = this.numFrogs;

		// Add The frog receivers at the top:
		for (var f=0,ff=this.numFrogs;f<ff;f++){
			this.frogReceivers.push(new FrogReceiver(this,
											(WIDTH/this.numFrogs)*f, 
											FROG_RECEIVER_HEIGHT, 
											(WIDTH/this.numFrogs),  
											FROG_RECEIVER_HEIGHT)); 
            /*this.frogReceivers.push(new FrogReceiver(this,
											WIDTH, 
											FROG_RECEIVER_HEIGHT, 
											WIDTH,  
											FROG_RECEIVER_HEIGHT)); */
		}
		
        setInterval( function() {countSeconds(this)}, 1000);
        
        function countSeconds (root) {   
            if (time <= SECONDS) {
                if (time < 10) {
                    $("#clockshadow, #clock").html(":0" + time);
                } else {
                    $("#clockshadow, #clock").html(":" + time);
                }
                time++;
               // console.log(time);
                
                if (time > SECONDS) {
                    FG.endGame();
                }
            }
            
        }
		
		// Instantiate the Car Dispatchers on top (not actually drawn on canvas, just placeholders where the cars come from)
		//this.carDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT , RACECAR_SPEED, "LEFT","RACECAR"));
        this.carDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT + 5, RACECAR_SPEED, "LEFT","RACECAR"));
		//this.carDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT + 60,TRUCK_SPEED, "LEFT","TRUCK"));
        //this.carDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT + 30,TRUCK_SPEED, "LEFT","TRUCK"));
		this.carDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT + 70,TRUCK_SPEED, "LEFT","PLAINCAR"));
        //this.carDispatchers.push(new CarDispatcher(this, WIDTH, FROG_RECEIVER_TOTAL_HEIGHT + 90,PLAIN_CAR_SPEED, "LEFT","PLAINCAR"));
		
		// Instantiate the Car Dispatchers (not actually drawn on canvas, just placeholders where the cars come from)
		//this.carDispatchers.push(new CarDispatcher(this, -100, FROG_RECEIVER_TOTAL_HEIGHT + 240,TRUCK_SPEED, "RIGHT","TRUCK"));
        //this.carDispatchers.push(new CarDispatcher(this, -100, FROG_RECEIVER_TOTAL_HEIGHT + 140,PLAIN_CAR_SPEED, "RIGHT","TRUCK"));
		//this.carDispatchers.push(new CarDispatcher(this, -100, FROG_RECEIVER_TOTAL_HEIGHT + 300,RACECAR_SPEED, "RIGHT","RACECAR"));
        this.carDispatchers.push(new CarDispatcher(this, -100, FROG_RECEIVER_TOTAL_HEIGHT + 180,TRUCK_SPEED, "RIGHT","RACECAR"));
		
		// Start the animation
        this.addFrameListener(this.animate);
	},

	cleanUpCanvas : function() {
    	for(var i=0;i<this.carDispatchers.length;i++){
			this.carDispatchers[i].destroy();
		}
		for(var i=0;i<this.frogReceivers.length;i++){
			this.frogReceivers[i].destroy();
		}
	},
	
    endGame : function(root) {
		var context = this;
        
        //console.log(this);
        
        $("#play-again").css("display", "block");
        if (downs < 1) {
            $("#play-again #inner p").html("Nice try! Not every new team owner wins every time. Give it another try or just sit back and think of all the things you could do if you won today's high jackpot.");
        } else {
            $("#play-again #inner p").html("Congrats, You&rsquo;ve shown you&rsquo;re worthy of your owner status &mdash; and you now know todays high jackpot. Now just imagine all that you could do with all those winnings. Like buy your own team, for real.");
        }
        $("#screen").css("display", "none");
        $("#tdtext").hide();
        $("#header").removeClass("gameplay");
        $(".disclaim").css("bottom", "-4px");
        downs = 0;
        $("#touchdowns").html(downs);
		
		this.showMessage("over",5000);
		
		this.removeFrameListener(this.animate);
		this.cleanUpCanvas();
		this.canvas.removeAllChildren();
		
		// Show link to start new game:
		//document.getElementById("startOver").style.display = "block";
    },

	nextLevel : function(){
		// Score the Completed Level
		this.scoreboard.scoreFinishedLevel();

		// stop the animation madness
		this.removeFrameListener(this.animate);
		
		// clear the canvas
		this.cleanUpCanvas();

		// Restart the Game and the animation
		this.startGame();
	},
	
	recordDeadFrog : function(){
		this.frog.runOver();
		this.scoreboard.scoreKilledFrog();
		if (this.scoreboard.lives!=0){
			//this.showMessage(FROG_DEATH_MESSAGES[Math.floor(Math.random()*FROG_DEATH_MESSAGES.length)],1000);
            this.showMessage("tackle",1000);
			this.addNewFrog();
		}
	},

	recordSafeFrog : function(){
		this.scoreboard.scoreSafeFrog();
		this.frogsLeft -= 1;
		var context = this;
		if (this.frogsLeft==0){
			//this.showMessage("Nice Job...Starting Level " + (this.scoreboard.level+1),1000);
            this.showMessage("Nice" + (this.scoreboard.level+1),1000);
			this.nextLevel();
		} else {
			//this.showMessage(FROG_SAFE_MESSAGES[Math.floor(Math.random()*FROG_SAFE_MESSAGES.length)],1000);
            this.showMessage("touchdown",1000);
            downs++;
            $("#touchdowns").html(downs);
			this.addNewFrog();
		}
	},

	addNewFrog : function(){
		var context = this;
		this.paused = true;
		setTimeout(function(){
			context.frog = new Frog(context,HEIGHT-10,WIDTH/2);
			context.scoreboard.updateStats();
			context.paused = false;
		},1000)
	},

    key : function(state, name) {
    	// log(state+" "+name);
    	this.keys[name] = state;
    },
    
    touchy : function(state, name) {
    	//console.log(state+" "+name);
    	this.taps[name] = state;
        //console.log(this.taps[name] +' '+ state);
    },

    joystick : function(state, name) {
    	// log(state+" "+name);
    	this.sjoystick[name] = state;
    },
    
    animate: function(t, dt){
		if (this.paused){
			return false;
		}
		
		this.frog.animate(t, dt);

    	for(var i=0;i<this.carDispatchers.length;i++){
    		this.carDispatchers[i].animate(t, dt);
    		
    		// Check if the frog got hit by any of the cars
    		var cars = this.carDispatchers[i].cars;
    		for(var c=0,cc=cars.length;c<cc;c++){
    			if (NodesCollided(cars[c].node,this.frog.node)){
    				this.recordDeadFrog();
    				break;
    			}
    		}
    	}
    	
    	// The if doesn't event get entered unless the frog breaks the y-axis plane of the receivers at the top
		if (this.frog.node.y<ENDZONE_HEIGHT){
			for(var r=0,rr=this.frogReceivers.length;r<rr;r++){
                this.frogReceivers[r].holdFrog(this.frog);
                this.recordSafeFrog();
                 break;
				/*if(NodesCollided(this.frog.node,this.frogReceivers[r])){
					/*if (this.frogReceivers[r].isEmpty){
						this.frogReceivers[r].holdFrog(this.frog);
						this.recordSafeFrog();
						break;
					} else {
						this.recordDeadFrog();
						break;
					}*/
                    /*this.frogReceivers[r].holdFrog(this.frog);
                    this.recordSafeFrog();
                    break;
				}*/
			}
		}
		

	}

})

function pad(number, length) {
      
     var str = '' + number;
     while (str.length < length) {
         str = '0' + str;
     }
 
     return str;
}


init = function() {
	
    //pin = pad(Math.floor(Math.random() * 9999), 4);
    //document.getElementById('pinForMobile').innerHTML = pin;
//    if(navigator.javaEnabled() && (navigator.appName != "Microsoft Internet Explorer")) {
//    	vartool=java.awt.Toolkit.getDefaultToolkit();
//    	addr=java.net.InetAddress.getLocalHost();
//    	host=addr.getHostName();
//    	ip=addr.getHostAddress();
//    }
	
    var c = E.canvas(WIDTH, HEIGHT)
    var d = E('div', { id: 'screen' })
    
	// remove the canvas container from the DOM, so we can insert a new one if they play again
	var screenDiv = document.getElementById("screen");
    var wrapper = document.getElementById("wrapper");
	if (screenDiv) wrapper.removeChild(screenDiv);
    
    //screenDiv.setAttribute("class", "constrain-to-parent");
	
	//document.getElementById("startOver").style.display = "none";
    
    d.appendChild(c)
   // document.body.appendChild(d) 
    wrapper.appendChild(d);
    
   // d.setAttribute("class", "constrain-to-parent");
    
    FG = new FroggerGame(c)

    if (document.addEventListener)
    {
        document.addEventListener("keypress", Ignore,  false)
        document.addEventListener("keydown",  KeyDown, false)
        document.addEventListener("keyup",    KeyUp,   false)
        document.addEventListener("touchstart", Touch,  false)
        document.addEventListener("touchend", TouchEnd,  false)
    }
    else if (document.attachEvent)
    {
        document.attachEvent("onkeypress", Ignore)
        document.attachEvent("onkeydown",  KeyDown)
        document.attachEvent("onkeyup",    KeyUp)
        document.attachEvent("touchstart", Touch)
        document.attachEvent("touchend", TouchEnd)
    }
    else
    {
        document.onkeypress = Ignore
        document.onkeydown  = KeyDown
        document.onkeyup    = KeyUp;
        document.touchstart = Touch;
        document.touchend   = TouchEnd;
    }

    function Ignore(e) {
        if (e.preventDefault) e.preventDefault()
        if (e.stopPropagation) e.stopPropagation()
    }
    function KeyUp(e) {
        OnKey(0,e)
    }
    function KeyDown(e) {
        OnKey(1,e)
    }
    
    function Touch(e) {
        Touched (1,e)
    }
    
    function TouchEnd(e) {
        Touched (0,e);
       // console.log("lifted tap");
    }
    
    function OnKey(state, e)
    {
        if (e.preventDefault) e.preventDefault()
        if (e.stopPropagation) e.stopPropagation()
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
        switch(KeyID)
        {
            case 37:
                FG.key(state,"Left")
                break;
            case 38:
                FG.key(state,"Up")
                break;
            case 39:
                FG.key(state,"Right")
                break;
            case 40:
                FG.key(state,"Down")
                break;
        }
    }
    
    function Touched (state, e) {
        //if (e.preventDefault) e.preventDefault()
        //if (e.stopPropagation) e.stopPropagation()
        
        var touch = e.touches[0] || e.changedTouches[0];
            //CODE GOES HERE
        //console.log(touch.pageY+' '+touch.pageX);
        var offset = $("canvas").offset();
        var x = touch.pageX - offset.left;
        var y = touch.pageY - offset.top;
        
        //var frogY = FG.frog.currentY();
        //var frogX = FG.frog.currentX();
        var diffx = 0;
        var diffy = 0
        
        if (FG.frog) {
            diffx = Math.abs(FG.frog.node.x - x);
            diffy = Math.abs(FG.frog.node.y - y);
        }
        
        var direction = "";
        
        //console.log("current frog: " + FG.frog.node.x+' '+FG.frog.node.y);
       // console.log("touch: " + x+' '+y);
        console.log("difference " + diffx + ' ' + diffy);
        
        if (diffy > diffx) {
            
            if (diffy > 5) {
                if ((y > 0) && (y < HEIGHT)) {
                   if (FG.frog.node.y >= y) {
                       // console.log("up");
                       direction = "up";
                       //console.log(state);
                        //FG.touchy(state,"Up");
                    } 
                    if (FG.frog.node.y < y) {
                        direction = "down";
                    }
                }
            }
        } else {
            
            if (diffx > 5) {
                if ((x < WIDTH) && (x > 0)) {
                    if (FG.frog.node.x < x){
                        direction = "right";
                        //console.log("right");
                        //FG.touchy(state,"Right")
                    } else {
                        //console.log("left");
                        direction = "left";
                        //FG.touchy(state,"Left");
                        
                    }
                }
            }
        }
        //console.log("direction is " + direction);
        
        
        switch(direction)
        {
            case "down":
                //console.log("state is " + state);
                FG.touchy(0,"Up");
                FG.touchy(0,"Right");
                FG.touchy(0,"Left");
                FG.touchy(state,"Down");
                break;
            case "up":
                //console.log("state is " + state);
                FG.touchy(0,"Down");
                FG.touchy(0,"Right");
                FG.touchy(0,"Left");
                FG.touchy(state,"Up");
                break;
            case "right":
               // console.log("state is " + state);
                FG.touchy(0,"Left");
                FG.touchy(0,"Up");
                FG.touchy(0,"Down");
                FG.touchy(state,"Right");
                break;
            case "left":
                //console.log("state is " + state);
                FG.touchy(0,"Right");
                FG.touchy(state,"Left");
                FG.touchy(0,"Up");
                FG.touchy(0,"Down");
                break;
            default:
                FG.touchy(0,"Right");
                FG.touchy(0,"Left");
                FG.touchy(0,"Up");
                FG.touchy(0,"Down");
                break;
        } 
        
        
        
        /*switch(directionH)
        {
            case "right":
               // console.log("state is " + state);
                FG.touchy(0,"Left");
                FG.touchy(0,"Up");
                FG.touchy(0,"Down");
                FG.touchy(state,"Right");
                break;
            case "left":
                //console.log("state is " + state);
                FG.touchy(0,"Right");
                FG.touchy(state,"Left");
                FG.touchy(0,"Up");
                FG.touchy(0,"Down");
                break;
        }*/
        
        /*if ((y > 0) && (y < HEIGHT) && (diffy > 40)) {
            if (FG.frog.node.y >= y) {
                console.log("up");
                
                FG.touchy(state,"Up");
            } else {
                console.log("down");   
                FG.touchy(state,"Up");
            }
        } */

         
    }
    
    // establish sockets connection

	var connection = null;
	var topic = null;
	
	try {
		// Tracer.setTrace(true);
		conLog("Initializing Sockets");
		//JMS_URL = "ws://demo.kaazing.com:80/jms";
        JMS_URL = makeURL ("jms", "wss");
		conLog("Connecting to "+JMS_URL);
		var stompConnectionFactory = new StompConnectionFactory(JMS_URL);
		conLog("Created StompConnectionFactory, creating connection...");
		var connectionFuture = stompConnectionFactory.createConnection(
			function () {
				if (!connectionFuture.exception) {
					conLog("CONNECTED");
					connection = connectionFuture.getValue();
					connection.setExceptionListener(handleException);
			
					session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			
					conLog("Creating topic: /topic/"+pin);
					topic = session.createTopic("/topic/"+pin);
					consumer = session.createConsumer(topic);
					consumer.setMessageListener(handleMessage);
			
					connection.start(onConStart);
				}
				else {
					handleException(connectionFuture.exception);
				}
			}
		);
	}
	catch (e) {
		handleException(e);
	}

    function onConStart() {
        try {
		    var producer = session.createProducer(topic);
            // var msg = session.createTextMessage("0&0&0&0");
            // msg.setJMSCorrelationID("1234");
            // msg.setJMSPriority(9);
			// producer.send(msg, function(){clearToSend=1;log("got callback");});
			conLog("Listening to JMS topic: /topic/"+pin);
			moveLog("No JMS Received yet, waiting...");
        }
        catch (e) {
            handleException(e);
        }
    }
    
    function handleMessage(message) {
    	
		// setup the mapping for catching sockets joystick moves
        // log(message.getText()+" "+message.getJMSDestination().getTopicName()+" "+message.getJMSCorrelationID()+" "+message.getJMSPriority());
        
    	var timeNow = new Date().getTime();
		
    	// if (message.getJMSExpiration()<timeNow){
            // split messages and states
            temp=message.getText().split('&');   
            moveLog("JMS Received: State="+message.getText());
            FG.joystick(temp[0], "Left");
            FG.joystick(temp[1], "Up");
            FG.joystick(temp[2], "Right");
            FG.joystick(temp[3], "Down");
            // setTimeout("log('TimeOut'); FG.joystick(0, 'Left'); FG.joystick(0, 'Up'); FG.joystick(0, 'Right'); FG.joystick(0, 'Down');",2000);    		
    	// }
    }
    
    function handleException(e) {
        //console.log("EXCEPTION: "+e);
//        if (connection) {
//            connection.close(null);
//        }
    }
	
}

function log(logMsg) {
	var elem = document.getElementById("log");
	var tempLogBuffer="";
	logBuffer[0] = logBuffer[1]; //DISCARD THE FIRST LINE
	var n = 0;
	for (n=1;n<=LOGBUFFERSIZE-2;n++) {
		tempLogBuffer = tempLogBuffer+"\n"+logBuffer[n];
		logBuffer[n] = logBuffer[n+1];
	}
	logBuffer[LOGBUFFERSIZE-1] = logMsg;
	// elem.innerHTML=tempLogBuffer+"\n"+logMsg;
}

function conLog(conStatus){
	// populate conStatus
	//document.getElementById("conStatus").innerHTML = conStatus;
}

function moveLog(moveStatus){
	// populate moveStatus
	//document.getElementById("moveStatus").innerHTML = moveStatus;
}


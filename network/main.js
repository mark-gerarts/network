var MathFunctions = {
    random: function(min, max) {
        return Math.floor(Math.random() * max) + min; 
    }
}



var Point = function(x, y, radius, direction, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.direction = direction;
    this.velocity = velocity;
}

var Network = function(canvas, numberOfPoints) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.fps = 30;
    this.dt = 1 / this.fps;
    this.ctx = document.getElementById('myCanvas').getContext('2d');
    this.interval;
    this.points = [];
    this.color = "#FFFFFF";
    this.rainbow = false;
    this.vmin = 15;
    this.vmax = 60;
    
    this.randomizeDirections = function() {
        for(var i=0; i<this.points.length; i++) {
            //Random direction (up, left,..)
            var rd = MathFunctions.random(0, 3);
            var direction;
            
            switch(rd) {
                case 0: //Left
                    direction = {x: 0, y: MathFunctions.random(0, this.height)};
                    break;
                case 1: //Right
                    direction = {x: this.width, y: MathFunctions.random(0, this.height)};
                    break;
                case 2: //Up
                    direction = {x: MathFunctions.random(0, this.width), y: 0};
                    break;
                case 3:
                    direction = {x: MathFunctions.random(0, this.width), y: this.height};
                    break;
            }
            
            this.points[i].direction = direction;
        }
    }
    
    this.setColor = function(color) {
        this.color = color;
    }
    
    this.randomizeColor = function() {
        function randomHex() { //ToDo: use convert to hex
            var r = MathFunctions.random(0, 15);
            switch(r) {
                case 10:
                    r = 'A';
                    break;
                case 11:
                    r = 'B';
                    break;
                case 12:
                    r = 'C';
                    break;
                case 13:
                    r = 'D';
                    break;
                case 14:
                    r = 'E';
                    break;
                case 15:
                    r = 'F';
                    break;
            }
            return r;
        }
        
        var hex = ['#'];
        for(var i=0; i<6; i++) {
            hex.push(randomHex());
        }
        this.setColor(hex.join(''));
    }
    
    this.setVelocities = function(vmin, vmax) {
        for(var i=0; i<this.points.length; i++) {
            this.points[i].velocity = MathFunctions.random(vmin, vmax);
        }
    }
    
    this.draw = function() {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, this.width, this.height);
        
        //Points
        for(var i=0; i<this.points.length; i++) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.points[i].x, this.points[i].y, this.points[i].radius, 0, Math.PI*2, true); 
            ctx.closePath();
            ctx.fill();    
        }
        
        //Lines
        for(var i=0; i<this.points.length; i++) {
            if(i != this.points.length - 1) {
                ctx.strokeStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(this.points[i].x, this.points[i].y);
                ctx.lineTo(this.points[i+1].x, this.points[i+1].y);
                ctx.stroke(); 
            } else {
                ctx.strokeStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(this.points[i].x, this.points[i].y);
                ctx.lineTo(this.points[0].x, this.points[0].y);
                ctx.stroke();
            }
        }
    }
    
    this.update = function() {
        //Update point positions
        for(var i=0; i<this.points.length; i++) {
            //X-movement
            var deltaX = this.points[i].direction.x - this.points[i].x;
            var deltaY = this.points[i].direction.y - this.points[i].y;
            var rad = Math.atan2(deltaY, deltaX); //ArcTan2: gives the vector angle in radians
            var v_x = this.points[i].velocity * Math.cos(rad); //Get the horizontal component
            var v_y = this.points[i].velocity * Math.sin(rad); //Get the vertical component
            
            this.points[i].x += this.dt * v_x;
            this.points[i].y += this.dt * v_y;
            
            //Change directions
            if(this.points[i].x <= (0+this.points[i].radius*2) || this.points[i].x >= (this.width - this.points[i].radius*2)
                || this.points[i].y <= (0+this.points[i].radius*2) || this.points[i].y >= (this.height - this.points[i].radius*2)) {
                this.randomizeDirections();
                
            }
            
        }
    }
    
    this.step = function() {
        this.update();
        this.draw();
    }
    
    this.start = function() {
        var self = this;
        function render() { 
            self.interval = setTimeout(function() {
                requestAnimationFrame(render);
                self.update();
                self.draw();
                if(self.rainbow) {
                    self.randomizeColor();
                }
            }, 1000 / self.fps);
        }
        render(); //Start rendering
    }
    
    this.pause = function() {
        clearInterval(this.interval);
    }
    
    this.createPoints = function() {
        //Create points
        for(var i=0; i<numberOfPoints; i++) {
            this.points.push(new Point(
                MathFunctions.random(0, this.width),
                MathFunctions.random(0, this.height),
                3,
                {x: 0, y: 0},
                MathFunctions.random(this.vmin, this.vmax)
            ));
        }
    }
    
    this.init = function() {
        this.createPoints();        
        this.randomizeDirections();
        this.draw();
        this.start(); //Start rendering
    }
}



var canvas, network;
window.onload = function() {
    canvas = document.getElementById('myCanvas');
    network = new Network(canvas, 7);
    
    network.init();
    
    
}
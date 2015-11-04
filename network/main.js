var MathFunctions = {
    random: function(min, max) {
        return Math.floor(Math.random() * max) + min; 
    }
}



var Point = function(x, y, radius, direction) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.direction = direction;
    this.velocity = 15;
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
    
    this.draw = function() {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, this.width, this.height);
        
        //Points
        for(var i=0; i<this.points.length; i++) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.points[i].x, this.points[i].y, this.points[i].radius, 0, Math.PI*2, true); 
            ctx.closePath();
            ctx.fill();    
        }
        
        //Lines
        for(var i=0; i<this.points.length; i++) {
            if(i != this.points.length - 1) {
                ctx.strokeStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.moveTo(this.points[i].x, this.points[i].y);
                ctx.lineTo(this.points[i+1].x, this.points[i+1].y);
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
            }, 1000 / self.fps);
        }
        render(); //Start rendering
    }
    
    this.pause = function() {
        clearInterval(this.interval);
    }
    
    this.init = function() {
        //Create points
        for(var i=0; i<numberOfPoints; i++) {
            this.points.push(new Point(
                MathFunctions.random(0, this.width),
                MathFunctions.random(0, this.height),
                3,
                {x: MathFunctions.random(0, this.width), y: MathFunctions.random(0, this.height)}
            ));
        }
        
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
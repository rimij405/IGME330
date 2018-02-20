// Part III #2B
moveCircles: function(dt){
		for(var i=0;i<this.circles.length; i++){
			var c = this.circles[i];
			if(c.state === this.CIRCLE_STATE.DONE) continue;
			if(c.state === this.CIRCLE_STATE.EXPLODING){
				c.radius += this.CIRCLE.EXPLOSION_SPEED  * dt;
				if (c.radius >= this.CIRCLE.MAX_RADIUS){
					c.state = this.CIRCLE_STATE.MAX_SIZE;
					console.log("circle #" + i + " hit CIRCLE.MAX_RADIUS");
				}
				continue;
			}
		
			if(c.state === this.CIRCLE_STATE.MAX_SIZE){
				c.lifetime += dt; // lifetime is in seconds
				if (c.lifetime >= this.CIRCLE.MAX_LIFETIME){
					c.state = this.CIRCLE_STATE.IMPLODING;
					console.log("circle #" + i + " hit CIRCLE.MAX_LIFETIME");
				}
				continue;
			}
				
			if(c.state === this.CIRCLE_STATE.IMPLODING){
				c.radius -= this.CIRCLE.IMPLOSION_SPEED * dt;
				if (c.radius <= this.CIRCLE.MIN_RADIUS){
					console.log("circle #" + i + " hit CIRCLE.MIN_RADIUS and is gone");
					c.state = this.CIRCLE_STATE.DONE;
					continue;
				}
			
			}
		
			// move circles
			c.move(dt);
		
			// did circles leave screen?
			if(this.circleHitLeftRight(c)) c.xSpeed *= -1;
 			if(this.circleHitTopBottom(c)) c.ySpeed *= -1;
	
		} // end for loop
	},



// Part IV #1B
checkForCollisions: function(){
		if(this.gameState == this.GAME_STATE.EXPLODING){
			// check for collisions between circles
			for(var i=0;i<this.circles.length; i++){
				var c1 = this.circles[i];
				// only check for collisions if c1 is exploding
				if (c1.state === this.CIRCLE_STATE.NORMAL) continue;   
				if (c1.state === this.CIRCLE_STATE.DONE) continue;
				for(var j=0;j<this.circles.length; j++){
					var c2 = this.circles[j];
				// don't check for collisions if c2 is the same circle
					if (c1 === c2) continue; 
				// don't check for collisions if c2 is already exploding 
					if (c2.state != this.CIRCLE_STATE.NORMAL ) continue;  
					if (c2.state === this.CIRCLE_STATE.DONE) continue;
				
					// Now you finally can check for a collision
					if(circlesIntersect(c1,c2) ){
						c2.state = this.CIRCLE_STATE.EXPLODING;
						c2.xSpeed = c2.ySpeed = 0;
						this.roundScore ++;
					}
				}
			} // end for
			
			// round over?
			var isOver = true;
			for(var i=0;i<this.circles.length; i++){
				var c = this.circles[i];
				if(c.state != this.CIRCLE_STATE.NORMAL && c.state != this.CIRCLE_STATE.DONE){
				 isOver = false;
				 break;
				}
			} // end for
		
			if(isOver){
				this.gameState = this.GAME_STATE.ROUND_OVER;
				this.totalScore += this.roundScore;
			 }
				
		} // end if GAME_STATE_EXPLODING
	},
	
	
//Part VI - 1A

drawHUD: function(ctx){
		ctx.save(); // NEW
		// draw score
      	// fillText(string, x, y, css, color)
		this.fillText("This Round: " + this.roundScore + " of " + this.numCircles, 20, 20, "14pt courier", "#ddd");
		this.fillText("Total Score: " + this.totalScore, this.WIDTH - 200, 20, "14pt courier", "#ddd");

		// NEW
		if(this.gameState == this.GAME_STATE.BEGIN){
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			this.fillText("To begin, click a circle", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "white");
		} // end if
	
		// NEW
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			ctx.save();
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			this.fillText("Round Over", this.WIDTH/2, this.HEIGHT/2 - 40, "30pt courier", "red");
			this.fillText("Click to continue", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "red");
			this.fillText("Next round there are " + (this.numCircles + 5) + " circles", this.WIDTH/2 , this.HEIGHT/2 + 35, "20pt courier", "#ddd");
		} // end if
		
		ctx.restore(); // NEW
	}
	
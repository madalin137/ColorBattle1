
function Particle(x, y, radius, color, velocity, angle) 
{
	this.x = x;
	this.y = y;
	this.radius = radius;
	
	this.color = color;
	
	this.vx = velocity * Math.cos(angle);
	this.vy = velocity * Math.sin(angle);
}

Particle.prototype.move = function(plusEquals)
{
	if (plusEquals) {
		this.x += this.vx;
		this.y += this.vy;
	}
	else {
		this.x -= this.vx;
		this.y -= this.vy;
	}
}

Particle.prototype.draw = function()
{
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
	ctx.fill();
}

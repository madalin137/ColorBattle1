var coreRadius = 140;
var ringRadius = 35;
var turretRadius = 10;

var coreColor = 'rgba(0, 255, 255, 0.5)';
var turretColor = 'rgba(0, 112, 255, 0.5)'

function Shooter()
{
	this.core = new Particle(canvas.width / 2, canvas.height / 2, coreRadius, coreColor, 0, 0);
	this.turret = new Particle(ringRadius * Math.cos(0) + canvas.width / 2, 
	                           ringRadius * Math.sin(0) + canvas.height / 2,							   
	                           turretRadius, turretColor, 0, 0);
}

Shooter.prototype.moveTurret = function(angle)
{
	this.turret.x = ringRadius * Math.cos(angle) + canvas.width / 2;
	this.turret.y = ringRadius * Math.sin(angle) + canvas.height / 2;
}

Shooter.prototype.draw = function()
{
	this.core.draw();
	this.turret.draw();
}

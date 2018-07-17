var canvas, ctx;

var Engine = (function()
{
	/*munitie*/
	//Player ammo constants
	var ammoVelocity = 10;
	var ammoRadius = 10;
	var ammoColor =  'rgba(0, 112, 255, 0.5)';
	
	//constante
	var enemyRadius = 20;
	var enemyColor = 'rgba(255, 0, 48, 0.5)';
	
	/*--*/
	var player;
	var shots = [];
	
	var enemies = [];
	var lastSpawn, now;
	var spawnInterval = 100;
	
	var score = 0;
	var gamePaused = false;
	var gameOver = false;
	var restart = false;
	
	var HTML_score;
	var HTML_pause;
	var HTML_restart;
	
	function mouseMoveHandler(e)
	{
		e.preventDefault();
		
		var dx = e.clientX - canvas.width / 2;
		var dy = e.clientY - canvas.height / 2;
		
		player.moveTurret(Math.atan2(dy, dx));
	}
	
	function clickHandler(e)
	{
		if (!gameOver) {
			e.preventDefault();
		
			var dx = e.clientX - canvas.width / 2;
			var dy = e.clientY - canvas.height / 2;
			var angle = Math.atan2(dy, dx);
		
			shots.push(new Particle(player.turret.x, player.turret.y,
									ammoRadius, ammoColor, ammoVelocity, angle));
		}
	}
	
	function pauseClickHandler(e)
	{
		e.preventDefault();
		
		gamePaused = !gamePaused;
		runGameLoop();
	}
	
	function restartClickHandler(e)
	{
		e.preventDefault();
		restart = true
		if (gamePaused) {
			gamePaused = false;
			runGameLoop();
		}
	}
	
	function setUpCanvas() 
	{
		canvas = document.getElementById('feild');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		if (canvas.getContext) {
			ctx = canvas.getContext('2d');
		}
	}
	
	function handleShots()
	{
		for (var i = 0; i < shots.length; ++i) {
			shots[i].move(true);
			shots[i].draw();
			
			var p = shots[i];
			
			if (shots[i].x < 0 || shots.y < 0) {
				shots.splice(i, 1);
			}
			else if (shots[i].x > canvas.width || shots[i].y > canvas.height) {
				shots.splice(i, 1);
			}
		}
	}
	
	function addEnemy()
	{
		var side = Math.round(Math.random() * 3);
		
		var TOP = 0;
		var RIGHT = 1;
		var BOTTOM = 2;
		var LEFT = 3;
		
		var speed = 1 + Math.random() * 1;
		
		switch (side) {
			case TOP:
				var x = Math.random() * canvas.width;
				
				var dx = x - canvas.width / 2;
				var dy = 0 - canvas.height / 2;
				
				var angle = Math.atan2(dy, dx);
				
				enemies.push(new Particle(x, 0, enemyRadius, enemyColor, speed, angle));
				break;
			
			case RIGHT:
				var y = Math.random() * canvas.height;
				
				var dx = canvas.width / 2;
				var dy = y - canvas.height / 2;
				
				var angle = Math.atan2(dy, dx);
				
				enemies.push(new Particle(canvas.width, y, enemyRadius, enemyColor, speed, angle));
				break;
				
			case BOTTOM:
				var x = Math.random() * canvas.width;
				
				var dx = x - canvas.width / 2;
				var dy = canvas.height / 2;
				
				var angle = Math.atan2(dy, dx);
				
				enemies.push(new Particle(x, canvas.height, enemyRadius, enemyColor, speed, angle));
				break;
				
			case LEFT:
				var y = Math.random() * canvas.height;
				
				var dx = 0 - canvas.width / 2;
				var dy = y - canvas.height / 2;
				
				var angle = Math.atan2(dy, dx);
				
				enemies.push(new Particle(0, y, enemyRadius, enemyColor, speed, angle));
				break;
		}
	}
	
	function handleEnemies()
	{
		now = new Date().getTime();
		
		if ((now - lastSpawn) >= spawnInterval && !gameOver) {
			addEnemy();
			lastSpawn = now;
		}
		
		for (var i = 0; i < enemies.length; ++i) {
			enemies[i].move(false);
			enemies[i].draw();
			
			//Get distance from player core
			dx = enemies[i].x - player.core.x;
			dy = enemies[i].y - player.core.y;
			distance = Math.sqrt(dx * dx + dy * dy);
			
			//Check if enemy touched core
			if (distance <= (enemies[i].radius + player.core.radius)) {
				player.core.radius -= enemies[i].radius;
				enemies.splice(i, 1);
				continue;
			}
			
			//Check if enemy hit by shot from player
			for (j = 0; j < shots.length; ++j) {
				var dx = shots[j].x - enemies[i].x
				var dy = shots[j].y - enemies[i].y
				var distance = Math.sqrt(dx * dx + dy * dy);
				
				if (distance <= (shots[j].radius + enemies[i].radius)) {
					shots.splice(j, 1);
					enemies.splice(i, 1);
					++score;
					HTML_score.innerHTML = 'SCORE: ' + score;
					spawnInterval -= 2;
					console.log(spawnInterval);
					break;
				}
			}
		}
	}

	function resetGame()
	{
		gamePaused = false;
		gameOver = false;
		score = 0;
		
		player = new Shooter();
		shots = [];
		enemies = [];
		
		lastSpawn = 0;
		now = 0;
		spawnInterval = 1000;
	}
	
	function animate()
	{
		var gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0,
		                                        canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height));
		
		gradient.addColorStop(0, '#555');
		gradient.addColorStop(1, '#1a1a1a');
		
		ctx.fillStyle = gradient;
		ctx.fillRect(0,0, canvas.width, canvas.height);
		
		if (!gameOver) {
			player.draw();
		}
		handleShots();
		handleEnemies();
	}
	
	function runGameLoop()
	{
		if (!gamePaused) {
			if (restart) {
				resetGame();
				restart = false;
			}
			
			gameOver = player.core.radius <= 0;
			animate();
			console.log('tick');
			window.webkitRequestAnimationFrame(runGameLoop);
		}
	}
	
	return {
		init: function()
		{
			
			setUpCanvas();
			player = new Shooter(); 
			lastSpawn = 0;
			HTML_score = document.getElementById('numPoints');
			HTML_pause = document.getElementById('pause');
			HTML_restart = document.getElementById('restart');
			
			
			canvas.addEventListener('mousemove', mouseMoveHandler, false);
			canvas.addEventListener('click', clickHandler, false);
			
			HTML_pause.addEventListener('click', pauseClickHandler, false);
			HTML_restart.addEventListener('click', restartClickHandler, false);
			
			runGameLoop();
		}
	};
})();

window.addEventListener('load', Engine.init, false); 

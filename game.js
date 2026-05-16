/**
 * Angry Birds Game
 */

class Bird extends PhysicsBody {
    constructor(x, y, type = 'red') {
        super(x, y, 25, 25, 1);
        this.type = type;
        this.color = this.getColor();
        this.isDragging = false;
        this.dragStart = new Vector2(0, 0);
        this.launched = false;
        this.trails = [];
        this.health = 100;
    }

    getColor() {
        const colors = {
            red: '#FF4444',
            blue: '#4444FF',
            yellow: '#FFDD44',
            black: '#333333'
        };
        return colors[this.type] || colors.red;
    }

    setDragging(mousePos) {
        this.isDragging = true;
        this.dragStart = mousePos.clone();
    }

    updateDrag(mousePos) {
        if (!this.isDragging) return;
        this.position = mousePos.clone();
    }

    launch() {
        if (!this.isDragging) return;
        this.isDragging = false;

        const launchVector = this.dragStart.subtract(this.position);
        this.velocity = launchVector.multiply(0.15);
        this.launched = true;
    }

    update() {
        super.update();

        // Trail effect
        if (this.launched) {
            this.trails.push({
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height / 2,
                alpha: 1,
                size: this.width
            });

            this.trails = this.trails.filter(t => {
                t.alpha -= 0.05;
                return t.alpha > 0;
            });
        }

        // Remove bird if off-screen
        if (this.position.y > 700) {
            this.health = 0;
        }
    }

    draw(ctx) {
        // Draw trail
        this.trails.forEach(t => {
            ctx.fillStyle = `rgba(255, 100, 100, ${t.alpha * 0.3})`;
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.size / 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw bird
        ctx.save();
        ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        ctx.rotate(this.rotation);

        // Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-6, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, -5, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(-6, -5, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, -5, 2, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#FF9900';
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(15, -3);
        ctx.lineTo(15, 3);
        ctx.fill();

        ctx.restore();

        // Draw drag line when dragging
        if (this.isDragging) {
            ctx.strokeStyle = '#FF4444';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(this.position.x + this.width / 2, this.position.y + this.height / 2);
            ctx.lineTo(this.dragStart.x, this.dragStart.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}

class Pig extends PhysicsBody {
    constructor(x, y, size = 'medium') {
        const sizeMap = { small: 15, medium: 20, large: 30 };
        const dimension = sizeMap[size] || 20;
        const health = { small: 20, medium: 50, large: 100 }[size] || 50;

        super(x, y, dimension, dimension, size === 'large' ? 2 : 1);
        this.size = size;
        this.health = health;
        this.maxHealth = health;
        this.damageCounter = 0;
    }

    takeDamage(amount) {
        this.health -= amount;
        this.damageCounter = 10;
    }

    update() {
        super.update();
        if (this.damageCounter > 0) this.damageCounter--;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        ctx.rotate(this.rotation);

        // Body
        ctx.fillStyle = this.damageCounter > 0 ? '#FF6666' : '#00DD00';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-5, -3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(5, -3, 3, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(-5, -3, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(5, -3, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = '#FF9999';
        ctx.beginPath();
        ctx.arc(0, 2, 3, 0, Math.PI * 2);
        ctx.fill();

        // Health bar
        const barWidth = this.width + 5;
        const barHeight = 3;
        ctx.fillStyle = '#FF4444';
        ctx.fillRect(-barWidth / 2, -this.width / 2 - 8, barWidth, barHeight);
        ctx.fillStyle = '#44FF44';
        ctx.fillRect(-barWidth / 2, -this.width / 2 - 8, (this.health / this.maxHealth) * barWidth, barHeight);

        ctx.restore();
    }
}

class Block extends PhysicsBody {
    constructor(x, y, width, height, material = 'wood') {
        super(x, y, width, height, material === 'stone' ? 3 : 1);
        this.material = material;
        this.health = material === 'stone' ? 150 : 75;
        this.maxHealth = this.health;
        this.damageCounter = 0;
    }

    takeDamage(amount) {
        this.health -= amount;
        this.damageCounter = 10;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        ctx.rotate(this.rotation);

        // Main color
        const mainColor = this.material === 'stone' ? '#666666' : '#CD853F';
        const accentColor = this.damageCounter > 0 ? '#FF4444' : (this.material === 'stone' ? '#999999' : '#8B4513');

        ctx.fillStyle = mainColor;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Pattern
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1;
        for (let i = -this.width / 2; i < this.width / 2; i += 5) {
            ctx.beginPath();
            ctx.moveTo(i, -this.height / 2);
            ctx.lineTo(i, this.height / 2);
            ctx.stroke();
        }

        // Health bar
        ctx.fillStyle = '#FF4444';
        ctx.fillRect(-this.width / 2, this.height / 2 + 3, this.width, 3);
        ctx.fillStyle = '#44FF44';
        ctx.fillRect(-this.width / 2, this.height / 2 + 3, (this.health / this.maxHealth) * this.width, 3);

        ctx.restore();
    }
}

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.score = 0;
        this.level = 1;
        this.birdsLeft = 3;
        this.totalBirds = 3;
        this.gameOver = false;
        this.paused = false;
        this.won = false;

        this.birds = [];
        this.pigs = [];
        this.blocks = [];
        this.currentBird = null;

        this.initializeLevel();
        this.setupEventListeners();
        this.gameLoop();
    }

    initializeLevel() {
        this.birds = [];
        this.pigs = [];
        this.blocks = [];
        this.gameOver = false;
        this.won = false;
        this.paused = false;
        this.currentBird = null;

        // Create slingshot area
        this.slingshot = {
            x: 100,
            y: 500,
            radius: 20
        };

        // Create birds
        for (let i = 0; i < this.birdsLeft; i++) {
            const bird = new Bird(this.slingshot.x - i * 35, this.slingshot.y, ['red', 'blue', 'yellow'][i % 3]);
            this.birds.push(bird);
        }

        this.currentBird = this.birds[0];

        // Create level layout based on current level
        this.createLevelLayout();
    }

    createLevelLayout() {
        const layouts = [
            // Level 1: Simple pyramid
            {
                blocks: [
                    { x: 600, y: 450, w: 40, h: 80, m: 'wood' },
                    { x: 660, y: 450, w: 40, h: 80, m: 'wood' },
                    { x: 630, y: 360, w: 80, h: 40, m: 'wood' }
                ],
                pigs: [
                    { x: 630, y: 300, s: 'medium' }
                ]
            },
            // Level 2: Harder pyramid
            {
                blocks: [
                    { x: 550, y: 450, w: 40, h: 80, m: 'wood' },
                    { x: 610, y: 450, w: 40, h: 80, m: 'wood' },
                    { x: 670, y: 450, w: 40, h: 80, m: 'stone' },
                    { x: 580, y: 360, w: 80, h: 40, m: 'wood' },
                    { x: 640, y: 360, w: 80, h: 40, m: 'wood' },
                    { x: 610, y: 270, w: 80, h: 40, m: 'stone' }
                ],
                pigs: [
                    { x: 570, y: 300, s: 'small' },
                    { x: 650, y: 300, s: 'medium' },
                    { x: 610, y: 200, s: 'large' }
                ]
            },
            // Level 3: Complex structure
            {
                blocks: [
                    { x: 500, y: 480, w: 60, h: 40, m: 'wood' },
                    { x: 600, y: 480, w: 60, h: 40, m: 'wood' },
                    { x: 700, y: 480, w: 60, h: 40, m: 'stone' },
                    { x: 550, y: 380, w: 40, h: 80, m: 'wood' },
                    { x: 650, y: 380, w: 40, h: 80, m: 'stone' },
                    { x: 600, y: 280, w: 80, h: 40, m: 'wood' },
                    { x: 600, y: 180, w: 40, h: 80, m: 'stone' }
                ],
                pigs: [
                    { x: 500, y: 350, s: 'small' },
                    { x: 650, y: 350, s: 'small' },
                    { x: 550, y: 250, s: 'medium' },
                    { x: 650, y: 250, s: 'medium' },
                    { x: 600, y: 120, s: 'large' }
                ]
            }
        ];

        const layout = layouts[Math.min(this.level - 1, layouts.length - 1)];

        layout.blocks.forEach(b => {
            this.blocks.push(new Block(b.x, b.y, b.w, b.h, b.m));
        });

        layout.pigs.forEach(p => {
            this.pigs.push(new Pig(p.x, p.y, p.s));
        });
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restart());
    }

    handleMouseDown(e) {
        if (this.gameOver || this.paused || !this.currentBird || this.currentBird.launched) return;

        const rect = this.canvas.getBoundingClientRect();
        const mousePos = new Vector2(
            (e.clientX - rect.left) * (this.canvas.width / rect.width),
            (e.clientY - rect.top) * (this.canvas.height / rect.height)
        );

        const dist = Math.sqrt(
            Math.pow(mousePos.x - (this.currentBird.position.x + this.currentBird.width / 2), 2) +
            Math.pow(mousePos.y - (this.currentBird.position.y + this.currentBird.height / 2), 2)
        );

        if (dist < 50) {
            this.currentBird.setDragging(mousePos);
        }
    }

    handleMouseMove(e) {
        if (!this.currentBird || !this.currentBird.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        const mousePos = new Vector2(
            (e.clientX - rect.left) * (this.canvas.width / rect.width),
            (e.clientY - rect.top) * (this.canvas.height / rect.height)
        );

        this.currentBird.updateDrag(mousePos);
    }

    handleMouseUp(e) {
        if (this.currentBird && this.currentBird.isDragging) {
            this.currentBird.launch();
        }
    }

    togglePause() {
        if (!this.gameOver) {
            this.paused = !this.paused;
            document.getElementById('pauseBtn').textContent = this.paused ? '▶️ Resume' : '⏸️ Pause';
        }
    }

    update() {
        if (this.gameOver || this.paused) return;

        // Update all game objects
        this.birds.forEach(bird => bird.update());
        this.pigs.forEach(pig => pig.update());
        this.blocks.forEach(block => block.update());

        // Check collisions between birds and pigs
        this.birds.forEach(bird => {
            if (!bird.launched) return;
            this.pigs.forEach(pig => {
                if (bird.collidingWith(pig)) {
                    const damage = Math.max(10, bird.velocity.length() * 5);
                    pig.takeDamage(damage);
                    bird.takeDamage(30);
                    this.score += 10;
                }
            });
        });

        // Check collisions between birds and blocks
        this.birds.forEach(bird => {
            if (!bird.launched) return;
            this.blocks.forEach(block => {
                if (bird.collidingWith(block)) {
                    const damage = Math.max(5, bird.velocity.length() * 2);
                    block.takeDamage(damage);
                    bird.takeDamage(20);
                    CollisionDetector.resolveCollision(bird, block);
                    this.score += 5;
                }
            });
        });

        // Check collisions between blocks and pigs
        this.blocks.forEach(block => {
            this.pigs.forEach(pig => {
                if (block.collidingWith(pig)) {
                    const damage = Math.max(5, block.velocity.length() * 3);
                    pig.takeDamage(damage);
                    CollisionDetector.resolveCollision(block, pig);
                    this.score += 15;
                }
            });
        });

        // Check collisions between blocks
        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = i + 1; j < this.blocks.length; j++) {
                if (this.blocks[i].collidingWith(this.blocks[j])) {
                    CollisionDetector.resolveCollision(this.blocks[i], this.blocks[j]);
                }
            }
        }

        // Check collisions between pigs
        for (let i = 0; i < this.pigs.length; i++) {
            for (let j = i + 1; j < this.pigs.length; j++) {
                if (this.pigs[i].collidingWith(this.pigs[j])) {
                    CollisionDetector.resolveCollision(this.pigs[i], this.pigs[j]);
                }
            }
        }

        // Remove dead entities
        this.birds = this.birds.filter(b => b.health > 0 && b.position.x < this.width + 50);
        this.pigs = this.pigs.filter(p => p.health > 0);
        this.blocks = this.blocks.filter(b => b.health > 0);

        // Check game state
        this.checkGameState();
    }

    checkGameState() {
        // Check if all pigs are gone
        if (this.pigs.length === 0) {
            this.won = true;
            this.gameOver = true;
            this.score += 500;
            this.showGameOver(true);
        }

        // Check if all birds are used and no more launched
        const allBirdsUsed = this.birds.length === 0;
        const noBirdLaunched = !this.currentBird || this.currentBird.launched;

        if (allBirdsUsed && noBirdLaunched && this.pigs.length > 0) {
            this.gameOver = true;
            this.showGameOver(false);
        }
    }

    showGameOver(won) {
        const modal = document.getElementById('gameOverModal');
        const title = document.getElementById('gameOverTitle');
        const message = document.getElementById('gameOverMessage');
        const finalScore = document.getElementById('finalScore');
        const finalLevel = document.getElementById('finalLevel');

        if (won) {
            title.textContent = '🎉 Level Complete!';
            message.textContent = 'Great job! All pigs defeated!';
            this.score += 200;
        } else {
            title.textContent = '😢 Game Over!';
            message.textContent = 'Out of birds! Better luck next time!';
        }

        finalScore.textContent = this.score;
        finalLevel.textContent = this.level;

        modal.classList.remove('hidden');
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw ground
        this.ctx.fillStyle = '#8B7355';
        this.ctx.fillRect(0, 550, this.width, this.height - 550);

        // Draw slingshot
        this.drawSlingshot();

        // Draw game objects
        this.blocks.forEach(block => block.draw(this.ctx));
        this.pigs.forEach(pig => pig.draw(this.ctx));
        this.birds.forEach(bird => bird.draw(this.ctx));

        // Draw pause overlay
        if (this.paused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
        }
    }

    drawSlingshot() {
        const sx = this.slingshot.x;
        const sy = this.slingshot.y;

        // Post
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(sx - 5, sy - 50, 10, 100);

        // Rubber bands
        this.ctx.strokeStyle = '#FF6666';
        this.ctx.lineWidth = 3;

        if (this.currentBird && !this.currentBird.launched) {
            const birdX = this.currentBird.position.x + this.currentBird.width / 2;
            const birdY = this.currentBird.position.y + this.currentBird.height / 2;

            this.ctx.beginPath();
            this.ctx.moveTo(sx, sy - 30);
            this.ctx.lineTo(birdX, birdY);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(sx, sy + 30);
            this.ctx.lineTo(birdX, birdY);
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(sx, sy - 30);
            this.ctx.lineTo(sx, sy + 30);
            this.ctx.stroke();
        }
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('birdsLeft').textContent = Math.max(0, this.birds.length - (this.currentBird ? 1 : 0));
    }

    restart() {
        this.level = 1;
        this.score = 0;
        this.birdsLeft = 3;
        document.getElementById('gameOverModal').classList.add('hidden');
        this.initializeLevel();
    }

    gameLoop() {
        this.update();
        this.draw();
        this.updateUI();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game('gameCanvas');
});

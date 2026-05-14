class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.birdsUsed = 0;
        this.maxBirds = 5;
    }
    
    create() {
        // Background
        this.cameras.main.setBackgroundColor('#87CEEB');
        
        // Ground
        const ground = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height - 20,
            this.cameras.main.width,
            40,
            0x8B4513
        );
        this.physics.add.existing(ground, true);
        
        // Create groups
        this.birds = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.obstacles = this.physics.add.staticGroup();
        
        // Create game elements
        this.createEnemies();
        this.createObstacles();
        this.setupCollisions();
        
        // UI
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            font: 'bold 28px Arial',
            fill: '#000',
            stroke: '#fff',
            strokeThickness: 2
        });
        
        this.birdsText = this.add.text(20, 60, `Birds: ${this.maxBirds - this.birdsUsed}`, {
            font: 'bold 24px Arial',
            fill: '#000',
            stroke: '#fff',
            strokeThickness: 2
        });
        
        // Instructions
        this.add.text(
            20,
            this.cameras.main.height - 40,
            'Drag & Release to Launch Red Bird',
            {
                font: '16px Arial',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 2
            }
        );
        
        // Input
        this.input.on('pointerdown', (pointer) => this.launchBird(pointer));
    }
    
    createEnemies() {
        const positions = [
            { x: this.cameras.main.width * 0.65, y: this.cameras.main.height - 150 },
            { x: this.cameras.main.width * 0.75, y: this.cameras.main.height - 150 },
            { x: this.cameras.main.width * 0.85, y: this.cameras.main.height - 150 }
        ];
        
        positions.forEach(pos => {
            const enemy = this.add.circle(pos.x, pos.y, 20, 0x00dd00);
            this.physics.add.existing(enemy);
            enemy.body.setBounce(0.8).setCollideWorldBounds(true).setDrag(0.01);
            this.enemies.add(enemy);
        });
    }
    
    createObstacles() {
        const woodColor = 0xA0522D;
        
        // Horizontal obstacles
        this.obstacles.create(
            this.cameras.main.width * 0.7,
            this.cameras.main.height - 120
        ).setDisplaySize(100, 20).setFillStyle(woodColor);
        
        this.obstacles.create(
            this.cameras.main.width * 0.8,
            this.cameras.main.height - 120
        ).setDisplaySize(100, 20).setFillStyle(woodColor);
    }
    
    setupCollisions() {
        this.physics.add.collider(this.birds, this.obstacles);
        this.physics.add.overlap(this.birds, this.enemies, this.hitEnemy, null, this);
    }
    
    launchBird(pointer) {
        if (this.birdsUsed >= this.maxBirds) {
            this.gameOver();
            return;
        }
        
        const bird = this.add.circle(100, this.cameras.main.height - 100, 15, 0xff0000);
        this.physics.add.existing(bird);
        
        // Calculate velocity based on pointer position
        const velocityX = (pointer.x - 100) * 3;
        const velocityY = (pointer.y - (this.cameras.main.height - 100)) * 3;
        
        bird.body.setVelocity(velocityX, velocityY);
        bird.body.setBounce(0.6).setCollideWorldBounds(true).setDrag(0.01);
        
        this.birds.add(bird);
        this.birdsUsed++;
        this.birdsText.setText(`Birds: ${this.maxBirds - this.birdsUsed}`);
    }
    
    hitEnemy(bird, enemy) {
        enemy.destroy();
        bird.destroy();
        this.score += 100;
        this.scoreText.setText(`Score: ${this.score}`);
        
        // Check if all enemies are destroyed
        if (this.enemies.children.entries.length === 0) {
            this.winGame();
        }
    }
    
    gameOver() {
        this.scene.start('WinScene', { score: this.score, won: false });
    }
    
    winGame() {
        this.scene.start('WinScene', { score: this.score, won: true });
    }
    
    update() {
        // Remove birds that went off-screen
        this.birds.children.entries.forEach(bird => {
            if (bird.y > this.cameras.main.height + 100 || bird.x > this.cameras.main.width + 100) {
                bird.destroy();
            }
        });
        
        // Check if no more birds and enemies remain
        if (this.birdsUsed >= this.maxBirds && this.birds.children.entries.length === 0 && this.enemies.children.entries.length > 0) {
            this.gameOver();
        }
    }
}

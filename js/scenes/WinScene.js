class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }
    
    init(data) {
        this.finalScore = data.score;
        this.hasWon = data.won || false;
    }
    
    create() {
        // Background
        this.cameras.main.setBackgroundColor('#2c3e50');
        
        if (this.hasWon) {
            // Victory message
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 - 150,
                '🎉 YOU WIN! 🎉',
                {
                    font: 'bold 64px Arial',
                    fill: '#2ecc71',
                    stroke: '#000',
                    strokeThickness: 3
                }
            ).setOrigin(0.5);
        } else {
            // Game Over message
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 - 150,
                'GAME OVER',
                {
                    font: 'bold 64px Arial',
                    fill: '#e74c3c',
                    stroke: '#000',
                    strokeThickness: 3
                }
            ).setOrigin(0.5);
        }
        
        // Score display
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 20,
            `Final Score: ${this.finalScore}`,
            {
                font: 'bold 44px Arial',
                fill: '#f39c12',
                stroke: '#000',
                strokeThickness: 2
            }
        ).setOrigin(0.5);
        
        // Play Again Button
        const againBtn = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 120,
            'PLAY AGAIN',
            {
                font: 'bold 40px Arial',
                fill: '#3498db',
                stroke: '#000',
                strokeThickness: 2
            }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        // Button hover effects
        againBtn.on('pointerover', () => {
            againBtn.setFill('#2980b9');
            againBtn.setScale(1.1);
        });
        
        againBtn.on('pointerout', () => {
            againBtn.setFill('#3498db');
            againBtn.setScale(1);
        });
        
        againBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        // Menu Button
        const menuBtn = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 200,
            'MAIN MENU',
            {
                font: 'bold 32px Arial',
                fill: '#95a5a6',
                stroke: '#000',
                strokeThickness: 2
            }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        // Menu button hover effects
        menuBtn.on('pointerover', () => {
            menuBtn.setFill('#bdc3c7');
            menuBtn.setScale(1.1);
        });
        
        menuBtn.on('pointerout', () => {
            menuBtn.setFill('#95a5a6');
            menuBtn.setScale(1);
        });
        
        menuBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        // Background
        this.cameras.main.setBackgroundColor('#2c3e50');
        
        // Title
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 150,
            'ANGRY BIRDS',
            {
                font: 'bold 72px Arial',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);
        
        // Subtitle
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'Mobile Game Prototype',
            {
                font: '24px Arial',
                fill: '#bdc3c7'
            }
        ).setOrigin(0.5);
        
        // Play Button
        const playBtn = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 80,
            'TAP TO PLAY',
            {
                font: 'bold 48px Arial',
                fill: '#f39c12',
                stroke: '#000',
                strokeThickness: 3
            }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        // Button hover effects
        playBtn.on('pointerover', () => {
            playBtn.setFill('#e74c3c');
            playBtn.setScale(1.1);
        });
        
        playBtn.on('pointerout', () => {
            playBtn.setFill('#f39c12');
            playBtn.setScale(1);
        });
        
        playBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        // Instructions
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 50,
            'Destroy all green pigs to win!',
            {
                font: '18px Arial',
                fill: '#95a5a6'
            }
        ).setOrigin(0.5);
    }
}

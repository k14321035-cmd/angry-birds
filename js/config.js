// Game Configuration
const gameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
            enableBody: true
        }
    },
    scene: [MenuScene, GameScene, WinScene],
    render: {
        antialias: true,
        pixelArt: false
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        orientation: Phaser.Scale.Orientation.LANDSCAPE
    }
};

// Responsive resize
window.addEventListener('resize', () => {
    if (window.game) {
        window.game.scale.resize(window.innerWidth, window.innerHeight);
    }
});

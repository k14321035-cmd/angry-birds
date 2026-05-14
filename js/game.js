// Initialize Game
const game = new Phaser.Game(gameConfig);

// Store game instance globally
window.game = game;

// Handle window resize
window.addEventListener('resize', () => {
    if (game && game.scale) {
        game.scale.resize(window.innerWidth, window.innerHeight);
    }
});

// Prevent context menu on right click
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('canvas')) {
        e.preventDefault();
    }
});

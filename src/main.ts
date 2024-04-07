// Main Game Logic
import * as ex from 'excalibur';
import Config from './config';
import { Sounds, loader } from './resources';
import { Game } from './game';

let game: Game;

async function waitForFontLoad(font: string, timeout = 2000, interval = 100) {
    return new Promise((resolve, reject) => {
        // repeatedly poll check
        const poller = setInterval(async () => {
        try {
            await document.fonts.load(font);
        } catch (err) {
            reject(err);
        }
        if (document.fonts.check(font)) {
            clearInterval(poller);
            resolve(true);
        }
        }, interval);
        setTimeout(() => clearInterval(poller), timeout);
    });
}

const engine = new ex.Engine({
    backgroundColor: ex.Color.Black,
    pixelRatio: 2,
    width: 1000,
    height: 800,
    displayMode: ex.DisplayMode.FitScreen,
});
engine.debug.entity.showName = true;
engine.backgroundColor = ex.Color.Black;
engine.setAntialiasing(false);

// Setup game scene
game = new Game();
engine.add('game', new Game());
engine.goToScene('game');

// Game events to handle
engine.on('hidden', () => {
    console.log('pause');
    engine.stop();
});
engine.on('visible', () => {
    console.log('start');
    engine.start();
});


//engine.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
    //if (evt.key === ex.Input.Keys.D) {
      //engine.toggleDebug();
    //}
//});

waitForFontLoad("normal 30px Open Sans").then(() => {
    engine.start(loader).then(() => {
        Sounds.laserSound.volume = Config.soundVolume;
        Sounds.explodeSound.volume = Config.soundVolume;
        Sounds.enemyFireSound.volume = Config.soundVolume;
        Sounds.powerUp.volume = Config.soundVolume;
        Sounds.rocketSound.volume = Config.soundVolume;

        console.log("Game Resources Loaded");
    });
})
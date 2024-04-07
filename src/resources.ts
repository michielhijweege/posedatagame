import * as ex from "excalibur";

import fighterFile from '../res/fighter.png';
import enemyFile  from '../res/enemy.png';
import spriteexplosionFile from '../res/spriteexplosion.png';
import gameSheetFile from '../res/gameSheet.png';
import laserFile from '../res/laser.wav';
import enemyfireFile from '../res/enemyfire.wav';
import explodeFile from '../res/explode.wav';
import hitFile from '../res/hit.wav';
import powerupFile from '../res/powerup.wav';
import rocketFile from '../res/rocket.wav';
import {Loader} from "excalibur";


const Images: { [key: string]: ex.ImageSource } = {
    fighter: new ex.ImageSource(fighterFile),
    enemyPink: new ex.ImageSource(enemyFile),
    explosion: new ex.ImageSource(spriteexplosionFile),
    sheet: new ex.ImageSource(gameSheetFile),
};

const Sounds: { [key: string]: ex.Sound } = {
    laserSound: new ex.Sound(laserFile),
    enemyFireSound: new ex.Sound(enemyfireFile),
    explodeSound: new ex.Sound(explodeFile),
    hitSound: new ex.Sound(hitFile),
    powerUp: new ex.Sound(powerupFile),
    rocketSound: new ex.Sound(rocketFile),
}

const explosionSpriteSheet = ex.SpriteSheet.fromImageSource({ 
    image: Images.explosion,
    grid: {
        rows: 5,
        columns: 5,
        spriteWidth: 45,
        spriteHeight: 45
    }
});
const gameSheet = ex.SpriteSheet.fromImageSource({
    image: Images.sheet, 
    grid: {
        rows: 10,
        columns: 10,
        spriteWidth: 32, 
        spriteHeight: 32
    }
});

const loader = new ex.Loader();
loader.logoHeight = -1;
const allResources = {...Images, ...Sounds};
for (const res in allResources) {
    loader.addResource(allResources[res]);
}

export { Images, Sounds, loader, explosionSpriteSheet, gameSheet };
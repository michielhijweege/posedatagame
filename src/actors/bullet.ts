import * as ex from "excalibur";
import Config from "../config";
import { gameSheet } from "../resources";
import { Baddie } from "./baddie";

export class Bullet extends ex.Actor {
    constructor(x: number, y: number, dx: number, dy: number, collisiongGroup: ex.CollisionGroup) {
        super({
            pos: new ex.Vector(x, y),
            vel: new ex.Vector(dx, dy),
            width: Config.bulletSize,
            height: Config.bulletSize,
        });
        this.body.collisionType = ex.CollisionType.Passive;
        this.body.group = collisiongGroup;
    }
    
    onInitialize(engine: ex.Engine) {
        this.on('precollision', (evt) => this.onPreCollision(evt));
        // Clean up on exit viewport
        this.on('exitviewport', () => this.killAndRemoveFromBullets());

        const anim = ex.Animation.fromSpriteSheet(gameSheet, [3, 4, 5, 6, 7, 8, 7, 6, 5, 4], 100, ex.AnimationStrategy.Loop);
        anim.scale = new ex.Vector(2, 2);
        this.graphics.use(anim);
    }

    private onPreCollision(evt: ex.PreCollisionEvent) {
        if (!(evt.other instanceof Bullet)) {
            this.killAndRemoveFromBullets();
        }
    }

    private killAndRemoveFromBullets() {
        this.kill();
        ex.Util.removeItemFromArray(this, Baddie.Bullets);
    }
}
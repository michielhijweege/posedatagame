import * as ex from "excalibur";
import { Vector } from "excalibur";
import Config from "../config";
import { stats } from "../stats";

export class HealthBar extends ex.Actor {
    healthBarWidth = Config.healthBarWidth;
    healthBarHeight = Config.healthBarHeight;
    constructor() {
        super({
            name: "healthbar",
            color: ex.Color.Green,
            scale: new Vector(-1, 1),
            pos: new ex.Vector(425, 20),
        });

        this.transform.coordPlane = ex.CoordPlane.Screen;
        this.body.collisionType = ex.CollisionType.PreventCollision
        this.graphics.anchor = Vector.Zero;
        this.graphics.use(new ex.Canvas({
            draw: (ctx) => this.draw(ctx),
            cache: false,
            width: Config.healthBarWidth + 20,
            height: Config.healthBarHeight + 50
        }));
    }

    onPreUpdate() {
        this.healthBarWidth = Config.healthBarWidth * (stats.hp / Config.totalHp);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.color.toString();
        ctx.fillStyle = this.color.toString();
        ctx.lineWidth = 3;
        ctx.font = 'normal 30px Open Sans'
        ctx.fillText("HP", 0, 30);
        ctx.strokeRect(0, 35, Config.healthBarWidth + 10, Config.healthBarHeight + 10);
        ctx.fillRect(5, 40, this.healthBarWidth, Config.healthBarHeight);
    }
}

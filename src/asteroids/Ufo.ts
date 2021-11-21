import Particle from './Particle';
import Bullet from './Bullet';
import { asteroidVertices, randomNumBetween, findAngle, rotatePoint } from './helpers';
import { themes } from './color-theme'

import type { CanvasItem, IState, Iposition} from './game.types'

export interface Iastroid extends CanvasItem {
  position: Iposition,
  velocity: Iposition,
  rotation: number,
  rotationSpeed: number,
  radius: number,
  score: number,
  addScore: Function,
  onSound: Function,
  destroy: Function,
  vertices: Iposition[],
}

export interface Iprops {
  position: Iposition,
  size:number,
  create:Function,
  addScore:Function,
  onSound:Function,
  onDie?:Function,
  additionalScore?: number,
  target:CanvasItem,
  type:string;
}

export default class Ufo {

  type:string;
  position: Iposition;
  velocity: Iposition;
  vertices: Iposition[];
  rotation: number;
  radius: number;
  rotationSpeed: number;
  score:number = 1000;
  additionalScore:number;
  target: CanvasItem;
  create:Function;
  addScore:Function;
  onDie: Function;
  onSound: Function;
  delete: boolean = false;
  nextShotDelay: number;
  bulletColor: string;

  constructor(props:Iprops) {
    this.type = 'ufo'
    this.position = props.position
    this.velocity = {
      x: randomNumBetween(-2.5, 2.5),
      y: randomNumBetween(-2.5, 2.5)
    }
    this.rotation = 0
    this.rotationSpeed = randomNumBetween(-1, 1)
    this.radius = props.size
    this.additionalScore = Number(props.additionalScore) || 0
    this.create = props.create
    this.addScore = props.addScore
    this.vertices = asteroidVertices(4, props.size)
    this.target = props.target
    this.onDie = props.onDie || function () {}
    this.onSound = props.onSound
    this.nextShotDelay = randomNumBetween(10, 1200),
    this.bulletColor = 'default';
    /*
    this.image = props.image;
    this.imageWidth = props.imageWidth;
    this.imageHeight = props.imageHeight;

    this.img = new Image();
    this.img.src = props.image || "";
    */
    this.type= props.type;

    this.onSound({
      file: 'enemyShowUp',
      status: 'PLAYING',
    })

  }
  generateNewShoot() {
    this.nextShotDelay = randomNumBetween(10, 1200),
    this.shoot()
  }
  shoot() {
    const bullet = new Bullet({
      ship: this,
      size: 3,
      range: 1000,
      color: this.bulletColor,
      onSound: this.onSound,
    })
    this.onSound({
      file: 'enemyShot',
      status: 'PLAYING'
    })
    this.create(bullet, 'ufoBullets');
  }
  destroy(byWho:string) {
    this.delete = true;
    this.onDie();
    this.addScore(this.score);
    this.onSound({
      file: 'crash',
      status: 'PLAYING'
    })
    // Explode
    for (let i = 0; i < 60; i++) {
      const particle = new Particle({
        lifeSpan: randomNumBetween(60, 100),
        size: randomNumBetween(1, 4),
        position: {
          x: this.position.x + randomNumBetween(-this.radius/4, this.radius/4),
          y: this.position.y + randomNumBetween(-this.radius/4, this.radius/4)
        },
        velocity: {
          x: randomNumBetween(-1.5, 1.5),
          y: randomNumBetween(-1.5, 1.5)
        }
      })
      this.create(particle, 'particles')
    }
  }

  render(state:IState, ctx:any):void {

    if(this.bulletColor === 'default') {
      this.bulletColor = themes[state.colorThemeIndex].enemyBullet
    }


    if (this.nextShotDelay-- < 0) {
      this.generateNewShoot()
    }


    let _rotation = findAngle(this.target.position, this.position)
    _rotation = Math.round(_rotation + 272)

    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Rotation
    //this.rotation += this.rotationSpeed;
    this.rotation = _rotation
    /*
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }
    */
    // Screen edges
    if (this.position.x > state.screen.width + this.radius) this.position.x = -this.radius;
    else if (this.position.x < -this.radius) this.position.x = state.screen.width + this.radius;
    if (this.position.y > state.screen.height + this.radius) this.position.y = -this.radius;
    else if (this.position.y < -this.radius) this.position.y = state.screen.height + this.radius;

    // Draw
    const context = ctx;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.strokeStyle = themes[state.colorThemeIndex].enemy
    context.fillStyle = themes[state.colorThemeIndex].enemy // ef404f
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -this.radius);
    for (let i = 1; i < this.vertices.length; i++) {
      context.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    context.closePath();
    context.clip();
    context.stroke();
    context.fill();

    /*
    if (this.img !== "") {
      context.drawImage(this.img, this.radius / 2 * (-1), this.radius / 2 * (-1), 85, 85);
    }
    */
    context.restore();
  }
}

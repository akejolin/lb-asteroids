import Particle from './Particle';
import UfoBullet from './UfoBullet';
import { asteroidVertices, randomNumBetween, findAngle, rotatePoint } from './helpers';
import { addInterval, removeInterval } from './gameIntervalHandler'
import colorTheme from './colorTheme'

let classRoot
export default class Ufo {
  constructor(args) {
    this.objectType = 'ufo'
    classRoot = this
    this.position = args.position
    this.velocity = {
      x: randomNumBetween(-2.5, 2.5),
      y: randomNumBetween(-2.5, 2.5)
    }
    this.rotation = 0
    this.rotationSpeed = randomNumBetween(-1, 1)
    this.radius = args.size
    const additionalScore = Number(args.additionalScore) || 0
    this.score = 1000
    this.create = args.create
    this.addScore = args.addScore
    this.vertices = asteroidVertices(4, args.size)
    this.target = args.target
    this.onDie = args.onDie || function () {}
    this.onSound = args.onSound
    /*
    this.image = args.image;
    this.imageWidth = args.imageWidth;
    this.imageHeight = args.imageHeight;

    this.img = new Image();
    this.img.src = args.image || "";
    */
    this.type= args.type;

    this.generateNewShoot()

    this.onSound({
      file: 'enemyShowUp',
      status: 'PLAYING',
    })

  }
  generateNewShoot() {
    addInterval('ufoShootIntervall', randomNumBetween(2000, 8000), () => {
      removeInterval('ufoShootIntervall')
      this.shoot()
    })
  }
  shoot() {
    const bullet = new UfoBullet({
      ship: this,
      size: 3,
      target: this.target,
      onSound: this.onSound,
    })
    this.create(bullet, 'ufoBullets');
    this.generateNewShoot()
  }
  destroy(byWho) {
    this.delete = true;
    removeInterval('ufoShootIntervall')
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

  render(state){

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
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.strokeStyle = colorTheme[state.selectedColorTheme].enemy
    context.fillStyle = colorTheme[state.selectedColorTheme].enemy // ef404f
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

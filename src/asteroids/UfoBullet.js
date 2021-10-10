import { rotatePoint } from './helpers';
import colorTheme from './colorTheme'

export default class UfoBullet {
  constructor(args) {
    this.objectType = 'ufo_bullet'
    this.rotation = args.ship.rotation;
    this.onSound = args.onSound

    if (args.additionalRotation) {
      this.rotation = this.rotation + args.additionalRotation
    }

    let posDelta = rotatePoint({x:0, y:-10}, {x:0,y:0}, this.rotation * Math.PI / 180);
    this.position = {
      x: args.ship.position.x + posDelta.x,
      y: args.ship.position.y  + posDelta.y
    };

    this.velocity = {
      x:(posDelta.x / 2),
      y:(posDelta.y / 2)
    };
    this.radius = args.size;

    this.onSound({
      file: 'enemyShot',
      status: 'PLAYING'
    })

  }

  destroy(byWho) {
    this.delete = true;
  }

  render(state){
    // Move
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    // Delete if it goes out of bounds
    if ( this.position.x < 0
      || this.position.y < 0
      || this.position.x > state.screen.width
      || this.position.y > state.screen.height ) {
        this.destroy();
    }

    // Draw
    const context = state.context
    context.save()
    context.translate(this.position.x, this.position.y)
    context.rotate(this.rotation * Math.PI / 180)
    context.fillStyle = colorTheme[state.selectedColorTheme].enemyBullet
    context.lineWidth = 0.5
    context.beginPath()
    context.arc(0, 0, this.radius, 0, this.radius * Math.PI)
    context.closePath()
    context.fill()
    context.restore()
  }
}

import { rotatePoint } from './helpers';

export default class Lazar {
  constructor(args) {
    this.objectType = 'lazer'
    let posDelta = rotatePoint({x:0, y:-20}, {x:0,y:0}, args.ship.rotation * Math.PI / 180);
    this.position = {
      x: args.ship.position.x + posDelta.x,
      y: args.ship.position.y + posDelta.y
    };
    this.rotation = args.ship.rotation;
    this.lastRotation = this.rotation
    this.velocity = {
      x:(posDelta.x / 1),
      y:(posDelta.y / 1),
    };
    this.radius = 3;

    this.width = 3;
    this.height = 30;

  }
    destroy(byWho) {
      this.delete = true;
  }

  render(state){
    // Move
    //if (this.ship.rotation !== this.rotation) {
      //this.destroy();
    //}

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

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
    context.fillStyle = '#FFF'
    context.lineWidth = 0.5
    context.beginPath()
    context.fillRect(0, -20, 3, 30)
    context.closePath()
    context.stroke()
    context.restore()
  }
}

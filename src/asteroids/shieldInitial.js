import Particle from './Particle';
import { asteroidVertices, randomNumBetween } from './helpers';
import { addInterval, removeInterval } from './gameIntervalHandler'

let classRoot = this;
export default class Shield {
  constructor(args) {
    this.objectType = 'shield'
    classRoot = this;
    this.position = args.position
    this.velocity = {
      x: randomNumBetween(-1.5, 1.5),
      y: randomNumBetween(-1.5, 1.5)
    }
    this.radius = args.size;
    this.create = args.create;
    this.vertices = asteroidVertices(8, args.size)
    this.color = '#FFFFFF';
    this.alpha = 0.4;
    this.direction = "/";
    this.ship = args.ship;
    this.upgrade = args.upgrade;
    this.countDown = args.countDown || 20;
    this.type = args.type || 'default'
    this.topRoot = args.topRoot
    this.topRoot.props.actions.updateShieldStatus(this.countDown)
    this.fuel = this.type === 'default' ? 500 : 0
    this.updateShieldFuel = args.updateShieldFuel

    this.updateShieldFuel(this.fuel)
  }
  selfDestruction() {
    if (this.type !== 'initial') {
      return null
    }

    addInterval('ShieldSelfDestructionInterval', 1000, countDown )

    function countDown() {
      classRoot.countDown--;
      classRoot.topRoot.props.actions.updateShieldStatus(classRoot.countDown)
      if (classRoot.countDown < 5 && classRoot.direction === "/") {
        classRoot.direction = "+";
      }
      if (classRoot.countDown < 1) {
        removeInterval('ShieldSelfDestructionInterval')
        if (classRoot.type === 'initial') {
          classRoot.upgrade({
            type: 'removedShield',
          })
          this.destroy('selfDestruction')
        } else {
          classRoot.upgrade({
            type: 'default',
          })
          this.destroy('selfDestruction')
        }

      }
    }

  }
  destroy(byWho) {
    removeInterval('ShieldSelfDestructionInterval')
    this.topRoot.props.actions.updateShieldStatus(0)
    this.delete = true
  }

  render(state) {

    if (this.type === 'initial') {
      if (this.alpha < 0.5 && this.direction === "+" ) {
        this.alpha = this.alpha + 0.01
      } else if (this.alpha > 0.5 && this.direction === "+") {
        this.direction = "-";
      }

      if (this.alpha > 0.05 && this.direction === "-" ) {
        this.alpha = this.alpha - 0.01
      } else if (this.alpha < 0.05 && this.direction === "-") {
        this.direction = "+";
      }
    } else {
      if (this.fuel <= 0) {
        this.destroy('noFuel')
      }
      if (state.keys.weapon) {
        this.alpha = 1
        this.fuel--
        console.log(this.fuel)
        this.updateShieldFuel(this.fuel)
      } else {
        this.alpha = 0
      }
    }

    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Rotation
    this.rotation += this.rotationSpeed;
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    this.position.x = this.ship.position.x;
    this.position.y = this.ship.position.y;


    function circle(ctx, x, y, r, c) {
      ctx.beginPath()
      var rad = ctx.createRadialGradient(x, y, 1, x, y, r)
      rad.addColorStop(0.7, 'rgba('+c+',0)')
      rad.addColorStop(1, 'rgba('+c+',1)')
      ctx.fillStyle = rad
      ctx.arc(x, y, r, 0, Math.PI*2, false)
      ctx.closePath()
      ctx.fill()
      context.strokeStyle = classRoot.color
      context.stroke()
    }


    // Draw
    const context = state.context
    context.save()
    context.translate(this.position.x, this.position.y)
    context.rotate(this.rotation * Math.PI / 180)

    context.lineWidth = 2
    context.globalAlpha = this.alpha
    context.beginPath()
    circle(context, 0, 0, this.radius, '255,255,255')
    context.restore()
  }
}

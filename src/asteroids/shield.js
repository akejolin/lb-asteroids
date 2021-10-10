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
    this.onSound = args.onSound
    this.radius = args.size;
    this.create = args.create;
    this.vertices = asteroidVertices(8, args.size)
    this.color = '#FFFFFF';
    this.alpha = 0;
    this.ship = args.ship;
    this.upgrade = args.upgrade;
    this.type = 'default'
    this.topRoot = args.topRoot
    this.fuel = 500
    this.updateShieldFuel = args.updateShieldFuel
    this.isActive = false
    this.updateShieldFuel(this.fuel)
  }
  selfDestruction() {

  }
  destroy(byWho) {
    removeInterval('ShieldSelfDestructionInterval')
    this.updateShieldFuel(0)
    this.delete = true
  }

  render(state) {

    if (this.fuel <= 0) {
      this.destroy('noFuel')
    }
    if (this.ship.delete) {
      this.destroy('noShip')
    }
    if (state.keys.weapon) {
      this.alpha = 1
      this.fuel--
      this.updateShieldFuel(this.fuel)
      if (!this.isActive) {
        this.onSound({
          file: 'shieldUp',
          status: 'PLAYING'
        })
        this.isActive = true
      }
    } else {
      this.alpha = 0
      this.isActive = false
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

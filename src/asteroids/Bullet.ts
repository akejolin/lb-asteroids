import { rotatePoint } from './helpers';
import {themes} from './color-theme'

import type { CanvasItem, IState, Iposition} from './game.types'

export interface Iprops {
  ship?: any
  additionalRotation?: number
  size?: number
}

export default class Bullet {
  type:string;
  rotation: number;
  position: Iposition;
  velocity: Iposition;
  radius: number;
  delete: boolean;

  constructor(props:Iprops) {
    this.type = 'bullet'
    this.rotation = props.ship.rotation;
    this.delete = false;
    
    if (props.additionalRotation) {
      this.rotation = this.rotation + props.additionalRotation
    }

    let posDelta = rotatePoint({x:0, y:-20}, {x:0,y:0}, this.rotation * Math.PI / 180);
    this.position = {
      x: props.ship.position.x + posDelta.x,
      y: props.ship.position.y + posDelta.y
    };

    this.velocity = {
      x:(posDelta.x / 2),
      y:(posDelta.y / 2)
    };
    this.radius = props.size || props.ship.bulletSize;

  }

  destroy(byWho?:string){
    this.delete = true;
  }

  render(state:IState):void {
    // Move
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
    const {context} = state
    if(context) {
      context.save()
      context.translate(this.position.x, this.position.y)
      context.rotate(this.rotation * Math.PI / 180)
      context.fillStyle = themes[state.colorThemeIndex].bullet
      context.lineWidth = 0.5
      context.beginPath()
      context.arc(0, 0, this.radius, 0, this.radius * Math.PI)
      context.closePath()
      context.fill()
      context.restore()
    }
  }
}

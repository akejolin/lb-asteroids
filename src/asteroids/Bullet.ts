import { rotatePoint } from './helpers';
import {themes} from './color-theme'

import type { CanvasItem, IState, Iposition} from './game.types'

export interface Iprops {
  ship?: any
  additionalRotation?: number;
  size?: number;
  range?: number;
  onSound?: Function;
  color?: string;
  lifeSpan?: number;
}

export default class Bullet {
  type:string;
  rotation: number;
  position: Iposition;
  originPos: Iposition;
  velocity: Iposition;
  radius: number;
  delete: boolean;
  range: number = 400
  lifeSpan: number = 50
  onSound: Function = () => {}
  color: string = 'default';

  constructor(props:Iprops) {
    this.type = 'bullet'
    this.rotation = props.ship.rotation;
    this.delete = false;

    this.color = props.color ? props.color : 'default'
    if (props.range) {
      this.range = props.range
    }
    if (props.lifeSpan) {
      this.lifeSpan = props.lifeSpan
    }
    if (props.onSound) {
      this.onSound = props.onSound
    }
    
    
    if (props.additionalRotation) {
      this.rotation = this.rotation + props.additionalRotation
    }

    let posDelta = rotatePoint({x:0, y:-20}, {x:0,y:0}, this.rotation * Math.PI / 180);
    this.position = {
      x: props.ship.position.x + posDelta.x,
      y: props.ship.position.y + posDelta.y
    };
    this.originPos = {
      x: props.ship.position.x + posDelta.x,
      y: props.ship.position.y + posDelta.y
    };

    this.velocity = {
      x:(posDelta.x / 2),
      y:(posDelta.y / 2)
    };
    this.radius = props.size || 2;

  }

  destroy(byWho?:string){
    this.delete = true;
  }

  render(state:IState, ctx:any):void {

    if (this.lifeSpan-- < 0){
      this.destroy('self')
    }

    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

   if (this.color === 'default') {
    this.color = themes[state.colorThemeIndex].bullet
   } 

/*

    // Delete if it goes out of bounds
    if ( this.position.x < 0
      || this.position.y < 0
      || this.position.x > state.screen.width
      || this.position.y > state.screen.height ) {
        this.destroy();
    }

    if ( (this.position.x < this.originPos.x - this.range
      || this.position.y < this.originPos.y - this.range )
      || (this.position.x > this.originPos.x + this.range
      || this.position.y > this.originPos.y + this.range )) {
        this.destroy();
    }
    */


    // Screen edges
    if (state.inifityScreen) {
      if (this.position.x > state.screen.width + this.radius) {
        this.position.x = -this.radius;
      } else if(this.position.x < -this.radius){
        this.position.x = state.screen.width + this.radius;
      }
      if (this.position.y > state.screen.height + this.radius) {
          this.position.y = -this.radius;
      } else if (this.position.y < -this.radius) {
        this.position.y = state.screen.height + this.radius;
      }
    } else {

      let x = this.velocity.x
      let y = this.velocity.y
      
      if (this.position.x + this.radius> state.screen.width) {
        x = -this.velocity.x;
      } else if(this.position.x - this.radius < 0){
        x = -this.velocity.x
      }
      if (this.position.y + this.radius > state.screen.height) {
        y = -this.velocity.y;
      } else if (this.position.y - this.radius < 0) {
        y = -this.velocity.y
      }

      const newVelocity = {x,y}
      this.velocity = newVelocity
    }


    // Draw
    const context = ctx
    if(context) {
      context.save()
      context.translate(this.position.x, this.position.y)
      context.rotate(this.rotation * Math.PI / 180)
      context.fillStyle = this.color
      context.lineWidth = 0.5
      context.beginPath()
      context.arc(0, 0, this.radius, 0, this.radius * Math.PI)
      context.closePath()
      context.fill()
      context.restore()
    }
  }
}

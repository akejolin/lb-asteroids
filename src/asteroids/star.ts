import Particle from './Particle';
import { asteroidVertices, randomNumBetween } from './helpers';
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
  vertices: [],
}

export interface Iprops {
  position: Iposition,
  size?: number,
}


export default class Asteroid {
  type;
  position;
  vertices;
  rotation;
  score;
  velocity:Iposition;
  radius;
  rotationSpeed;
  delete;


  constructor(props: Iprops) {
    this.type = 'star'
    this.position = props.position
    this.velocity = {
      x: randomNumBetween(-1.5, 1.5),
      y: randomNumBetween(-1.5, 1.5),
    }
    this.rotation = 0;
    this.rotationSpeed = randomNumBetween(-1, 1)
    this.radius = props.size || 1;
    const additionalScore:number = props.additionalScore || 0
    this.score = Math.floor(((80/this.radius)*5) + additionalScore);
    this.vertices = asteroidVertices(8, props.size)
    this.delete = false

  }

  destroy(byWho:string):void {}

  render(state:IState, ctx:any):void {
    
    // Draw
    const context = ctx 
    if (context) {
      context.save();
      context.translate(this.position.x, this.position.y);
      context.rotate(this.rotation * Math.PI / 180);
      context.strokeStyle = '#FFF';
      context.fillStyle = '#ffffff';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(0, - this.radius);
      for (let i = 1; i < this.vertices.length; i++) {
        context.lineTo(this.vertices[i].x, this.vertices[i].y);
      }
      context.closePath();
      context.clip();
      context.stroke();
      context.fill();

      context.restore();
    }
  }
}

import Particle from './Particle';
import { asteroidVertices, randomNumBetween } from './helpers';
import { addInterval, removeInterval } from './gameIntervalHandler'
import type { CanvasItem, IState, Iposition} from './game.types'

export interface Iprops {
  position: Iposition,
  size: number,
  create:Function,
  addScore: Function,
  onSound: Function,
  upgradeType: number,
  upgrade: Function,
}

export interface IupgradeType {
  type: string,
  size: number,
  duration: number,
  image: string,
  color: string,
}

export default class Present {
  type;
  position;
  vertices;
  rotation;
  score;
  velocity:Iposition;
  create;
  addScore;
  onSound;
  radius;
  rotationSpeed;
  delete;
  image:HTMLImageElement;
  alpha;
  isInRadar;
  upgrade;
  upgradeTypes:IupgradeType[];
  upgradeType: number;
  color;
  lifeSpan:number;

  getUpgrade = ():IupgradeType => this.upgradeTypes[this.upgradeType]

  constructor(props:Iprops) {
    this.type = 'present'
    this.position = props.position
    this.velocity = {
      x: randomNumBetween(-1.5, 1.5),
      y: randomNumBetween(-1.5, 1.5)
    }
    this.rotation = 0;
    this.delete = false;
    this.rotationSpeed = randomNumBetween(-1, 1)
    this.radius = props.size;
    this.score = Math.floor((80/this.radius)*5);
    this.create = props.create;
    this.addScore = props.addScore;
    this.vertices = asteroidVertices(8, props.size)
    this.alpha = 0.1;
    this.onSound = props.onSound;
    this.upgrade = props.upgrade
    this.isInRadar = false
    this.lifeSpan = randomNumBetween(800, 2000),

    this.upgradeTypes = [
      {
        type: 'extraLife',
        size: 15,
        duration: 1,
        image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjAuMSAyMC40IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMC4xIDIwLjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cG9seWdvbiBwb2ludHM9IjEwLjUsOC4zIDE2LjksMTAuMiA2LjksMjAuMiA5LjMsMTIuMSA5LjMsMTIuMSAyLjksMTAuMiAxMi45LDAuMiAxMC41LDguMyAiLz48L3N2Zz4=',
        color: '#00c1ff',
      },
      {
        type: 'biggerBullets',
        size: 15,
        duration: 700,
        image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjAuMSAyMC40IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMC4xIDIwLjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cG9seWdvbiBwb2ludHM9IjEwLjUsOC4zIDE2LjksMTAuMiA2LjksMjAuMiA5LjMsMTIuMSA5LjMsMTIuMSAyLjksMTAuMiAxMi45LDAuMiAxMC41LDguMyAiLz48L3N2Zz4=',
        color: '#ffc131',
      },
      {
        type: 'nova',
        duration: 1,
        size: 15,
        image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjAuMSAyMC40IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMC4xIDIwLjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cG9seWdvbiBwb2ludHM9IjEwLjUsOC4zIDE2LjksMTAuMiA2LjksMjAuMiA5LjMsMTIuMSA5LjMsMTIuMSAyLjksMTAuMiAxMi45LDAuMiAxMC41LDguMyAiLz48L3N2Zz4=',
        color: '#fe02c7',
      },
      {
        type: 'triple',
        size: 2,
        duration: 1000,
        image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjAuMSAyMC40IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMC4xIDIwLjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cG9seWdvbiBwb2ludHM9IjEwLjUsOC4zIDE2LjksMTAuMiA2LjksMjAuMiA5LjMsMTIuMSA5LjMsMTIuMSAyLjksMTAuMiAxMi45LDAuMiAxMC41LDguMyAiLz48L3N2Zz4=',
        color: '#363433',
      },
      {
        type: 'shield',
        size: 100,
        duration: 1000,
        image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjAuMSAyMC40IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMC4xIDIwLjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PGc+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxwYXRoIGlkPSJwYXRoMiIgZD0iTTEwLDAuOUwxMCwwLjlsMC40LDAuMWMwLjIsMC4xLDAuMywwLjIsMC40LDAuMnMwLjMsMC4xLDAuNiwwLjNjMC40LDAuMiwwLjUsMC4zLDAuNSwwLjNzMC4xLDAsMC4zLDAuMWMwLjIsMC4xLDAuMywwLjEsMC40LDAuMnMwLjIsMC4xLDAuNCwwLjJjMC4yLDAuMSwwLjMsMC4xLDAuMywwLjFjMCwwLDAuMSwwLDAuMiwwLjFjMC4xLDAsMC4yLDAuMSwwLjMsMC4xYzAuMSwwLDAuMywwLjEsMC40LDAuMWMwLjIsMCwwLjMsMC4xLDAuNSwwLjFjMC4yLDAsMC4zLDAuMSwwLjMsMC4xYzAsMCwwLjIsMCwwLjUsMC4xUzE2LDMsMTYsM3MwLjIsMCwwLjUsMC4xYzAuMywwLDAuNCwwLjEsMC40LDAuMXMwLjEsMCwwLjQsMC4xYzAuMiwwLDAuNCwwLjEsMC40LDAuMWwwLDBsMCwwLjhjMCwwLjUsMCwxLjItMC4xLDJzLTAuMSwxLjQtMC4xLDEuN3MtMC4xLDAuNi0wLjEsMC44UzE3LjMsOSwxNy4yLDkuMmMwLDAuMi0wLjEsMC40LTAuMSwwLjZjMCwwLjItMC4xLDAuNC0wLjEsMC41YzAsMC4yLTAuMSwwLjMtMC4xLDAuNWMtMC4xLDAuMi0wLjEsMC4zLTAuMSwwLjNjMCwwLDAsMC4xLDAsMC4xYzAsMC4xLDAsMC4xLTAuMSwwLjJjMCwwLjEtMC4xLDAuMi0wLjEsMC40cy0wLjEsMC4zLTAuMSwwLjRjMCwwLjEtMC4xLDAuMi0wLjEsMC4zYy0wLjEsMC4xLTAuMSwwLjMtMC4yLDAuNWMtMC4xLDAuMi0wLjEsMC4zLTAuMiwwLjNjMCwwLTAuMSwwLjEtMC4yLDAuM2MtMC4xLDAuMi0wLjIsMC4zLTAuMiwwLjNzLTAuMSwwLjEtMC4yLDAuM3MtMC4xLDAuMi0wLjIsMC4zYzAsMC0wLjEsMC4xLTAuMSwwLjJDMTUsMTQuOSwxNC45LDE1LDE0LjksMTVjMCwwLTAuMSwwLjEtMC4xLDAuMnMtMC4xLDAuMS0wLjEsMC4yYzAsMC4xLTAuMSwwLjEtMC4xLDAuMWMwLDAtMC4xLDAuMS0wLjEsMC4xYzAsMC4xLTAuMSwwLjEtMC4xLDAuMnMtMC4xLDAuMS0wLjEsMC4yYzAsMC4xLTAuMSwwLjEtMC4xLDAuMmMwLDAtMC4xLDAuMS0wLjIsMC4yYy0wLjEsMC4xLTAuMiwwLjMtMC40LDAuNGMtMC4xLDAuMi0wLjMsMC4zLTAuNCwwLjRjLTAuMSwwLjEtMC4yLDAuMi0wLjIsMC4ycy0wLjEsMC4xLTAuMiwwLjJjLTAuMSwwLjEtMC4yLDAuMi0wLjIsMC4ycy0wLjEsMC4xLTAuMiwwLjJjLTAuMSwwLjEtMC4yLDAuMi0wLjIsMC4yYzAsMC0wLjEsMC4xLTAuMSwwLjFzLTAuMSwwLjEtMC4yLDAuMnMtMC4xLDAuMS0wLjIsMC4xYzAsMC0wLjEsMC4xLTAuMSwwLjFjMCwwLTAuMSwwLjEtMC4yLDAuMWMtMC4xLDAuMS0wLjIsMC4xLTAuMiwwLjFjMCwwLTAuMSwwLTAuMSwwLjFjMCwwLTAuMSwwLjEtMC4xLDAuMWMwLDAtMC4xLDAuMS0wLjEsMC4xcy0wLjEsMC0wLjEsMC4xYy0wLjEsMC0wLjEsMC4xLTAuMiwwLjFzLTAuMiwwLjEtMC4yLDAuMWwtMC4xLDBsLTAuMSwwYzAsMC0wLjEsMC0wLjEtMC4xcy0wLjEtMC4xLTAuMi0wLjFjLTAuMS0wLjEtMC4yLTAuMS0wLjItMC4xYzAsMC0wLjEsMC0wLjEtMC4xUzkuMiwxOSw5LjEsMTguOWMwLDAtMC4xLTAuMS0wLjItMC4xYy0wLjEtMC4xLTAuMi0wLjEtMC4yLTAuMWMwLDAtMC4xLTAuMS0wLjEtMC4xYzAsMC0wLjEtMC4xLTAuMS0wLjFjLTAuMSwwLTAuMS0wLjEtMC4yLTAuMlM4LDE4LjIsOCwxOC4xQzcuOSwxOCw3LjgsMTgsNy43LDE3LjhzLTAuMi0wLjItMC4yLTAuMmMwLDAtMC4xLTAuMS0wLjItMC4yQzcuMSwxNy4zLDcsMTcuMyw3LDE3LjJzLTAuMS0wLjEtMC4yLTAuMmMtMC4xLTAuMS0wLjItMC4yLTAuMi0wLjJjMCwwLTAuMS0wLjEtMC4zLTAuM2MtMC4xLTAuMi0wLjItMC4zLTAuMy0wLjNjMCwwLTAuMS0wLjEtMC4xLTAuMkM1LjksMTYsNS44LDE2LDUuOCwxNS45cy0wLjEtMC4xLTAuMS0wLjFjMCwwLTAuMS0wLjEtMC4xLTAuMWMwLDAtMC4xLTAuMS0wLjEtMC4xYzAsMC0wLjEtMC4xLTAuMS0wLjFjMCwwLDAtMC4xLTAuMS0wLjFjMCwwLTAuMS0wLjEtMC4xLTAuMWMwLDAtMC4xLTAuMS0wLjEtMC4yYzAtMC4xLTAuMS0wLjEtMC4xLTAuMWMwLDAtMC4xLTAuMS0wLjEtMC4ycy0wLjEtMC4xLTAuMS0wLjJzLTAuMS0wLjEtMC4xLTAuMnMtMC4xLTAuMi0wLjEtMC4yYzAsMC0wLjEtMC4xLTAuMi0wLjNjLTAuMS0wLjItMC4yLTAuMy0wLjItMC40YzAtMC4xLTAuMS0wLjItMC4xLTAuMkM0LjEsMTMuMSw0LDEzLDQsMTIuOXMtMC4xLTAuMi0wLjEtMC4yczAtMC4xLTAuMS0wLjJzLTAuMS0wLjMtMC4xLTAuNGMwLTAuMS0wLjEtMC4yLTAuMS0wLjRjLTAuMS0wLjItMC4xLTAuNC0wLjItMC42cy0wLjEtMC41LTAuMi0wLjdDMy4xLDEwLjEsMyw5LjgsMyw5LjdjMC0wLjEtMC4xLTAuMy0wLjEtMC42UzIuOCw4LjYsMi43LDguNWMwLTAuMSwwLTAuMy0wLjEtMC44UzIuNiw3LDIuNiw2LjhjMC0wLjIsMC0wLjUsMC0wLjdjMC0wLjIsMC0wLjctMC4xLTEuMmMwLTAuNiwwLTEsMC0xLjJWMy4zbDAsMGMwLDAsMC4xLDAsMC4yLDBjMC4xLDAsMC4yLDAsMC40LTAuMXMwLjQtMC4xLDAuOC0wLjFTNC41LDMsNC43LDIuOWMwLjIsMCwwLjQtMC4xLDAuNi0wLjFjMC4zLTAuMSwwLjUtMC4xLDAuNy0wLjJjMC4yLTAuMSwwLjMtMC4xLDAuNS0wLjFjMC4xLDAsMC4yLTAuMSwwLjMtMC4xczAuMSwwLDAuMi0wLjFjMC4xLDAsMC4yLTAuMSwwLjQtMC4yQzcuNSwyLjEsNy43LDIsNy45LDEuOWMwLjItMC4xLDAuMy0wLjEsMC4zLTAuMXMwLjEsMCwwLjMtMC4xYzAuMi0wLjEsMC4zLTAuMSwwLjQtMC4yczAuMy0wLjEsMC40LTAuMmMwLjEtMC4xLDAuMy0wLjEsMC41LTAuMkwxMCwwLjlMMTAsMC45eiIvPjwvZz48L3N2Zz4=',
        color: '#34b3e8',
      },
    ]

    this.upgradeType = props.upgradeType || 0;

    this.image = new Image();
    this.image.src = this.upgradeTypes[this.upgradeType].image;
    this.color=this.upgradeTypes[this.upgradeType].color || '#ffc131';
  }
  playShowUpSound():void {
    this.onSound({
      file: 'upgradeShowUp',
      status: 'PLAYING'
    })
  }


  inRadar(yes:boolean) {
    if (yes) {
      this.changeAlpha("+");
      if (!this.isInRadar) {
        this.isInRadar = true
        this.playShowUpSound()
      }

    } else {
      this.changeAlpha("-");
      if (this.isInRadar) {
        this.isInRadar = false
      }
    }
  }
  changeAlpha(direction:string) {
    if (this.alpha < 1 && direction === "+" ) {
      this.alpha = this.alpha + 0.02;
    }
    if (this.alpha > 0.1 && direction === "-" ) {
      this.alpha = this.alpha - 0.02;
    }
  }

  selfDestruction():void {
    this.delete = true;
    // Explode
    for (let i = 0; i < this.radius; i++) {
      const particle = new Particle({
        lifeSpan: randomNumBetween(15, 30),
        size: randomNumBetween(1, 4),
        position: {
          x: this.position.x + randomNumBetween(-this.radius/4, this.radius/4),
          y: this.position.y + randomNumBetween(-this.radius/4, this.radius/4)
        },
        velocity: {
          x: randomNumBetween(-1.5, 1.5),
          y: randomNumBetween(-1.5, 1.5)
        }
      });
      this.create(particle, 'particles');
    }
  }

  destroy(byWho:string):void {
    this.delete = true;
    this.onSound({
      file: 'upgradeCatch',
      status: 'PLAYING'
    })
    this.addScore(this.score);

    if (this.alpha > 0) {

    }

  }

  render(state:IState, ctx:any):void{

    // Destroy with effects if max age has excided
    if (this.lifeSpan-- < 0){
      this.selfDestruction()
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

    // Screen edges
    if(this.position.x > state.screen.width + this.radius) this.position.x = -this.radius;
    else if(this.position.x < -this.radius) this.position.x = state.screen.width + this.radius;
    if(this.position.y > state.screen.height + this.radius) this.position.y = -this.radius;
    else if(this.position.y < -this.radius) this.position.y = state.screen.height + this.radius;

    // Draw
    const context = ctx
    if (context) {
      context.save();
      context.translate(this.position.x, this.position.y);
      context.rotate(this.rotation * Math.PI / 180);
      context.strokeStyle = this.color;
      context.fillStyle = this.color // ef404f
      context.lineWidth = 2;
      context.globalAlpha = this.alpha;
      context.beginPath();
      context.arc(0, 0, 20, 0, 2 * Math.PI, false);
      context.stroke();
      context.fill();
      context.closePath();
      context.clip();
      context.drawImage(this.image, this.radius / 2 * (-1), this.radius / 2 * (-1), 20, 20);
      context.restore();
    }
  }
}

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreators } from './actions'

import KeyHandler, { KEY } from './keys'
import ScreenHandler from './screen-handler'
import {randomNumBetweenExcluding, randomInterger} from './helpers'
import { themes } from './color-theme'
import Asteroid from './Asteroid'
import type { Ikeys } from './keys'
import type { Iscreen } from './screen-handler'
import type { IState, CanvasItem, Iposition } from './game.types'

const mapStateToProps = (state:any) => ({
  gameStatus: state.asteroids.gameStatus
})
const mapDispatchToProps = (dispatch:any) => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

type IProps = {
  gameStatus: string
  actions: { [key: string]: any }
}

let classRoot = "";

export class Game extends Component<IProps> {
  canvasRef;
  state:IState;
  canvasItems:CanvasItem[];
  constructor(props:IProps) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
    this.canvasItems = []
    this.state = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      keys : {
        left  : false,
        right : false,
        up    : false,
        down  : false,
        space : false,
        return: false,
        weapon: false,
      },
      colorThemeIndex: randomInterger(0, themes.length - 1 ),
      upgradeFuel: 0,
      readyforNextLife: false,
      hasError: false,
    }
  }

  componentDidMount():void {
    if (this.canvasRef.current !== null) {
      const context = this.canvasRef.current!.getContext('2d');
      this.setState({ context });
    }
    this.props.actions.updateGameStatus('INITIAL')
  }

  componentDidUpdate(prevProps: IProps, prevState:IState):void {
    if (prevProps.gameStatus !== this.props.gameStatus) {
      switch (this.props.gameStatus) {
        case 'INITIAL':
          this.startInitialState()
          break;
        case 'GAME_ON':
          //this.onGame()
          break;
        case 'GAME_START':
          //this.startGame()
          break;
        case 'GAME_GET_READY':
          //this.startContinue()
          /*
          setTimeout(() => {
            this.setState({
              readyforNextLife: true,
            })
          }, 1000)
          */
          break;
        case 'GAME_OVER':
          //this.gameOver()
          break;
      }
    }

  }

  startInitialState():void {

    this.update()
    this.generateAsteroids(3)
  }

  generateAsteroids(amount:number) {
    let ship = this.canvasItems.find(i => i.type === 'ship') || {
      position: {
        x: 0,
        y: 0,
      } as Iposition
    };

    for (let i = 0; i < amount; i++) {
      let asteroid = new Asteroid<CanvasItem>({
        size: 80,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x-60, ship.position.x+60),
          y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y-60, ship.position.y+60)
        },
        create: this.createObject,
        addScore: (item:any) => {},
        onSound: (item:any) => {},
      });
      this.createObject(asteroid);
    }
  }

  update():void {

    const {context, screen} = this.state
    if (context) {
      context.save();
      context.scale(screen.ratio, screen.ratio);

      // Motion trail
      context.fillStyle = themes[this.state.colorThemeIndex].background
      context.globalAlpha = 0.4;
      context.fillRect(0, 0, screen.width, screen.height);
      context.globalAlpha = 1;
    }

    this.updateObjects()
    requestAnimationFrame(() => {this.update()})
  }
  updateObjects():void {
    const items = this.canvasItems
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        this.canvasItems.splice(index, 1);
      }else{
        items[index].render(this.state);
      }
      index++;
    }
  }
  createObject(item:CanvasItem):void {
    this.canvasItems.push(item);
  }

  render() {
    const {screen} = this.state
    return (
      <React.Fragment>
        <ScreenHandler cb={(screen:Iscreen) => this.setState({screen})} />
        <KeyHandler gameStatus={this.props.gameStatus}  state={this.state.keys} cb={(keys:Ikeys) => this.setState({keys})}/>
        <canvas
          id="canvas-board"
          ref={this.canvasRef}
          style={{
            display: 'block',
            backgroundColor: themes[this.state.colorThemeIndex].background,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '100%',
          }}
          width={screen.width * screen.ratio}
          height={screen.height * screen.ratio}
        />
      </React.Fragment>
    )
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game)
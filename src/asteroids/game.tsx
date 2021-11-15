import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreators } from './actions'

import KeyHandler, { KEY } from './keys'
import ScreenHandler from './screen-handler'
import {randomNumBetweenExcluding, randomInterger, randomNumBetween} from './helpers'
import {
  addInterval,
  removeInterval,
  clearAllIntervals,
} from './gameIntervalHandler'
import { themes } from './color-theme'
import {
  updateObjects,
  collisionBetweens,
} from './processer'
import Asteroid from './Asteroid'
import Ship from './Ship'
import Shield from './shield'
import Present from './Present'
import BoardInit from './boardInit'
import BoardGameOver from './boardGameOver'
import BoardGetReady from './boardGetReady'
import GameBoard from './gameboard/main'
import Canvas from './canvas'
import { superNova } from './nova'

import type { Ikeys } from './keys'
import type { Iscreen } from './screen-handler'
import type { IState, CanvasItem, CanvasItemGroups, Iposition, collisionObject } from './game.types'

const mapStateToProps = (state:any) => ({
  gameStatus: state.asteroids.gameStatus,
  level: state.asteroids.level,
  lives: state.asteroids.lives,
  score: state.asteroids.score,
  upgradeFuel: state.asteroids.upgradeFuel,
  shieldFuel: state.asteroids.shieldFuel,
  upgradeFuelTotal: state.asteroids.upgradeFuelTotal,
})
const mapDispatchToProps = (dispatch:any) => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

type IProps = {
  gameStatus: string
  score: number
  actions: {
    [key: string]: any
  }
  level: number,
  lives: number,
  //shieldFuel: number,
  upgradeFuel: number,
  upgradeFuelTotal: number,
}

  // Upgrades actions
  interface ShipItem extends CanvasItem {
    upgrade: Function,
  }
  interface PresentItem extends CanvasItem {
    getUpgrade: Function,
  }

let classRoot = "";

export class Game extends Component<IProps> {
  canvasRef;
  state:IState;
  canvasItems:CanvasItem[];
  canvasItemsGroups: CanvasItemGroups;
  particles:CanvasItem[];
  fps = 60;
  ctx:any;
  constructor(props:IProps) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
    this.canvasItems = []
    this.canvasItemsGroups = {
      asteroids: [],
      particles: [],
      ships: [],
      shields: [],
      bullets: [],
      presents: [],
      ufos: [],
      others: [],
    }

    this.particles = []
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
        escape: false,
      },
      colorThemeIndex: randomInterger(0, themes.length - 1 ),
      upgradeFuel: 0,
      readyforNextLife: false,
      hasError: false,
      //nextPresentDelay: randomNumBetween(500, 1000),
      nextPresentDelay: randomNumBetween(1, 100),
    }
    this.createObject = this.createObject.bind(this)
  }

  componentDidMount():void {
    if (this.canvasRef.current !== null) {
      const context = this.canvasRef.current!.getContext('2d');
      //this.setState({ context });
      this.ctx = context
    }
    this.update()
  
    this.props.actions.updateGameStatus('INITIAL')
  }

  componentWillUnmount():void {
    clearAllIntervals()
    this.removeAllCanvasItems()
    this.props.actions.updateGameStatus('STOPPED')
  }

  componentDidUpdate(prevProps: IProps, prevState:IState):void {
    if (prevProps.gameStatus !== this.props.gameStatus) {
      switch (this.props.gameStatus) {
        case 'INITIAL':
          this.generateAsteroids(3)
          break;
        case 'GAME_ON':
          removeInterval('waitForGetReady')
          removeInterval('waitForRecovery')
          clearAllIntervals()
          this.createShip()
          break;
        case 'GAME_START':
          clearAllIntervals()
          this.removeAllCanvasItems()
          this.generateAsteroids(1)
          this.props.actions.updateGameLevel(0)
          this.props.actions.updateShieldFuel(0)
          this.props.actions.updateLives(2)
          this.props.actions.updateGameStatus('GAME_ON')
          break;
        case 'GAME_ABORT':
          removeInterval('abortAfterGameOver')
          this.removeAllCanvasItems()
          this.props.actions.updateGameStatus('INITIAL')
          break;
        case 'GAME_RECOVERY':
          this.removeCanvasItems(['ship'])
          addInterval('waitForRecovery', 1000, () => {
            removeInterval('waitForRecovery')
            this.props.actions.updateGameStatus('GAME_GET_READY')
            this.props.actions.updateShieldFuel(0)
          })
          break;
        case 'GAME_GET_READY':
          removeInterval('waitForRecovery')
          addInterval('waitForGetReady', 1500, () => {
            removeInterval('waitForGetReady')
            this.props.actions.updateGameStatus('GAME_ON')
          })
          break;
        case 'GAME_OVER':
          addInterval('abortAfterGameOver', 4000, () => {
            removeInterval('abortAfterGameOver')
            this.props.actions.updateGameStatus('GAME_ABORT')
          })
          break;
      }
    }
  }

  removeCanvasItems(primary:Array<string>) {
    primary.forEach(element => {
      this.canvasItemsGroups[`${element}s`].splice(0, this.canvasItemsGroups[`${element}s`].length)
    });
  }
  removeAllCanvasItems() {
    const targets = this.canvasItemsGroups
    for (let key in targets) {
      targets[key].splice(0,targets[key].length)
    };
  }
  generateAsteroids(amount:number) {
    let ship = this.canvasItemsGroups['ships'].find(item => item.type === 'ship' && item.delete === false) || {
      position: { x: 0, y: 0} as Iposition
    };

    for (let i = 0; i < amount; i++) {
      let asteroid = new Asteroid({
        size: 80,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x - 180, ship.position.x + 180),
          y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y - 180, ship.position.y + 180)
        },
        create: this.createObject,
        addScore: this.addScore.bind(this),
        onSound: (item:any) => {},
      });
      this.createObject(asteroid, 'asteroids');
    }
  }
  createShip() {
    let ship = new Ship({
      position: {
        x: this.state.screen.width/2,
        y: this.state.screen.height/2
      },
      //lastShotLimit: 0.1,
      create: this.createObject,
      onDie: () => {},
      onSound: () => {},
      updateUpgradeFuel: (data:any) => {
        return this.props.actions.updateUpgradeFuel(data)},
      
    });
    this.createObject(ship, 'ships')
    //this.props.actions.updateShieldFuel(0)
  }
  addScore(points:number) {
    this.props.actions.addScore(points)
  }
  generatePresent() {
    let ship = this.canvasItemsGroups['ships'].find(item => item.type === 'ship' && item.delete === false)
      if (!ship) {
        return;
      }
      let present = new Present({
        size: 20,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, -100, +100),
          y: randomNumBetweenExcluding(0, this.state.screen.height, -100, +100)
        },
        create: this.createObject,
        addScore: this.addScore.bind(this),
        upgrade: () => {},
        // upgradeType: randomInterger(4,4)
        upgradeType: randomInterger(2,2),
        // onSound: this.onSound.bind(this),
        onSound: () => {},
      });
      this.createObject(present, 'presents');
  }

  generateShield() {
    //console.log('shield')
    let ship = this.canvasItemsGroups['ships'].find(i => i.type === 'ship');
    
    if (!ship) {
      return;
    }

    this.removeCanvasItems(['shield'])
    let shield = new Shield({
      position: {
        x: randomNumBetweenExcluding(0, this.state.screen.width, -100, +100),
        y: randomNumBetweenExcluding(0, this.state.screen.height, -100, +100)
      },
      create: this.createObject.bind(this),
      ship: ship,
      updateShieldFuel: (data:number) => this.props.actions.updateShieldFuel(data),
      onSound: () => {} //this.onSound.bind(this)
    })
    //console.log('shield: ', shield)
    this.createObject(shield, 'shields');
  }

  createObject(item:CanvasItem, group:string = 'asteroids'):void {
    this.canvasItemsGroups[group].push(item);
  }
  collisionWithBullet(item1:CanvasItem, item2:CanvasItem):void {
    item1.destroy(item2.type);
    item2.destroy(item1.type);
  }
  collisionWithShield(item1:CanvasItem, item2:CanvasItem):void {
    item2.destroy(item1.type);
  }
  collisionWithShip(item1:CanvasItem, item2:CanvasItem):void {
    item1.destroy(item2.type);
    item2.destroy(item1.type);
    if (this.props.lives < 1) {
      this.props.actions.updateGameStatus('GAME_OVER')
    } else {
      this.props.actions.updateLives('-1')
      this.props.actions.updateGameStatus('GAME_RECOVERY')
    }
  }

  collisionWithPresent(ship:ShipItem, present:PresentItem):void {
    const upgrade = present.getUpgrade();
    // Extralife
    switch(upgrade.type) {
      case 'extraLife':
        this.props.actions.updateLives('+1')
        present.destroy(ship.type);        
      break;
      case 'nova':
        const primaryArray = this.canvasItemsGroups['asteroids']
        superNova(primaryArray)

        //this.ufos.forEach(item => {
        //  item.destroy('nova')
        //})
        // this.onSound({
        //   file: 'nova',
        //   status: 'PLAYING'
        // })
      break;
      case 'shield': 
        this.generateShield()
      break;
      case 'biggerBullets':
      case 'triple':
        ship.upgrade({
          upgrade,
        })
      break;
    }
    present.destroy(ship.type);
}
  async update():Promise<void> {
    
    const {state} = this
    const {screen} = state
    const context = this.ctx
    if (context) {
      context.save();
      context.scale(screen.ratio, screen.ratio);

      // Motion trail
      context.fillStyle = themes[state.colorThemeIndex].background
      context.globalAlpha = 0.7;
      context.fillRect(0, 0, screen.width, screen.height);
      context.globalAlpha = 1;
    }


    const collisions:collisionObject[] = [
      {
        primary: 'bullet',
        secondary: [ 'asteroid', 'ufo'],
        cb: this.collisionWithBullet.bind(this)
      },
      {
        primary: 'ship',
        secondary: [ 'asteroid', 'ufo'],
        cb: this.collisionWithShip.bind(this)
      },  
      {
        primary: 'ship',
        secondary: [ 'present'],
        cb: this.collisionWithPresent.bind(this)
      },
      {
        primary: 'shield',
        secondary: [ 'asteroid', 'ufo'],
        cb: this.collisionWithShield.bind(this)
      },   
    ]
    await collisionBetweens(this.canvasItemsGroups, collisions)

    // Generate new present
    if (this.state.nextPresentDelay-- < 0){
      this.state.nextPresentDelay = randomNumBetween(400, 1000)
      this.generatePresent() 
    }

    // Instant Key handling
    if (this.props.gameStatus === 'INITIAL' && state.keys.space) {
      this.props.actions.updateGameStatus('GAME_START')
    }
    if ((this.props.gameStatus === 'GAME_ON' || this.props.gameStatus === 'GAME_OVER') && state.keys.escape) {
      this.props.actions.updateGameStatus('GAME_ABORT')
    }
    if (this.props.gameStatus === 'GAME_GET_READY' && state.keys.space) {
      this.props.actions.updateGameStatus('GAME_ON')
    }


    if (!this.canvasItemsGroups['asteroids'].length && this.props.gameStatus === 'GAME_ON') {
      this.props.actions.updateGameLevel('+1')
      this.levelUp()
    }



    await updateObjects(this.canvasItemsGroups, this.state, this.ctx)

    context.restore();

    // Engine
    if (this.fps !== 60) {
      setTimeout(() => {
        requestAnimationFrame(() => this.update());
      }, 1000 / this.fps);
    } else {
      requestAnimationFrame(() => this.update());
    }
  }

  levelUp() {
    const amountOfAsteroids = Math.floor(Number(this.props.level) + 1)
    const nextSelectedColor = randomInterger(0, themes.length - 1 )
    this.props.actions.updateColorTheme(nextSelectedColor)
    this.state.colorThemeIndex = nextSelectedColor

    this.state.nextPresentDelay = randomNumBetween(400, 1000)
    this.generateAsteroids(amountOfAsteroids)
    this.props.actions.addScore(1000)
  }

  render() {
 
    const {screen} = this.state
    return (
      <React.Fragment>
        <ScreenHandler cb={(screen:Iscreen) => this.setState({screen})} />
        <KeyHandler keys={this.state.keys} cb={(keys:Ikeys) => this.setState({keys})}/>
        <BoardInit gameStatus={this.props.gameStatus} colorThemeIndex={this.state.colorThemeIndex} />
        <BoardGameOver gameStatus={this.props.gameStatus} colorThemeIndex={this.state.colorThemeIndex} />
        <BoardGetReady gameStatus={this.props.gameStatus} colorThemeIndex={this.state.colorThemeIndex} />
        <GameBoard
          gameStatus={this.props.gameStatus}
          score={this.props.score}
          colorThemeIndex={this.state.colorThemeIndex}
          lives={this.props.lives}
          level={this.props.level}
          shieldFuel={this.props.shieldFuel}
          upgradeFuel={this.props.upgradeFuel}
          upgradeFuelTotal={this.props.upgradeFuelTotal}
        />
        <Canvas
          ref={this.canvasRef}
          background={themes[this.state.colorThemeIndex].background}
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
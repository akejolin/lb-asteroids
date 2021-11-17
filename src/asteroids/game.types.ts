import type {Ikeys} from 'src/asteroids/keys'
import type { Iscreen } from './screen-handler'

export interface Iposition {
  x: number,
  y: number,
}

export interface CanvasItem {
  position: Iposition,
  delete: boolean,
  create: Function,
  render: Function,
  type: string,
  destroy: Function,
  radius: number,
  getUpgrade?: Function
}

export interface CanvasItemGroups {
  [key: string]: CanvasItem[]
  /*
  asteroids: CanvasItem[] | [],
  particles: CanvasItem[] | [],
  ships: CanvasItem[] | [],
  shields: CanvasItem[] | [],
  presents: CanvasItem[] | [], 
  bullets: CanvasItem[] | [],
  ufos: CanvasItem[] | [],
  others: CanvasItem[] | [],
  */
}


export interface IState {
  screen: Iscreen,
  context: CanvasRenderingContext2D | null,
  keys : Ikeys,
  colorThemeIndex: number,
  upgradeFuel: number,
  readyforNextLife: boolean,
  hasError: boolean,
  nextPresentDelay: number,
  ufoDelay:number,
}


export interface collisionObject {
  primary: string;
  secondary: Array<string>;
  cb: Function;
}



export interface IupgradeBase {
  type: string,
  size: number,
  image: string,
  color: string,
  duration?: number,
  lifeSpan?: number,
}

export interface IshipWeapon extends IupgradeBase{
  size: number,
  range: number,
  lastShotLimit: number,
}
export interface IshipEquipment extends IupgradeBase{

}
export interface IgameChanger extends IupgradeBase{

}

export interface IspaceInterferer extends IupgradeBase{

}

export interface upgradeArray extends Array<IshipWeapon|IgameChanger|IshipEquipment|IspaceInterferer> {
  
}
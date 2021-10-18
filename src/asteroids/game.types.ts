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


export interface IState {
  screen: Iscreen,
  context: CanvasRenderingContext2D | null,
  keys : Ikeys,
  colorThemeIndex: number,
  upgradeFuel: number,
  readyforNextLife: boolean,
  hasError: boolean,
}
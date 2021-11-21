import Particle from './Particle';
import { asteroidVertices, randomNumBetween } from './helpers';
import { addInterval, removeInterval } from './gameIntervalHandler'
import type {
  CanvasItem,
  IState,
  Iposition,
  IupgradeBase,
  IshipWeapon,
  IshipEquipment,
  IgameChanger,
  IspaceInterferer,
  upgradeArray,
} from './game.types'

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
  public isInRadar;
  upgrade;
  upgradeTypes:upgradeArray;
  upgradeType: number;
  color;
  lifeSpan:number;

  getUpgrade = ():IshipWeapon|IshipEquipment|IgameChanger|IspaceInterferer =>
    this.upgradeTypes[this.upgradeType]

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
    this.alpha = 1;
    this.onSound = props.onSound;
    this.upgrade = props.upgrade
    this.isInRadar = false
    this.lifeSpan = randomNumBetween(800, 2000),

    this.upgradeTypes = [
      {
        type: 'extraLife',
        image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4PSIwcHQiIHk9IjBwdCIgd2lkdGg9IjIwcHQiIGhlaWdodD0iMjBwdCIgdmlld0JveD0iMCAwIDIwIDIwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICA8ZyBpZD0iMSI+CiAgICA8dGl0bGU+TGF5ZXIgMjwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgPHRpdGxlPlRleHQ8L3RpdGxlPgogICAgICA8ZyBpZD0iMiI+CiAgICAgICAgPGRlZnM+CiAgICAgICAgICA8cGF0aCBpZD0iMyIgZD0iTS0wLjAwODkxMjAzLDIwLjAwODkgQy0wLjAwODkxMjAzLDIwLjAwODksLTAuMDA4OTEyMDMsMTcuMzMzNSwtMC4wMDg5MTIwMywxNy4zMzM1IEMtMC4wMDg5MTIwMywxNy4zMzM1LDQuNTg0NDMsMTcuMzMzNSw0LjU4NDQzLDE3LjMzMzUgQzQuNTg0NDMsMTcuMzMzNSw0LjU4NDQzLDYuNjMxODcsNC41ODQ0Myw2LjYzMTg3IEM0LjU4NDQzLDYuNjMxODcsMi4yODc3Niw2LjYzMTg3LDIuMjg3NzYsNi42MzE4NyBDMi4yODc3Niw2LjYzMTg3LDIuMjg3NzYsMy45NTY0NywyLjI4Nzc2LDMuOTU2NDcgQzIuMjg3NzYsMy45NTY0Nyw0LjU4NDQzLDMuOTU2NDcsNC41ODQ0MywzLjk1NjQ3IEM0LjU4NDQzLDMuOTU2NDcsNC41ODQ0MywxLjI4MTA2LDQuNTg0NDMsMS4yODEwNiBDNC41ODQ0MywxLjI4MTA2LDkuMTc3NzgsMS4yODEwNiw5LjE3Nzc4LDEuMjgxMDYgQzkuMTc3NzgsMS4yODEwNiw5LjE3Nzc4LDE3LjMzMzUsOS4xNzc3OCwxNy4zMzM1IEM5LjE3Nzc4LDE3LjMzMzUsMTMuNzcxMSwxNy4zMzM1LDEzLjc3MTEsMTcuMzMzNSBDMTMuNzcxMSwxNy4zMzM1LDEzLjc3MTEsMjAuMDA4OSwxMy43NzExLDIwLjAwODkgeiIvPgogICAgICAgIDwvZGVmcz4KICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiMzIiBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO29wYWNpdHk6MTtzdHJva2U6bm9uZTsiLz4KICAgICAgPC9nPgogICAgPC9kZWZzPgogICAgPHVzZSB4bGluazpocmVmPSIjMiIvPgogICAgPGRlZnM+CiAgICAgIDx0aXRsZT5UZXh0PC90aXRsZT4KICAgICAgPGcgaWQ9IjQiPgogICAgICAgIDxkZWZzPgogICAgICAgICAgPHBhdGggaWQ9IjUiIGQ9Ik0xMC41NjQ3LDEzLjI0MDIgQzEwLjU2NDcsMTMuMjQwMiwxMC41NjQ3LDEyLjI2MywxMC41NjQ3LDEyLjI2MyBDMTAuNTY0NywxMi4yNjMsOS44OTUwNywxMi4yNjMsOS44OTUwNywxMi4yNjMgQzkuODk1MDcsMTIuMjYzLDkuODk1MDcsOC4zNTQwOSw5Ljg5NTA3LDguMzU0MDkgQzkuODk1MDcsOC4zNTQwOSwxMS4yMzQzLDguMzU0MDksMTEuMjM0Myw4LjM1NDA5IEMxMS4yMzQzLDguMzU0MDksMTEuMjM0MywxMi4yNjMsMTEuMjM0MywxMi4yNjMgQzExLjIzNDMsMTIuMjYzLDEzLjI0MzEsMTIuMjYzLDEzLjI0MzEsMTIuMjYzIEMxMy4yNDMxLDEyLjI2MywxMy4yNDMxLDguMzU0MDksMTMuMjQzMSw4LjM1NDA5IEMxMy4yNDMxLDguMzU0MDksMTQuNTgyMyw4LjM1NDA5LDE0LjU4MjMsOC4zNTQwOSBDMTQuNTgyMyw4LjM1NDA5LDE0LjU4MjMsMTMuMjQwMiwxNC41ODIzLDEzLjI0MDIgeiIvPgogICAgICAgIDwvZGVmcz4KICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiM1IiBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO29wYWNpdHk6MTtzdHJva2U6bm9uZTsiLz4KICAgICAgPC9nPgogICAgPC9kZWZzPgogICAgPHVzZSB4bGluazpocmVmPSIjNCIvPgogICAgPGRlZnM+CiAgICAgIDx0aXRsZT5UZXh0PC90aXRsZT4KICAgICAgPGcgaWQ9IjYiPgogICAgICAgIDxkZWZzPgogICAgICAgICAgPHBhdGggaWQ9IjciIGQ9Ik0xNS4yNTE5LDE0LjIxNzUgQzE1LjI1MTksMTQuMjE3NSwxNS4yNTE5LDguMzU0MDksMTUuMjUxOSw4LjM1NDA5IEMxNS4yNTE5LDguMzU0MDksMTkuMjY5Niw4LjM1NDA5LDE5LjI2OTYsOC4zNTQwOSBDMTkuMjY5Niw4LjM1NDA5LDE5LjI2OTYsOS4zMzEzMiwxOS4yNjk2LDkuMzMxMzIgQzE5LjI2OTYsOS4zMzEzMiwxOS45MzkyLDkuMzMxMzIsMTkuOTM5Miw5LjMzMTMyIEMxOS45MzkyLDkuMzMxMzIsMTkuOTM5MiwxMS4yODU4LDE5LjkzOTIsMTEuMjg1OCBDMTkuOTM5MiwxMS4yODU4LDE5LjI2OTYsMTEuMjg1OCwxOS4yNjk2LDExLjI4NTggQzE5LjI2OTYsMTEuMjg1OCwxOS4yNjk2LDEyLjI2MywxOS4yNjk2LDEyLjI2MyBDMTkuMjY5NiwxMi4yNjMsMTYuNTkxMiwxMi4yNjMsMTYuNTkxMiwxMi4yNjMgQzE2LjU5MTIsMTIuMjYzLDE2LjU5MTIsMTQuMjE3NSwxNi41OTEyLDE0LjIxNzUgeiBNMTYuNTkxMiwxMS4yODU4IEMxNi41OTEyLDExLjI4NTgsMTguNiwxMS4yODU4LDE4LjYsMTEuMjg1OCBDMTguNiwxMS4yODU4LDE4LjYsOS4zMzEzMiwxOC42LDkuMzMxMzIgQzE4LjYsOS4zMzEzMiwxNi41OTEyLDkuMzMxMzIsMTYuNTkxMiw5LjMzMTMyIHoiLz4KICAgICAgICA8L2RlZnM+CiAgICAgICAgPHVzZSB4bGluazpocmVmPSIjNyIgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtvcGFjaXR5OjE7c3Ryb2tlOm5vbmU7Ii8+CiAgICAgIDwvZz4KICAgIDwvZGVmcz4KICAgIDx1c2UgeGxpbms6aHJlZj0iIzYiLz4KICA8L2c+Cjwvc3ZnPgo=',
        color: '#ff00dd',
      } as IgameChanger,
      {
        type: 'nova',
        image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjAuMSAyMC40IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMC4xIDIwLjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cG9seWdvbiBwb2ludHM9IjEwLjUsOC4zIDE2LjksMTAuMiA2LjksMjAuMiA5LjMsMTIuMSA5LjMsMTIuMSAyLjksMTAuMiAxMi45LDAuMiAxMC41LDguMyAiLz48L3N2Zz4=',
        color: '#9502fe',
        catchSound: 'none',
      } as IspaceInterferer,
      {
        type: 'biggerBullets',
        size: 15,
        duration: 700,
        image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjAuMSAyMC40IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMC4xIDIwLjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cG9seWdvbiBwb2ludHM9IjEwLjUsOC4zIDE2LjksMTAuMiA2LjksMjAuMiA5LjMsMTIuMSA5LjMsMTIuMSAyLjksMTAuMiAxMi45LDAuMiAxMC41LDguMyAiLz48L3N2Zz4=',
        color: '#ff3131',
        range: 400,
        lastShotLimit: 170,
      } as IshipWeapon,
      {
        type: 'triple',
        size: 2,
        duration: 700,
        image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4PSIwcHQiIHk9IjBwdCIgd2lkdGg9IjIwcHQiIGhlaWdodD0iMjBwdCIgdmlld0JveD0iMCAwIDIwIDIwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICA8ZyBpZD0iMSI+CiAgICA8dGl0bGU+TGF5ZXIgMjwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgPHRpdGxlPlBhdGg8L3RpdGxlPgogICAgICA8ZyBpZD0iMiI+CiAgICAgICAgPGRlZnM+CiAgICAgICAgICA8cGF0aCBpZD0iMyIgZD0iTTMuMTY0MzYsNy41MDMzNiBDNC41NDMyMiw3LjUwMzM2LDUuNjYxLDguNjIxMTQsNS42NjEsMTAgQzUuNjYxLDExLjM3ODksNC41NDMyMiwxMi40OTY2LDMuMTY0MzYsMTIuNDk2NiBDMS43ODU1LDEyLjQ5NjYsMC42Njc3MTYsMTEuMzc4OSwwLjY2NzcxNiwxMCBDMC42Njc3MTYsOC42MjExNCwxLjc4NTUsNy41MDMzNiwzLjE2NDM2LDcuNTAzMzYgeiIvPgogICAgICAgIDwvZGVmcz4KICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiMzIiBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO29wYWNpdHk6MTtzdHJva2U6bm9uZTsiLz4KICAgICAgPC9nPgogICAgPC9kZWZzPgogICAgPHVzZSB4bGluazpocmVmPSIjMiIvPgogICAgPGRlZnM+CiAgICAgIDx0aXRsZT5QYXRoPC90aXRsZT4KICAgICAgPGcgaWQ9IjQiPgogICAgICAgIDxkZWZzPgogICAgICAgICAgPHBhdGggaWQ9IjUiIGQ9Ik0xNi44MzU2LDcuNTAzMzYgQzE4LjIxNDUsNy41MDMzNiwxOS4zMzIzLDguNjIxMTQsMTkuMzMyMywxMCBDMTkuMzMyMywxMS4zNzg5LDE4LjIxNDUsMTIuNDk2NiwxNi44MzU2LDEyLjQ5NjYgQzE1LjQ1NjgsMTIuNDk2NiwxNC4zMzksMTEuMzc4OSwxNC4zMzksMTAgQzE0LjMzOSw4LjYyMTE0LDE1LjQ1NjgsNy41MDMzNiwxNi44MzU2LDcuNTAzMzYgeiIvPgogICAgICAgIDwvZGVmcz4KICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiM1IiBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO29wYWNpdHk6MTtzdHJva2U6bm9uZTsiLz4KICAgICAgPC9nPgogICAgPC9kZWZzPgogICAgPHVzZSB4bGluazpocmVmPSIjNCIvPgogICAgPGRlZnM+CiAgICAgIDx0aXRsZT5QYXRoPC90aXRsZT4KICAgICAgPGcgaWQ9IjYiPgogICAgICAgIDxkZWZzPgogICAgICAgICAgPHBhdGggaWQ9IjciIGQ9Ik05Ljg3NTc0LDcuNTAzMzYgQzExLjI1NDYsNy41MDMzNiwxMi4zNzI0LDguNjIxMTQsMTIuMzcyNCwxMCBDMTIuMzcyNCwxMS4zNzg5LDExLjI1NDYsMTIuNDk2Niw5Ljg3NTc0LDEyLjQ5NjYgQzguNDk2ODgsMTIuNDk2Niw3LjM3OTA5LDExLjM3ODksNy4zNzkwOSwxMCBDNy4zNzkwOSw4LjYyMTE0LDguNDk2ODgsNy41MDMzNiw5Ljg3NTc0LDcuNTAzMzYgeiIvPgogICAgICAgIDwvZGVmcz4KICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiM3IiBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO29wYWNpdHk6MTtzdHJva2U6bm9uZTsiLz4KICAgICAgPC9nPgogICAgPC9kZWZzPgogICAgPHVzZSB4bGluazpocmVmPSIjNiIvPgogIDwvZz4KPC9zdmc+Cg==',
        color: '#ff3131',
        range: 400,
        lastShotLimit: 170,
      } as IshipWeapon,


      {
        type: 'lazar',
        size: 2,
        duration: 400,
        image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjAuMSAyMC40IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMC4xIDIwLjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cG9seWdvbiBwb2ludHM9IjEwLjUsOC4zIDE2LjksMTAuMiA2LjksMjAuMiA5LjMsMTIuMSA5LjMsMTIuMSAyLjksMTAuMiAxMi45LDAuMiAxMC41LDguMyAiLz48L3N2Zz4=',
        color: '#ff3131',
        range: 600,
        lastShotLimit: 0,
      } as IshipWeapon,
      {
        type: 'shield',
        duration: 1000,
        image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjAuMSAyMC40IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMC4xIDIwLjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PGc+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxwYXRoIGlkPSJwYXRoMiIgZD0iTTEwLDAuOUwxMCwwLjlsMC40LDAuMWMwLjIsMC4xLDAuMywwLjIsMC40LDAuMnMwLjMsMC4xLDAuNiwwLjNjMC40LDAuMiwwLjUsMC4zLDAuNSwwLjNzMC4xLDAsMC4zLDAuMWMwLjIsMC4xLDAuMywwLjEsMC40LDAuMnMwLjIsMC4xLDAuNCwwLjJjMC4yLDAuMSwwLjMsMC4xLDAuMywwLjFjMCwwLDAuMSwwLDAuMiwwLjFjMC4xLDAsMC4yLDAuMSwwLjMsMC4xYzAuMSwwLDAuMywwLjEsMC40LDAuMWMwLjIsMCwwLjMsMC4xLDAuNSwwLjFjMC4yLDAsMC4zLDAuMSwwLjMsMC4xYzAsMCwwLjIsMCwwLjUsMC4xUzE2LDMsMTYsM3MwLjIsMCwwLjUsMC4xYzAuMywwLDAuNCwwLjEsMC40LDAuMXMwLjEsMCwwLjQsMC4xYzAuMiwwLDAuNCwwLjEsMC40LDAuMWwwLDBsMCwwLjhjMCwwLjUsMCwxLjItMC4xLDJzLTAuMSwxLjQtMC4xLDEuN3MtMC4xLDAuNi0wLjEsMC44UzE3LjMsOSwxNy4yLDkuMmMwLDAuMi0wLjEsMC40LTAuMSwwLjZjMCwwLjItMC4xLDAuNC0wLjEsMC41YzAsMC4yLTAuMSwwLjMtMC4xLDAuNWMtMC4xLDAuMi0wLjEsMC4zLTAuMSwwLjNjMCwwLDAsMC4xLDAsMC4xYzAsMC4xLDAsMC4xLTAuMSwwLjJjMCwwLjEtMC4xLDAuMi0wLjEsMC40cy0wLjEsMC4zLTAuMSwwLjRjMCwwLjEtMC4xLDAuMi0wLjEsMC4zYy0wLjEsMC4xLTAuMSwwLjMtMC4yLDAuNWMtMC4xLDAuMi0wLjEsMC4zLTAuMiwwLjNjMCwwLTAuMSwwLjEtMC4yLDAuM2MtMC4xLDAuMi0wLjIsMC4zLTAuMiwwLjNzLTAuMSwwLjEtMC4yLDAuM3MtMC4xLDAuMi0wLjIsMC4zYzAsMC0wLjEsMC4xLTAuMSwwLjJDMTUsMTQuOSwxNC45LDE1LDE0LjksMTVjMCwwLTAuMSwwLjEtMC4xLDAuMnMtMC4xLDAuMS0wLjEsMC4yYzAsMC4xLTAuMSwwLjEtMC4xLDAuMWMwLDAtMC4xLDAuMS0wLjEsMC4xYzAsMC4xLTAuMSwwLjEtMC4xLDAuMnMtMC4xLDAuMS0wLjEsMC4yYzAsMC4xLTAuMSwwLjEtMC4xLDAuMmMwLDAtMC4xLDAuMS0wLjIsMC4yYy0wLjEsMC4xLTAuMiwwLjMtMC40LDAuNGMtMC4xLDAuMi0wLjMsMC4zLTAuNCwwLjRjLTAuMSwwLjEtMC4yLDAuMi0wLjIsMC4ycy0wLjEsMC4xLTAuMiwwLjJjLTAuMSwwLjEtMC4yLDAuMi0wLjIsMC4ycy0wLjEsMC4xLTAuMiwwLjJjLTAuMSwwLjEtMC4yLDAuMi0wLjIsMC4yYzAsMC0wLjEsMC4xLTAuMSwwLjFzLTAuMSwwLjEtMC4yLDAuMnMtMC4xLDAuMS0wLjIsMC4xYzAsMC0wLjEsMC4xLTAuMSwwLjFjMCwwLTAuMSwwLjEtMC4yLDAuMWMtMC4xLDAuMS0wLjIsMC4xLTAuMiwwLjFjMCwwLTAuMSwwLTAuMSwwLjFjMCwwLTAuMSwwLjEtMC4xLDAuMWMwLDAtMC4xLDAuMS0wLjEsMC4xcy0wLjEsMC0wLjEsMC4xYy0wLjEsMC0wLjEsMC4xLTAuMiwwLjFzLTAuMiwwLjEtMC4yLDAuMWwtMC4xLDBsLTAuMSwwYzAsMC0wLjEsMC0wLjEtMC4xcy0wLjEtMC4xLTAuMi0wLjFjLTAuMS0wLjEtMC4yLTAuMS0wLjItMC4xYzAsMC0wLjEsMC0wLjEtMC4xUzkuMiwxOSw5LjEsMTguOWMwLDAtMC4xLTAuMS0wLjItMC4xYy0wLjEtMC4xLTAuMi0wLjEtMC4yLTAuMWMwLDAtMC4xLTAuMS0wLjEtMC4xYzAsMC0wLjEtMC4xLTAuMS0wLjFjLTAuMSwwLTAuMS0wLjEtMC4yLTAuMlM4LDE4LjIsOCwxOC4xQzcuOSwxOCw3LjgsMTgsNy43LDE3LjhzLTAuMi0wLjItMC4yLTAuMmMwLDAtMC4xLTAuMS0wLjItMC4yQzcuMSwxNy4zLDcsMTcuMyw3LDE3LjJzLTAuMS0wLjEtMC4yLTAuMmMtMC4xLTAuMS0wLjItMC4yLTAuMi0wLjJjMCwwLTAuMS0wLjEtMC4zLTAuM2MtMC4xLTAuMi0wLjItMC4zLTAuMy0wLjNjMCwwLTAuMS0wLjEtMC4xLTAuMkM1LjksMTYsNS44LDE2LDUuOCwxNS45cy0wLjEtMC4xLTAuMS0wLjFjMCwwLTAuMS0wLjEtMC4xLTAuMWMwLDAtMC4xLTAuMS0wLjEtMC4xYzAsMC0wLjEtMC4xLTAuMS0wLjFjMCwwLDAtMC4xLTAuMS0wLjFjMCwwLTAuMS0wLjEtMC4xLTAuMWMwLDAtMC4xLTAuMS0wLjEtMC4yYzAtMC4xLTAuMS0wLjEtMC4xLTAuMWMwLDAtMC4xLTAuMS0wLjEtMC4ycy0wLjEtMC4xLTAuMS0wLjJzLTAuMS0wLjEtMC4xLTAuMnMtMC4xLTAuMi0wLjEtMC4yYzAsMC0wLjEtMC4xLTAuMi0wLjNjLTAuMS0wLjItMC4yLTAuMy0wLjItMC40YzAtMC4xLTAuMS0wLjItMC4xLTAuMkM0LjEsMTMuMSw0LDEzLDQsMTIuOXMtMC4xLTAuMi0wLjEtMC4yczAtMC4xLTAuMS0wLjJzLTAuMS0wLjMtMC4xLTAuNGMwLTAuMS0wLjEtMC4yLTAuMS0wLjRjLTAuMS0wLjItMC4xLTAuNC0wLjItMC42cy0wLjEtMC41LTAuMi0wLjdDMy4xLDEwLjEsMyw5LjgsMyw5LjdjMC0wLjEtMC4xLTAuMy0wLjEtMC42UzIuOCw4LjYsMi43LDguNWMwLTAuMSwwLTAuMy0wLjEtMC44UzIuNiw3LDIuNiw2LjhjMC0wLjIsMC0wLjUsMC0wLjdjMC0wLjIsMC0wLjctMC4xLTEuMmMwLTAuNiwwLTEsMC0xLjJWMy4zbDAsMGMwLDAsMC4xLDAsMC4yLDBjMC4xLDAsMC4yLDAsMC40LTAuMXMwLjQtMC4xLDAuOC0wLjFTNC41LDMsNC43LDIuOWMwLjIsMCwwLjQtMC4xLDAuNi0wLjFjMC4zLTAuMSwwLjUtMC4xLDAuNy0wLjJjMC4yLTAuMSwwLjMtMC4xLDAuNS0wLjFjMC4xLDAsMC4yLTAuMSwwLjMtMC4xczAuMSwwLDAuMi0wLjFjMC4xLDAsMC4yLTAuMSwwLjQtMC4yQzcuNSwyLjEsNy43LDIsNy45LDEuOWMwLjItMC4xLDAuMy0wLjEsMC4zLTAuMXMwLjEsMCwwLjMtMC4xYzAuMi0wLjEsMC4zLTAuMSwwLjQtMC4yczAuMy0wLjEsMC40LTAuMmMwLjEtMC4xLDAuMy0wLjEsMC41LTAuMkwxMCwwLjlMMTAsMC45eiIvPjwvZz48L3N2Zz4=',
        color: '#e8a634',
      } as IshipEquipment, 
    ]
    this.upgradeType = props.upgradeType || 0;

    this.image = new Image();
    this.image.src = this.upgradeTypes[this.upgradeType].image;
    this.color=this.upgradeTypes[this.upgradeType].color || '#ffc131';
    this.playShowUpSound()
  }
  playShowUpSound():void {
    this.onSound({
      file: 'upgradeShowUp',
      status: 'PLAYING'
    })
  }

  inRadar() {
    //this.playShowUpSound()
  }
  changeAlpha(direction:string) {
    /*
    if (this.alpha < 1 && direction === "+" ) {
      this.alpha = this.alpha + 0.02;
    }
    if (this.alpha > 0.1 && direction === "-" ) {
      this.alpha = this.alpha - 0.02;
    }
    */
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
    if (this.upgradeTypes[this.upgradeType].catchSound !== 'none') {
      this.onSound({
        file: 'upgradeCatch',
        status: 'PLAYING'
      })
    }
    this.addScore(this.score);

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
      //context.globalAlpha = this.alpha;
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

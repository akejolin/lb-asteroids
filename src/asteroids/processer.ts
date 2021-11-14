import type { IState, CanvasItem, CanvasItemGroups } from './game.types'

export const updateObjects = (targets:CanvasItemGroups, state:IState):void => {
  for (let key in targets) {
    let index = 0;
    const items = targets[key];
    for (let item of items) {
      if (item.delete) {
        items.splice(index, 1);
      } else{
        items[index].render(state);
      }
      index++;
    }
  }
}

  export const checkCollision = (obj1:CanvasItem, obj2:CanvasItem, distance = 0):boolean => {
    var vx = obj1.position.x - obj2.position.x;
    var vy = obj1.position.y - obj2.position.y;
    var length = Math.sqrt(vx * vx + vy * vy);
    if (length < ((obj1.radius + distance) + (obj2.radius + distance))) {
      return true;
    }
    return false;
  }

  export const collisionBetween = (
    haystack:CanvasItemGroups,
    primary:string,
    secondary:Array<string>,
    cb:Function
  ):void => {
   
    const primaryArray:CanvasItem[] = haystack[`${primary}s`]
    let secondaryArray:CanvasItem[] = []
    secondary.forEach(element => {
      secondaryArray.push(...haystack[`${element}s`])
    });
    let a = primaryArray.length - 1;
    let b;
    for (a; a > -1; --a) {
      b = secondaryArray.length - 1;
      for (b; b > -1; --b) {
        const item1 = primaryArray[a];
        const item2 = secondaryArray[b];
        if (item1 && item2 && checkCollision(item1, item2)) {
          cb(item1, item2)
        }
      }
    }
  }
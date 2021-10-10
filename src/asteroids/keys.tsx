import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useAppSelector, useAppDispatch } from 'src/store/hooks'
//import { update } from 'src/store/asteroids/keys'

export enum KEY {
    LEFT = 37,
    RIGHT = 39,
    UP = 38,
    DOWN = 40,
    A = 65,
    D = 68,
    W = 87,
    SPACE = 32,
    RETURN = 13,
    WEAPON = 70,
    ESCAPE = 27,
}

export interface Ikeys {
    left  : boolean,
    right : boolean,
    up    : boolean,
    down  : boolean,
    space : boolean,
    return: boolean,
    weapon: boolean,
  }

type IProps = {
    cb:Function,
    state: Ikeys,
    gameStatus: string,
  }

export default ({gameStatus, state, cb=()=>{}}:IProps) => {

    //const keyState = useAppSelector((state) => state.keys)
    //const gameStatusState = useAppSelector((state) => state.status.value)
    //const dispatch = useAppDispatch()
    

    const handleKeys = (value: boolean ) => (e: KeyboardEvent): void => {
        
        
        if (e.key === 'Escape') {
            if (gameStatus !== 'INITIAL') {
                // TODO!
                //this.gameEscape()
            }
        }
        
    
        const keys = Object.assign({}, state)
    
        keys.left  = e.keyCode === KEY.LEFT || e.keyCode === KEY.A ? value : false;
        keys.right  = e.keyCode === KEY.RIGHT || e.keyCode === KEY.D ? value : false;
        keys.up  = e.keyCode === KEY.UP || e.keyCode === KEY.W ? value : false;
        keys.down  = e.keyCode === KEY.DOWN  ? value : false;
        keys.space  = e.keyCode === KEY.SPACE  ? value : false;
        keys.return  = e.keyCode === KEY.RETURN  ? value : false;
        keys.weapon  = e.keyCode === KEY.WEAPON  ? value : false;
    
        //dispatch(update(keys))
        cb(keys)
    }


    useEffect(() => {
        window.addEventListener('keyup', handleKeys(false));
        window.addEventListener('keydown', handleKeys(true));
      }, [])


    return null
}
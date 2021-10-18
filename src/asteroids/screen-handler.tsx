import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useAppSelector, useAppDispatch } from 'src/store/hooks'

export interface Iscreen {
  width: number,
  height: number,
  ratio: number,
}

type IProps = {
  cb:Function,
}

export default ({cb=()=>{}}:IProps) => {

    const handle = (e: UIEvent): void => {
      cb({
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      })
    }
    useEffect(() => {
        window.addEventListener('resize',  (e) => handle(e));
        cb({
          width: window.innerWidth,
          height: window.innerHeight,
          // ratio: window.devicePixelRatio || 1,
          ratio: 1,
        })
      }, [])

    return null
}
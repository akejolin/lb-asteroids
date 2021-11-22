import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import './style.css'
import ProcentBar from 'src/components/procentBar'
import FlexView from 'src/components/flexView'
import {themes} from 'src/asteroids/color-theme'

type ComponentProps = {
  show: boolean,
}



export default (props: ComponentProps) => {

  if (!props.show) {
    return null
  }
  return (
    <div className="game-border" style={{
      width: '100vw',
      height: '100vh',
      zIndex: 200,
      left:0,
      top:0,
      position: 'absolute'
    }}>

    </div>
  )
}
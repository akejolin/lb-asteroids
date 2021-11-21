import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import './style.css'
import ProcentBar from 'src/components/procentBar'
import FlexView from 'src/components/flexView'
import {themes} from 'src/asteroids/color-theme'

type ComponentProps = {
  gameStatus: string,
  colorThemeIndex: number,
  text: string,
  allowedStatus: Array<string>
}



export default (props: ComponentProps) => {
  if (!props.allowedStatus.some(item => item === props.gameStatus)) {
    return null
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      zIndex: 200,
      position: 'absolute'
    }}>
      <FlexView style={{
        position: 'absolute',
        height: '95%',
        textAlign: 'center',
        lineHeight: '50px',
      }}>
        <FlexView style={{flexGrow: 0, marginTop: 20, height: 'unset'}}>
          <FlexView row>
            <h1 className="blinking">{props.text}</h1>
          </FlexView>
        </FlexView>
      </FlexView>
    </div>
  )
}
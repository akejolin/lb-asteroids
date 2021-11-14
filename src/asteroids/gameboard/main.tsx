import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import '../style.css'
import ProcentBar from 'src/components/procentBar'
import FlexView from 'src/components/flexView'
import {themes} from 'src/asteroids/color-theme'

type ComponentProps = {
  gameStatus: string,
  score: number,
  colorThemeIndex: number,
  level: number,
  lives: number,
  shieldFuel: number,
  upgradeFuel: number,
  upgradeFuelTotal: number,
}



export default (props: ComponentProps) => {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        zIndex: 200,
        position: 'absolute'
      }}>
        <FlexView
          row
          style={{
            width: '100%',
            height: '5%',
            backgroundColor: `${themes[props.colorThemeIndex].background}aa`,
            color: 'white',
            lineHeight: '100%',
          }}
        >
            <div style={{marginLeft: 10, whiteSpace: 'nowrap'}}>Level: {props.level}</div>
            <div style={{marginLeft: 16, whiteSpace: 'nowrap'}}>Lives: {props.lives}</div>
            <FlexView row style={{height: 'unset', textAlign: 'center'}}>
              <div style={{marginLeft: 16}}>Score: {props.score}</div>
            </FlexView>
            <FlexView row style={{width: 250, height: 'unset', justifyContent: 'flex-end'}}>
              <div>Shield:</div>
              <div>
                <ProcentBar value={props.shieldFuel} total={500} />
              </div>
              <div style={{marginLeft: 16}}>Upgrade:</div>
              <div style={{marginRight: 8}}>
                <ProcentBar value={props.upgradeFuel} total={props.upgradeFuelTotal} />
              </div>
            </FlexView>
        </FlexView>


    </div>)
}
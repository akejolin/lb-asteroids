import React, { useState, useRef, useEffect, forwardRef, useLayoutEffect } from 'react'

type ComponentProps = {
  canvasRef: any;
  width:number;
  background:string;
  height:number;
}



export default forwardRef((props: ComponentProps, ref) => {

  useEffect(() => {
    console.log('ref has changed')
  }, [props.canvasRef])

  return (
    <canvas
    id="canvas-board"
    ref={ref}
    style={{
      display: 'block',
      backgroundColor: props.background,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: '100%',
    }}
    width={props.width}
    height={props.height}
  />
  )
})
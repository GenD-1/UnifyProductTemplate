import { useEffect, useRef, useState } from "react"
import useStore from "../../store"

export const SpriteEffect = ({ width = 1024, height = 540, canStart }: any) => {
    const spriteImageArray = useStore((state: any) => state.spriteImageArray)

    const canvasRef = useRef() as any

    const frameCount = 68

    let frame = 1
    const speed = 1

    const [ ended, setEnded ] = useState(false)

    const animate = () => {

        const canvas = canvasRef.current
        
        if( !canvas )   return

        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const index = Math.ceil(frame / speed)
        ctx.drawImage( spriteImageArray.sparkleImgs[index - 1], 0, 0, 2048, 1080, 0, 0, canvas.width, canvas.height )

        if( index >= frameCount ) {
            setEnded(true)
            return
        }

        frame ++

        requestAnimationFrame(animate)
    }

    useEffect(() => {
        if( canStart )  animate()
    }, [canStart])

    return (
        <div>
            { !ended ? (
                <canvas ref={ canvasRef } width={width} height={height} />
            ): null }
        </div>
    )
}
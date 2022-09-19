import { useEffect } from "react"
import useStore from "../../store"

export const Preload = () => {
    let first = true
    const frameCount = 68

    let imageArray = [] as any
    
    const spriteImageArray = useStore((state: any) => state.spriteImageArray)
    const setSpriteImageArray = useStore((state: any) => state.setSpriteImageArray)
    const setIsLoadFinished = useStore((state: any) => state.setIsLoadFinished)

    useEffect(() => {
        // if( first ) {
        //     first = false
        //     return
        // }

        const promises = []

        for( let i = 1; i <= frameCount; i++ ) {
            promises.push(new Promise((resolve, reject) => {
                const img = new Image() as any
                img.src = `/assets/sparkle_sprite/${ i }.png`
                img.onload = () => {
                    imageArray[i - 1] = img

                    resolve(true)
                }
            }))
        }

        Promise.all(promises).then((res) => {
            const temp = { ...spriteImageArray }
            temp.sparkleImgs = imageArray
            setSpriteImageArray(temp)
            setIsLoadFinished(true)
        })
    }, [])

    return (
        <></>
    )
}

export default Preload
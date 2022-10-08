import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState} from "react";
import { animated, useSpring } from "@react-spring/three";
import { ang2Rad } from "../../helper/math";
import useStore from "../../store";

export const Model = ({scale, modelInfo}: any) => {
    const model = useLoader( GLTFLoader, modelInfo.src ) as any

    const setShowInfo = useStore((state: any) => state.setShowInfo)

    const setIsModalLoaded = useStore((state: any) => state.setIsModalLoaded)

    const canStartAnim = useStore((state: any) => state.canStartAnim)
    
    const rotateIdle = useStore((state: any) => state.rotateIdle)
    const setRotateIdle = useStore((state: any) => state.setRotateIdle)

    const meshRef = useRef(null) as any

    const originPosition = [0, 0.03, 0.1]
    const originRotation = [0, ang2Rad(-90), 0]

    const [spring, api] = useSpring(() => ({
        rotation: originRotation,
        config: { friction: 5, duration: 1000 }
    }));

    const [ posSpring, posApi ] = useSpring(() => ({
        position: originPosition,
        config: { friction: 5, duration: 300 }
    }))

    const onPointerOverHandler = (e: any) => {
        e.stopPropagation()
        document.body.style.cursor = 'grab'
    }

    const onPointerOutHandler = () => {
        document.body.style.cursor = ''
    }

    const startAnimation = () => {
        api.start({
            rotation: [
                0, ang2Rad(1080), 0
            ]
        })

        setTimeout(() => {
            posApi.start({
                position: [
                    0, 0, 0
                ],
                config: { friction: 5, duration: 500 }
            })

            api.stop()
            api.start({
                rotation: [
                    0, ang2Rad(1080), 0
                ],
                config: { friction: 5, duration: 500 }
            })
        }, 700)

        setTimeout(() => {
            setShowInfo(true)

            setRotateIdle(true)
        }, 1200)
    }

    useEffect(() => {
        setIsModalLoaded(true)
    }, [])

    useEffect(() => {
        if( canStartAnim )
            startAnimation()
    }, [ canStartAnim ])

    useFrame(() => {
        if( rotateIdle ) {
            meshRef.current.rotateY( ang2Rad(1) )
        }
    })

    return (
        <animated.mesh 
            { ...spring as any }
            { ...posSpring as any }
            scale={ scale }
            onPointerOver={ onPointerOverHandler } 
            onPointerOut={ onPointerOutHandler }
            ref={ meshRef }
        >
            <primitive object={model.scene} />
        </animated.mesh>
    )
}

export default Model
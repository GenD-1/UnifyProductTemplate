import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { useEffect, useRef} from "react";
import { animated, useSpring } from "@react-spring/three";
import { ang2Rad } from "../../helper/math";

export const Model = ({scale, modelInfo}: any) => {
    const model = useLoader( GLTFLoader, modelInfo.src ) as any

    const meshRef = useRef(null) as any

    const originPosition = [0, 0.05, 0.2]
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

    useEffect(() => {
        api.start({
            rotation: [
                0, ang2Rad(1080), 0
            ]
        })

        setTimeout(() => {
            posApi.start({
                position: [
                    0, 0, 0
                ]
            })
        }, 700)
    }, [])

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
import { Canvas, extend, useThree } from '@react-three/fiber'
import { ambientLightProps, backgroundColor, cameraProps, modelScaleValue, orbitControlProps, spotLightProps, spotLightProps2 } from '../../constants/scene'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import Model from './model'
import { Loader } from './Loader'
import { pendantsModelProps } from '../../constants'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import { useGesture } from "@use-gesture/react";
import useStore from '../../store'
import { useOthers, useUpdateMyPresence } from '../../liveblocks.config'

export const Scene = ({ modelId, bloom }: any) => {
    const scaleValue = modelScaleValue;
    const pointerRef = useRef() as any
    const updateMyPresence = useUpdateMyPresence()
    const setRotateIdle = useStore((state: any) => state.setRotateIdle)

    const [timeOutInstance, setTimeOutInstance] = useState() as any

    useEffect(() => {
        console.log(cameraProps);
    }, [cameraProps])

    const getModelInfo = (id: any) => {
        const result = pendantsModelProps.find((item: any) => (
            Number(item.id) === Number(id)
        ))

        return result
    }

    const modelInfo = getModelInfo(modelId) as any

    const bind = useGesture({
        onDragStart: (state: any) => {
            clearTimeout(timeOutInstance)

            setRotateIdle(false)
        },
        onDragEnd: (state: any) => {
            clearTimeout(timeOutInstance)

            const object = setTimeout(() => {
                setRotateIdle(true)
            }, 2000)

            setTimeOutInstance(object)
        }
    })


    const onMouseScroll = (event: any) => {
        console.log(event);
    }


    const onPointerMove = (event: any) => {

        // console.log(pointerRef);
        // if (modelPage !== currentPage) {
        //     setModelPosition({ id: '123', position: { x: 0, y: 0, z: 0 } })
        // }

        updateMyPresence({
            cursor: {
                x: Number(pointerRef?.current?.getAzimuthalAngle()),
                y: Number(pointerRef?.current?.getPolarAngle())
            },

        })
    }

    const onPointerLeave = () => {
        updateMyPresence({ cursor: null, })
    }

    const others = useOthers()
    const showOther = ({ connectionId, presence, info }: any) => {
        if (!presence?.cursor) {
            return null
        }
        const x = presence.cursor.x;
        const y = presence.cursor.y;


        pointerRef?.current?.setAzimuthalAngle(x)

        pointerRef?.current?.setPolarAngle(y)

    }

    return (

        <div onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} onScroll={onMouseScroll}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                touchAction: 'none'
            }}>
            {others.map(showOther)}
            <Canvas
                {...bind() as any}
                gl={{ antialias: true, alpha: true, }}
                camera={{ fov: cameraProps.fov, position: [cameraProps.position.x, cameraProps.position.y, cameraProps.position.z] }}
                shadows
            >
                {/* <color attach="background" args={[ 0x000000 ]} /> */}

                <ambientLight
                    color={ambientLightProps.color}
                />

                <spotLight
                    color={spotLightProps.color}
                    castShadow={spotLightProps.castShadow}
                    position={[-spotLightProps.position.x, spotLightProps.position.y, spotLightProps.position.z]}
                    intensity={spotLightProps.intensity}
                />

                <spotLight
                    color={spotLightProps.color}
                    castShadow={spotLightProps.castShadow}
                    position={[-spotLightProps.position.x, spotLightProps.position.y, -spotLightProps.position.z]}
                    intensity={spotLightProps.intensity}
                />

                <spotLight
                    color={spotLightProps2.color}
                    castShadow={spotLightProps2.castShadow}
                    position={[-spotLightProps2.position.x, spotLightProps2.position.y, spotLightProps2.position.z]}
                    intensity={spotLightProps2.intensity}
                />

                <spotLight
                    color={spotLightProps2.color}
                    castShadow={spotLightProps2.castShadow}
                    position={[-spotLightProps2.position.x, spotLightProps2.position.y, -spotLightProps2.position.z]}
                    intensity={spotLightProps2.intensity}
                />

                <OrbitControls
                    ref={pointerRef}
                    maxZoom={50}
                    minZoom={1}
                    maxDistance={orbitControlProps.maxDistance}
                    minDistance={orbitControlProps.minDistance}
                    target={[orbitControlProps.target[0], orbitControlProps.target[1], orbitControlProps.target[2]]}
                    enablePan={false}
                />

                <Suspense fallback={<Loader />}>
                    <Model
                        scale={[scaleValue, scaleValue, scaleValue]}
                        modelInfo={modelInfo}
                    />
                </Suspense>

                {/* <EffectComposer enabled={ bloom || true }>
                <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.5} intensity={2} radius={0.9} mipmapBlur />
                <Noise opacity={0.02} />
            </EffectComposer> */}
            </Canvas>
        </div>
    )
}

export default Scene
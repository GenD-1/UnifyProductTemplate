import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { extend, ReactThreeFiber, useFrame, useThree } from "@react-three/fiber"
import { bloomParams } from '../../constants/scene';
import { useEffect, useRef } from 'react';
// import { UnrealBloomPass } from 'three-stdlib'
import { Effects } from "@react-three/drei";

// extend({ UnrealBloomPass })
extend({ EffectComposer, RenderPass, UnrealBloomPass })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            unrealBloomPass: ReactThreeFiber.Node<UnrealBloomPass, any>
        }
    }
}

export const Effect = () => {
    const { gl, scene, camera, size } = useThree()
    const composer = useRef() as any

    useEffect(() => void scene && composer.current.setSize(size.width, size.height), [size])
    useFrame(() => composer.current.render(), 1)
    // const intensity = 2
    // const radius = 1

    return (
        <>
            {/* <Effects disableGamma >
                <unrealBloomPass threshold={1} strength={intensity} radius={radius} />
            </Effects> */}
            <effectComposer ref={composer} args={[gl]}>
                <renderPass attach={'passes-0'} scene={scene} camera={camera} />
                <unrealBloomPass attach={'passes-1'} args={[undefined as any, bloomParams.bloomStrength, bloomParams.bloomRadius, bloomParams.bloomThreshold]} />
            </effectComposer>
        </>
    )
}

export default Effect
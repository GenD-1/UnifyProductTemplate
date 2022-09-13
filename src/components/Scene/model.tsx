import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three'
import { useLoader, useThree } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { useGesture } from "@use-gesture/react";
import useStore from "../../store";
import { isPointInSquare } from "../../helper/math";
import { useEffect, useRef, useState } from "react";

export const Model = ({url, scale, drawable, page, index: posIndex, small, meshPosition, meshSize, id, modelInfo}: any) => {
    const model = useLoader( GLTFLoader, url ) as any

    const meshRef = useRef(null) as any

    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)   // x-y plane

    const dragInfo = useStore((state: any) => state.dragInfo)
    const setDragInfo = useStore((state: any) => state.setDragInfo)

    const currentPage = useStore((state: any) => state.currentPage)

    const focusInfo = useStore((state: any) => state.focusInfo)
    const setFocusInfo = useStore((state: any) => state.setFocusInfo)

    const { camera } = useThree()

    const getCurrentPosition = () => {
        const diffPageCount = page - currentPage

        const diffOffset = diffPageCount * 0.06 * 3

        const curPosition = [
            0.06 * (-1 + posIndex) + diffOffset,
            small ? -0.05 : 0,
            0
        ]

        return curPosition
    }

    const originPosition = getCurrentPosition()

    const [ latestTap, setLatestTap ] = useState(0)

    useEffect(() => {
        if( !page ) return

        api.start({
            position: [
                ...getCurrentPosition()
            ]
        })
    }, [currentPage])

    const [spring, api] = useSpring(() => ({
        position: originPosition,
        config: { friction: 20, duration: 100 }
    }));

    const bind = useGesture({
        onDrag: ({ active, timeStamp, event }: any) => {
            if( !drawable || focusInfo.isFocus ) return

            event.stopPropagation()

            if (active && dragInfo.isDragging) {
                document.body.style.cursor = 'grabbing'

                let planeIntersectPoint = new THREE.Vector3()
                event.ray.intersectPlane(floorPlane, planeIntersectPoint)

                const newPos = {
                    x: planeIntersectPoint.x,
                    y: planeIntersectPoint.y,
                    z: 0
                }

                api.start({
                    position: [
                        newPos.x,
                        newPos.y,
                        newPos.z,
                    ],
                })
            } else {
                document.body.style.cursor = 'grab'
            }
        
            setDragInfo({
                isDragging: active,
            })
        
            return timeStamp
        },
        onDragEnd: ({ event }: any) => {
            if( !drawable ) return

            event.stopPropagation()

            let planeIntersectPoint = new THREE.Vector3()
            event.ray.intersectPlane(floorPlane, planeIntersectPoint)

            const newPos = {
                x: planeIntersectPoint.x,
                y: planeIntersectPoint.y,
                z: 0
            }

            const centerPos = {
                x: 0,
                y: 0.07
            }

            const len = 0.02

            if( isPointInSquare( newPos, centerPos, len ) ) {
                api.start({
                    position: [0, 0.05, 0],
                })
            } else {
                api.start({
                    position: [
                        ...originPosition
                    ],
                })
            }
        }
    })

    const onPointerOverHandler = (e: any) => {
        if( !drawable ) return

        e.stopPropagation()
        document.body.style.cursor = 'grab'
    }

    const onPointerOutHandler = () => {
        if( !drawable ) return

        document.body.style.cursor = ''
    }

    const focusObject = (event: any) => {
        event.stopPropagation()

        const now = new Date().getTime()
        const timeSince = now - latestTap
        if((timeSince < 600) && (timeSince > 0)) {
            const position = [
                meshRef.current.position.x - meshPosition[0],
                meshRef.current.position.y + meshPosition[1] * 2,
                meshRef.current.position.z - meshPosition[2],
            ]

            const newInfo = {...focusInfo}
            newInfo.isFocus = !focusInfo.isFocus
            newInfo.position = position
            newInfo.prevCamPosition = [ camera.position.x, camera.position.y, camera.position.z ]
            newInfo.focusId = id
            newInfo.detailInfo = modelInfo.details
            setFocusInfo( newInfo )
        }

        setLatestTap( new Date().getTime() )
    }

    return (
        currentPage === page && (!focusInfo.isFocus || focusInfo.focusId === id) ? (
            <animated.mesh 
                {...focusObject}
                { ...spring }
                { ...bind() as any }
                scale={ scale }
                onPointerOver={ onPointerOverHandler } 
                onPointerOut={ onPointerOutHandler }
                ref={ meshRef }
                onClick={ modelInfo.feather ? focusObject : null }
                // rotation={[ 0, ang2Rad(90), 0 ]}
            >
                <mesh position={meshPosition} onClick={ focusObject }>
                    <boxGeometry args={meshSize} />
                    <meshBasicMaterial color={'red'} transparent opacity={0.0}/>
                </mesh>
                <primitive object={model.scene} />
            </animated.mesh>
        ) : null
    )
}

export default Model
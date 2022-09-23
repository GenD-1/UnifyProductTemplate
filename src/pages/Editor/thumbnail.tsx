import { useState } from "react"
import styled, { keyframes } from "styled-components"
import ThumbnailModal from "../../components/Modal"
import { SpriteEffect } from "../../components/Sprite/canvas"
import { soundArray } from "../../constants"
import useStore from "../../store"


const circleAnimation = keyframes`
    0% { margin-top: -5px; }
    50% { margin-top: 5px; }
    100% { margin-top: -5px; }
`

const SrcButton = styled.div`
    position: absolute;
    width: 0px;
    height: 0px;
    border-radius: 100px;
    transition: all 1s;
    transform: translate3d(-50%, -50%, 0);
    left: 50%;
    top: 50%;
    right: 0%;
    bottom: 0%;
    cursor: pointer;

    .sprite {
        position: absolute;
        transform: translate3d(-50%, -50%, 0);
        left: 50%;
        top: 50%;
    }

    &.active {
        width: 40px;
        height: 40px;

        animation: ${circleAnimation} 1s infinite;
        animation-timing-function: ease-in;
    }

    &.active1 {
        top: 34%;
        left: 12%;

        animation-delay: .2s;
    }

    &.active2 {
        top: 68%;
        left: 12%;

        animation-delay: .5s;
    }

    &.active3 {
        top: 34%;
        left: 88%;

        animation-delay: .8s;
    }

    &.active4 {
        top: 68%;
        left: 88%;

        animation-delay: .3s;
    }
`

const thumbnailInfo = [
    {
        id: 1,
        type: 'image',
        src: '/assets/thumbnails/IMG_01.jpg'
    }, {
        id: 2,
        type: 'video',
        src: '/assets/thumbnails/Video01.mp4'
    }, {
        id: 3,
        type: 'image',
        src: '/assets/thumbnails/IMG_02.jpg'
    }, {
        id: 4,
        type: 'video',
        src: '/assets/thumbnails/Video02.mp4'
    }
]

export const ThumbnailButtons = () => {
    const showInfo = useStore((state: any) => state.showInfo)

    const [ selectedButton, setSelectedButton ] = useState(0) as any

    const [isOpen, setIsOpen] = useState(false)
    
    const openModal = (index: number) => {
        setIsOpen(true)

        soundArray['chime'].currentTime = 0.3
        soundArray['chime'].play()

        setSelectedButton(index)
    }

    const closeModal = () => {
        setIsOpen(false)
        
        setSelectedButton(0)
    }

    const getSelectedInfo = () => {
        const index = thumbnailInfo.findIndex((item: any) => item.id === selectedButton)

        return thumbnailInfo[index]
    }
    
    return (
        <>
            { thumbnailInfo.map((info: any, index: number) => (
                <SrcButton 
                    key={ `thumbanil${index}` } 
                    className={`flex justify-center items-center ${ showInfo ? `active active${ info.id }` : '' }`} 
                    onClick={ () => openModal( info.id ) }
                >
                    <img alt='pic' src={`/assets/${ info.type === 'image' ? 'IMG_src_Icon' : 'play-button' }.png`}></img>
                    { selectedButton === info.id ? (
                        <div className='sprite'>
                            <SpriteEffect canStart={ true } width={512} height={270} />
                        </div>
                    ): null }
                </SrcButton>
            )) }

            <ThumbnailModal isOpen={isOpen} onClose={closeModal} info={ getSelectedInfo() } />
        </>
    )
}

export default ThumbnailButtons
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import Loader from '../../components/Loader'
import Modal from '../../components/Modal'
import Preload from '../../components/Preload'
import Scene from '../../components/Scene'
import { SpriteEffect } from '../../components/Sprite/canvas'
import { pendantsModelProps, soundArray } from '../../constants'
import useStore from '../../store'
import ShareModal from 'react-modal';

ShareModal.setAppElement('#root');

const opacityAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const opacityAnimation1 = keyframes`
    0% { opacity: 0; }
    25% { opacity: 1; }
    75% { opacity: 1; }
    100% { opacity: 0; }
`

const circleAnimation = keyframes`
    0% { margin-top: -5px; }
    50% { margin-top: 5px; }
    100% { margin-top: -5px; }
`

const CanvasWrapper = styled.div`
    height: calc(100% - 56px);

    .sceneWrapper {
        width: 100%;
        height: 100%;
    }

    &.active {
        height: 60%;
        margin-bottom: 5vh;
        
        .sceneWrapper {
            width: 50%;
        }
    }
`

const CenterSpriteWrapper = styled.div`
    transform: translate3d(-50%, -50%, 0);
    left: 50%;
    top: 50%;
`

const LogoWrapper = styled.div`
    position: absolute;
    top: 0;
    height: 15%;
    width: 100%;
    font-family: Apple Chancery;

    img {
        max-width: 80%;
        max-height: 100%;

        opacity: 0;
        animation: ${opacityAnimation} 5s;
        animation-delay: 0s;
        animation-fill-mode: forwards;
    }

    .description {
        max-width: 80%;

        opacity: 0;
        animation: ${opacityAnimation} 5s;
        animation-delay: 1s;
        animation-fill-mode: forwards;
    }
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
    background: #ffff00;
    cursor: pointer;

    &.active1 {
        width: 60px;
        height: 60px;
        top: 30%;
        left: 12%;
        border: 1px solid #123;
        animation: ${circleAnimation} 1s infinite;
        animation-timing-function: ease-in;
        animation-delay: .2s;
    }

    &.active2 {
        width: 60px;
        height: 60px;
        top: 64%;
        left: 12%;
        border: 1px solid #123;

        animation: ${circleAnimation} 1s infinite;
        animation-timing-function: ease-in;
        animation-delay: .5s;
    }

    &.active3 {
        width: 60px;
        height: 60px;
        top: 30%;
        left: 88%;
        border: 1px solid #123;

        animation: ${circleAnimation} 1s infinite;
        animation-timing-function: ease-in;
        animation-delay: .8s;
    }

    &.active4 {
        width: 60px;
        height: 60px;
        top: 64%;
        left: 88%;
        border: 1px solid #123;

        animation: ${circleAnimation} 1s infinite;
        animation-timing-function: ease-in;
        animation-delay: .3s;
    }
`

const ActionWrapper = styled.div`
    // position: absolute;
    bottom: 0;
    
    p {
        font-family: Apple Chancery;
        opacity: 0;
        animation: ${opacityAnimation} 5s;
        animation-delay: 0s;
        animation-fill-mode: forwards;
    }
`

const ProductDescWrapper = styled.div`
    position: absolute;
    transform: translate3d(0, 50%, 0);
    bottom: 16%;
`

const ProductName = styled.div`
    position: absolute;
    top: 14%;

    opacity: 0;
    animation: ${opacityAnimation} 5s;
    animation-delay: 2s;
    animation-fill-mode: forwards;
    font-family: Snell Roundhand2;
`

const ProductDesc = styled.div`
    opacity: 0;
    animation: ${opacityAnimation1} 5s;
    animation-fill-mode: forwards;

    font-family: Apple Chancery;
    font-size: 1.7rem;

    &.first {
        animation-delay: 3.2s;
    }

    &.second {
        animation-delay: 8.2s;
    }

    &.third {
        animation-delay: 13.2s;
    }
`

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '30%',
        height: '40%'
    },
};

const customStylescopy = {
    content: {
        top: '90%',
        left: '10%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '15%',
        height: '8%',
    },
}

export const Editor = () => {
    const { id } = useParams()

    const showInfo = useStore((state: any) => state.showInfo)
    const isLoadFinished = useStore((state: any) => state.isLoadFinished)
    const isModalLoaded = useStore((state: any) => state.isModalLoaded)
    const canStartAnim = useStore((state: any) => state.canStartAnim)
    const setCanStartAnim = useStore((state: any) => state.setCanStartAnim)

    const [isOpen, setIsOpen] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [copyModelOpen, setCopyModelOpen] = useState(false)
    const [ selectedButton, setSelectedButton ] = useState(0) as any

    const [ bloom, setBloom ] = useState(true)

    const openModal = (index: number) => {
        setIsOpen(true)

        soundArray['chime'].currentTime = 0
        soundArray['chime'].play()

        setSelectedButton(index)
    }

    const closeModal = () => {
        setIsOpen(false)
        
        setSelectedButton(0)
    }

    useEffect(() => {
        // soundArray['voice'].play()

        // if (showInfo) {
        //     soundArray['chime'].currentTime = 0
        //     soundArray['chime'].play()

        //     setTimeout(() => {
        //         soundArray['voice'].play()
        //     }, 1500)
        // }
    }, [showInfo])

    useEffect(() => {
        if (canStartAnim) {
            // soundArray['background'].play()
            // soundArray['background'].onended = () => {
            //     soundArray['background'].currentTime = 0
            //     soundArray['background'].play()
            // }

            setTimeout(() => {
                soundArray['chime'].play()
            }, 1200)
            
            setTimeout(() => {
                soundArray['voice'].play()
            }, 2700)

            // setTimeout(() => {
            //     soundArray['woosh'].currentTime = 1
            //     soundArray['woosh'].play()
            // }, 500)

            // setTimeout(() => {
            //     setBloom(false)
            // }, 1000)
        }
    }, [canStartAnim])

    const handleModal = (active: any) => {
        setModalIsOpen(active);
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopyModelOpen(true)
        setTimeout(() => {
            setCopyModelOpen(false)
            handleModal(false)
        }, 2000)
    }

    const getModelInfo = (id: any) => {
        const result = pendantsModelProps.find((item: any) => (
            Number(item.id) === Number(id)
        ))

        return result
    }

    const modelInfo = getModelInfo( id ) as any

    return (
        <div className='overflow-hidden w-screen flex flex-col' style={{ minHeight: '-webkit-fill-available', height: window.innerHeight }}>
            <Preload />

            {isLoadFinished ? (
                <>
                    <CenterSpriteWrapper className='absolute overflow-hidden w-full flex justify-center items-center'>
                        <SpriteEffect canStart={showInfo} />
                    </CenterSpriteWrapper>

                    <CanvasWrapper
                        className={`w-full h-full relative flex justify-center items-center`}
                    >
                        <div className={`sceneWrapper ${ !canStartAnim ? 'opacity-0' : ''}`}>
                            <Scene modelId={id} bloom={ bloom } />
                        </div>

                        {canStartAnim ? (
                            <>
                                <SrcButton className={`flex justify-center items-center ${ showInfo ? 'active1' : '' }`} onClick={ () => openModal(1) }>
                                    { selectedButton === 1 ? (
                                        <SpriteEffect canStart={ true } width={512} height={270} />
                                    ): null }
                                </SrcButton>

                                <SrcButton className={`flex justify-center items-center ${ showInfo ? 'active2' : '' }`} onClick={ () => openModal(2) }>
                                    { selectedButton === 2 ? (
                                        <SpriteEffect canStart={ true } width={512} height={270} />
                                    ): null }
                                </SrcButton>

                                <SrcButton className={`flex justify-center items-center ${ showInfo ? 'active3' : '' }`} onClick={ () => openModal(3) }>
                                    { selectedButton === 3 ? (
                                        <SpriteEffect canStart={ true } width={512} height={270} />
                                    ): null }
                                </SrcButton>

                                <SrcButton className={`flex justify-center items-center ${ showInfo ? 'active4' : '' }`} onClick={ () => openModal(4) }>
                                    { selectedButton === 4 ? (
                                        <SpriteEffect canStart={ true } width={512} height={270} />
                                    ): null }
                                </SrcButton>

                                <ProductName className='text-4xl my-4'>{ modelInfo.details.name }</ProductName>

                                <ProductDescWrapper className="text-center">
                                    <ProductDesc className='text-2xl my-4 first'>What this product is told here</ProductDesc>
                                    <ProductDesc className='text-2xl my-4 second absolute top-0'>What this product is told here</ProductDesc>
                                    <ProductDesc className='text-2xl my-4 third absolute top-0'>What this product is told here</ProductDesc>
                                </ProductDescWrapper>
                            </>
                        ) : null}
                    </CanvasWrapper>

                    {showInfo ? (
                        <>
                            <LogoWrapper className='flex flex-col justify-center items-center'>
                                <img src={'/assets/BrandLogo_Template.png'} alt='pic'></img>

                                <div className='flex justify-between items-center w-full description my-2'>
                                    <div className='text-sm'>Zoom and rotate</div>
                                    <div className='text-sm'>Doubletap to purchase</div>
                                </div>
                            </LogoWrapper>

                            <ActionWrapper className='w-full flex justify-between items-center px-2'>
                                <button className='flex flex-col justify-center items-center font-bold'>
                                    <img src='/assets/ChatIcon.png' width={32} height={32} alt='pic'></img>
                                    2968
                                </button>

                                <button className='flex flex-col justify-center items-center font-bold'>
                                    <img src='/assets/Like_HeartIcon.png' width={32} height={32} alt='pic'></img>
                                    1.2M
                                </button>

                                <p className='text-sm text-center'>
                                    Share with friends or <br />
                                    Invite them to a private room
                                </p>

                                <button onClick={() => handleModal(true)} className='flex flex-col justify-center items-center font-bold'>
                                    <img src='/assets/ShareIcon.png' width={32} height={32} alt='pic'></img>
                                    Share
                                </button>
                            </ActionWrapper>
                        </>
                    ) : null}
                </>
            ) : <Loader />}

            {(isLoadFinished && isModalLoaded && !canStartAnim) ? (
                <div className='absolute t-0 l-0 w-full h-full flex justify-center items-center text-3xl font-Apple-Chancery' onClick={() => setCanStartAnim(true)}>
                    Click to Start
                </div>
            ) : null}

            <Modal isOpen={isOpen} onClose={closeModal} />
            <ShareModal
                isOpen={modalIsOpen}
                onRequestClose={() => handleModal(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className='flex flex-col h-full'>
                    <div className='flex'>
                        <div>Share</div>
                        <img onClick={() => handleModal(false)} src='assets/close.png' alt='close' className='w-6 ml-auto cursor-pointer'></img>
                    </div>
                    {/* <div className='flex h-full justify-center items-center'>Link Copied to clipboard</div> */}
                    <div className='flex h-full justify-center items-center'>
                        <div className='w-10/12 bg-[#f9f9f9] h-[35px] border-[1px] border-solid border-black p-[1%] rounded-sm flex justify-between'>
                            <span>{window.location.href}</span>
                            <div onClick={handleCopy} className='text-[#065fd4] cursor-pointer'>COPY</div>
                        </div>
                    </div>
                </div>
            </ShareModal>

            <ShareModal
                isOpen={copyModelOpen}
                style={customStylescopy}
                contentLabel="Example Modal"
            >
                <div className='flex flex-col'>
                    <div className='flex justify-center items-center'>Link Copied to clipboard</div>
                </div>
            </ShareModal>
        </div>
    )
}

export default Editor
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import Loader from '../../components/Loader'
import Preload from '../../components/Preload'
import Scene from '../../components/Scene'
import { SpriteEffect } from '../../components/Sprite/canvas'
import useStore from '../../store'
import ShareModal from 'react-modal';
import ThumbnailButtons from './thumbnail'
import { useCheckout } from '../../context/CheckoutContext'
import CheckoutModal from '../../components/CheckoutModal'
import { useDoubleTap } from 'use-double-tap';

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

const CanvasWrapper = styled.div`
    height: calc(87% - 56px - 35px);

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
    top: 35px;
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
    top: 9%;

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

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [copyModelOpen, setCopyModelOpen] = useState(false)

    // Testing using false product data
    // Setting dummy data into ProductDetails array
    const { productDetails, setProductDetails } = useCheckout();
    const [checkoutOpen, setCheckoutOpen] = useState(false)

    // Double touch function
    let lastClick = 0;
    const checkoutRef = useRef<HTMLInputElement | null>(null);

    const handleTouch = useDoubleTap(() => {
        handleCheckout();
    }, 200);

    const handleCheckout = () => {
        setProductDetails([{
            productName: 'anchor jewlery',
            productColor: 'black',
            productCost: 75.25,
            productImage: 'sampleImg.png',
            productQuantity: 1,
            productDescription: 'Lorem Ipsum is the simple dummy text of the printing world.',
        }]);
        setCheckoutOpen(true)
    }

    const closeCheckoutModal = () => {
        setCheckoutOpen(false)
    }

    const [ bloom, setBloom ] = useState(true)

    useEffect(() => {
        if (canStartAnim) {
            setTimeout(() => {
                setBloom(false)
            }, 1000)
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

    let voiceAudio = new Audio()
    let chimeAudio = new Audio()
    let wooshAudio = new Audio()
    let backgroundAudio = new Audio()

    const onStart = () => {
        setCanStartAnim(true)

        voiceAudio.src = '/assets/sounds/VoiceOver_Template.mp3'
        chimeAudio.src = '/assets/sounds/ProductExperience_Chime.mp3'
        wooshAudio.src = '/assets/sounds/ProductExperience_Woosh.mp3'
        backgroundAudio.src = '/assets/sounds/Background_Template.mp3'

        backgroundAudio.play()
        backgroundAudio.loop = true
        
        setTimeout(() => {
            chimeAudio.currentTime = 0.3
            chimeAudio.play()
        }, 800)
        
        setTimeout(() => {
            voiceAudio.play()
        }, 2700)

        setTimeout(() => {
            wooshAudio.currentTime = 1
            wooshAudio.play()
        }, 50)
    }

    return (
        <div className='overflow-hidden w-screen flex flex-col' style={{ minHeight: '-webkit-fill-available', height: window.innerHeight }}>
            <Preload />

            {/* <div style={{ height: 35 }}></div> */}

            <div style={{ height: '13%' }}></div>

            {isLoadFinished ? (
                <>
                    <CenterSpriteWrapper className='absolute overflow-hidden w-full flex justify-center items-center'>
                        <SpriteEffect canStart={showInfo} />
                    </CenterSpriteWrapper>

                    <CanvasWrapper
                        className={`w-full h-full relative flex justify-center items-center`}
                    >
                        <div {...handleTouch} className={`sceneWrapper ${ !canStartAnim ? 'opacity-0' : ''}`}>
                            <Scene modelId={id} bloom={ bloom } />
                        </div>

                        {canStartAnim ? (
                            <>
                                <ThumbnailButtons />

                                <ProductName className='text-4xl my-4'>Product Name</ProductName>

                                <ProductDescWrapper className="text-center">
                                    <ProductDesc className='text-2xl my-4 first w-full'>Touch the object with your fingers</ProductDesc>
                                    <ProductDesc className='text-2xl my-4 second absolute top-0 w-full'>Pinch to zoom</ProductDesc>
                                    <ProductDesc className='text-2xl my-4 third absolute top-0 w-full'>Double tap to purchase!</ProductDesc>
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
                                {/* <button className='flex flex-col justify-center items-center font-bold'>
                                    <img src='/assets/ChatIcon.png' width={32} height={32} alt='pic'></img>
                                    2968
                                </button>

                                <button className='flex flex-col justify-center items-center font-bold'>
                                    <img src='/assets/Like_HeartIcon.png' width={32} height={32} alt='pic'></img>
                                    1.2M
                                </button> */}

                                <p className='text-xl text-center'>
                                    {`Invite friends to a live room! ->`}
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
                <div className='absolute t-0 l-0 w-full h-full flex justify-center items-center text-3xl font-Apple-Chancery' onClick={ onStart } onTouchStart={ onStart }>
                    Click to Start
                </div>
            ) : null}

            <CheckoutModal isOpen={ checkoutOpen } onClose={ closeCheckoutModal } />

            
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

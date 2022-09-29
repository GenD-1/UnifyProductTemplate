import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import ComponentLoader from '../ComponentLoader'

const CloseIconWrapper = styled.button`
    position: absolute;
    right: .3rem;
    top: .3rem;
    z-index: 50;
`

const ContentWrapper = styled.div`
    img, video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

export default function ThumbnailModal({ isOpen, onClose, info }: any) {
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        setIsLoading(true)

        if( info && info.src ) {
            if( info.type === 'video' ) {
                const video = document.createElement('video')
                video.setAttribute('src', info.src)
                document.body.appendChild(video)
                video.load()
                video.addEventListener('loadeddata', function() {                    
                    document.body.removeChild(video)
                    setIsLoading(false)
                 }, false);
            } else {
                const image = document.createElement('img')
                image.setAttribute('src', info.src)
                document.body.appendChild(image)
                image.onload = () => {
                    document.body.removeChild(image)
                    setIsLoading(false)
                }
            }
        }
    }, [ info ])

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex w-screen items-center justify-center p-4 text-center relative" style={{ minHeight: '-webkit-fill-available', height: window.innerHeight }}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full h-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <CloseIconWrapper onClick={ onClose }>
                                        <X size={'22px'} />
                                    </CloseIconWrapper>

                                    { info && info.src ? (
                                        <ContentWrapper className='w-full h-full'>
                                            { info.type === 'video' ? (
                                                <video controls>
                                                    <source src={ info.src } type="video/mp4"/>
                                                </video>
                                            ): (
                                                <img alt='pic' src={ info.src }/>
                                            ) }
                                        </ContentWrapper>
                                    ): null }

                                    { isLoading ? <ComponentLoader /> : null }
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

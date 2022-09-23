import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'

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
                        <div className="flex w-screen h-screen items-center justify-center p-4 text-center relative">
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
                                                <video autoPlay muted>
                                                    <source src={ info.src } type="video/mp4"/>
                                                </video>
                                            ): (
                                                <img alt='pic' src={ info.src } />
                                            ) }
                                        </ContentWrapper>
                                    ): null }
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

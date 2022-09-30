import { Suspense, useEffect, useState } from "react";
import Avatar from '../../components/Avatar/Avatar';
import { COLORS_PRESENCE } from '../../constants';
import { RoomProvider, useMap, useMyPresence, useOthers } from "../../liveblocks.config";
import Editor from '../Editor';
import { LiveMap } from "@liveblocks/client";
import { v1 as uuidv1 } from 'uuid';
import {
    selectIsConnectedToRoom,
    useHMSActions,
    useHMSStore,
} from "@100mslive/react-sdk";
import MicroPhone from "../../components/Microphone";


function WhoIsHere({ userCount }: any) {

    return (
        <div className="who_is_here"> {userCount} Live </div>
    );
}

function Room({ url }: any) {

    const others = useOthers();

    return (
        <div
            className="container"
        // onPointerMove={onCanvasPointerMove}
        // onPointerUp={onCanvasPointerUp}
        >
            <div className='flex mt-2 ml-1.5 justify-end'>
                <div className='flex'>
                    {others.map(({ connectionId, presence }) => {
                        if (!connectionId) {
                            return null;
                        }

                        return (
                            <Avatar
                                key={connectionId}
                                color={COLORS_PRESENCE[connectionId % COLORS_PRESENCE.length]}
                            />
                        );
                    })}
                </div>
                <div className='mx-2'>
                    <WhoIsHere
                        userCount={others.length}
                    />
                </div>
            </div>
            <PageShow shareUrl={url} />
        </div>
    );
}

function PageShow({ shareUrl }: any) {
    const shapes = useMap("shapes");

    if (shapes === null || shapes === undefined) {
        return (
            <div className="loading">
                Loading
            </div>
        );
    } else {
        return <Editor shareUrl={shareUrl} />;
    }
}

function EditorWraped({ roomName }: any) {

    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const hmsActions = useHMSActions();

    const [shareUrl, setShareUrl] = useState('')
    const [roomId, setRoomId] = useState('')

    useEffect(() => {

        window.onunload = () => {
            if (isConnected) {
                hmsActions.leave();
            }
        };

    }, [hmsActions, isConnected]);

    useEffect(() => {
        let currentUrl = (window.location.href).split('/')

        console.log(currentUrl);


        if (currentUrl[4] === undefined) {
            fetchRoomId();
        } else {
            setRoomId(currentUrl[4]);
        }

    }, [])


    const fetchRoomId = async () => {
        await fetch("https://backend-unify.herokuapp.com/managementToken")
            .then(res => res.json())
            .then(
                async (result) => {
                    setRoomId(result.roomId)
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const fetchToken = async () => {
        const Id = uuidv1()
        const response = await fetch(`https://prod-in2.100ms.live/hmsapi/unifymarketplace-audio.app.100ms.live/api/token`, {
            method: 'POST',
            body: JSON.stringify({
                user_id: Id,
                role: 'speaker',
                room_id: roomId,
            }),
        });

        const { token } = await response.json();
        let currentUrl = (window.location.href).split('/')
        if (currentUrl[4] === undefined) {
            let newUrl = window.location.href + "/" + roomId + "/" + roomName
            setShareUrl(newUrl)
        } else {
            setShareUrl(window.location.href)
        }
        handleJoint(token)
    }

    const handleJoint = async (token: any) => {
        await hmsActions.join({
            userName: 'result',
            authToken: token
        });
    }


    return (
        <div>
            {roomName &&
                <RoomProvider id={roomName} initialPresence={{ cursor: null, }} initialStorage={{ shapes: new LiveMap(), }}>
                    <Room url={shareUrl} />
                </RoomProvider>
            }
            {
                isConnected ?
                    <MicroPhone /> :
                    <div className="control-bar container mx-auto fixed bottom-[3%] sm:bottom-[11%] md:bottom-[9%] sm:right-1 sm:w-[7%] w-[60%] right-0  text-sm">
                        <button className="btn-control" onClick={fetchToken}>
                            Start
                        </button>
                    </div>

            }
        </div>
    );
}


export default EditorWraped
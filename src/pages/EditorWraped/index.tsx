import { Suspense, useCallback, useEffect, useState } from "react";
import Avatar from '../../components/Avatar/Avatar';
import { COLORS_PRESENCE } from '../../constants';
import { RoomProvider, useMap, useMyPresence, useOthers } from "../../liveblocks.config";
import Editor from '../Editor';
import { LiveMap } from "@liveblocks/client";
import { v1 as uuidv1 } from 'uuid';
import Video from "twilio-video";

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

    // const isConnected = useHMSStore(selectIsConnectedToRoom);
    // const hmsActions = useHMSActions();

    const [shareUrl, setShareUrl] = useState('')
    // const [roomId, setRoomId] = useState('')
    const [room, setRoom] = useState(null);
    const [connecting, setConnecting] = useState(false);


    useEffect(() => {

        window.onunload = () => {
            if (room) {
                handleLogout();
            }
        };

    }, []);


    const handleLogout = useCallback(() => {
        setRoom((prevRoom: any) => {
            if (prevRoom) {
                prevRoom.localParticipant.tracks.forEach((trackPub: any) => {
                    trackPub.track.stop();
                });
                prevRoom.disconnect();
            }
            return null;
        });
    }, []);

    const handleSubmit = useCallback(
        async (event: any) => {
            event.preventDefault();
            setConnecting(true);
            const data = await fetch("https://twilioaudiobackend.herokuapp.com/join-room", {
                method: "POST",
                body: JSON.stringify({

                    roomName: roomName,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                console.log(res);
                return res.json()
            });


            Video.connect(data.token, {
                name: roomName,
                video: false,
                audio: true
            })
                .then((room: any) => {
                    setConnecting(false);
                    setRoom(room);
                    console.log("Room", room)
                    let newUrl = window.location.protocol + "//" + window.location.host + '/1' + "/" + room.sid + "/" + roomName
                    console.log(newUrl);
                    setShareUrl(newUrl)

                })
                .catch((err) => {
                    console.error(err);
                    setConnecting(false);
                });
        },
        [roomName]
    );

    useEffect(() => {
        if (room) {
            const tidyUp = (event: any) => {
                if (event.persisted) {
                    return;
                }
                if (room) {
                    handleLogout();
                }
            };
            window.addEventListener("pagehide", tidyUp);
            window.addEventListener("beforeunload", tidyUp);
            return () => {
                window.removeEventListener("pagehide", tidyUp);
                window.removeEventListener("beforeunload", tidyUp);
            };
        }
    }, [room, handleLogout]);


    // useEffect(() => {
    //     let currentUrl = (window.location.href).split('/')

    //     console.log(currentUrl);


    //     if (currentUrl[4] === undefined) {
    //         fetchRoomId();
    //     } else {
    //         setRoomId(currentUrl[4]);
    //     }

    // }, [])






    return (
        <div>
            {roomName &&
                <RoomProvider id={roomName} initialPresence={{ cursor: null, }} initialStorage={{ shapes: new LiveMap(), }}>
                    <Room url={shareUrl} />
                </RoomProvider>
            }
            {
                room ?
                    <MicroPhone roomName={roomName} room={room} handleLogout={handleLogout} /> :
                    <div className="control-bar container mx-auto fixed bottom-[1%] sm:bottom-[11%] md:bottom-[9%] sm:right-1 sm:w-[7%] w-[60%] right-0  text-sm">
                        <button className="btn-control" onClick={handleSubmit}>
                            Start
                        </button>
                    </div>

            }
        </div>
    );
}


export default EditorWraped
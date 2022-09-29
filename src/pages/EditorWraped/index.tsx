import { Suspense } from "react";
import Avatar from '../../components/Avatar/Avatar';
import { COLORS_PRESENCE } from '../../constants';
import { RoomProvider, useMap, useMyPresence, useOthers } from "../../liveblocks.config";
import Editor from '../Editor';
import { LiveMap } from "@liveblocks/client";


function WhoIsHere({ userCount }: any) {

    return (
        <div className="who_is_here"> {userCount} Live </div>
    );
}

function Room() {

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
            <PageShow />
        </div>
    );
}

function PageShow() {
    const shapes = useMap("shapes");

    if (shapes === null || shapes === undefined) {
        return (
            <div className="loading">
                Loading
            </div>
        );
    } else {
        return <Editor />;
    }
}

function EditorWraped() {
    return (
        <RoomProvider id="unify-Product-Template" initialPresence={{ cursor: null, }} initialStorage={{ shapes: new LiveMap(), }}>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
            <Room />
            {/* </Suspense> */}
        </RoomProvider>
    );
}


export default EditorWraped
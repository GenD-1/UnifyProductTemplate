import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

let PUBLIC_KEY = "pk_live_dwx4ql2mT2466xuugesFggk9";

if (!/^pk_(live|test)/.test(PUBLIC_KEY)) {
    console.warn(
        `Replace "${PUBLIC_KEY}" by your public key from https://liveblocks.io/dashboard/apikeys.\n` +
        `Learn more: https://github.com/liveblocks/liveblocks/tree/main/examples/react-dashboard#getting-started.`
    );
}

overrideApiKey();

const client = createClient({
    publicApiKey: PUBLIC_KEY,
});

export const {
    useMyPresence,
    useMap,
    useHistory,
    useCanUndo,
    useCanRedo,
    useBatch,
    useRoom,
    useOthers,
    RoomProvider,
} = createRoomContext<any>(client);

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
function overrideApiKey() {
    const query = new URLSearchParams(window?.location?.search);
    const apiKey = query.get("apiKey");

    if (apiKey) {
        PUBLIC_KEY = apiKey;
    }
}
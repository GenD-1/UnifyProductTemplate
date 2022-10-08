import { useAVToggle } from "@100mslive/react-sdk";
import { useEffect, useState } from "react";
import { Mic, MicOff } from 'react-feather'
import Participant from "../Participant/Participant";

function MicroPhone({ roomName, room, handleLogout }: any) {
    const [participants, setParticipants] = useState([]) as any;


    useEffect(() => {
        const participantConnected = (participant: any) => {
            setParticipants((prevParticipants: any) => [...prevParticipants, participant]);
        };

        const participantDisconnected = (participant: any) => {
            setParticipants((prevParticipants: any) =>
                prevParticipants.filter((p: any) => p !== participant)
            );
        };


        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        room.participants.forEach(participantConnected);
        return () => {
            room.off("participantConnected", participantConnected);
            room.off("participantDisconnected", participantDisconnected);
        };
    }, [room]);


    const remoteParticipants = participants.map((participant: any) => (
        <Participant key={participant.sid} participant={participant} />
    ));





    return (
        <div className="control-bar  container mx-auto w-fit absolute sm:bottom-[10%]  sm:right-1  right-0  text-sm"
        // width: 70px;
        // position: absolute;
        // bottom: 10%;
        // right: 0;"
        >
            {room ? (
                <>
                    <Participant
                        key={room.localParticipant.sid}
                        participant={room.localParticipant}
                        isOwner={true}
                    />
                </>
            ) : (
                ""
            )}
            <div className="remote-participants">{remoteParticipants}</div>
        </div>
    );
}

export default MicroPhone;
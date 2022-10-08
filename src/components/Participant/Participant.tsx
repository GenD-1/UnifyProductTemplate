import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "react-feather";

const Participant = ({ participant, isOwner }: any) => {

    const [audioTracks, setAudioTracks] = useState([]) as any;
    const [isAudioMute, setIsAudioMute] = useState(true) as any;


    const audioRef = useRef() as any;

    const trackpubsToTracks = (trackMap: any) =>
        Array.from(trackMap.values())
            .map((publication: any) => publication.track)
            .filter((track) => track !== null);

    useEffect(() => {

        setAudioTracks(trackpubsToTracks(participant.audioTracks));

        const trackSubscribed = (track: any) => {

            if (track.kind === "audio") {
                setAudioTracks((audioTracks: any) => [...audioTracks, track]);
            }
        };

        const trackUnsubscribed = (track: any) => {

            if (track.kind === "audio") {
                setAudioTracks((audioTracks: any) => audioTracks.filter((a: any) => a !== track));
            }
        };

        participant.on("trackSubscribed", trackSubscribed);
        participant.on("trackUnsubscribed", trackUnsubscribed);

        return () => {

            setAudioTracks([]);
            participant.removeAllListeners();
        };
    }, [participant]);



    useEffect(() => {
        const audioTrack = audioTracks[0];
        if (audioTrack) {
            audioTrack.attach(audioRef.current);
            return () => {
                audioTrack.detach();
            };
        }
    }, [audioTracks]);


    const muteAudio = () => {
        setIsAudioMute(!isAudioMute)
        if (isAudioMute) {
            participant.audioTracks.forEach((track: any) => {
                console.log(track);
                track.track.enable();
            });
        }

        else {
            participant.audioTracks.forEach((track: any) => {
                console.log(track);
                console.log("participant", participant);
                track.track.disable();
            });
        }
    }

    return (
        <div className="participant w-fit" onClick={muteAudio}  >
            {/* <h3>{participant.identity}</h3>           */}
            {!isOwner && <audio ref={audioRef} autoPlay={true} muted={false} />}
            {isOwner && <button className="p-1">{isAudioMute ? <MicOff size={25} /> : <Mic size={25} />}</button>}
        </div>
    );
};

export default Participant;

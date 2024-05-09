"use client";

import { RefObject } from "react";

export default function LOCALSTREAM_OUTPUTSTREAM(l_stream_ref: RefObject<HTMLVideoElement>, r_stream_ref: RefObject<HTMLVideoElement>) {

    const servers = {
        iceServers: [{
            urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]
        }]
    }

    const createOffer: (l_stream: MediaStream) => Promise<void> = async (l_stream: MediaStream) => {
        const peerConnection = new RTCPeerConnection();
        const remoteStream = new MediaStream();

        if (r_stream_ref && r_stream_ref.current)
            r_stream_ref.current.srcObject = remoteStream;

        l_stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, l_stream);
        })

        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            })
        }

        peerConnection.onicecandidate = async (event) => {
            if (event.candidate) {
                console.log("New ICE candidate", event.candidate);
            }
        }

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        console.log("offer", offer)

    }

    const init: () => Promise<void> = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

        if (l_stream_ref && l_stream_ref.current)
            l_stream_ref.current.srcObject = localStream;

        createOffer(localStream);
    }

    init();
}
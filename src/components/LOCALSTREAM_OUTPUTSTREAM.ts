"use client";

import { RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import { createClient, RtmClient, RtmTextMessage } from "agora-rtm-react";
import "dotenv/config";

export default function LOCALSTREAM_OUTPUTSTREAM(l_stream_ref: RefObject<HTMLVideoElement>, r_stream_ref: RefObject<HTMLVideoElement>) {
    interface p2pCONNECTION {
        localStream : MediaStream,
        remoteStream : MediaStream,
        peerConnection : RTCPeerConnection
    }

    interface data {
        type: "offer" | "candidate",
        offer: RTCSessionDescriptionInit
    }
    
    const p2pInstance : p2pCONNECTION = {
        localStream : new MediaStream(),
        remoteStream : new MediaStream(),
        peerConnection : new RTCPeerConnection()
    }
    
    const servers = {
        iceServers: [{
            urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]
        }]
    }
    
    const token = undefined;
    const uid = uuidv4();
    const client: () => RtmClient = createClient("889bf6e33852455eae51eb0b7a3345a0");

    const createOffer: (MemberId : string) => Promise<void> = async (MemberId) => {
        
        if (r_stream_ref && r_stream_ref.current)
            r_stream_ref.current.srcObject = p2pInstance.remoteStream;

        p2pInstance.localStream.getTracks().forEach((track) => {
            p2pInstance.peerConnection.addTrack(track, p2pInstance.localStream);
        })

        p2pInstance.peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                p2pInstance.remoteStream.addTrack(track);
            })
        }

        p2pInstance.peerConnection.onicecandidate = async (event) => {
            const data_sent0 : data = {
                type : "candidate",
                offer : offer
            }
            
            if (event.candidate) {
                console.log("New ICE candidate", event.candidate);

                client().sendMessageToPeer({text: JSON.stringify(data_sent0)}, MemberId)
            }
        }
        
        const offer = await p2pInstance.peerConnection.createOffer();
        await p2pInstance.peerConnection.setLocalDescription(offer);
        
        console.log("offer", offer);

        const data_sent1 : data = {
            type : "offer",
            offer : offer
        }

        client().sendMessageToPeer({text: JSON.stringify(data_sent1)}, MemberId)
        
    }
    

    const init: () => Promise<void> = async () => {

        // if (process.env.NEXT_PUBLIC_API_ID) {
            // console.log(client, "fff")

            await client().login({ uid, token });

            const channel = client().createChannel("main");

            await channel.join();
            // console.log(channel.join())

            channel.on("MemberJoined", async (MemberId) => {
                // console.log("A new user joined the channel ", MemberId);

                createOffer(MemberId);
            });

            client().on("MessageFromPeer", async (Message, MemberId) => {
                const msg : data = JSON.parse((Message as RtmTextMessage).text);
                console.log("Message have been received : ", msg.offer, " from : " + MemberId);
            })
        // }
        
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        
        if (l_stream_ref && l_stream_ref.current)
            l_stream_ref.current.srcObject = localStream;
        
    }
    
    init();
}
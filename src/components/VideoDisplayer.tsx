"use client";

import { FC, useEffect, useRef } from "react";
import VideoComponent from "./VideoComponent";
import LOCALSTREAM_OUTPUTSTREAM from "./LOCALSTREAM_OUTPUTSTREAM.ts";

const VideoDisplayer: FC<{}> = () => {
    const vid_1 = useRef<HTMLVideoElement>(null);
    const vid_2 = useRef<HTMLVideoElement>(null);

    useEffect(()=>{
        LOCALSTREAM_OUTPUTSTREAM( vid_1, vid_2);
    }, [vid_1, vid_2])

    return (
        <>
            <div id="videoComponents">

                <VideoComponent
                    _class_name_="video-player"
                    _user_id_={1}
                    _vid_ref_={vid_1}
                />

                <VideoComponent
                    _class_name_="video-player"
                    _user_id_={2}
                    _vid_ref_={vid_2}
                />

            </div>
        </>)
}


export default VideoDisplayer
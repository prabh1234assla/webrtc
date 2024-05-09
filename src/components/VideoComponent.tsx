"use client";

import { FC, RefObject } from "react";

type Props = {
    _class_name_: string
    _user_id_: number
    _vid_ref_: RefObject<HTMLVideoElement>
}

const VideoComponent: FC<Props> = ({ _class_name_, _user_id_, _vid_ref_ }) => {
    return (<>
        <video
            className={_class_name_}
            id={"user " + _user_id_}
            autoPlay={true}
            playsInline={true}
            ref={_vid_ref_}
        />
    </>)
}

export default VideoComponent
////////////////////////////////////////
//        Channel Definitions         //
////////////////////////////////////////

interface IndexChannelDef {
    UPLOAD_CLICK : string;
}

export const IndexChannel : IndexChannelDef = {
    UPLOAD_CLICK: 'upload-click'
}

interface VideoChannelDef {
    PLAY_PAUSE_CLICK: string;
}

export const VideoChannel : VideoChannelDef = {
    PLAY_PAUSE_CLICK: 'play-pause-click'
}

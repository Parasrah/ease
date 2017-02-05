import * as WebTorrent from 'webtorrent';

interface SeedCallback {
    (torrent: WebTorrent.Torrent) : void;
}

export default class VideoStreamHost {
    filepath : string;
    host : WebTorrent.Instance;
    torrent : WebTorrent.Torrent;

    constructor(filepath: string) {
        this.filepath = filepath;
        this.torrent = null;
        
        // Create the torrent
        this.host = new WebTorrent();
    }

    seed(callback: SeedCallback) {
        this.host.seed(this.filepath, (torrent: WebTorrent.Torrent) => {
            this.torrent = torrent;
            callback(torrent);
        });
    }
    
}
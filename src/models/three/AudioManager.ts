import { Audio, AudioListener, AudioLoader } from "three";
import SoundType from "../enum/SoundType";

export default class AudioManager {
    private _audioListener: AudioListener;
    private _audioLoader: AudioLoader;
    private _audioMapping: {
        RUN: {
            audio: Audio;
            volume: number;
            loop: boolean;
            path: string;
        };
        WALK: {
            audio: Audio;
            volume: number;
            loop: boolean;
            path: string;
        };
        AMBIENT: {
            audio: Audio;
            volume: number;
            loop: boolean;
            path: string;
        };
        CLICK: {
            audio: Audio;
            volume: number;
            loop: boolean;
            path: string;
        };
        NOTIFICATION: {
            audio: Audio;
            volume: number;
            loop: boolean;
            path: string;
        };
        TELEPORT: {
            audio: Audio;
            volume: number;
            loop: boolean;
            path: string;
        };
        BOOK: {
            audio: Audio;
            volume: number;
            loop: boolean;
            path: string;
        };
        PAGE: {
            audio: Audio;
            volume: number;
            loop: boolean;
            path: string;
        };
    };

    constructor() {
        this._audioListener = new AudioListener();
        this._audioMapping = {
            RUN: {
                audio: new Audio(this._audioListener),
                volume: 0.4,
                loop: true,
                path: "/sounds/run.mp3"
            },
            WALK: {
                audio: new Audio(this._audioListener),
                volume: 1,
                loop: true,
                path: "/sounds/walk.mp3"
            },
            AMBIENT: {
                audio: new Audio(this._audioListener),
                volume: 0.5,
                loop: true,
                path: "/sounds/ambient.mp3"
            },
            CLICK: {
                audio: new Audio(this._audioListener),
                volume: 0.5,
                loop: false,
                path: "/sounds/click.mp3"
            },
            NOTIFICATION: {
                audio: new Audio(this._audioListener),
                volume: 0.8,
                loop: false,
                path: "/sounds/notification.mp3"
            },
            TELEPORT: {
                audio: new Audio(this._audioListener),
                volume: 1,
                loop: false,
                path: "/sounds/teleport.mp3"
            },
            PAGE: {
                audio: new Audio(this._audioListener),
                volume: 1,
                loop: false,
                path: "/sounds/page.mp3"
            },
            BOOK: {
                audio: new Audio(this._audioListener),
                volume: 1,
                loop: false,
                path: "/sounds/book.mp3"
            }
        };
        this._audioLoader = new AudioLoader();
    }

    public get audioListener(): AudioListener {
        return this._audioListener;
    }

    public playSound(sound: SoundType): void {
        const audio = this._audioMapping[sound];

        this._audioLoader.load(audio.path, (buffer) => {
            audio.audio.setBuffer(buffer);
            audio.audio.setLoop(audio.loop);
            audio.audio.setVolume(audio.volume);
            audio.audio.play();
        });
    }

    public stopSound(sound: SoundType[]): void {
        sound.forEach((s) => {
            const audio = this._audioMapping[s];

            if (audio.audio.isPlaying) audio.audio.stop();
        });
    }
}
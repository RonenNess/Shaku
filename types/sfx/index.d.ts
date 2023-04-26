declare const _exports: {
    _playingSounds: Set<any>;
    setup(): Promise<any>;
    startFrame(): void;
    endFrame(): void;
    destroy(): void;
    readonly SoundMixer: typeof import("./sound_mixer");
    play(soundAsset: import("../assets/sound_asset"), volume: number, playbackRate: number, preservesPitch: boolean): Promise<any>;
    stopAll(): void;
    readonly playingSoundsCount: number;
    createSound(sound: import("../assets/sound_asset")): import("./sound_instance");
    masterVolume: number;
};
export = _exports;
//# sourceMappingURL=index.d.ts.map
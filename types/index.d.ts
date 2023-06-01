export = global.Shaku;
declare var Shaku: {
    utils: Utils;
    sfx: Sfx;
    gfx: Gfx;
    input: Input;
    assets: Assets;
    collision: Collision;
    pauseWhenNotFocused: boolean;
    pause: boolean;
    pauseGameTime: boolean;
    init(managers?: import("./manager")[]): Promise<any>;
    destroy(): void;
    isCurrentlyPaused(): boolean;
    startFrame(): void;
    endFrame(): void;
    "__#16@#_updateFpsAndTimeStats"(): void;
    silent(): void;
    throwErrorOnWarnings(enable: boolean): void;
    readonly gameTime: import("./utils/game_time");
    readonly version: string;
    getFpsCount(): number;
    getAverageFrameTime(): number;
    requestAnimationFrame(callback: Function): number;
    cancelAnimationFrame(id: number): any;
    setLogger(loggerHandler: any): void;
    getLogger(name: any): Logger;
};
declare namespace global { }
//# sourceMappingURL=index.d.ts.map
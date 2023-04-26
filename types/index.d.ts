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
/**
 * Entry point for the Shaku module.
 *
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 *
 */
declare var global: typeof globalThis;
//# sourceMappingURL=index.d.ts.map
declare const _exports: {
    resolver: import("./resolver");
    setup(): any;
    createWorld(gridCellSize: number | import("../utils/vector2")): import("./collision_world");
    readonly RectangleShape: typeof import("./shapes/rectangle");
    readonly PointShape: typeof import("./shapes/point");
    readonly CircleShape: typeof import("./shapes/circle");
    readonly LinesShape: typeof import("./shapes/lines");
    readonly TilemapShape: typeof import("./shapes/tilemap");
    startFrame(): void;
    endFrame(): void;
    destroy(): void;
};
export = _exports;
//# sourceMappingURL=index.d.ts.map
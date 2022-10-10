export const Vector2: typeof import("./vector2");
export const Vector3: typeof import("./vector3");
export const Rectangle: typeof import("./rectangle");
export const Circle: typeof import("./circle");
export const Line: typeof import("./line");
export const Color: typeof import("./color");
export const Animator: typeof import("./animator");
export const GameTime: typeof import("./game_time");
export const MathHelper: typeof import("./math_helper");
export const SeededRandom: typeof import("./seeded_random");
export const Perlin: typeof import("./perlin");
export const Storage: typeof import("./storage");
export const StorageAdapter: typeof import("./storage_adapter");
export const PathFinder: {
    findPath: (grid: {
        isBlocked(_from: any, _to: any): boolean;
        getPrice(_index: any): number;
    }, startPos: any, targetPos: any, options: any) => import("./vector2")[];
    IGrid: {
        new (): {
            isBlocked(_from: any, _to: any): boolean;
            getPrice(_index: any): number;
        };
    };
};
export const Transformation: typeof import("./transformation");
export const TransformationModes: {
    Relative: string;
    AxisAligned: string;
    Absolute: string;
};
//# sourceMappingURL=index.d.ts.map
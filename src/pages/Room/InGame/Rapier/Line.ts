export type Line = number[][][];
/**
 * Create lines. startX must be lower than endY.
 */
export function createLines(startY: number, endY: number, thickness: number, x: number = 5000) {
    const lines: Line[] = [];
    let first = true;
    if (startY >= endY) {
        throw new Error("startX must be lower than endY");
    }
    
    for (let i = startY; i < endY + thickness; i += thickness) {
        if (!first) {
            lines.push([[[x, i], [x, i + thickness], [-x, i + thickness], [-x, i], [x, i]]]);
            continue;
        }
        lines.push([[[x, i - 10], [x, i + thickness], [-x, i + thickness], [-x, i - 10], [x, i - 10]]]);
        first = false;
    }
    
    return lines;
}

/**
 * Create bomb boundary
 */
export function createBombBoundary(x: number, y: number, width: number, height: number): Line {
    const hx = width / 2;
    const hy = height / 2;
    return [[
        [x - hx, y - hy],
        [x - hx, y + hy],
        [x + hx, y + hy],
        [x + hx, y - hy],
        [x - hx, y - hy]
    ]];
}
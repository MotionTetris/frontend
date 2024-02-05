/* Calculate intersection and difference between polygon and lines */

/* Create lines. startX must be lower than endY. */
export function createLines(startY: number, endY: number, thickness: number, x: number = 10000) {
    let lines: number[][][][] = [];
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
    console.log(lines);
    return lines;
}
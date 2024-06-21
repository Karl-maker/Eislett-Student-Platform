export function generateRangeOfNumbersArray(y: number, x: number): number[] {
    let array: number[] = [];
    for (let i = y - x; i <= y + x; i++) {
        array.push(i);
    }
    return array;
}
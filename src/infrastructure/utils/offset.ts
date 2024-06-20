export default function generateRandomOffsets(totalCount: number, amount: number): number[] {
    const offsets: number[] = [];

    // If totalCount is 1, simply repeat offset 0 for the required amount of times
    if (totalCount === 1) {
        for (let i = 0; i < amount; i++) {
            offsets.push(0);
        }
        return offsets;
    }

    // Generate random offsets and add them to the array
    for (let i = 0; i < amount; i++) {
        const randomOffset = Math.floor(Math.random() * totalCount);
        offsets.push(randomOffset);
    }

    return offsets;
}

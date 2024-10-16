const MAX_CHIP_TYPES = 4;
const BIG_BLINDS_PER_BUYIN = 100;
const VALID_CHIP_VALUES = [100, 25, 5, 1, 0.25, 0.05, 0.01] as const;
const VALID_BLIND_VALUES: { [key: number]: number } = {
    0.02: 0.01,
    0.05: 0.02,
    0.10: 0.05,
    0.25: 0.10,
    0.50: 0.25,
    1.00: 0.50,
    2.00: 1.00,
};

function product<T>(...sets: T[][]): T[][] {
    return sets.reduce<T[][]>((acc, set) => {
        if (acc.length === 0) return set.map(item => [item]);
        return acc.flatMap(accItem => set.map(setItem => [...accItem, setItem]));
    }, []);
}

interface ChipColors {
    [key: string]: number;
}

type Combination = [number[], number];

type FilterFunction = (params: { combinations: Combination[], bigBlindValue: number, chipColors: ChipColors }) => Combination[];

export function assignChipValues(chipColors: ChipColors, bigBlindValue: number, maxPlayers: number): Combination | null {
    const targetSum = maxPlayers * bigBlindValue * BIG_BLINDS_PER_BUYIN;

    const validCombinations = getValidCombinations(chipColors, targetSum);

    if (!validCombinations.length) {
        return null;
    }

    let result: Combination[] = validCombinations;

    const filters: FilterFunction[] = [
        filterMissingSmallBlindValue,
        filterLargeChips,
        filterManyDuplicates,
        filterMinMaxValues,
        filterMaxQuantity
    ];

    for (const filter of filters) {
        const params = {
            combinations: result,
            bigBlindValue,
            chipColors
        };
        const filteredResult = filter(params);
        if (filteredResult.length > 0) {
            result = filteredResult;
        } else {
            return getDefault(result);
        }
    }

    return result[0];
}

function getValidCombinations(chipColors: ChipColors, targetSum: number): Combination[] {
    const validCombinations: Combination[] = [];
    const allCombinations = product(...Array(Object.keys(chipColors).length).fill(VALID_CHIP_VALUES));

    for (const combo of allCombinations) {
        const totalValue = combo.reduce<number>((sum, value, i) => {
            const chipColor = Object.keys(chipColors)[i];
            return sum + chipColors[chipColor] * (value as number);
        }, 0);
        if (totalValue >= targetSum) {
            validCombinations.push([combo as number[], totalValue]);
        }
    }
    return validCombinations;
}

function filterMissingSmallBlindValue({ combinations, bigBlindValue }: { combinations: Combination[], bigBlindValue: number }): Combination[] {
    return combinations.filter(([combo]) => combo.some(value => value <= VALID_BLIND_VALUES[bigBlindValue]));
}

function filterLargeChips({ combinations, bigBlindValue }: { combinations: Combination[], bigBlindValue: number }): Combination[] {
    return combinations.filter(([combo]) => combo.every(value => value <= 20 * bigBlindValue));
}

function filterManyDuplicates({ combinations, chipColors }: { combinations: Combination[], chipColors: ChipColors }): Combination[] {
    const maxDuplicates = Math.max(0, Object.keys(chipColors).length - MAX_CHIP_TYPES);
    return combinations.filter(([combo]) => combo.length - new Set(combo).size <= maxDuplicates);
}

function filterMinMaxValues({ combinations, chipColors }: { combinations: Combination[], chipColors: ChipColors }): Combination[] {
    const leastQuantityChips = Object.keys(chipColors).sort((a, b) => chipColors[a] - chipColors[b]).slice(0, 2);
    const [least1, least2] = leastQuantityChips;

    return combinations.filter(([combo]) => {
        const colorIndex1 = Object.keys(chipColors).indexOf(least1);
        const colorIndex2 = Object.keys(chipColors).indexOf(least2);
        return (combo[colorIndex1] === Math.max(...combo) && combo[colorIndex2] === Math.min(...combo)) ||
               (combo[colorIndex2] === Math.max(...combo) && combo[colorIndex1] === Math.min(...combo));
    });
}

function filterMaxQuantity({ combinations, chipColors }: { combinations: Combination[], chipColors: ChipColors }): Combination[] {
    const mostQuantityChipColor = Object.keys(chipColors).sort((a, b) => chipColors[b] - chipColors[a])[0];
    const mostQuantityChipIndex = Object.keys(chipColors).indexOf(mostQuantityChipColor);

    const output = combinations.filter(([combo]) => {
        const primaryValue = Array.from(new Set(combo)).sort((a, b) => b - a)[1];
        return combo[mostQuantityChipIndex] === primaryValue;
    });

    return output.sort((a, b) => b[0].filter((value: number) => value === b[0][mostQuantityChipIndex]).length - 
                               a[0].filter((value: number) => value === a[0][mostQuantityChipIndex]).length);
}

function getDefault(pool: Combination[]): Combination | null {
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}


// Dev test example
// const chipColors: ChipColors = { blue: 100, red: 500, green: 200, black: 100 };
// console.log(assignChipValues(chipColors, 2.00, 9));
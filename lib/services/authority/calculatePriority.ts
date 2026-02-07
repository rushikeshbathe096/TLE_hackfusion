
interface PriorityInputs {
    frequency: number;
    createdAt: Date | string;
}

export function calculatePriority({ frequency, createdAt }: PriorityInputs): number {
    // Frequency Score
    let frequencyScore = 1;
    if (frequency >= 6) frequencyScore = 3;
    else if (frequency >= 3) frequencyScore = 2;
    // else 1-2 -> 1 (default)

    // Age Score
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let ageScore = 1;
    if (diffDays > 5) ageScore = 3;
    else if (diffDays >= 2) ageScore = 2;
    // else < 2 days -> 1 (default)

    // Priority Formula: (frequencyScore * 2) + ageScore
    return (frequencyScore * 2) + ageScore;
}

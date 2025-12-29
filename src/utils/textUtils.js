/**
 * Calculates the Levenshtein distance between two strings.
 * This represents the minimum number of single-character edits (insertions, deletions, or substitutions)
 * required to change one string into the other.
 * 
 * @param {string} a 
 * @param {string} b 
 * @returns {number} The distance
 */
export const levenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
};

/**
 * Normalizes a string by removing punctuation, extra spaces, and converting to lowercase.
 * @param {string} str 
 * @returns {string}
 */
export const normalize = (str) => {
    if (!str) return "";
    return str.toLowerCase().replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ").trim();
};

/**
 * Checks if the user answer is correct using fuzzy matching.
 * @param {string} userAnswer 
 * @param {string} correctAnswer 
 * @returns {boolean}
 */
export const isFuzzyMatch = (userAnswer, correctAnswer) => {
    const normUser = normalize(userAnswer);
    const normCorrect = normalize(correctAnswer);

    // 1. Exact match after normalization
    if (normUser === normCorrect) return true;

    // 2. Substring match (if one contains the other and is substantial length)
    // This helps with "Ghostbusters" vs "The Ghostbusters" or "Охотники" vs "Охотниками"
    if ((normCorrect.includes(normUser) || normUser.includes(normCorrect)) && normCorrect.length > 3 && normUser.length > 3) {
        // Only allow if the length difference isn't too massive (e.g. don't match "cat" to "communication")
        const lengthDiff = Math.abs(normUser.length - normCorrect.length);
        if (lengthDiff <= 4) return true;
    }

    // 3. Levenshtein Distance
    // Allow for typos (approx 20% error rate allowed)
    const distance = levenshteinDistance(normUser, normCorrect);
    const maxLen = Math.max(normUser.length, normCorrect.length);

    // Allow up to 3 errors for longer words, or 20% for shorter ones
    const allowedErrors = Math.min(3, Math.floor(maxLen * 0.3));

    return distance <= allowedErrors;
};

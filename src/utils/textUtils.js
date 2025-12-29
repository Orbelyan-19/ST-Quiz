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
 * Very lenient - allows typos, grammatical case differences, and partial matches.
 * @param {string} userAnswer 
 * @param {string} correctAnswer 
 * @returns {boolean}
 */
export const isFuzzyMatch = (userAnswer, correctAnswer) => {
    const normUser = normalize(userAnswer);
    const normCorrect = normalize(correctAnswer);

    // Empty check
    if (!normUser || !normCorrect) return false;

    // 1. Exact match after normalization
    if (normUser === normCorrect) return true;

    // 2. Substring match (very lenient)
    // Helps with "Охотники" vs "Охотниками за привидениями"
    if (normCorrect.includes(normUser) && normUser.length >= 3) {
        return true;
    }
    if (normUser.includes(normCorrect) && normCorrect.length >= 3) {
        return true;
    }

    // 3. Word-by-word match for multi-word answers
    // If the correct answer has multiple words, check if user got the main word(s)
    const correctWords = normCorrect.split(' ').filter(w => w.length > 2);
    const userWords = normUser.split(' ').filter(w => w.length > 2);

    if (correctWords.length > 1) {
        // Count how many correct words the user got (with fuzzy matching per word)
        let matchedWords = 0;
        for (const cWord of correctWords) {
            for (const uWord of userWords) {
                if (cWord.includes(uWord) || uWord.includes(cWord)) {
                    matchedWords++;
                    break;
                }
                // Allow 2 char difference per word
                if (levenshteinDistance(cWord, uWord) <= 2) {
                    matchedWords++;
                    break;
                }
            }
        }
        // If user matched at least half the words, accept it
        if (matchedWords >= Math.ceil(correctWords.length / 2)) {
            return true;
        }
    }

    // 4. Levenshtein Distance (very lenient - 40% error allowed)
    const distance = levenshteinDistance(normUser, normCorrect);
    const maxLen = Math.max(normUser.length, normCorrect.length);

    // Allow up to 40% errors, minimum 3
    const allowedErrors = Math.max(3, Math.floor(maxLen * 0.4));

    return distance <= allowedErrors;
};

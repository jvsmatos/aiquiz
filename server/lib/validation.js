export const validateQuestions = (questions) => {
    try {        
        // 1. Basic check: The data must be an array with exactly 8 questions
        if (!Array.isArray(questions)) {
            console.error('[VALIDATION] The received data is not an array.');
            return false;
        }

        if (questions.length !== 8) {
            console.error(
                `[VALIDATION] Incorrect number of questions. Expected: 8 | Received: ${questions.length}`,
                "\nReceived data:", JSON.stringify(questions, null, 2)
            );
            return false;
        }

        // 2. Check for unique question IDs
        const uniqueIds = new Set(questions.map(q => q.id));
        if (uniqueIds.size !== 8) {
            console.error(
                `[VALIDATION] Duplicate question IDs found. Expected: 8 unique | Found: ${uniqueIds.size}`,
                "\nDuplicate IDs:", 
                questions.filter(q => !uniqueIds.has(q.id)).map(q => q.id) // Shows duplicate IDs
            );
            return false;
        }

        // 3. Structural validation for each question
        const invalidQuestions = questions.filter(q => 
            !(typeof q.id === 'string' &&
            typeof q.question === 'string' &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            q.options.every(opt => 
                typeof opt.id === 'string' &&
                ['a', 'b', 'c', 'd'].includes(opt.id) &&
                typeof opt.text === 'string'
            ) &&
            ['a', 'b', 'c', 'd'].includes(q.correctAnswerId) &&
            ['easy', 'medium', 'hard'].includes(q.difficulty))
        );

        if (invalidQuestions.length > 0) {
            console.error(
                `[VALIDATION] ${invalidQuestions.length} question(s) have an invalid structure:`,
                "\nDetailed errors:", 
                invalidQuestions.map((q, index) => `Question ${index + 1} (ID: ${q.id}): ${JSON.stringify(q, null, 2)}`)
            );
            return false;
        }

        // 4. Validate the difficulty distribution
        const difficultyCounts = questions.reduce((acc, q) => {
            acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
            return acc;
        }, {});

        if (!(
            difficultyCounts.easy === 2 &&
            difficultyCounts.medium === 3 &&
            difficultyCounts.hard === 3
        )) {
            console.error(
                "[VALIDATION] Incorrect difficulty distribution.",
                "\nExpected: easy=2 | medium=3 | hard=3",
                "\nReceived:", JSON.stringify(difficultyCounts, null, 2)
            );
            return false;
        }

        return true;

    } catch (error) {
        console.error(
            '[VALIDATION] Critical error during validation:',
            "\nMessage:", error.message,
            "\nStack trace:", error.stack,
            "\nReceived data:", JSON.stringify(questions, null, 2)
        );
        return false;
    }
};

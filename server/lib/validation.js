export const validateQuestions = (questions) => {
    try {        
        // 1. Basic check: The data must be an array with exactly 8 questions
        if (!Array.isArray(questions)) {
            console.error(`[ERROR] The received data is not an array. [${requestId}]`);
            return false;
        }

        if (questions.length !== 8) {
            console.error(`[ERROR] Expected 8 questions, received ${questions.length} [${requestId}]`);
            return false;
        }

        // 2. Check for unique question IDs
        const uniqueIds = new Set(questions.map(q => q.id));
        if (uniqueIds.size !== 8) {
            console.error(`[ERROR] Duplicate question IDs found [${requestId}]`);
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
            console.error(`[ERROR] ${invalidQuestions.length} invalid questions [${requestId}]`);
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
            console.error(`[ERROR] Incorrect difficulty distribution [${requestId}]`);
            return false;
        }

        return true;

    } catch (error) {
        console.error(`[ERROR] Validation failed: ${error.message} [${requestId}]`);
        return false;
    }
};

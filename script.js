document.addEventListener('DOMContentLoaded', () => {
    const questionBox = document.getElementById('question');
    const options = Array.from(document.querySelectorAll('.option'));
    const feedback = document.getElementById('feedback');
    const nextButton = document.getElementById('next-btn');
    const scoreTracker = document.getElementById('score-tracker');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let totalQuestionsAnswered = 0;

    // Load questions from a text file
    fetch('questions.txt')
        .then(response => response.text())
        .then(data => {
            questions = parseQuestions(data);
            shuffleArray(questions); // Shuffle questions
            displayQuestion();
        })
        .catch(error => console.error('Error loading questions:', error));

    function parseQuestions(data) {
        return data.trim().split('\n').map(line => {
            const [correct, ...incorrect] = line.split('|');
            return { correct, incorrect };
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function displayQuestion() {
        if (currentQuestionIndex >= questions.length) {
            questionBox.textContent = 'No more questions!';
            options.forEach(option => option.style.display = 'none');
            nextButton.style.display = 'none';
            return;
        }

        const question = questions[currentQuestionIndex];
        questionBox.textContent = `What is the correct answer?`;

        const allOptions = [question.correct, ...question.incorrect];
        shuffleArray(allOptions);

        options.forEach((option, index) => {
            option.textContent = allOptions[index];
            option.dataset.correct = option.textContent === question.correct;
        });

        feedback.textContent = '';
        nextButton.style.display = 'block';
    }

    function selectAnswer(index) {
        const selectedOption = options[index];
        if (selectedOption.dataset.correct === 'true') {
            feedback.textContent = 'Correct!';
            feedback.className = 'correct';
            score++;
        } else {
            feedback.textContent = 'Incorrect!';
            feedback.className = 'incorrect';
        }

        totalQuestionsAnswered++;
        scoreTracker.textContent = `Score: ${score} / ${totalQuestionsAnswered}`;

        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1000);
    }

    window.selectAnswer = selectAnswer; // Make selectAnswer accessible from HTML

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Remove 'index.html' from the URL if the current page is the homepage
    if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
        window.history.replaceState(null, '', window.location.origin + '/');
    }

    const difficultyScreen = document.getElementById('difficulty-screen');
    const quizContainer = document.getElementById('quiz-container');
    const questionBox = document.getElementById('question');
    const options = Array.from(document.querySelectorAll('.options .option'));
    const feedback = document.getElementById('feedback');
    const nextButton = document.getElementById('next-btn');
    const scoreTracker = document.getElementById('score-tracker');
    const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let totalQuestionsAnswered = 0;
    let isAnswered = false; // To prevent selecting multiple options before clicking "Next"

    // Load questions based on selected difficulty
    function loadQuestions(difficultyFile) {
        fetch(`questions/${difficultyFile}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                questions = data;
                shuffleArray(questions); // Shuffle questions
                displayQuestion();
                difficultyScreen.style.display = 'none';
                quizContainer.style.display = 'block';
            })
            .catch(error => console.error('Error loading questions:', error));
    }

    // Shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Display the current question and shuffled answer options
    function displayQuestion() {
        if (currentQuestionIndex >= questions.length) {
            questionBox.textContent = 'No more questions!';
            options.forEach(option => option.style.display = 'none');
            nextButton.style.display = 'none';
            return;
        }

        const question = questions[currentQuestionIndex];
        questionBox.textContent = question.question;

        // Select 3 random incorrect answers
        const incorrectAnswers = question.incorrect.slice();
        shuffleArray(incorrectAnswers);
        const selectedIncorrect = incorrectAnswers.slice(0, 3);

        // Combine the correct answer with 3 random incorrect ones
        const allOptions = [question.correct, ...selectedIncorrect];
        shuffleArray(allOptions);

        options.forEach((option, index) => {
            option.textContent = allOptions[index];
            option.classList.remove('correct', 'incorrect'); // Remove color classes
            option.dataset.correct = option.textContent === question.correct;
            option.disabled = false; // Enable buttons again
        });

        feedback.textContent = '';
        isAnswered = false;
        nextButton.style.display = 'none'; // Hide the "Next Question" button until an answer is chosen
    }

    // Handle answer selection
    function selectAnswer(index) {
        if (isAnswered) return; // Prevent multiple answers being selected before clicking next

        const selectedOption = options[index];
        const isCorrect = selectedOption.dataset.correct === 'true';

        if (isCorrect) {
            feedback.textContent = 'Correct!';
            feedback.className = 'correct';
            selectedOption.classList.add('correct');
            score++;
        } else {
            feedback.textContent = 'Incorrect!';
            feedback.className = 'incorrect';
            selectedOption.classList.add('incorrect');
            
            // Highlight the correct answer in green
            options.forEach(option => {
                if (option.dataset.correct === 'true') {
                    option.classList.add('correct');
                }
            });
        }

        totalQuestionsAnswered++;
        scoreTracker.textContent = `Score: ${score} / ${totalQuestionsAnswered}`;

        options.forEach(option => option.disabled = true); // Disable buttons after selecting an answer
        nextButton.style.display = 'block'; // Show the "Next Question" button
        isAnswered = true; // Mark question as answered
    }

    window.selectAnswer = selectAnswer; // Make selectAnswer accessible from HTML

    // Handle next question
    function nextQuestion() {
        currentQuestionIndex++;
        displayQuestion();
    }

    window.nextQuestion = nextQuestion; // Make nextQuestion accessible from HTML

    // Handle difficulty button clicks
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const difficultyFile = button.getAttribute('onclick').split("'")[1]; // Extract difficulty file name from onclick attribute
            loadQuestions(difficultyFile); // Load questions based on the clicked difficulty
        });
    });
});

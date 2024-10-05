document.addEventListener('DOMContentLoaded', () => {
    const difficultyScreen = document.getElementById('difficulty-screen');
    const quizContainer = document.getElementById('quiz-container');
    const questionBox = document.getElementById('question');
    const options = Array.from(document.querySelectorAll('.options .option'));
    const feedback = document.getElementById('feedback');
    const nextButton = document.getElementById('next-btn');
    const scoreTracker = document.getElementById('score-tracker');
    const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');
    const darkModeToggle = document.getElementById('dark-mode-toggle'); // Dark mode toggle button
    // Passcode
    const submitButton = document.getElementById('submit-passcode');
    const passcodeInput = document.getElementById('passcode');
    const quizInfo = document.getElementById('quiz-info');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let totalQuestionsAnswered = 0;
    let isAnswered = false;

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
            option.classList.remove('correct', 'incorrect');
            option.dataset.correct = option.textContent === question.correct;
            option.disabled = false;
        });

        feedback.textContent = '';
        isAnswered = false;
        nextButton.style.display = 'none';
    }

    // Handle answer selection
    function selectAnswer(index) {
        if (isAnswered) return;

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
            
            options.forEach(option => {
                if (option.dataset.correct === 'true') {
                    option.classList.add('correct');
                }
            });
        }

        totalQuestionsAnswered++;
        scoreTracker.textContent = `Score: ${score} / ${totalQuestionsAnswered}`;

        options.forEach(option => option.disabled = true);
        nextButton.style.display = 'block';
        isAnswered = true;
    }

    window.selectAnswer = selectAnswer;

    // Handle next question
    function nextQuestion() {
        currentQuestionIndex++;
        displayQuestion();
    }

    window.nextQuestion = nextQuestion;

    // Handle difficulty button clicks
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const difficultyFile = button.getAttribute('onclick').split("'")[1];
            loadQuestions(difficultyFile);
        });
    });

    // Event listener for passcode submission
    submitButton.addEventListener('click', () => {
        const passcode = passcodeInput.value.trim();
        if (passcode === "testpasscode1") {
            loginForm.classList.add('hidden'); // Hide the login form
            quizInfo.classList.remove('hidden'); // Show Quiz Bowl info
        } else {
            alert("Incorrect passcode. Please try again.");
        }
    });

    // Dark Mode Implementation
    function setDarkMode(isDark) {
        const elements = [document.body, difficultyScreen, quizContainer, nextButton];
        elements.forEach(element => {
            if (isDark) {
                element.classList.add('dark-mode');
                darkModeToggle.textContent = '☀️ Light Mode'; // Change button text for light mode
            } else {
                element.classList.remove('dark-mode');
                darkModeToggle.textContent = '🌙 Dark Mode'; // Change button text for dark mode
            }
        });
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    }

    // Retrieve dark mode preference from localStorage on page load
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'enabled') {
        setDarkMode(true);
    }

    // Toggle dark mode and save preference
    darkModeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        setDarkMode(!isDarkMode);
    });
});

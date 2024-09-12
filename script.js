let questions = [];
let currentQuestion = 0;
let selectedAnswer = null;
let correctAnswers = 0;
let totalQuestions = 0;

function loadQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            loadQuestion();
        })
        .catch(error => console.error("Error loading questions:", error));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {
    const questionBox = document.getElementById('question');
    const options = document.querySelectorAll('.option');
    const currentQ = questions[currentQuestion];

    // Randomly select 3 incorrect answers and add the correct one
    const incorrectChoices = [...currentQ.incorrect];
    shuffleArray(incorrectChoices); // Shuffle the incorrect options first
    const selectedIncorrect = incorrectChoices.slice(0, 3); // Select 3 incorrect answers
    const allChoices = [...selectedIncorrect, currentQ.correct]; // Add the correct answer
    shuffleArray(allChoices); // Shuffle all options

    // Set the question text
    questionBox.innerText = currentQ.question;

    // Display the options
    options.forEach((option, index) => {
        option.innerText = allChoices[index];
        option.style.backgroundColor = '#4CAF50'; // Reset button colors
        option.disabled = false; // Re-enable the buttons for the new question
    });

    document.getElementById('feedback').innerText = "";
    selectedAnswer = null;
    updateScore();
}

function selectAnswer(index) {
    const options = document.querySelectorAll('.option');
    selectedAnswer = options[index].innerText;
    const currentQ = questions[currentQuestion];
    const feedback = document.getElementById('feedback');

    options.forEach((option, idx) => {
        option.disabled = true; // Disable buttons after answering
        if (option.innerText === currentQ.correct) {
            option.style.backgroundColor = 'green'; // Highlight the correct answer
        }
        if (selectedAnswer !== currentQ.correct && option.innerText === selectedAnswer) {
            option.style.backgroundColor = 'red'; // Highlight wrong answer
        }
    });

    if (selectedAnswer === currentQ.correct) {
        feedback.innerText = "Correct!";
        feedback.className = "correct";
        correctAnswers++;
    } else {
        feedback.innerText = "Wrong answer!";
        feedback.className = "incorrect";
    }

    totalQuestions++;
    updateScore();
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        document.getElementById('question-box').innerHTML = "<h2>You've completed the quiz!</h2>";
        document.getElementById('next-btn').style.display = "none";
    }
}

function updateScore() {
    document.getElementById('score-tracker').innerText = `Score: ${correctAnswers} / ${totalQuestions}`;
}

// Load the questions when the page loads
window.onload = loadQuestions;

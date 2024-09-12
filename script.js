const questions = [
    {
        question: "What is the capital of France?",
        answers: ["Berlin", "Madrid", "Paris", "Rome"],
        correct: 2
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        answers: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "F. Scott Fitzgerald"],
        correct: 0
    },
    {
        question: "What is the powerhouse of the cell?",
        answers: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
        correct: 1
    }
];

let currentQuestion = 0;
let selectedAnswer = null;

function loadQuestion() {
    const questionBox = document.getElementById('question');
    const options = document.querySelectorAll('.option');
    const currentQ = questions[currentQuestion];
    
    questionBox.innerText = currentQ.question;
    options.forEach((option, index) => {
        option.innerText = currentQ.answers[index];
        option.style.backgroundColor = '#4CAF50'; // Reset button colors
    });
    
    document.getElementById('feedback').innerText = "";
    selectedAnswer = null;
}

function selectAnswer(index) {
    selectedAnswer = index;
    const currentQ = questions[currentQuestion];
    const feedback = document.getElementById('feedback');

    if (selectedAnswer === currentQ.correct) {
        feedback.innerText = "Correct!";
        feedback.style.color = "green";
    } else {
        feedback.innerText = "Wrong answer!";
        feedback.style.color = "red";
    }
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

// Load the first question when the page loads
window.onload = loadQuestion;

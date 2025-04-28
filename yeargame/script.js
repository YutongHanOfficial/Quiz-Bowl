let questions = [];
let score = 0;
let health = 100;
let currentQuestionIndex = 0;

fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        questions = shuffleQuestions(data);
    })
    .catch(error => console.error("Error loading questions:", error));

document.addEventListener("DOMContentLoaded", () => {
    const healthSlider = document.getElementById("startingHealth");
    const healthDisplay = document.getElementById("healthDisplay");

    healthSlider.addEventListener("input", () => {
        healthDisplay.innerText = `Health: ${healthSlider.value}`;
    });

    const yearSlider = document.getElementById("yearSlider");
    const yearInput = document.getElementById("yearInput");

    // Sync the range slider with the number input
    yearSlider.addEventListener("input", () => {
        yearInput.value = yearSlider.value;
    });

    // Clamp the number input between 1575 and 2025
    yearInput.addEventListener("input", () => {
        let value = Math.min(2025, Math.max(1575, parseInt(yearInput.value)));
        yearInput.value = value;
        yearSlider.value = value;
    });
});

function startGame() {
    health = parseInt(document.getElementById("startingHealth").value);
    document.getElementById("health").innerText = health;
    document.getElementById("setup-screen").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    loadQuestion();
}

function shuffleQuestions(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
    // Only load a question if health is above 0
    if (health <= 0) return;

    currentQuestionIndex = Math.floor(Math.random() * questions.length);
    document.getElementById("event").innerText = questions[currentQuestionIndex].event;
}

function submitGuess() {
    if (health <= 0) return; // Stop if the game is already over

    const guess = parseInt(document.getElementById("yearInput").value);
    const correctYear = questions[currentQuestionIndex].year;
    const errorMargin = Math.abs(correctYear - guess);

    document.getElementById("feedback").innerText = 
        `Correct Year: ${correctYear} | Error: ${errorMargin} years`;

    // Calculate new health & score
    health = Math.max(0, health - errorMargin);
    score++;

    // Update UI
    document.getElementById("score").innerText = score;
    document.getElementById("health").innerText = health;

    // If health hits 0, end the game immediately
    if (health <= 0) {
        endGame();
        return;
    }

    // **Disable or hide the slider, input, and submit button** 
    document.getElementById("yearSlider").disabled = true;
    document.getElementById("yearInput").disabled = true;
    document.querySelector("button[onclick='submitGuess()']").style.display = "none";

    // Show the Continue button
    document.getElementById("continueBtn").classList.remove("hidden");
}

function nextQuestion() {
    if (health <= 0) return; // Do nothing if game is over

    // Clear feedback and hide Continue button
    document.getElementById("feedback").innerText = "";
    document.getElementById("continueBtn").classList.add("hidden");

    // **Re-enable or show the slider, input, and submit button** 
    document.getElementById("yearSlider").disabled = false;
    document.getElementById("yearInput").disabled = false;
    document.querySelector("button[onclick='submitGuess()']").style.display = "inline-block";

    // Load the next question
    loadQuestion();
}

/**
 * endGame() is called as soon as health hits 0.
 * It hides the slider, input, and buttons, and shows a Restart button.
 */
function endGame() {
    // Show 'Game Over!' message
    document.getElementById("event").innerText = "Game Over!";
    document.getElementById("question").innerText = "You ran out of health!";
    document.getElementById("feedback").innerText = "";

    // Hide the slider, number input, and both buttons
    document.getElementById("yearSlider").style.display = "none";
    document.getElementById("yearInput").style.display = "none";
    document.querySelector("button[onclick='submitGuess()']").style.display = "none";
    document.getElementById("continueBtn").classList.add("hidden");

    // Create a new Restart button
    const restartBtn = document.createElement("button");
    restartBtn.innerText = "Restart";
    restartBtn.onclick = () => location.reload();
    restartBtn.style.marginTop = "20px";

    // Append it to the .game-content area
    document.querySelector(".game-content").appendChild(restartBtn);
}

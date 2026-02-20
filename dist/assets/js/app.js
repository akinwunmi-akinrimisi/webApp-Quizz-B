// Define your quiz questions and answers
const quizQuestions = [
  {
    question: "Which of the following statements is TRUE about EBS volumes?",
    choices: [
      "A. It is possible to use Autoscaling with EBS, rather than EC2.", 
      "B. It is possible to configure an Autoscaling Group to repair degraded EBS volumes, without the need to terminate the EC2 instances.", 
      "C. You are able to attach multiple EBS volumes to an EC2 instance.", 
      "D. You are able to attach multiple EC2 instances to an EBS Volume."
    ],
    correctAnswer: 2
  },
  {
    question: "How many Internet Gateways can you attach to your custom VPC?",
    choices: ["A. 3", "B. 5", "C. 4", "D. 1"],
    correctAnswer: 3
  },
  {
    question: "A company wants to self-manage a database environment. Which of the following should be adopted to fulfil this requirement?",
    choices: [
      "A. Use the DynamoDB service", 
      "B. Provision the database using the AWS RDS service", 
      "C. Use AWS Managed Databases", 
      "D. Create an EC2 Instance and install the database service accordingly"
    ],
    correctAnswer: 3
  },
  {
    question: "You have been asked to identify a service on AWS that is a durable object storage. Which of the services will this be?",
    choices: [
      "A. Elastic Compute Cloud (EC2)", 
      "B. Mobile Hub", 
      "C. Simple Storage Service (S3)",
      "D. Elastic File Service (EFS)"
    ],
    correctAnswer: 2
  },
  {
    question: "What data formats are policy documents written in?",
    choices: ["A. YAML", "B. JSON", "C. XML", "D. PDF"],
    correctAnswer: 1
  },
  {
    question: "You need to restrict access to an S3 Bucket. Which of the following will you use to do so?",
    choices: [
      "A. CloudFront",
      "B. Identity Federation with Active Directory",
      "C. S3 Bucket Policy",
      "D. CloudWatch"
    ],
    correctAnswer: 2
  },
  {
    question: "Which AWS service provides scalable NoSQL database capabilities?",
    choices: [
      "A. Amazon RDS",
      "B. Amazon DynamoDB",
      "C. Amazon Redshift",
      "D. Amazon ElastiCache"
    ],
    correctAnswer: 1
  }
];

// DOM elements
const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const feedbackElement = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const backButton = document.getElementById("back-btn");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const quizContainer = document.querySelector(".quiz-container");
const resultsScreen = document.getElementById("results-screen");

let currentQuestion = 0;
let score = 0;
let answered = false;

// Load the current question
function loadQuestion() {
  answered = false;
  const question = quizQuestions[currentQuestion];
  questionElement.textContent = question.question;

  choicesElement.innerHTML = "";
  question.choices.forEach((choice, index) => {
    const li = document.createElement("li");
    li.textContent = choice;
    li.setAttribute("data-index", index);
    li.addEventListener("click", () => confirmAnswer(index));
    choicesElement.appendChild(li);
  });

  feedbackElement.innerHTML = "";
  feedbackElement.classList.add("hidden");
  nextButton.disabled = true;
  backButton.disabled = currentQuestion === 0;

  // Update progress
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  progressFill.style.width = progress + "%";
  progressText.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
}

// Confirm the selected answer
function confirmAnswer(choiceIndex) {
  if (answered) return;
  
  const selectedChoice = choicesElement.children[choiceIndex];
  selectedChoice.classList.add("selected");

  // Disable all choices
  for (let i = 0; i < choicesElement.children.length; i++) {
    choicesElement.children[i].classList.add("disabled");
  }

  // Show confirmation feedback
  feedbackElement.innerHTML = `<span>Selected: ${selectedChoice.textContent}</span><button onclick="checkAnswer(${choiceIndex})" style="padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Check Answer</button>`;
  feedbackElement.classList.remove("hidden");
  answered = true;
}

// Check the selected answer
function checkAnswer(choiceIndex) {
  const question = quizQuestions[currentQuestion];
  const selectedChoice = choicesElement.children[choiceIndex];

  if (choiceIndex === question.correctAnswer) {
    feedbackElement.innerHTML = `<span>✓ Correct! Well done!</span>`;
    selectedChoice.classList.remove("selected");
    selectedChoice.classList.add("correct");
    score++;
  } else {
    feedbackElement.innerHTML = `<span>✗ Incorrect. The correct answer was: ${question.choices[question.correctAnswer]}</span>`;
    selectedChoice.classList.remove("selected");
    selectedChoice.classList.add("incorrect");
    choicesElement.children[question.correctAnswer].classList.add("correct");
  }

  nextButton.disabled = false;
}

// Move to the next question
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizQuestions.length) {
    loadQuestion();
  } else {
    showScore();
  }
}

// Move to the previous question
function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

// Display the final score
function showScore() {
  quizContainer.style.display = "none";
  resultsScreen.classList.remove("hidden");

  const percentage = (score / quizQuestions.length) * 100;
  document.getElementById("final-score").textContent = score;
  document.getElementById("total-questions").textContent = quizQuestions.length;
  document.getElementById("score-percentage").textContent = Math.round(percentage) + "%";
  document.getElementById("score-message").textContent = getComplimentaryComment();
}

// Generate a complimentary comment based on the score
function getComplimentaryComment() {
  const percentage = (score / quizQuestions.length) * 100;
  if (percentage === 100) {
    return "🎉 Congratulations! Perfect score! You're an AWS expert!";
  } else if (percentage >= 80) {
    return "🌟 Great job! You did really well! Keep up the excellent work!";
  } else if (percentage >= 60) {
    return "👍 Good effort! You're on the right track. Keep learning!";
  } else if (percentage >= 40) {
    return "💪 Not bad! Keep practicing to improve your AWS knowledge.";
  } else {
    return "📚 Keep learning! AWS has many services to explore. Try again!";
  }
}

// Event listeners
nextButton.addEventListener("click", nextQuestion);
backButton.addEventListener("click", previousQuestion);

// Start the quiz
loadQuestion();

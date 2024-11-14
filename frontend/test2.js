navigateToQuestion(0);

document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.option');
    const dropzones = document.querySelectorAll('.dropzone');
    let currentQuestionIndex = 0;
    let isSubmitted = false;

    options.forEach(option => {
        option.addEventListener('dragstart', handleDragStart);
        option.addEventListener('dragend', handleDragEnd);
    });

    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', handleDragOver);
        dropzone.addEventListener('drop', handleDrop);
    });

    document.getElementById('quizForm').addEventListener('submit', function(event) {
        event.preventDefault();
        checkAnswers();
    });

    updateNavigation();
    updateButtons();
});

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.value);
    event.target.classList.add('dragging');
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    event.target.textContent = data;
    event.target.dataset.value = data;
    document.getElementById(`nav-${currentQuestionIndex + 1}`).classList.add('answered');
}

function checkAnswers() {
    const dropzones = document.querySelectorAll('.dropzone');
    let score = 0;

    dropzones.forEach((dropzone, index) => {
        const answer = dropzone.dataset.answer;
        const value = dropzone.dataset.value;

        const navItem = document.getElementById(`nav-${index + 1}`);
        if (value) {
            if (answer === value) {
                dropzone.classList.add('correct');
                navItem.classList.add('true');
                score++;
            } else {
                dropzone.classList.add('incorrect');
                navItem.classList.add('wrong');
            }
        } else {
            // Mark unanswered questions as wrong
            dropzone.classList.add('incorrect');
            navItem.classList.add('wrong');
        }

        // Highlight correct option
        const correctOption = document.querySelector(`.option[data-value="${answer}"]`);
        if (correctOption) {
            correctOption.style.backgroundColor = 'lightgreen';
        }
    });

    const result = document.getElementById('result');
    result.textContent = `Your score is: ${score} out of ${dropzones.length}`;
    isSubmitted = true;
    updateButtons();
}

function navigateToQuestion(index) {
    const questions = document.querySelectorAll('.question-container');
    questions.forEach((question, i) => {
        question.style.display = i === index ? 'block' : 'none';
    });
    currentQuestionIndex = index;
    updateNavigation();
    updateButtons();
}

function navigateToNextQuestion() {
    const questions = document.querySelectorAll('.question-container');
    if (currentQuestionIndex < questions.length - 1) {
        navigateToQuestion(currentQuestionIndex + 1);
    }
}

function navigateToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        navigateToQuestion(currentQuestionIndex - 1);
    }
}

function updateNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((navItem, index) => {
        navItem.classList.toggle('current', index === currentQuestionIndex);
    });
}

function updateButtons() {
    const questions = document.querySelectorAll('.question-container');
    document.getElementById('prev-btn').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
    document.getElementById('next-btn').style.display = currentQuestionIndex < questions.length - 1 ? 'inline-block' : 'none';
    document.getElementById('submit-btn').style.display = currentQuestionIndex === questions.length - 1 ? 'inline-block' : 'none';
}
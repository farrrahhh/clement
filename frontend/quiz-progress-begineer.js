document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  const quizId = localStorage.getItem("completed_quiz_id1");
  // const completedQuizId = localStorage.getItem('completed_quiz_id');
  if (!username) {
    window.location.href = "login.html"; // Redirect to login if not logged in
    return;
  }

  try {
    const response = await fetch(`https://clement-website-ruangbahasa123.vercel.app/quiz-progress?username=${username}&quiz_id=${quizId}`);
    const result = await response.json();

    const progressStatus = document.getElementById("progress-status");
    const score = document.getElementById("score");
    const startQuizButton = document.getElementById("start-quiz");
    const continueQuizButton = document.getElementById("continue-quiz");
    const tryAgainButton = document.getElementById("try-again");

    console.log("Quiz progress result:", result); // Add logging

    if (result.status === "not_started") {
      progressStatus.textContent = "Kamu belum pernah mengerjakan quiz.";
      startQuizButton.style.display = "block";
    } else if (result.total_score === null) {
      progressStatus.textContent = "Kamu sedang mengerjakan quiz.";
      continueQuizButton.style.display = "block";
    } else if (result.total_score !== null) {
      progressStatus.textContent = "Kamu sudah pernah mengerjakan quiz.";
      score.textContent = `Nilai terakhir kamu: ${result.total_score}`;
      score.style.display = "block";
      tryAgainButton.style.display = "block";
    }

    console.log("Start Quiz button:", startQuizButton); // Add logging

    startQuizButton.addEventListener("click", () => {
      console.log("Start Quiz button clicked"); // Add logging
      window.location.href = "begineer.html";
    });

    continueQuizButton.addEventListener("click", () => {
      console.log("Continue Quiz button clicked"); // Add logging
      window.location.href = "begineer.html";
    });

    tryAgainButton.addEventListener("click", async () => {
      console.log("Try Again button clicked"); // Add logging
      await fetch(`https://clement-website-ruangbahasa123.vercel.app/reset-quiz?username=${username}&quiz_id=${quizId}`, { method: "POST" });
      window.location.href = "begineer.html";
    });
  } catch (error) {
    console.error("Error fetching quiz progress:", error);
  }
});

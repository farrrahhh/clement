// Allow the drop by preventing the default behavior
function allowDrop(ev) {
  ev.preventDefault();
}

// Set the data to be transferred during the drag operation
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

// Handle the drop event and append the dragged element to the drop target
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var draggedElement = document.getElementById(data);
  if (ev.target.id === "div1") {
      ev.target.appendChild(draggedElement);
      // Change the image appearance after being dragged
      draggedElement.style.width = "21vw";
      draggedElement.style.height = "28vw";
      draggedElement.style.boxShadow = "0 0 25px solid #082387";
      draggedElement.style.border = "0.6rem solid #082387";
      // Enable the button
      document.querySelector('.btn2').classList.remove('disabled');
  }
}

// Function to show error message if button is clicked before dragging the image
function showError() {
  var errorMessage = document.querySelector('.error-message');
  errorMessage.style.display = 'block';
  errorMessage.classList.add('show');
  setTimeout(function() {
      errorMessage.classList.remove('show');
      errorMessage.style.display = 'none';
  }, 3000);
}

// Add event listener to the button
document.addEventListener('DOMContentLoaded', function() {
  var button = document.querySelector('.btn2');
  button.classList.add('disabled'); // Add disabled class initially
  button.addEventListener('click', function(event) {
      if (button.classList.contains('disabled')) {
          event.preventDefault(); // Prevent the default action
          showError(); // Show error message
      }
  });
});
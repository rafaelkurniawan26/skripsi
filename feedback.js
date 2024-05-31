document.getElementById('feedbackBtn').addEventListener('click', function() {
    var url = document.getElementById('urlInput').value;
    var feedback = document.querySelector('input[name="feedback"]:checked').value;

    fetch('http://127.0.0.1:5000/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: url,
            feedback: feedback
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Display a feedback saved message
            document.getElementById('feedbackSaved').textContent = 'Feedback saved successfully!';
            window.location.href = 'third_page.html';
        } else {
            console.log(data);
        }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
document.addEventListener('DOMContentLoaded', () => {

    // Handle translation button click
    document.getElementById('translateBtn').addEventListener('click', async () => {
        const fileInput = document.getElementById('fileInput');
        const language = document.getElementById('languageSelect').value;
        const format = document.querySelector('input[name="fileFormat"]:checked').value;

        if (fileInput.files.length === 0) {
            alert('Please upload a document first!');
            return;
        }

        const formData = new FormData();
        formData.append('document', fileInput.files[0]);
        formData.append('language', language);
        formData.append('action', 'translate');

        try {
            // Show loading message or spinner
            document.getElementById('outputText').textContent = 'Processing... Please wait.';

            // Call the backend to process the document
            const response = await fetch('http://localhost:3000/process-document', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            // Display the preview in the UI
            document.getElementById('outputText').textContent = data.preview;
            document.getElementById('downloadBtn').style.display = 'block';

            // Store the content and format for download
            window.generatedContent = data.preview;
            window.generatedFormat = format;

        } catch (error) {
            console.error('Error:', error);
            document.getElementById('output').textContent = 'Error during translation or summarization.';
        }
    });

    // Handle "Summarize Document" button click
    document.getElementById('summarizeDocBtn').addEventListener('click', async () => {
        const fileInput = document.getElementById('fileInput');

        if (fileInput.files.length === 0) {
            alert('Please upload a document first!');
            return;
        }

        const formData = new FormData();
        formData.append('document', fileInput.files[0]);
        formData.append('action', 'summarize');

        try {
            // Show loading message or spinner
            document.getElementById('outputText').textContent = 'Processing... Please wait.';

            // Call the backend to summarize the document
            const response = await fetch('http://localhost:3000/process-document', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            // Display the summary preview in the UI
            document.getElementById('outputText').textContent = data.preview;
            document.getElementById('downloadBtn').style.display = 'block';

            // Store the content and format for download
            window.generatedContent = data.preview;
            window.generatedFormat = "word";

        } catch (error) {
            console.error('Error:', error);
            document.getElementById('output').textContent = 'Error during document summarization.';
        }
    });

    // Handle "Summarize Reviews" button click
    document.getElementById('summarizeReviewBtn').addEventListener('click', async () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            chrome.tabs.sendMessage(currentTab.id, { action: 'getReviews' }, async (response) => {
                if (response.reviews) {
                    // Send reviews to the backend to summarize
                    const summary = await getReviewSummary(response.reviews);
                    document.getElementById('summaryText').textContent = summary;
                    document.getElementById('reviewSummary').style.display = 'block';
                    document.getElementById('downloadReviewBtn').style.display = 'block';
                } else {
                    document.getElementById('summaryText').textContent = 'No reviews found on this page!';
                    document.getElementById('reviewSummary').style.display = 'block';
                    document.getElementById('downloadReviewBtn').style.display = 'none';
                }
            });
        });
    });

    // Handle "Rewrite" button click
    document.getElementById('rewriteBtn').addEventListener('click', async () => {
        const fileInput = document.getElementById('fileInput');

        if (fileInput.files.length === 0) {
            alert('Please upload a document first!');
            return;
        }

        const formData = new FormData();
        formData.append('document', fileInput.files[0]);
        formData.append('action', 'rewrite');

        try {
            // Show loading message or spinner
            document.getElementById('outputText').textContent = 'Processing... Please wait.';

            // Call the backend to rewrite the document
            const response = await fetch('http://localhost:3000/process-document', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            // Display the rewritten text in the UI
            document.getElementById('outputText').textContent = data.preview;
            document.getElementById('downloadBtn').style.display = 'block';

            // Store the content and format for download
            window.generatedContent = data.preview;
            window.generatedFormat = "word";

        } catch (error) {
            console.error('Error:', error);
            document.getElementById('output').textContent = 'Error during text rewriting.';
        }
    });

    // Function to send reviews to the backend for summarization
    async function getReviewSummary(reviews) {
        const response = await fetch('http://localhost:3000/generate-summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reviews }),
        });
        const data = await response.json();
        return data.summary;
    }

    // Handle "Download" button click for document
    document.getElementById('downloadBtn').addEventListener('click', async () => {
        if (!window.generatedContent) {
            alert('No content to download.');
            return;
        }

        const downloadData = {
            content: window.generatedContent,
            format: window.generatedFormat,
        };

        try {
            const response = await fetch('http://localhost:3000/download-document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(downloadData),
            });

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `document.${window.generatedFormat}`;
            link.click();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Handle "Download Review Summary" button click
    document.getElementById('downloadReviewBtn').addEventListener('click', async () => {
        const summaryData = {
            content: document.getElementById('summaryText').textContent,
            format: "word",
        };

        try {
            const response = await fetch('http://localhost:3000/download-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(summaryData),
            });

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `review-summary.${summaryData.format}`;
            link.click();
        } catch (error) {
            console.error('Error downloading summary:', error);
        }
    });

});

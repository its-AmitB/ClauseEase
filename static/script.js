document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-upload');
    const fileNameSpan = document.getElementById('file-name');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loader = document.getElementById('loader');
    const resultsSection = document.getElementById('results-section');

    // 1. Update file name display on selection
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileNameSpan.textContent = fileInput.files[0].name;
            fileNameSpan.style.fontStyle = 'normal';
        } else {
            fileNameSpan.textContent = 'No file selected';
            fileNameSpan.style.fontStyle = 'italic';
        }
    });

    // 2. Show loader on form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', () => {
            analyzeBtn.disabled = true;
            analyzeBtn.textContent = 'Analyzing...';
            loader.style.display = 'block';
            if (resultsSection) {
                resultsSection.style.display = 'none';
            }
        });
    }

    // 3. Accordion for collapsible clauses
    const clauseHeaders = document.querySelectorAll('.clause-header');
    clauseHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const card = header.parentElement;
            const body = header.nextElementSibling;
            
            card.classList.toggle('active');

            if (body.style.maxHeight) {
                body.style.maxHeight = null;
                body.style.marginTop = null;
            } else {
                body.style.maxHeight = body.scrollHeight + 'px';
                body.style.marginTop = '20px';
            }
        });
    });

    // 4. Copy to clipboard functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents the accordion from closing
            const textToCopy = button.dataset.clipboardText;

            // Use the modern clipboard API
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy text. Please try again.');
            });
        });
    });
});

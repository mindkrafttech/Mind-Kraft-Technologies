document.addEventListener('DOMContentLoaded', function () {
    const brochureForm = document.getElementById('brochureForm');

    if (brochureForm) {
        brochureForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = document.getElementById('brochureSubmitBtn');
            const originalBtnText = submitBtn.innerHTML;

            // Change button state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            // Collect data
            const formData = new FormData(brochureForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                mobile: formData.get('mobile'),
                timestamp: new Date().toISOString()
            };

            // Google Apps Script URL (Placeholder - User needs to replace this)
            // Instructions: Create a Google Apps Script web app and paste the URL here.
            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxlqOJ-06hDr8AF5XmAjnCNNDFQ-ic8Cl_dKU_imNQqmGaacz04R-2j71gSil3GTCgRMA/exec';

            // For now, we'll simulate a successful submission since we don't have the real URL
            // In production, uncomment the fetch block below and remove the setTimeout simulation

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Apps Script
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', // Changed to text/plain to avoid CORS preflight issues
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    // With no-cors, we can't check response.ok. We assume success if it didn't throw.
                    triggerDownload();
                    showSuccessMessage();
                    brochureForm.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Something went wrong. Please try again.');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    function triggerDownload() {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = 'assets/MindKraft_Brochure.pdf'; // Path to the PDF
        link.download = 'MindKraft_Brochure.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function showSuccessMessage() {
        // You can replace this with a nicer modal or toast
        alert("Thank you! Your brochure is downloading.");
    }
});

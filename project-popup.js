document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('projectModal');
    const openBtn = document.getElementById('getProjectBtn');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('projectForm');
    const jitRadios = document.getElementsByName('isJitStudent');
    const jitUploadSection = document.getElementById('jitUploadSection');
    const fileInput = document.getElementById('idCardFile');
    const fileLabel = document.getElementById('fileLabel');
    const successMessage = document.getElementById('successMessage');
    const formContent = document.getElementById('formContent');
    const jitSuccessMsg = document.getElementById('jitSuccessMsg');
    const submitBtn = document.getElementById('submitBtn');

    // --- GOOGLE APPS SCRIPT URL ---
    // ⚠️ REPLACE THIS WITH YOUR DEPLOYED WEB APP URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwj267A84vS89p-KVLMaEgJLn8UPHwZtEBaYV2yjcyW3GDSYQKJSmiIoYYxyjXTHlSSfQ/exec';

    // Open Modal
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    // Close Modal
    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Toggle JIT Upload Section
    jitRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Yes') {
                jitUploadSection.style.display = 'block';
                fileInput.required = true;
            } else {
                jitUploadSection.style.display = 'none';
                fileInput.required = false;
                fileInput.value = ''; // Clear file
                fileLabel.textContent = 'Click to upload ID Card / Bonafide (Image or PDF)';
            }
        });
    });

    // File Upload Preview Text
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileLabel.textContent = `Selected: ${e.target.files[0].name}`;
        }
    });

    // Convert File to Base64
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data:type/ext;base64,
            reader.onerror = error => reject(error);
        });
    };

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Loading State
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Handle File Upload
            if (data.isJitStudent === 'Yes' && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                data.fileData = await getBase64(file);
                data.fileName = file.name;
                data.mimeType = file.type;
            }

            // Send to Google Apps Script
            // We use no-cors mode because GAS doesn't support CORS preflight perfectly for simple POSTs sometimes,
            // BUT for receiving JSON response we need standard fetch. 
            // Standard method for GAS forms:
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data)
            });

            // Note: If using 'no-cors', we can't read the response. 
            // Assuming success if no network error for this simple implementation.
            // For robust production, use a proxy or JSONP, but standard POST usually works if GAS is set to "Anyone".

            // Show Success
            formContent.style.display = 'none';
            successMessage.style.display = 'block';

            if (data.isJitStudent === 'Yes') {
                jitSuccessMsg.style.display = 'block';
            } else {
                jitSuccessMsg.style.display = 'none';
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again or contact us on WhatsApp.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
});

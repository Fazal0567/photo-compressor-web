// DOM Elements
const uploadInput = document.getElementById('upload');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('quality-value');
const compressBtn = document.getElementById('compress-btn');
const originalPreview = document.getElementById('original-preview');
const compressedPreview = document.getElementById('compressed-preview');
const originalSizeText = document.getElementById('original-size');
const compressedSizeText = document.getElementById('compressed-size');
const downloadBtn = document.getElementById('download-btn');

let originalImage = null;

// Update quality value display
qualitySlider.addEventListener('input', () => {
    qualityValue.textContent = qualitySlider.value;
});

// Handle image upload
uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    originalImage = file;
    originalPreview.src = URL.createObjectURL(file);
    originalSizeText.textContent = `Size: ${(file.size / 1024).toFixed(2)} KB`;

    // Reset compressed preview
    compressedPreview.src = '';
    compressedSizeText.textContent = 'Size: 0 KB';
    downloadBtn.style.display = 'none';
});

// Compress image
compressBtn.addEventListener('click', () => {
    if (!originalImage) {
        alert('Please upload an image first!');
        return;
    }

    const quality = parseInt(qualitySlider.value) / 100;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate new dimensions (optional: reduce resolution)
            const maxWidth = 1200;
            const maxHeight = 1200;
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to Blob (compressed)
            canvas.toBlob((blob) => {
                const compressedUrl = URL.createObjectURL(blob);
                compressedPreview.src = compressedUrl;
                compressedSizeText.textContent = `Size: ${(blob.size / 1024).toFixed(2)} KB`;

                // Set download link
                downloadBtn.href = compressedUrl;
                downloadBtn.style.display = 'inline-block';
            }, 'image/jpeg', quality);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(originalImage);
});
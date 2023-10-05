window.addEventListener('DOMContentLoaded', function() {
    const checkboxes = Array.from(document.getElementsByName('size'));
    checkboxes.forEach((checkbox) => checkbox.checked = true);
});

function resizeImage() {
    const fileInput = document.getElementById('fileInput');
    const sizes = Array.from(document.getElementsByName('size'))
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => parseInt(checkbox.value));
    const file = fileInput.files[0];

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function() {
        const zip = new JSZip();
        const promises = [];
        for (const size of sizes) {
            const promise = new Promise((resolve, reject) => {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    zip.file(`icon-${size}px.png`, blob);
                    resolve(url);
                });
            });
            promises.push(promise);
        }
        Promise.all(promises).then((urls) => {
            const result = document.getElementById('result');
            result.innerHTML = '';
            for (const url of urls) {
                const link = document.createElement('a');
                link.href = url;
                link.download = 'resized-image.png';
                link.innerHTML = `<img src="${url}" alt="Resized Image">`;
                result.appendChild(link);
            }
            zip.generateAsync({ type: 'blob' }).then((blob) => {
                const downloadBtn = document.getElementById('downloadBtn');
                const url = URL.createObjectURL(blob);
                downloadBtn.href = url;
                downloadBtn.download = 'resized-images.zip';
                downloadBtn.style.display = 'block';
            });
        });
    };
}
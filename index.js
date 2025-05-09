const imageInput = document.getElementById('imageInput');
const convertBtn = document.getElementById('convertBtn');
const status = document.getElementById('status');
const downloadLink = document.getElementById('downloadLink');
const { jsPDF } = window.jspdf;

// Update status saat file dipilih
imageInput.addEventListener('change', () => {
    convertBtn.disabled = !imageInput.files.length;
    status.textContent = imageInput.files.length ? `Selected ${imageInput.files.length} file(s)` : '';
    downloadLink.classList.add('hidden');
});

// Proses konversi saat tombol diklik
convertBtn.addEventListener('click', async () => {
    const files = imageInput.files;
    if (!files.length) return;

    status.textContent = 'Converting...';
    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';

    try {
        // Validasi file
        for (const file of files) {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                status.textContent = `Error: ${file.name} bukan JPG atau PNG yang valid`;
                convertBtn.disabled = false;
                convertBtn.textContent = 'Convert to PDF';
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                status.textContent = `Error: ${file.name} melebihi batas 10MB`;
                convertBtn.disabled = false;
                convertBtn.textContent = 'Convert to PDF';
                return;
            }
        }

        const pdf = new jsPDF();
        let firstImage = true;

        // Proses setiap gambar
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            status.textContent = `Processing image ${i + 1} of ${files.length}...`;

            const img = new Image();
            const url = URL.createObjectURL(file);
            img.src = url;

            await new Promise((resolve) => (img.onload = resolve));

            const imgWidth = img.width;
            const imgHeight = img.height;

            // Skala ke ukuran A4 (210x297 mm)
            const pdfWidth = 210;
            const pdfHeight = (imgHeight * pdfWidth) / imgWidth;
            const format = [pdfWidth, pdfHeight];
            const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';

            if (!firstImage) {
                pdf.addPage(format, orientation);
            }

            pdf.setPage(firstImage ? 1 : pdf.internal.getNumberOfPages());
            pdf.addImage(img, file.type === 'image/png' ? 'PNG' : 'JPEG', 0, 0, pdfWidth, pdfHeight);
            firstImage = false;

            URL.revokeObjectURL(url);
        }

        // Simpan PDF dan buat link download
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        downloadLink.href = pdfUrl;
        downloadLink.classList.remove('hidden');
        downloadLink.click();
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);

        status.textContent = 'PDF berhasil dibuat dan diunduh!';
    } catch (error) {
        status.textContent = `Error: ${error.message || 'Gagal mengonversi gambar ke PDF'}`;
        console.error(error);
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert to PDF';
    }
});

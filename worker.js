importScripts('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

const { jsPDF } = jspdf;

self.onmessage = async (e) => {
    try {
        const files = e.data; // Array of { buffer, text, type, name, size }
        if (!files || !Array.isArray(files) || files.length === 0) {
            throw new Error('No files received');
        }

        // Validate files
        for (const file of files) {
            if (!['image/jpeg', 'image/png', 'text/plain'].includes(file.type)) {
                throw new Error(`${file.name} is not a valid JPG, PNG, or TXT file`);
            }
            if (file.size > 10 * 1024 * 1024) {
                throw new Error(`${file.name} exceeds 10MB limit`);
            }
        }

        const pdf = new jsPDF();
        let firstPage = true;

        // Process each file
        for (let i = 0; i < files.length; i++) {
            const { buffer, text, type, name } = files[i];

            if (type === 'text/plain') {
                // Add text to PDF
                if (!firstPage) {
                    pdf.addPage();
                }
                pdf.setFontSize(12);
                pdf.text(text, 10, 10, { maxWidth: 190 });
                firstPage = false;
            } else {
                // Process images (JPG/PNG)
                const img = new Image();
                const blob = new Blob([buffer], { type });
                const url = URL.createObjectURL(blob);
                img.src = url;

                try {
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = () => reject(new Error(`Failed to load image ${name}`));
                    });

                    const imgWidth = img.width;
                    const imgHeight = img.height;
                    const pdfWidth = 210;
                    const pdfHeight = (imgHeight * pdfWidth) / imgWidth;
                    const format = [pdfWidth, pdfHeight];
                    const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';

                    if (!firstPage) {
                        pdf.addPage(format, orientation);
                    }

                    pdf.setPage(firstPage ? 1 : pdf.internal.getNumberOfPages());
                    pdf.addImage(img, type === 'image/png' ? 'PNG' : 'JPEG', 0, 0, pdfWidth, pdfHeight);
                    firstPage = false;
                } finally {
                    URL.revokeObjectURL(url);
                }
            }
        }

        // Save PDF as ArrayBuffer
        const pdfArrayBuffer = pdf.output('arraybuffer');
        self.postMessage({ success: true, data: pdfArrayBuffer }, [pdfArrayBuffer]);
    } catch (error) {
        self.postMessage({ success: false, error: error.message || 'Failed to convert document to PDF' });
    }
};
const OCRCore = {
    async extract(file, lang, onProgress) {
        const worker = await Tesseract.createWorker({
            logger: m => { if (m.status === 'recognizing text') onProgress(m.progress); }
        });
        await worker.loadLanguage(lang);
        await worker.initialize(lang);
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();
        return text;
    },
    refine(text) {
        return text.replace(/\s+/g, ' ').replace(/([.?!])([A-Z])/g, '$1 $2').trim();
    }
};
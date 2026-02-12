document.addEventListener('DOMContentLoaded', () => {
    initAppEngine();

    const dom = {
        dropZone: document.getElementById('drop-zone'),
        fileInput: document.getElementById('file-input'),
        result: document.getElementById('result-text'),
        progress: document.getElementById('progress-bar'),
        percent: document.getElementById('percent-text'),
        processCard: document.getElementById('process-card'),
        preview: document.getElementById('img-preview'),
        modal: document.getElementById('modal-license'),
        keywords: document.getElementById('keyword-container'),
        analysisPanel: document.getElementById('analysis-panel')
    };

    function sendWAMessage(planName) {
        const waNumber = "6285800234396";
        let text = "";

        if (planName === "PRO") {
            text = "Halo Vozza Digital, saya tertarik aktivasi paket Pro untuk fitur Refine dan analisis cerdasnya. Mohon info langkah selanjutnya ya. Terima kasih.";
        } else if (planName === "BUSINESS") {
            text = "Halo Vozza Digital, saya ingin menggunakan paket Business supaya bisa akses semua fitur termasuk mode puisi. Mohon panduan aktivasinya ya. Terima kasih.";
        } else {
            text = "Halo Vozza Digital, saya tertarik menggunakan versi penuh dari aplikasi ini agar lebih produktif. Mohon informasinya untuk aktivasi paket yang tersedia. Terima kasih.";
        }

        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, "_blank");
    }

    dom.dropZone.onclick = () => dom.fileInput.click();

    dom.fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        dom.preview.src = URL.createObjectURL(file);
        dom.preview.classList.remove('hidden');
        document.getElementById('preview-placeholder').classList.add('hidden');
        dom.processCard.classList.remove('hidden');

        try {
            const lang = document.getElementById('lang-select').value;
            const text = await OCRCore.extract(file, lang, (p) => {
                const v = Math.round(p * 100);
                dom.progress.style.width = v + '%';
                if(dom.percent) dom.percent.innerText = v + '%';
            });

            dom.result.value = text;
            if (currentPlan.features.includes('analysis')) {
                const kws = AnalysisEngine.analyze(text);
                dom.analysisPanel.classList.remove('hidden');
                dom.keywords.innerHTML = kws.map(k => `<span class="tag">#${k}</span>`).join('');
            }
            document.getElementById('char-count').innerText = `${text.length} Karakter`;
        } catch (err) { alert("Ada kendala membaca gambar, silakan coba lagi ya."); } 
        finally { dom.processCard.classList.add('hidden'); }
    };

    document.getElementById('btn-refine').onclick = () => {
        if (!currentPlan.features.includes('refine')) {
            sendWAMessage("PRO");
            dom.modal.classList.remove('hidden');
        } else {
            dom.result.value = OCRCore.refine(dom.result.value);
        }
    };

    document.getElementById('btn-poetry').onclick = () => {
        if (!currentPlan.features.includes('poetry')) {
            sendWAMessage("BUSINESS");
            dom.modal.classList.remove('hidden');
        } else {
            dom.result.value = AnalysisEngine.poetry(dom.result.value);
        }
    };

    document.getElementById('btn-upgrade').onclick = () => {
        sendWAMessage("GENERAL");
        dom.modal.classList.remove('hidden');
    };

    document.getElementById('btn-activate-submit').onclick = () => {
        const key = document.getElementById('license-input').value;
        if (!LicenseSystem.activate(key)) alert("Maaf, sepertinya kode lisensinya kurang tepat. Silakan cek kembali ya.");
    };

    document.getElementById('btn-close-modal').onclick = () => dom.modal.classList.add('hidden');
    
    document.getElementById('btn-copy').onclick = () => {
        navigator.clipboard.writeText(dom.result.value);
        alert("Teks berhasil disalin!");
    };

    document.getElementById('btn-theme-toggle').onclick = () => {
        const t = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', t === 'dark' ? 'light' : 'dark');
    };
});
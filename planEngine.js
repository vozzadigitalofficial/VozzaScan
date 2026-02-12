const PLANS = {
    LITE: { id: 'lite', name: 'LITE', features: ['ocr'] },
    PRO: { id: 'pro', name: 'PRO', features: ['ocr', 'refine', 'analysis'] },
    BIZ: { id: 'business', name: 'BUSINESS', features: ['ocr', 'refine', 'analysis', 'poetry'] }
};

let currentPlan = PLANS.LITE;

function initAppEngine() {
    const saved = localStorage.getItem('vozza_p_id');
    if (saved && PLANS[saved.toUpperCase()]) {
        currentPlan = PLANS[saved.toUpperCase()];
    }
    syncUI();
}

function syncUI() {
    const badge = document.getElementById('plan-badge');
    badge.textContent = currentPlan.name;
    
    document.querySelectorAll('.premium-feat').forEach(btn => {
        const feat = btn.id === 'btn-refine' ? 'refine' : 'poetry';
        btn.style.opacity = currentPlan.features.includes(feat) ? '1' : '0.3';
        btn.style.cursor = currentPlan.features.includes(feat) ? 'pointer' : 'not-allowed';
    });

    if (currentPlan.id !== 'lite') {
        document.getElementById('btn-upgrade').classList.add('hidden');
    }
}
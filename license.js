const LicenseSystem = {
    validate(key) {
        const k = key.trim().toUpperCase();
        // Validasi Ketat: Membedakan BIZ dan PRO
        if (/^VOZZA-BIZ-[A-Z0-9]{4}-2026$/.test(k)) return PLANS.BIZ;
        if (/^VOZZA-PRO-[A-Z0-9]{4}-2026$/.test(k)) return PLANS.PRO;
        return null;
    },
    activate(key) {
        const plan = this.validate(key);
        if (plan) {
            localStorage.setItem('vozza_p_id', plan.id);
            localStorage.setItem('vozza_p_key', btoa(key)); 
            location.reload(); 
            return true;
        }
        return false;
    }
};
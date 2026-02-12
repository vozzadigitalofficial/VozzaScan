const AnalysisEngine = {
    analyze(text) {
        if (!text || text.length < 10) return [];
        const common = ['yang', 'untuk', 'dengan', 'adalah', 'dalam', 'dari', 'this', 'that'];
        const words = text.toLowerCase().match(/\w+/g)
            .filter(w => w.length > 5 && !common.includes(w));
        
        const counts = {};
        words.forEach(w => counts[w] = (counts[w] || 0) + 1);
        
        return Object.entries(counts)
            .sort((a,b) => b[1] - a[1])
            .slice(0, 5).map(e => e[0]);
    },
    poetry(text) {
        return text.split(/[.?!]/).map(s => s.trim()).filter(s => s).join('\n');
    }
};
const BOUNCE_OUT_CONFIG = Object.freeze({ chance: 0.003, crowdedFieldIncrease: 0.0015, simulatedDartsPerLeg: 18 });
const BOUNCE_OUT_TEXT = {
    pl: { title: '↘ Bounce-out', intro: 'Rzadkie odbicia i wypadnięcia lotek: 0 punktów, bez powtórki rzutu.', label: 'Bounce-out w meczach', enabled: 'Włączone (domyślne)', disabled: 'Wyłączone', rule: 'Bazowo 0,3% na punktowaną lotkę. Ciasne grupowanie nieco zwiększa ryzyko. Te same zasady dla gracza i AI; sprzęt nie ma wpływu.', log: 'Bounce-out — 0 pkt', stat: 'Bounce-outy' },
    en: { title: '↘ Bounce-out', intro: 'Rare darts bouncing off or falling out: zero points, no rethrow.', label: 'Bounce-outs in matches', enabled: 'Enabled (default)', disabled: 'Disabled', rule: 'Base chance: 0.3% per scoring dart. Tight grouping slightly increases the risk. The same rules apply to you and AI; equipment has no effect.', log: 'Bounce-out — 0 points', stat: 'Bounce-outs' },
    de: { title: '↘ Bounce-out', intro: 'Seltene abprallende oder herausfallende Darts: null Punkte, kein erneuter Wurf.', label: 'Bounce-outs in Matches', enabled: 'Aktiviert (Standard)', disabled: 'Deaktiviert', rule: 'Grundchance: 0,3% pro punktendem Dart. Enge Gruppierung erhöht das Risiko leicht. Gleiche Regeln für dich und KI; Ausrüstung hat keinen Einfluss.', log: 'Bounce-out — 0 Punkte', stat: 'Bounce-outs' },
    nl: { title: '↘ Bounce-out', intro: 'Zeldzame darts die terugkaatsen of uitvallen: nul punten, geen nieuwe worp.', label: 'Bounce-outs in wedstrijden', enabled: 'Ingeschakeld (standaard)', disabled: 'Uitgeschakeld', rule: 'Basiskans: 0,3% per scorende dart. Dichte groepering verhoogt het risico iets. Dezelfde regels voor jou en AI; materiaal heeft geen invloed.', log: 'Bounce-out — 0 punten', stat: 'Bounce-outs' }
};

function getBounceOutText() {
    const language = typeof currentLang === 'string' ? currentLang : 'en';
    const text = BOUNCE_OUT_TEXT[language] || BOUNCE_OUT_TEXT.en;
    if (typeof dartPhysics === 'undefined') return text;
    const collision = {
        pl: ' Kontakt z wbitą lotką może zmienić kąt i pole trafienia; mocne zderzenie dodaje ryzyko bounce-outu. Wyłączenie odbić usuwa też kolizyjne bounce-outy.',
        en: ' Contact with a landed dart can change the angle and scoring field; a hard collision adds bounce-out risk. Disabling bounce-outs also disables collision bounce-outs.',
        de: ' Kontakt mit einem steckenden Dart kann Winkel und Trefferfeld ändern; ein harter Kontakt erhöht das Bounce-out-Risiko. Deaktivieren verhindert auch Kollisions-Bounce-outs.',
        nl: ' Contact met een geraakte dart kan de hoek en het scorevak veranderen; een harde botsing verhoogt de kans op een bounce-out. Uitschakelen voorkomt ook bounce-outs door botsingen.'
    };
    return { ...text, rule: text.rule + (collision[language] || collision.en) };
}

function initializeBounceOutSettings(candidate = typeof player === 'object' ? player : null, reset = false) {
    if (!candidate) return false;
    candidate.bounceOutEnabled = reset || typeof candidate.bounceOutEnabled !== 'boolean' ? true : candidate.bounceOutEnabled;
    return candidate.bounceOutEnabled;
}

function areBounceOutsEnabled() {
    return typeof player === 'object' && player?.bounceOutEnabled !== false;
}

function changeBounceOutSetting(value) {
    if (typeof player !== 'object' || !player?.name || !['enabled', 'disabled'].includes(value)
        || (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy())) return false;
    player.bounceOutEnabled = value === 'enabled';
    refreshBounceOutSettingsUI();
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function refreshBounceOutSettingsUI() {
    if (typeof document === 'undefined') return;
    const text = getBounceOutText();
    ['title', 'intro', 'label', 'enabled', 'disabled', 'rule'].forEach(key => {
        const element = document.getElementById(`bounce-out-${key}`);
        if (element) element.textContent = text[key];
    });
    const select = document.getElementById('hub-bounce-out-mode');
    if (select) select.value = areBounceOutsEnabled() ? 'enabled' : 'disabled';
    const stat = document.getElementById('stat-bounce-out-label');
    if (stat) stat.textContent = text.stat;
}

function getBounceOutChance(result, visit) {
    if (!areBounceOutsEnabled() || !(result?.sector * result?.mult > 0)) return 0;
    const tightField = result.mult > 1 || result.sector === 25;
    const landed = Array.isArray(visit?.bounceOutLandedDarts) ? visit.bounceOutLandedDarts : [];
    const crowded = tightField ? landed.filter(dart => dart.sector === result.sector && dart.mult === result.mult).length : 0;
    return BOUNCE_OUT_CONFIG.chance + Math.min(2, crowded) * BOUNCE_OUT_CONFIG.crowdedFieldIncrease;
}

function applyBounceOutToThrow(result, visit, random = Math.random) {
    const chance = getBounceOutChance(result, visit);
    const bounced = chance > 0 && random() < chance;
    if (visit) {
        if (!Array.isArray(visit.bounceOutLandedDarts)) visit.bounceOutLandedDarts = [];
        if (!bounced && result?.sector * result?.mult > 0) {
            visit.bounceOutLandedDarts.push({ sector: result.sector, mult: result.mult });
            visit.bounceOutLandedDarts = visit.bounceOutLandedDarts.slice(-3);
        }
    }
    return bounced ? { ...result, sector: 0, mult: 0, bounceOut: true, bouncedSector: result.sector, bouncedMult: result.mult } : result;
}

function recordMatchBounceOut(isP1, result, match = currentMatch) {
    if (!result?.bounceOut || !match?.stats) return false;
    const key = isP1 ? 'p1BounceOuts' : 'p2BounceOuts';
    match.stats[key] = Math.max(0, Number(match.stats[key]) || 0) + 1;
    return true;
}

function refreshMatchBounceOutStats() {
    if (typeof document === 'undefined') return;
    refreshBounceOutSettingsUI();
    ['p1', 'p2'].forEach((side, index) => {
        const element = document.getElementById(index ? 'stat-opp-bounce-outs' : 'stat-bounce-outs');
        if (element) element.textContent = Math.max(0, Number(currentMatch?.stats?.[`${side}BounceOuts`]) || 0);
    });
}

// Background matches already use a leg model, rather than dart-by-dart play.
// Sample a small binomial count for both sides before resolving each leg.
function simulateBounceOutLeg(chance, random = Math.random) {
    if (!areBounceOutsEnabled()) return { chance, counts: [0, 0], darts: 0 };
    const darts = BOUNCE_OUT_CONFIG.simulatedDartsPerLeg;
    const counts = [0, 0];
    // Average crowding of scoring throws, including large singles and misses.
    const probability = BOUNCE_OUT_CONFIG.chance + BOUNCE_OUT_CONFIG.crowdedFieldIncrease * 0.25;
    const sample = () => {
        const roll = random();
        let mass = (1 - probability) ** darts, cumulative = mass, count = 0;
        while (roll > cumulative && count < darts) {
            mass *= (darts - count) / (count + 1) * probability / (1 - probability);
            count++; cumulative += mass;
        }
        return count;
    };
    counts[0] = sample(); counts[1] = sample();
    return { chance: Math.max(0.05, Math.min(0.95, chance + (counts[1] - counts[0]) * 0.02)), counts, darts };
}

function getBounceOutAdjustedAverage(average, count, darts) {
    return (Number(average) * (darts > 0 ? darts / (darts + Math.max(0, count)) : 1)).toFixed(2);
}

let bounceOutAudioContext = null;
function playBounceOutSound() {
    if (typeof window === 'undefined') return;
    const volume = typeof globalVolume === 'number' ? Math.max(0, Math.min(1, globalVolume)) : 1;
    if (!volume) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
        if (!bounceOutAudioContext || bounceOutAudioContext.state === 'closed') bounceOutAudioContext = new AudioContextClass();
        const context = bounceOutAudioContext;
        if (context.state === 'suspended') context.resume().catch(() => {});
        [0, 0.09].forEach((delay, index) => {
            const oscillator = context.createOscillator(), gain = context.createGain();
            const start = context.currentTime + delay;
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(index ? 180 : 700, start);
            oscillator.frequency.exponentialRampToValueAtTime(70, start + 0.08);
            gain.gain.setValueAtTime(volume * 0.12, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);
            oscillator.connect(gain); gain.connect(context.destination);
            oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
            oscillator.start(start); oscillator.stop(start + 0.11);
        });
    } catch (_error) { /* Audio is optional; scoring remains synchronous. */ }
}

let bounceOutVisualTimer = null;
function showBounceOutFeedback(result) {
    if (typeof document === 'undefined') return;
    const banner = document.getElementById('match-bounce-out');
    if (banner) {
        clearTimeout(bounceOutVisualTimer);
        banner.textContent = `↘ ${getBounceOutText().log}`;
        banner.hidden = false;
        banner.classList.remove('bounce-out-active');
        void banner.offsetWidth;
        banner.classList.add('bounce-out-active');
        bounceOutVisualTimer = setTimeout(() => { banner.hidden = true; }, 900);
    }
    if (typeof animateBounceOutDart === 'function') animateBounceOutDart(result);
    playBounceOutSound();
}

if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('DOMContentLoaded', refreshBounceOutSettingsUI);

/* Tournament-specific television graphics shared by the scoreboard and TV director. */
(function (root) {
    'use strict';

    const themeAliases = Object.freeze({
        default: 'default', classic: 'default', neutral: 'default',
        worlds: 'world-championship', world: 'world-championship', championship: 'world-championship',
        'world-championship': 'world-championship',
        premier: 'premier-league', league: 'premier-league', 'premier-league': 'premier-league',
        matchplay: 'world-matchplay', 'world-matchplay': 'world-matchplay',
        'world-cup': 'world-cup', 'uk-open': 'uk-open', 'european-tour': 'european-tour',
        'european-championship': 'european-championship', 'players-championship': 'players-championship',
        'players-championship-finals': 'players-championship-finals', 'world-series': 'world-series',
        'world-grand-prix': 'world-grand-prix', 'grand-slam': 'grand-slam',
        'crown-masters': 'crown-masters', 'challenge-tour': 'challenge-tour',
        'development-tour': 'development-tour', 'q-school': 'q-school',
        custom: 'custom'
    });
    const paletteProperties = Object.freeze({
        accent: '--broadcast-accent', accentText: '--broadcast-accent-text',
        secondary: '--broadcast-secondary', secondaryText: '--broadcast-secondary-text', active: '--broadcast-active',
        activeText: '--broadcast-active-text', score: '--broadcast-score-idle', deep: '--broadcast-deep',
        mid: '--broadcast-mid', stage: '--broadcast-stage-bg', stageGlow: '--broadcast-stage-glow'
    });

    function normalizeTheme(value) {
        const key = String(value || '').trim().toLocaleLowerCase('en').replace(/[\s_]+/g, '-');
        return themeAliases[key] || '';
    }

    function tournamentText(tournament) {
        return [tournament?.name, tournament?.sourceName, tournament?.qualifierFor, tournament?.specialType]
            .filter(Boolean).join(' ').toLocaleLowerCase('en');
    }

    function resolve(tournament, match = null) {
        const requested = normalizeTheme(tournament?.broadcastTheme || tournament?.tvTheme);
        if (requested) return requested;
        if (!match?.isTournament && !tournament) return 'default';
        const name = tournamentText(tournament);
        if (/(world|global)\s+darts\s+championship/.test(name)) return 'world-championship';
        if (/premier\s+league|global\s+darts\s+league/.test(name)) return 'premier-league';
        if (/matchplay/.test(name)) return 'world-matchplay';
        if (/world\s+cup|puchar\s+narod[oó]w|worldcup/.test(name)) return 'world-cup';
        if (/uk\s+open|british\s+open|ukopen/.test(name)) return 'uk-open';
        if (/european\s+championship|continental\s+championship/.test(name)) return 'european-championship';
        if (/players\s+championship\s+finals|pro\s+players\s+finals/.test(name)) return 'players-championship-finals';
        if (/grand\s+prix/.test(name)) return 'world-grand-prix';
        if (/grand\s+slam|champion['’]?s\s+slam/.test(name)) return 'grand-slam';
        if (/crown\s+masters|classicmasters/.test(name)) return 'crown-masters';
        if (/worldmasters|global\s+masters\s+finals|world\s+series|(?:desert|arabian|northern|atlantic|aotearoa|southern)\s+masters/.test(name)
            || tournament?.worldMastersEvent) return 'world-series';
        if (/european\s+tour|continental\s+tour|continentalqualifier/.test(name)) return 'european-tour';
        if (/players\s+championship|pro\s+players\s+cup/.test(name)) return 'players-championship';
        if (/challenge\s+tour|rising\s+stars\s+circuit/.test(name)) return 'challenge-tour';
        if (/development\s+tour|future\s+champions\s+circuit/.test(name)) return 'development-tour';
        if (/q[ -]?school|pro\s+card\s+trials/.test(name)) return 'q-school';
        if (tournament?.isCustomTournament || tournament?.customTournament
            || String(tournament?.specialType || '').toLocaleLowerCase('en') === 'customtournament') return 'custom';
        return 'default';
    }

    function legStarter(match) {
        if (!match) return null;
        const initial = match.startingPlayer === 'p1' || match.startingPlayer === 'p2'
            ? match.startingPlayer
            : (match.turn === 'p1' || match.turn === 'p2' ? match.turn : null);
        if (!initial) return null;
        const completedLegVisible = Number(match.p1Score) === 0 || Number(match.p2Score) === 0;
        if (completedLegVisible && ['p1', 'p2'].includes(match.completedLegStarter)) return match.completedLegStarter;
        if (typeof getMatchLegStarter === 'function' && (match.matchFormat?.type === 'sets' || !completedLegVisible)) {
            return getMatchLegStarter(match);
        }
        const completedLegs = Math.max(0, Math.floor(Number(match.totalLegsPlayed) || 0));
        const legIndex = Math.max(0, completedLegs - (completedLegVisible ? 1 : 0));
        if (legIndex % 2 === 0) return initial;
        return initial === 'p1' ? 'p2' : 'p1';
    }

    function clearCustomPalette(screen) {
        Object.values(paletteProperties).forEach(property => screen.style.removeProperty(property));
    }

    function applyCustomPalette(screen, tournament) {
        const palette = tournament?.broadcastColors;
        if (!palette || typeof palette !== 'object') return;
        Object.entries(paletteProperties).forEach(([key, property]) => {
            const value = String(palette[key] || '').trim();
            if (/^#[0-9a-f]{3,8}$/i.test(value)) screen.style.setProperty(property, value);
        });
    }

    function apply(tournament = null, match = null) {
        const screen = root.document?.getElementById?.('screen-match');
        if (!screen) return resolve(tournament, match);
        const theme = resolve(tournament, match);
        screen.dataset.broadcastTheme = theme;
        const panel = root.document.getElementById('broadcast-scoreboard');
        if (panel) panel.dataset.broadcastTheme = theme;
        clearCustomPalette(screen);
        if (theme === 'custom') applyCustomPalette(screen, tournament);
        return theme;
    }

    root.matchBroadcastTheme = Object.freeze({ resolve, apply, normalizeTheme, legStarter });
})(typeof window !== 'undefined' ? window : globalThis);

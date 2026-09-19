/* Tournament-specific television graphics shared by the scoreboard and TV director. */
(function (root) {
    'use strict';

    const themeAliases = Object.freeze({
        default: 'default', classic: 'default', neutral: 'default',
        worlds: 'world-championship', world: 'world-championship', championship: 'world-championship',
        'world-championship': 'world-championship',
        premier: 'premier-league', league: 'premier-league', 'premier-league': 'premier-league',
        matchplay: 'world-matchplay', 'world-matchplay': 'world-matchplay',
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
        return [tournament?.name, tournament?.sourceName, tournament?.specialType]
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

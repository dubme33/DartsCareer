const TOUR_PROMOTION_TEXT = {
    title: ['Awans i spadek po sezonie', 'Season promotion and relegation', 'Auf- und Abstieg nach der Saison', 'Promotie en degradatie na het seizoen'],
    target: ['Wyższy cykl', 'Higher tour', 'Höhere Tour', 'Hogere tour'],
    none: ['Bez awansu i spadku', 'No promotion or relegation', 'Kein Auf- oder Abstieg', 'Geen promotie of degradatie'],
    places: ['Liczba awansujących i spadających', 'Players promoted and relegated', 'Auf- und Absteiger', 'Promoverende en degraderende spelers'],
    basis: ['Podstawa klasyfikacji obu cykli', 'Standings used for both tours', 'Wertung für beide Touren', 'Rangschikking voor beide tours'],
    ranking: ['Własny ranking sezonowy (£)', 'Separate seasonal prize ranking (£)', 'Eigene Saisonrangliste (£)', 'Eigen seizoensranglijst (£)'],
    league: ['Tabela ligi przed play-offami', 'League table before playoffs', 'Ligatabelle vor den Playoffs', 'Competitiestand vóór de play-offs'],
    hint: ['Wymagane są dwa rozłączne, stałe składy. Najlepsi tego cyklu zamienią się miejscami z najsłabszymi wyższego cyklu 1 stycznia. Wybierz własny ranking w obu cyklach albo po jednej lidze w każdym. Bez wyników obu cykli wymiana nie nastąpi. Zmiana obowiązuje od następnego sezonu.', 'Requires two separate fixed fields. The best players here exchange places with the lowest-ranked players in the higher tour on 1 January. Use a separate ranking in both tours, or one league in each. Without results from both tours, no exchange takes place. Changes apply next season.', 'Benötigt zwei getrennte feste Felder. Die Besten tauschen am 1. Januar mit den Letzten der höheren Tour. Nutze eigene Ranglisten in beiden Touren oder je eine Liga. Ohne Ergebnisse beider Touren findet kein Tausch statt. Änderungen gelten ab der nächsten Saison.', 'Vereist twee afzonderlijke vaste velden. De besten wisselen op 1 januari met de laagst geplaatsten in de hogere tour. Gebruik eigen ranglijsten in beide tours of één competitie per tour. Zonder resultaten van beide tours vindt geen wissel plaats. Wijzigingen gelden volgend seizoen.'],
    history: ['Ostatnia wymiana: {year} · awans: {up} · spadek: {down}', 'Last exchange: {year} · promoted: {up} · relegated: {down}', 'Letzter Tausch: {year} · Aufstieg: {up} · Abstieg: {down}', 'Laatste wissel: {year} · promotie: {up} · degradatie: {down}']
};
function trTourPromotion(key, params = {}) {
    const index = Math.max(0, ['pl', 'en', 'de', 'nl'].indexOf(currentLang));
    return (TOUR_PROMOTION_TEXT[key]?.[index] || key).replace(/\{(\w+)\}/g, (_, field) => String(params[field] ?? ''));
}
function renderCareerTourPromotionFields(tour) {
    const options = getCareerCalendarEditorState().tours.filter(candidate => !candidate.removed && candidate.id !== tour.id && candidate.entry === 'fixed');
    const text = key => careerEditorHtml(trTourPromotion(key));
    const last = [...(getCareerCalendarEditorState().promotionHistory || [])].reverse()
        .map(item => ({ year: item.year, report: item.reports.find(report => report.from === tour.id && !report.skipped) })).find(item => item.report);
    const pool = getTournamentEditorCandidates(), names = keys => keys.map(key => pool.find(candidate => getTournamentEditorPlayerKey(candidate) === key)?.name || key).join(', ');
    return `<fieldset><legend>${text('title')}</legend><div class="tournament-editor-fields">
        <label><span>${text('target')}</span><select id="ce-promotion-target">${careerEditorOptions([['', trTourPromotion('none')], ...options.map(candidate => [candidate.id, candidate.name])], tour.promotion?.targetId)}</select></label>
        <label><span>${text('places')}</span>${careerEditorNumber('ce-promotion-places', tour.promotion?.places || 2, 1, 256)}</label>
        <label class="te-wide"><span>${text('basis')}</span><select id="ce-promotion-basis">${careerEditorOptions(['ranking', 'league'].map(key => [key, trTourPromotion(key)]), tour.promotion?.basis || 'ranking')}</select></label></div>
        <p>${text('hint')}</p>${last ? `<p>${careerEditorHtml(trTourPromotion('history', { year: last.year, up: names(last.report.promoted), down: names(last.report.relegated) }))}</p>` : ''}</fieldset>`;
}
function getCareerTourPromotionFormData() {
    const targetId = document.getElementById('ce-promotion-target')?.value;
    return targetId ? { targetId, places: careerEditorInteger('ce-promotion-places', 1, 256), basis: document.getElementById('ce-promotion-basis').value } : undefined;
}

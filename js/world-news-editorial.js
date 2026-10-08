// Shared language and season-review labels.
function newsSay(en,pl,de=en,nl=en) { return ({en,pl,de,nl})[typeof currentLang==='string'?currentLang:'en']||en; }
function newsHighlightLabel(kind) {
    const labels={breakout:['Breakthrough','Przełom','Durchbruch','Doorbraak'],young:['Young player','Młody zawodnik','Nachwuchs','Jonge speler'],
        comeback:['Comeback','Powrót','Comeback','Comeback'],decline:['Decline','Spadek','Rückgang','Terugval'],
        climber:['Ranking climber','Awans w rankingu','Aufsteiger','Stijger'],playerYear:['Player of the year','Zawodnik roku','Spieler des Jahres','Speler van het jaar'],
        oneSeason:['Exceptional past season','Wyjątkowy wcześniejszy sezon','Außergewöhnliche frühere Saison','Uitzonderlijk eerder seizoen']};
    return newsSay(...(labels[kind]||[kind,kind,kind,kind]));
}

function womensSeriesNewsHeadline(f){
 const lines={
  'ws-open':['Women’s Series weekend opens','Rozpoczyna się weekend Kobiecego Cyklu PDC','Das Women’s-Series-Wochenende beginnt','Het Women’s Series-weekend begint'],
  'ws-leader':['{n} leads the Women’s Series table','{n} prowadzi w rankingu Kobiecego Cyklu PDC','{n} führt die Women’s-Series-Tabelle an','{n} leidt de Women’s Series-ranglijst'],
  'ws-record':['{n}: {amount} series titles this season','{n}: {amount} tytułów kobiecego cyklu w sezonie','{n}: {amount} Serientitel in dieser Saison','{n}: {amount} titels in de serie dit seizoen'],
  'ws-season':['{year} Women’s Series season complete','Zakończenie Kobiecego Cyklu PDC {year}','Women’s Series {year} abgeschlossen','Women’s Series-seizoen {year} voltooid'],
  'ws-world':['Women’s Series World Championship qualifying positions','Kobiece ścieżki kwalifikacji do MŚ','WM-Qualifikationsplätze der Women’s Series','WK-kwalificatieplaatsen van de Women’s Series']
 };
 return newsCopy(lines[f.kind]||['{n} wins {t}','{n} zwycięża w {t}','{n} gewinnt {t}','{n} wint {t}'],{...newsEditorialValues(f),amount:f.amount||''});
}
function womensSeriesNewsDeck(f){
 const v={...newsEditorialValues(f),amount:f.amount||'',names:f.names||''};
 if(f.kind==='ws-world')return newsCopy(['Current Women’s Series qualifiers: {names}.','Aktualne miejsca z Kobiecego Cyklu PDC zajmują: {names}.','Aktuelle Qualifikantinnen der Women’s Series: {names}.','Huidige kwalificanten uit de Women’s Series: {names}.'],v);
 if(f.kind==='ws-open')return newsCopy(['{amount} players enter the independent open draw.','Do niezależnego losowania zgłoszono {amount} zawodniczek.','{amount} Spielerinnen nehmen an der offenen Auslosung teil.','{amount} speelsters doen mee aan de zelfstandige open loting.'],v);
 if(f.kind==='ws-leader'||f.kind==='ws-season')return newsCopy(['{n}: {money} on the separate Women’s Series Order of Merit.','{n}: {money} w odrębnym rankingu Kobiecego Cyklu PDC.','{n}: {money} in der eigenständigen Women’s Series Order of Merit.','{n}: {money} op de aparte Women’s Series Order of Merit.'],v);
 return newsCopy(f.score&&f.opponent?['{n} defeats {o} {score} in the final.','{n} pokonuje {o} {score} w finale.','{n} besiegt {o} im Finale mit {score}.','{n} verslaat {o} met {score} in de finale.']:['A recorded result in the Women’s Series season.','Potwierdzony wynik w sezonie Kobiecego Cyklu PDC.','Ein bestätigtes Ergebnis der Women’s Series.','Een vastgelegd resultaat in het Women’s Series-seizoen.'],v);
}
function womensSeriesNewsParagraph(id,f){
 if(/context|ranking|background|outlook|next|money/i.test(id))return newsSay('Women’s Series prize money counts only towards its own Order of Merit.','Nagrody Kobiecego Cyklu PDC liczą się wyłącznie do jego własnego Order of Merit.','Preisgeld der Women’s Series zählt nur für ihre eigene Order of Merit.','Prijzengeld van de Women’s Series telt alleen voor de eigen Order of Merit.');
 return womensSeriesNewsDeck(f);
}

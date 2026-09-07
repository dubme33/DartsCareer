// Bazowe (fikcyjne) nazwiska historycznych mistrzów. Pole aliases służy
// wyłącznie do połączenia rekordu z zawodnikiem przemianowanym przez mod.
const historicalChampionProfiles = {
    'phil-taylor': { name: 'Philip Tailor', country: 'Anglia', aliases: ['Phil Taylor'] },
    'james-wade': { name: 'Jamie Wadey', country: 'Anglia', aliases: ['James Wade'] },
    'michael-van-gerwen': { name: 'Mickael van Gervyn', country: 'Holandia', aliases: ['Michael van Gerwen'] },
    'peter-wright': { name: 'Pete Right', country: 'Szkocja', aliases: ['Peter Wright'] },
    'jonny-clayton': { name: 'Johnny Clay', country: 'Walia', aliases: ['Jonny Clayton'] },
    'joe-cullen': { name: 'Joey Callen', country: 'Anglia', aliases: ['Joe Cullen'] },
    'chris-dobey': { name: 'Chris Doby', country: 'Anglia', aliases: ['Chris Dobey'] },
    'stephen-bunting': { name: 'Steve Benting', country: 'Anglia', aliases: ['Stephen Bunting'] },
    'luke-humphries': { name: 'Luke Humphreys', country: 'Anglia', aliases: ['Luke Humphries'] },
    'luke-littler': { name: 'Lucas Little', country: 'Anglia', aliases: ['Luke Littler'] },
    'roland-scholten': { name: 'Roland Schouten', country: 'Holandia', aliases: ['Roland Scholten'] },
    'raymond-van-barneveld': { name: 'Ray van Barnewelt', country: 'Holandia', aliases: ['Raymond van Barneveld'] },
    'robert-thornton': { name: 'Robert Thorne', country: 'Szkocja', aliases: ['Robert Thornton'] },
    'adrian-lewis': { name: 'Adrian Lewin', country: 'Anglia', aliases: ['Adrian Lewis'] },
    'gary-anderson': { name: 'Garry Anders', country: 'Szkocja', aliases: ['Gary Anderson'] },
    'nathan-aspinall': { name: 'Nate Asp', country: 'Anglia', aliases: ['Nathan Aspinall'] },
    'danny-noppert': { name: 'Dan Noperts', country: 'Holandia', aliases: ['Danny Noppert'] },
    'andrew-gilding': { name: 'Andy Gilder', country: 'Anglia', aliases: ['Andrew Gilding'] },
    'dimitri-van-den-bergh': { name: 'Dimitr Van den Berg', country: 'Belgia', aliases: ['Dimitri Van den Bergh'] },
    'larry-butler': { name: 'Larry Baxter', country: 'USA', aliases: ['Larry Butler'] },
    'peter-evison': { name: 'Peter Everson', country: 'Anglia', aliases: ['Peter Evison'] },
    'rod-harrington': { name: 'Rod Harrison', country: 'Anglia', aliases: ['Rod Harrington'] },
    'colin-lloyd': { name: 'Colin Floyd', country: 'Anglia', aliases: ['Colin Lloyd'] },
    'rob-cross': { name: 'Bob Cross', country: 'Anglia', aliases: ['Rob Cross'] },
    'scott-waites': { name: 'Scot Waites', country: 'Anglia', aliases: ['Scott Waites'] },
    'gerwyn-price': { name: 'Gerry Prices', country: 'Walia', aliases: ['Gerwyn Price'] },
    'jose-de-sousa': { name: 'Jose de Souza', country: 'Portugalia', aliases: ['Jose de Sousa', 'José de Sousa'] },
    'michael-smith': { name: 'Mike Smiths', country: 'Anglia', aliases: ['Michael Smith'] },
    'glen-durrant': { name: 'Glenn Durant', country: 'Anglia', aliases: ['Glen Durrant'] },
    'paul-nicholson': { name: 'Paul Nickson', country: 'Australia', aliases: ['Paul Nicholson'] },
    'kevin-painter': { name: 'Kevin Pointer', country: 'Anglia', aliases: ['Kevin Painter'] },
    'daryl-gurney': { name: 'Daryll Gerney', country: 'Irlandia Północna', aliases: ['Daryl Gurney'] },
    'simon-whitlock': { name: 'Simon Whitler', country: 'Australia', aliases: ['Simon Whitlock'] },
    'ross-smith': { name: 'Ross Smythe', country: 'Anglia', aliases: ['Ross Smith'] },
    'ritchie-edhouse': { name: 'Rich Edhome', country: 'Anglia', aliases: ['Ritchie Edhouse'] },
    'gian-van-veen': { name: 'Gion van Ween', country: 'Holandia', aliases: ['Gian van Veen'] },
    'alan-warriner': { name: 'Alan Warner', country: 'Anglia', aliases: ['Alan Warriner'] },
    'mike-de-decker': { name: 'Mick De Deckers', country: 'Belgia', aliases: ['Mike De Decker'] },
    'dennis-priestley': { name: 'Dennis Prestley', country: 'Anglia', aliases: ['Dennis Priestley'] },
    'john-part': { name: 'John Parks', country: 'Kanada', aliases: ['John Part'] },
    'co-stompe': { name: 'Co Stamper', country: 'Holandia', aliases: ['Co Stompe', 'Co Stompé'] },
    'john-henderson': { name: 'Jon Henders', country: 'Szkocja', aliases: ['John Henderson'] },
    'damon-heta': { name: 'Damian Heat', country: 'Australia', aliases: ['Damon Heta'] },
    'josh-rock': { name: 'Joshua Rocky', country: 'Irlandia Północna', aliases: ['Josh Rock'] }
};

// Zwycięzcy są przypisani do fikcyjnych odpowiedników turniejów z kalendarza.
// Dane: listy finałów wskazane przez autora gry; World Series obejmuje tylko Finals.
const historicalTournamentChampions = [
    {
        tournament: 'Crown Masters', specialType: 'classicMasters',
        editions: [
            [2013, 'phil-taylor'], [2014, 'james-wade'], [2015, 'michael-van-gerwen'],
            [2016, 'michael-van-gerwen'], [2017, 'michael-van-gerwen'], [2018, 'michael-van-gerwen'],
            [2019, 'michael-van-gerwen'], [2020, 'peter-wright'], [2021, 'jonny-clayton'],
            [2022, 'joe-cullen'], [2023, 'chris-dobey'], [2024, 'stephen-bunting'],
            [2025, 'luke-humphries']
        ]
    },
    {
        tournament: 'British Open', specialType: 'ukOpen',
        editions: [
            [2003, 'phil-taylor'], [2004, 'roland-scholten'], [2005, 'phil-taylor'],
            [2006, 'raymond-van-barneveld'], [2007, 'raymond-van-barneveld'], [2008, 'james-wade'],
            [2009, 'phil-taylor'], [2010, 'phil-taylor'], [2011, 'james-wade'],
            [2012, 'robert-thornton'], [2013, 'phil-taylor'], [2014, 'adrian-lewis'],
            [2015, 'michael-van-gerwen'], [2016, 'michael-van-gerwen'], [2017, 'peter-wright'],
            [2018, 'gary-anderson'], [2019, 'nathan-aspinall'], [2020, 'michael-van-gerwen'],
            [2021, 'james-wade'], [2022, 'danny-noppert'], [2023, 'andrew-gilding'],
            [2024, 'dimitri-van-den-bergh'], [2025, 'luke-littler']
        ]
    },
    {
        tournament: 'Global Matchplay',
        editions: [
            [1994, 'larry-butler'], [1995, 'phil-taylor'], [1996, 'peter-evison'],
            [1997, 'phil-taylor'], [1998, 'rod-harrington'], [1999, 'rod-harrington'],
            [2000, 'phil-taylor'], [2001, 'phil-taylor'], [2002, 'phil-taylor'],
            [2003, 'phil-taylor'], [2004, 'phil-taylor'], [2005, 'colin-lloyd'],
            [2006, 'phil-taylor'], [2007, 'james-wade'], [2008, 'phil-taylor'],
            [2009, 'phil-taylor'], [2010, 'phil-taylor'], [2011, 'phil-taylor'],
            [2012, 'phil-taylor'], [2013, 'phil-taylor'], [2014, 'phil-taylor'],
            [2015, 'michael-van-gerwen'], [2016, 'michael-van-gerwen'], [2017, 'phil-taylor'],
            [2018, 'gary-anderson'], [2019, 'rob-cross'], [2020, 'dimitri-van-den-bergh'],
            [2021, 'peter-wright'], [2022, 'michael-van-gerwen'], [2023, 'nathan-aspinall'],
            [2024, 'luke-humphries'], [2025, 'luke-littler']
        ]
    },
    {
        tournament: "Champion's Slam",
        editions: [
            [2007, 'phil-taylor'], [2008, 'phil-taylor'], [2009, 'phil-taylor'],
            [2010, 'scott-waites'], [2011, 'phil-taylor'], [2012, 'raymond-van-barneveld'],
            [2013, 'phil-taylor'], [2014, 'phil-taylor'], [2015, 'michael-van-gerwen'],
            [2016, 'michael-van-gerwen'], [2017, 'michael-van-gerwen'], [2018, 'gerwyn-price'],
            [2019, 'gerwyn-price'], [2020, 'jose-de-sousa'], [2021, 'gerwyn-price'],
            [2022, 'michael-smith'], [2023, 'luke-humphries'], [2024, 'luke-littler'],
            [2025, 'luke-littler']
        ]
    },
    {
        tournament: 'Global Darts League - Play-offs',
        editions: [
            [2005, 'phil-taylor'], [2006, 'phil-taylor'], [2007, 'phil-taylor'],
            [2008, 'phil-taylor'], [2009, 'james-wade'], [2010, 'phil-taylor'],
            [2011, 'gary-anderson'], [2012, 'phil-taylor'], [2013, 'michael-van-gerwen'],
            [2014, 'raymond-van-barneveld'], [2015, 'gary-anderson'], [2016, 'michael-van-gerwen'],
            [2017, 'michael-van-gerwen'], [2018, 'michael-van-gerwen'], [2019, 'michael-van-gerwen'],
            [2020, 'glen-durrant'], [2021, 'jonny-clayton'], [2022, 'michael-van-gerwen'],
            [2023, 'michael-van-gerwen'], [2024, 'luke-littler'], [2025, 'luke-humphries']
        ]
    },
    {
        tournament: 'Pro Players Finals',
        editions: [
            [2009, 'phil-taylor'], [2010, 'paul-nicholson'],
            { year: 2011, editionKey: '2011-02', label: '2011 (luty)', champion: 'phil-taylor', sortOrder: 2011.02 },
            { year: 2011, editionKey: '2011-12', label: '2011 (grudzień)', champion: 'kevin-painter', sortOrder: 2011.12 },
            [2012, 'phil-taylor'], [2013, 'michael-van-gerwen'], [2014, 'gary-anderson'],
            [2015, 'michael-van-gerwen'], [2016, 'michael-van-gerwen'], [2017, 'michael-van-gerwen'],
            [2018, 'daryl-gurney'], [2019, 'michael-van-gerwen'], [2020, 'michael-van-gerwen'],
            [2021, 'peter-wright'], [2022, 'michael-van-gerwen'], [2023, 'luke-humphries'],
            [2024, 'luke-humphries'], [2025, 'luke-littler']
        ]
    },
    {
        tournament: 'Continental Championship',
        editions: [
            [2008, 'phil-taylor'], [2009, 'phil-taylor'], [2010, 'phil-taylor'],
            [2011, 'phil-taylor'], [2012, 'simon-whitlock'], [2013, 'adrian-lewis'],
            [2014, 'michael-van-gerwen'], [2015, 'michael-van-gerwen'], [2016, 'michael-van-gerwen'],
            [2017, 'michael-van-gerwen'], [2018, 'james-wade'], [2019, 'rob-cross'],
            [2020, 'peter-wright'], [2021, 'rob-cross'], [2022, 'ross-smith'],
            [2023, 'peter-wright'], [2024, 'ritchie-edhouse'], [2025, 'gian-van-veen']
        ]
    },
    {
        tournament: 'Global Masters Finals', specialType: 'worldMastersFinals',
        editions: [
            [2015, 'michael-van-gerwen'], [2016, 'michael-van-gerwen'], [2017, 'michael-van-gerwen'],
            [2018, 'james-wade'], [2019, 'michael-van-gerwen'], [2020, 'gerwyn-price'],
            [2021, 'jonny-clayton'], [2022, 'gerwyn-price'], [2023, 'michael-van-gerwen'],
            [2024, 'luke-littler'], [2025, 'michael-van-gerwen']
        ]
    },
    {
        tournament: 'Global Grand Prix',
        editions: [
            [1998, 'phil-taylor'], [1999, 'phil-taylor'], [2000, 'phil-taylor'],
            [2001, 'alan-warriner'], [2002, 'phil-taylor'], [2003, 'phil-taylor'],
            [2004, 'colin-lloyd'], [2005, 'phil-taylor'], [2006, 'phil-taylor'],
            [2007, 'james-wade'], [2008, 'phil-taylor'], [2009, 'phil-taylor'],
            [2010, 'james-wade'], [2011, 'phil-taylor'], [2012, 'michael-van-gerwen'],
            [2013, 'phil-taylor'], [2014, 'michael-van-gerwen'], [2015, 'robert-thornton'],
            [2016, 'michael-van-gerwen'], [2017, 'daryl-gurney'], [2018, 'michael-van-gerwen'],
            [2019, 'michael-van-gerwen'], [2020, 'gerwyn-price'], [2021, 'jonny-clayton'],
            [2022, 'michael-van-gerwen'], [2023, 'luke-humphries'], [2024, 'mike-de-decker'],
            [2025, 'luke-littler']
        ]
    },
    {
        tournament: 'Global Darts Championship',
        editions: [
            [1994, 'dennis-priestley'], [1995, 'phil-taylor'], [1996, 'phil-taylor'],
            [1997, 'phil-taylor'], [1998, 'phil-taylor'], [1999, 'phil-taylor'],
            [2000, 'phil-taylor'], [2001, 'phil-taylor'], [2002, 'phil-taylor'],
            [2003, 'john-part'], [2004, 'phil-taylor'], [2005, 'phil-taylor'],
            [2006, 'phil-taylor'], [2007, 'raymond-van-barneveld'], [2008, 'john-part'],
            [2009, 'phil-taylor'], [2010, 'phil-taylor'], [2011, 'adrian-lewis'],
            [2012, 'adrian-lewis'], [2013, 'phil-taylor'], [2014, 'michael-van-gerwen'],
            [2015, 'gary-anderson'], [2016, 'gary-anderson'], [2017, 'michael-van-gerwen'],
            [2018, 'rob-cross'], [2019, 'michael-van-gerwen'], [2020, 'peter-wright'],
            [2021, 'gerwyn-price'], [2022, 'peter-wright'], [2023, 'michael-smith'],
            [2024, 'luke-humphries'], [2025, 'luke-littler']
        ]
    },
    {
        tournament: 'Puchar Narodów', specialType: 'worldCup', team: true,
        editions: [
            { year: 2010, country: 'Holandia', members: ['raymond-van-barneveld', 'co-stompe'] },
            { year: 2012, country: 'Anglia', members: ['phil-taylor', 'adrian-lewis'] },
            { year: 2013, country: 'Anglia', members: ['phil-taylor', 'adrian-lewis'] },
            { year: 2014, country: 'Holandia', members: ['michael-van-gerwen', 'raymond-van-barneveld'] },
            { year: 2015, country: 'Anglia', members: ['phil-taylor', 'adrian-lewis'] },
            { year: 2016, country: 'Anglia', members: ['phil-taylor', 'adrian-lewis'] },
            { year: 2017, country: 'Holandia', members: ['michael-van-gerwen', 'raymond-van-barneveld'] },
            { year: 2018, country: 'Holandia', members: ['michael-van-gerwen', 'raymond-van-barneveld'] },
            { year: 2019, country: 'Szkocja', members: ['gary-anderson', 'peter-wright'] },
            { year: 2020, country: 'Walia', members: ['gerwyn-price', 'jonny-clayton'] },
            { year: 2021, country: 'Szkocja', members: ['peter-wright', 'john-henderson'] },
            { year: 2022, country: 'Australia', members: ['damon-heta', 'simon-whitlock'] },
            { year: 2023, country: 'Walia', members: ['gerwyn-price', 'jonny-clayton'] },
            { year: 2024, country: 'Anglia', members: ['luke-humphries', 'michael-smith'] },
            { year: 2025, country: 'Irlandia Północna', members: ['josh-rock', 'daryl-gurney'] }
        ]
    }
];

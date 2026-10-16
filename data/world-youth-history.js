// Factual archival editions only. Missing database people stay in the archive;
// no active players, prizes, ranking entries or simulated results are created.
const worldYouthHistory = [
    [2011,'Arron Monk',355,'Michael van Gerwen',6,'6–4'],
    [2012,'James Hubbard',null,'Michael van Gerwen',6,'6–3'],
    [2013,'Michael Smith',34,'Ricky Evans',50,'6–1'],
    [2014,'Keegan Brown',356,'Rowby-John Rodriguez',null,'6–4'],
    [2015,'Max Hopp',66,'Nathan Aspinall',14,'6–5'],
    [2016,'Corey Cadby',null,'Berry van Peer',239,'6–2'],
    [2017,'Dimitri Van den Bergh',45,'Josh Payne',null,'6–3'],
    [2018,'Dimitri Van den Bergh',45,'Martin Schindler',18,'6–3'],
    [2019,'Luke Humphries',2,'Adam Gawlas',102,'6–0'],
    [2020,'Bradley Brooks',67,'Joe Davis',null,'6–5'],
    [2021,'Ted Evetts',160,'Nathan Rafferty',null,'6–4'],
    [2022,'Josh Rock',7,'Nathan Girvan',423,'6–1'],
    [2023,'Luke Littler',0,'Gian van Veen',1,'6–4'],
    [2024,'Gian van Veen',1,'Jurjen van der Velde',103,'6–5'],
    [2025,'Gian van Veen',1,'Beau Greaves',76,'6–3']
].map(([year,winner,winnerIndex,runner,runnerIndex,score])=>({year,winner,winnerIndex,runner,runnerIndex,score}));

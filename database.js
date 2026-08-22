// --- BAZA ZAWODNIKÓW ---
const pdcPlayers = [
    { name: "Lucas Little", country: "Anglia", ovr: 96, scoring: 98, doubles: 94, prizeMoney: 3127000, proTourPrizeMoney: 101500, pcPrizeMoney: 0 },
    { name: "Gion van Ween", country: "Holandia", ovr: 93, scoring: 94, doubles: 92, prizeMoney: 1002750, proTourPrizeMoney: 118750, pcPrizeMoney: 0 },
    { name: "Luke Humphreys", country: "Anglia", ovr: 93, scoring: 95, doubles: 91, prizeMoney: 1000500, proTourPrizeMoney: 131000, pcPrizeMoney: 0 },
    { name: "Gerry Prices", country: "Walia", ovr: 92, scoring: 93, doubles: 91, prizeMoney: 722500, proTourPrizeMoney: 131000, pcPrizeMoney: 0 },
    { name: "Johnny Clay", country: "Walia", ovr: 91, scoring: 92, doubles: 90, prizeMoney: 681500, proTourPrizeMoney: 128500, pcPrizeMoney: 0 },
    { name: "Jamie Wadey", country: "Anglia", ovr: 91, scoring: 91, doubles: 91, prizeMoney: 654750, proTourPrizeMoney: 108500, pcPrizeMoney: 0 },
    { name: "Mickael van Gervyn", country: "Holandia", ovr: 91, scoring: 92, doubles: 90, prizeMoney: 645000, proTourPrizeMoney: 94250, pcPrizeMoney: 0 },
    { name: "Joshua Rocky", country: "Irlandia Północna", ovr: 90, scoring: 91, doubles: 89, prizeMoney: 622000, proTourPrizeMoney: 127500, pcPrizeMoney: 0 },
    { name: "Steve Benting", country: "Anglia", ovr: 90, scoring: 90, doubles: 90, prizeMoney: 613250, proTourPrizeMoney: 154000, pcPrizeMoney: 0 },
    { name: "Dan Noperts", country: "Holandia", ovr: 89, scoring: 89, doubles: 89, prizeMoney: 599750, proTourPrizeMoney: 140000, pcPrizeMoney: 0 },
    { name: "Garry Anders", country: "Szkocja", ovr: 89, scoring: 91, doubles: 87, prizeMoney: 596750, proTourPrizeMoney: 41250, pcPrizeMoney: 0 },
    { name: "Rian Serle", country: "Anglia", ovr: 89, scoring: 90, doubles: 88, prizeMoney: 591750, proTourPrizeMoney: 123750, pcPrizeMoney: 0 },
    { name: "Wess Nyman", country: "Holandia", ovr: 88, scoring: 89, doubles: 87, prizeMoney: 568250, proTourPrizeMoney: 313500, pcPrizeMoney: 0 },
    { name: "Chris Doby", country: "Anglia", ovr: 88, scoring: 89, doubles: 87, prizeMoney: 567500, proTourPrizeMoney: 164250, pcPrizeMoney: 0 },
    { name: "Nate Asp", country: "Anglia", ovr: 88, scoring: 88, doubles: 88, prizeMoney: 531750, proTourPrizeMoney: 141750, pcPrizeMoney: 0 },
    { name: "Ross Smythe", country: "Anglia", ovr: 87, scoring: 90, doubles: 84, prizeMoney: 526750, proTourPrizeMoney: 190500, pcPrizeMoney: 0 },
    { name: "Jeremy Wattimen", country: "Holandia", ovr: 87, scoring: 87, doubles: 87, prizeMoney: 509750, proTourPrizeMoney: 147750, pcPrizeMoney: 0 },
    { name: "Luke Woodhome", country: "Anglia", ovr: 86, scoring: 86, doubles: 86, prizeMoney: 489500, proTourPrizeMoney: 182000, pcPrizeMoney: 0 },
    { name: "Marten Schindla", country: "Niemcy", ovr: 86, scoring: 87, doubles: 85, prizeMoney: 446750, proTourPrizeMoney: 95500, pcPrizeMoney: 0 },
    { name: "Damian Heat", country: "Australia", ovr: 85, scoring: 86, doubles: 84, prizeMoney: 436750, proTourPrizeMoney: 109250, pcPrizeMoney: 0 },
    { name: "Krzysztof Ratajczyk", country: "Polska", ovr: 85, scoring: 84, doubles: 86, prizeMoney: 429000, proTourPrizeMoney: 150000, pcPrizeMoney: 0 },
    { name: "Dirk van Duiven", country: "Holandia", ovr: 85, scoring: 87, doubles: 83, prizeMoney: 422250, proTourPrizeMoney: 105750, pcPrizeMoney: 0 },
    { name: "Bob Cross", country: "Anglia", ovr: 84, scoring: 85, doubles: 83, prizeMoney: 422000, proTourPrizeMoney: 116000, pcPrizeMoney: 0 },
    { name: "Mick De Deckers", country: "Belgia", ovr: 84, scoring: 85, doubles: 83, prizeMoney: 408000, proTourPrizeMoney: 52750, pcPrizeMoney: 0 },
    { name: "Rian Joce", country: "Anglia", ovr: 83, scoring: 83, doubles: 83, prizeMoney: 391250, proTourPrizeMoney: 102250, pcPrizeMoney: 0 },
    { name: "Cam Memzies", country: "Szkocja", ovr: 83, scoring: 84, doubles: 82, prizeMoney: 376250, proTourPrizeMoney: 93750, pcPrizeMoney: 0 },
    { name: "Andy Gilder", country: "Anglia", ovr: 82, scoring: 81, doubles: 83, prizeMoney: 364250, proTourPrizeMoney: 120500, pcPrizeMoney: 0 },
    { name: "Dave Chisnel", country: "Anglia", ovr: 82, scoring: 84, doubles: 80, prizeMoney: 358250, proTourPrizeMoney: 84750, pcPrizeMoney: 0 },
    { name: "Daryll Gerney", country: "Irlandia Północna", ovr: 81, scoring: 81, doubles: 81, prizeMoney: 352000, proTourPrizeMoney: 75500, pcPrizeMoney: 0 },
    { name: "Kev Dots", country: "Holandia", ovr: 81, scoring: 82, doubles: 80, prizeMoney: 346250, proTourPrizeMoney: 156000, pcPrizeMoney: 0 },
    { name: "Joey Callen", country: "Anglia", ovr: 81, scoring: 82, doubles: 80, prizeMoney: 304500, proTourPrizeMoney: 99750, pcPrizeMoney: 0 },
    { name: "Rich Edhome", country: "Anglia", ovr: 81, scoring: 82, doubles: 80, prizeMoney: 298750, proTourPrizeMoney: 49000, pcPrizeMoney: 0 },
    { name: "Pete Right", country: "Szkocja", ovr: 80, scoring: 81, doubles: 79, prizeMoney: 281000, proTourPrizeMoney: 36250, pcPrizeMoney: 0 },
    { name: "Rick Pietreczka", country: "Niemcy", ovr: 80, scoring: 81, doubles: 79, prizeMoney: 278750, proTourPrizeMoney: 39250, pcPrizeMoney: 0 },
    { name: "Mike Smiths", country: "Anglia", ovr: 80, scoring: 82, doubles: 78, prizeMoney: 252750, proTourPrizeMoney: 54000, pcPrizeMoney: 0 },
    { name: "Niel Zonevelder", country: "Holandia", ovr: 80, scoring: 80, doubles: 80, prizeMoney: 249750, proTourPrizeMoney: 100750, pcPrizeMoney: 0 },
    { name: "Will O'Conner", country: "Irlandia", ovr: 79, scoring: 80, doubles: 78, prizeMoney: 248500, proTourPrizeMoney: 112250, pcPrizeMoney: 0 },
    { name: "Nick Spring", country: "Niemcy", ovr: 79, scoring: 80, doubles: 78, prizeMoney: 217000, proTourPrizeMoney: 114000, pcPrizeMoney: 0 },
    { name: "Marten Lukeboy", country: "Anglia", ovr: 79, scoring: 79, doubles: 79, prizeMoney: 211750, proTourPrizeMoney: 16750, pcPrizeMoney: 0 },
    { name: "Ray van Barnewelt", country: "Holandia", ovr: 78, scoring: 79, doubles: 77, prizeMoney: 200500, proTourPrizeMoney: 42500, pcPrizeMoney: 0 },
    { name: "Cal Ridz", country: "Anglia", ovr: 78, scoring: 79, doubles: 77, prizeMoney: 197500, proTourPrizeMoney: 51750, pcPrizeMoney: 0 },
    { name: "Mick Manbuy", country: "Irlandia Północna", ovr: 78, scoring: 78, doubles: 78, prizeMoney: 192750, proTourPrizeMoney: 56500, pcPrizeMoney: 0 },
    { name: "Mads Ramza", country: "Łotwa", ovr: 77, scoring: 77, doubles: 77, prizeMoney: 191250, proTourPrizeMoney: 55750, pcPrizeMoney: 0 },
    { name: "Justus Hoods", country: "Anglia", ovr: 77, scoring: 78, doubles: 76, prizeMoney: 189000, proTourPrizeMoney: 53500, pcPrizeMoney: 0 },
    { name: "Gabe Klemens", country: "Niemcy", ovr: 77, scoring: 78, doubles: 76, prizeMoney: 184250, proTourPrizeMoney: 56000, pcPrizeMoney: 0 },
    { name: "Dimitr Van den Berg", country: "Belgia", ovr: 77, scoring: 77, doubles: 77, prizeMoney: 181500, proTourPrizeMoney: 22750, pcPrizeMoney: 0 },
    { name: "Conor Scuts", country: "Anglia", ovr: 76, scoring: 77, doubles: 75, prizeMoney: 179250, proTourPrizeMoney: 49250, pcPrizeMoney: 0 },
    { name: "Jeff de Giraffe", country: "Szwecja", ovr: 76, scoring: 77, doubles: 75, prizeMoney: 172750, proTourPrizeMoney: 76750, pcPrizeMoney: 0 },
    { name: "Jamie Hurr", country: "Anglia", ovr: 76, scoring: 76, doubles: 76, prizeMoney: 169750, proTourPrizeMoney: 45500, pcPrizeMoney: 0 },
    { name: "Scot Willim", country: "Anglia", ovr: 76, scoring: 77, doubles: 75, prizeMoney: 169750, proTourPrizeMoney: 32500, pcPrizeMoney: 0 },
    { name: "Rick Evan", country: "Anglia", ovr: 75, scoring: 76, doubles: 74, prizeMoney: 164000, proTourPrizeMoney: 39000, pcPrizeMoney: 0 },
    { name: "Kim Huibrecht", country: "Belgia", ovr: 75, scoring: 75, doubles: 75, prizeMoney: 161500, proTourPrizeMoney: 79000, pcPrizeMoney: 0 },
    { name: "Mensa Sulovic", country: "Austria", ovr: 75, scoring: 76, doubles: 74, prizeMoney: 161250, proTourPrizeMoney: 55750, pcPrizeMoney: 0 },
    { name: "Brendon Dolans", country: "Irlandia Północna", ovr: 75, scoring: 75, doubles: 75, prizeMoney: 156750, proTourPrizeMoney: 44500, pcPrizeMoney: 0 },
    { name: "Ian Wight", country: "Anglia", ovr: 74, scoring: 75, doubles: 73, prizeMoney: 153750, proTourPrizeMoney: 42750, pcPrizeMoney: 0 },
    { name: "Sebastian Bialecki", country: "Polska", ovr: 74, scoring: 75, doubles: 73, prizeMoney: 145000, proTourPrizeMoney: 84500, pcPrizeMoney: 0 },
    { name: "Karl Seldacek", country: "Czechy", ovr: 74, scoring: 74, doubles: 74, prizeMoney: 144500, proTourPrizeMoney: 80000, pcPrizeMoney: 0 },
    { name: "Rich Venstry", country: "Holandia", ovr: 74, scoring: 75, doubles: 73, prizeMoney: 143500, proTourPrizeMoney: 71000, pcPrizeMoney: 0 },
    { name: "Kean Bar", country: "Irlandia", ovr: 73, scoring: 74, doubles: 72, prizeMoney: 141500, proTourPrizeMoney: 47500, pcPrizeMoney: 0 },
    { name: "Al Souter", country: "Szkocja", ovr: 73, scoring: 73, doubles: 73, prizeMoney: 134750, proTourPrizeMoney: 45000, pcPrizeMoney: 0 },
    { name: "Bob Owens", country: "Walia", ovr: 72, scoring: 73, doubles: 71, prizeMoney: 128750, proTourPrizeMoney: 53000, pcPrizeMoney: 0 },
    { name: "Rian Meikle", country: "Anglia", ovr: 72, scoring: 72, doubles: 72, prizeMoney: 124750, proTourPrizeMoney: 26250, pcPrizeMoney: 0 },
    { name: "Lucas Wenig", country: "Niemcy", ovr: 72, scoring: 73, doubles: 71, prizeMoney: 122500, proTourPrizeMoney: 43500, pcPrizeMoney: 0 },
    { name: "Nick Kennie", country: "Walia", ovr: 71, scoring: 72, doubles: 70, prizeMoney: 121250, proTourPrizeMoney: 29000, pcPrizeMoney: 0 },
    { name: "Thibaut Ticoll", country: "Francja", ovr: 71, scoring: 71, doubles: 71, prizeMoney: 116750, proTourPrizeMoney: 34250, pcPrizeMoney: 0 },
    { name: "Mario Van der Bogaerde", country: "Belgia", ovr: 71, scoring: 72, doubles: 70, prizeMoney: 112000, proTourPrizeMoney: 48750, pcPrizeMoney: 0 },
    { name: "Max Hope", country: "Niemcy", ovr: 70, scoring: 71, doubles: 69, prizeMoney: 111000, proTourPrizeMoney: 59250, pcPrizeMoney: 0 },
    { name: "Brad Brook", country: "Anglia", ovr: 70, scoring: 70, doubles: 70, prizeMoney: 109750, proTourPrizeMoney: 41750, pcPrizeMoney: 0 },
    { name: "Cam Crab", country: "Anglia", ovr: 70, scoring: 71, doubles: 69, prizeMoney: 100000, proTourPrizeMoney: 38500, pcPrizeMoney: 0 },
    { name: "Wes Plaiser", country: "Holandia", ovr: 69, scoring: 70, doubles: 68, prizeMoney: 92750, proTourPrizeMoney: 35000, pcPrizeMoney: 0 },
    { name: "Adam Lipscom", country: "Anglia", ovr: 69, scoring: 70, doubles: 68, prizeMoney: 78750, proTourPrizeMoney: 23000, pcPrizeMoney: 0 },
    { name: "Mike Kuenhoven", country: "Holandia", ovr: 68, scoring: 69, doubles: 67, prizeMoney: 76750, proTourPrizeMoney: 58250, pcPrizeMoney: 0 },
    { name: "Chris Reys", country: "Hiszpania", ovr: 68, scoring: 68, doubles: 68, prizeMoney: 76000, proTourPrizeMoney: 74000, pcPrizeMoney: 0 },
    { name: "Tom Pissel", country: "Anglia", ovr: 67, scoring: 68, doubles: 66, prizeMoney: 67500, proTourPrizeMoney: 52000, pcPrizeMoney: 0 },
    { name: "Daryll Pilgry", country: "Anglia", ovr: 67, scoring: 67, doubles: 67, prizeMoney: 66250, proTourPrizeMoney: 42500, pcPrizeMoney: 0 },
    { name: "Cor Deckers", country: "Holandia", ovr: 67, scoring: 68, doubles: 66, prizeMoney: 65750, proTourPrizeMoney: 44250, pcPrizeMoney: 0 },
    { name: "Bo Graves", country: "Anglia", ovr: 66, scoring: 67, doubles: 65, prizeMoney: 62500, proTourPrizeMoney: 60250, pcPrizeMoney: 0 },
    { name: "Dominic Gruell", country: "Niemcy", ovr: 66, scoring: 67, doubles: 65, prizeMoney: 62250, proTourPrizeMoney: 14250, pcPrizeMoney: 0 },
    { name: "Chris Kister", country: "Holandia", ovr: 66, scoring: 66, doubles: 66, prizeMoney: 60500, proTourPrizeMoney: 46500, pcPrizeMoney: 0 },
    { name: "Andrew Bolton", country: "Szkocja", ovr: 65, scoring: 66, doubles: 64, prizeMoney: 53000, proTourPrizeMoney: 33500, pcPrizeMoney: 0 },
    { name: "Jimmy Longley", country: "Kanada", ovr: 65, scoring: 65, doubles: 65, prizeMoney: 50500, proTourPrizeMoney: 34750, pcPrizeMoney: 0 },
    { name: "Tom Sikes", country: "Anglia", ovr: 65, scoring: 66, doubles: 64, prizeMoney: 49000, proTourPrizeMoney: 46000, pcPrizeMoney: 0 },
    { name: "Charles Manby", country: "Anglia", ovr: 64, scoring: 65, doubles: 63, prizeMoney: 42000, proTourPrizeMoney: 38250, pcPrizeMoney: 0 },
    { name: "Joey Hunt", country: "Anglia", ovr: 64, scoring: 64, doubles: 64, prizeMoney: 40750, proTourPrizeMoney: 40750, pcPrizeMoney: 0 },
    { name: "Oscar Lukas", country: "Szwecja", ovr: 64, scoring: 65, doubles: 63, prizeMoney: 40750, proTourPrizeMoney: 11000, pcPrizeMoney: 0 },
    { name: "Leo Weber", country: "Niemcy", ovr: 64, scoring: 64, doubles: 64, prizeMoney: 40000, proTourPrizeMoney: 25000, pcPrizeMoney: 0 },
    { name: "Tom Lovely", country: "Anglia", ovr: 63, scoring: 64, doubles: 62, prizeMoney: 38500, proTourPrizeMoney: 21250, pcPrizeMoney: 0 },
    { name: "Jim van Ski", country: "Holandia", ovr: 63, scoring: 63, doubles: 63, prizeMoney: 38250, proTourPrizeMoney: 32000, pcPrizeMoney: 0 },
    { name: "Travis Dudeney", country: "Anglia", ovr: 63, scoring: 64, doubles: 62, prizeMoney: 37250, proTourPrizeMoney: 13500, pcPrizeMoney: 0 },
    { name: "Marv van Velzen", country: "Holandia", ovr: 63, scoring: 63, doubles: 63, prizeMoney: 36500, proTourPrizeMoney: 20000, pcPrizeMoney: 0 },
    { name: "Darius Labana", country: "Litwa", ovr: 62, scoring: 63, doubles: 61, prizeMoney: 36250, proTourPrizeMoney: 34250, pcPrizeMoney: 0 },
    { name: "Victor Tingstrom", country: "Szwecja", ovr: 62, scoring: 62, doubles: 62, prizeMoney: 34500, proTourPrizeMoney: 26000, pcPrizeMoney: 0 },
    { name: "Sean McGuirk", country: "Irlandia", ovr: 62, scoring: 63, doubles: 61, prizeMoney: 33500, proTourPrizeMoney: 27250, pcPrizeMoney: 0 },
    { name: "Alex Merkix", country: "Holandia", ovr: 62, scoring: 62, doubles: 62, prizeMoney: 32250, proTourPrizeMoney: 29250, pcPrizeMoney: 0 },
    { name: "Harry Coaty", country: "Anglia", ovr: 61, scoring: 62, doubles: 60, prizeMoney: 30750, proTourPrizeMoney: 26750, pcPrizeMoney: 0 },
    { name: "Kai Gotharden", country: "Niemcy", ovr: 61, scoring: 61, doubles: 61, prizeMoney: 29750, proTourPrizeMoney: 17500, pcPrizeMoney: 0 },
    { name: "Mervin Prince", country: "Anglia", ovr: 61, scoring: 62, doubles: 60, prizeMoney: 29000, proTourPrizeMoney: 27750, pcPrizeMoney: 0 },
    { name: "Dave Sharp", country: "Anglia", ovr: 61, scoring: 61, doubles: 61, prizeMoney: 28750, proTourPrizeMoney: 28750, pcPrizeMoney: 0 },
    { name: "Adam Pax", country: "Anglia", ovr: 61, scoring: 62, doubles: 60, prizeMoney: 28250, proTourPrizeMoney: 20750, pcPrizeMoney: 0 },
    { name: "Adam Warnes", country: "Anglia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 27500, proTourPrizeMoney: 15000, pcPrizeMoney: 0 },
    { name: "Dennis Kalter", country: "Holandia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 27500, proTourPrizeMoney: 23750, pcPrizeMoney: 0 },
    { name: "Gregg Ritchie", country: "Anglia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 26750, proTourPrizeMoney: 15250, pcPrizeMoney: 0 },
    { name: "Adam Gawel", country: "Czechy", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 25750, proTourPrizeMoney: 23750, pcPrizeMoney: 0 },
    { name: "Jurjen van de Velde", country: "Holandia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 24750, proTourPrizeMoney: 23500, pcPrizeMoney: 0 },
    { name: "Jeff De Zwaan", country: "Holandia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 24250, proTourPrizeMoney: 23250, pcPrizeMoney: 0 },
    { name: "Jeff Sparidaans", country: "Holandia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 23750, proTourPrizeMoney: 21750, pcPrizeMoney: 0 },
    { name: "Ben Pratnemer", country: "Słowenia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 23250, proTourPrizeMoney: 19500, pcPrizeMoney: 0 },
    { name: "Ollie Bates", country: "Anglia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 23250, proTourPrizeMoney: 20250, pcPrizeMoney: 0 },
    { name: "Tom Morris", country: "Anglia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 23000, proTourPrizeMoney: 23000, pcPrizeMoney: 0 },
    { name: "Ty Thorp", country: "Anglia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 22750, proTourPrizeMoney: 21500, pcPrizeMoney: 0 },
    { name: "Nial Culleton", country: "Irlandia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 22750, proTourPrizeMoney: 19750, pcPrizeMoney: 0 },
    { name: "Scot Waites", country: "Anglia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 22500, proTourPrizeMoney: 20000, pcPrizeMoney: 0 },
    { name: "Craig Landman", country: "Holandia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 20750, proTourPrizeMoney: 19500, pcPrizeMoney: 0 },
    { name: "Jake Tweddell", country: "Anglia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 20500, proTourPrizeMoney: 18000, pcPrizeMoney: 0 },
    { name: "Steve Burton", country: "Anglia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 20500, proTourPrizeMoney: 18500, pcPrizeMoney: 0 },
    { name: "Martin Dragt", country: "Holandia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 20250, proTourPrizeMoney: 20250, pcPrizeMoney: 0 },
    { name: "Sander Lap", country: "Holandia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 19250, proTourPrizeMoney: 18000, pcPrizeMoney: 0 },
    { name: "Max Czerwinsky", country: "Niemcy", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 18750, proTourPrizeMoney: 8500, pcPrizeMoney: 0 },
    { name: "Reece Griffin", country: "Walia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 18000, proTourPrizeMoney: 15750, pcPrizeMoney: 0 },
    { name: "Arnold Merk", country: "Niemcy", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 17750, proTourPrizeMoney: 16500, pcPrizeMoney: 0 },
    { name: "Dirk Coulson", country: "Anglia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 17750, proTourPrizeMoney: 17750, pcPrizeMoney: 0 },
    { name: "Tom Lishman", country: "Anglia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 17500, proTourPrizeMoney: 17500, pcPrizeMoney: 0 },
    { name: "Adam Leak", country: "Anglia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 17250, proTourPrizeMoney: 16000, pcPrizeMoney: 0 },
    { name: "Steve Rosney", country: "Irlandia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 15750, proTourPrizeMoney: 13750, pcPrizeMoney: 0 },
    { name: "Tytus Kanicki", country: "Polska", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 15000, proTourPrizeMoney: 7500, pcPrizeMoney: 0 },
    { name: "Stefan Henderyck", country: "Belgia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 14250, proTourPrizeMoney: 5500, pcPrizeMoney: 0 },
    { name: "Steven Lennon", country: "Irlandia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 13750, proTourPrizeMoney: 13750, pcPrizeMoney: 0 },
    { name: "Nate Potter", country: "Anglia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 13000, proTourPrizeMoney: 13000, pcPrizeMoney: 0 },
    { name: "Henry Ward", country: "Anglia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 13000, proTourPrizeMoney: 13000, pcPrizeMoney: 0 },
    { name: "Stefan Belmondo", country: "Szwajcaria", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 12750, proTourPrizeMoney: 12000, pcPrizeMoney: 0 },
    { name: "Yorik Hofens", country: "Belgia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 12500, proTourPrizeMoney: 12500, pcPrizeMoney: 0 },
    { name: "Pascal Rupp", country: "Niemcy", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 12250, proTourPrizeMoney: 9500, pcPrizeMoney: 0 },
    { name: "Sam Price", country: "Anglia", ovr: 60, scoring: 60, doubles: 60, prizeMoney: 10750, proTourPrizeMoney: 10750, pcPrizeMoney: 0 },
    { name: "Karl Sneyd", country: "Anglia", ovr: 60, scoring: 61, doubles: 59, prizeMoney: 10500, proTourPrizeMoney: 10500, pcPrizeMoney: 0 },
    { name: "Rusty Rodriguez", country: "Austria", ovr: 59, scoring: 60, doubles: 58, prizeMoney: 10000, proTourPrizeMoney: 10000, pcPrizeMoney: 0 },
    { name: "Dan Ayres", country: "Anglia", ovr: 59, scoring: 60, doubles: 58, prizeMoney: 9750, proTourPrizeMoney: 9750, pcPrizeMoney: 0 },
    { name: "Marv Kraft", country: "Niemcy", ovr: 59, scoring: 60, doubles: 58, prizeMoney: 9500, proTourPrizeMoney: 9500, pcPrizeMoney: 0 },
    { name: "Paul Krohn", country: "Niemcy", ovr: 59, scoring: 60, doubles: 58, prizeMoney: 9500, proTourPrizeMoney: 9500, pcPrizeMoney: 0 },
    { name: "Borna Krcmar", country: "Chorwacja", ovr: 59, scoring: 60, doubles: 58, prizeMoney: 8500, proTourPrizeMoney: 8500, pcPrizeMoney: 0 },
    { name: "Dan Klose", country: "Niemcy", ovr: 59, scoring: 60, doubles: 58, prizeMoney: 8250, proTourPrizeMoney: 8250, pcPrizeMoney: 0 },
    { name: "Arthur Baetens", country: "Belgia", ovr: 59, scoring: 60, doubles: 58, prizeMoney: 8000, proTourPrizeMoney: 8000, pcPrizeMoney: 0 },
    { name: "Mike Unterbuchner", country: "Niemcy", ovr: 58, scoring: 59, doubles: 57, prizeMoney: 7500, proTourPrizeMoney: 7500, pcPrizeMoney: 0 },
    { name: "Jens Schmidt", country: "Niemcy", ovr: 58, scoring: 59, doubles: 57, prizeMoney: 7000, proTourPrizeMoney: 7000, pcPrizeMoney: 0 },
    { name: "Patrik Kovac", country: "Węgry", ovr: 58, scoring: 59, doubles: 57, prizeMoney: 7000, proTourPrizeMoney: 7000, pcPrizeMoney: 0 },
    { name: "Lew Pride", country: "Anglia", ovr: 58, scoring: 59, doubles: 57, prizeMoney: 6500, proTourPrizeMoney: 6500, pcPrizeMoney: 0 },
    { name: "Petar Ljubic", country: "Chorwacja", ovr: 58, scoring: 59, doubles: 57, prizeMoney: 6500, proTourPrizeMoney: 6500, pcPrizeMoney: 0 },
    { name: "Drago Horvat", country: "Niemcy", ovr: 58, scoring: 59, doubles: 57, prizeMoney: 5500, proTourPrizeMoney: 5500, pcPrizeMoney: 0 },
    { name: "Marc Hausotter", country: "Niemcy", ovr: 58, scoring: 59, doubles: 57, prizeMoney: 5500, proTourPrizeMoney: 5500, pcPrizeMoney: 0 },
    { name: "Chris Wickenden", country: "Anglia", ovr: 58, scoring: 59, doubles: 57, prizeMoney: 5000, proTourPrizeMoney: 5000, pcPrizeMoney: 0 },
    { name: "Ollie Mitchell", country: "Anglia", ovr: 57, scoring: 58, doubles: 56, prizeMoney: 4250, proTourPrizeMoney: 4250, pcPrizeMoney: 0 },
    { name: "Jan Engstrom", country: "Szwecja", ovr: 57, scoring: 58, doubles: 56, prizeMoney: 4000, proTourPrizeMoney: 4000, pcPrizeMoney: 0 },
    { name: "Finn Behren", country: "Niemcy", ovr: 57, scoring: 58, doubles: 56, prizeMoney: 4000, proTourPrizeMoney: 4000, pcPrizeMoney: 0 },
    { name: "Cal Goffin", country: "Walia", ovr: 57, scoring: 58, doubles: 56, prizeMoney: 4000, proTourPrizeMoney: 4000, pcPrizeMoney: 0 },
    { name: "Anton Ostlund", country: "Szwecja", ovr: 57, scoring: 58, doubles: 56, prizeMoney: 4000, proTourPrizeMoney: 4000, pcPrizeMoney: 0 },
    { name: "Adam Kirk", country: "Anglia", ovr: 57, scoring: 58, doubles: 56, prizeMoney: 3750, proTourPrizeMoney: 3750, pcPrizeMoney: 0 },
    { name: "Filip Berezka", country: "Polska", ovr: 57, scoring: 58, doubles: 56, prizeMoney: 3750, proTourPrizeMoney: 3750, pcPrizeMoney: 0 },
    { name: "Scot Campbell", country: "Anglia", ovr: 57, scoring: 58, doubles: 56, prizeMoney: 3750, proTourPrizeMoney: 3750, pcPrizeMoney: 0 },
    { name: "Valter Melder", country: "Łotwa", ovr: 56, scoring: 57, doubles: 55, prizeMoney: 3500, proTourPrizeMoney: 3500, pcPrizeMoney: 0 },
    { name: "Jake Aldridge", country: "Anglia", ovr: 56, scoring: 57, doubles: 55, prizeMoney: 3250, proTourPrizeMoney: 3250, pcPrizeMoney: 0 },
    { name: "Pat Williams", country: "Anglia", ovr: 56, scoring: 57, doubles: 55, prizeMoney: 3000, proTourPrizeMoney: 3000, pcPrizeMoney: 0 },
    { name: "Tom Evetts", country: "Anglia", ovr: 56, scoring: 57, doubles: 55, prizeMoney: 2500, proTourPrizeMoney: 2500, pcPrizeMoney: 0 },
    { name: "Greg Hall", country: "Anglia", ovr: 56, scoring: 57, doubles: 55, prizeMoney: 2500, proTourPrizeMoney: 2500, pcPrizeMoney: 0 },
    { name: "Jamie Van de Weerd", country: "Holandia", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "Michael Smejda", country: "Czechy", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "Mika Varila", country: "Finlandia", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "Adrian Dudziak", country: "Polska", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "Gabor Varaljay", country: "Słowacja", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "Jano Sliacky", country: "Słowacja", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "Jaro Holub", country: "Słowacja", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "Pete Kelemen", country: "Węgry", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "Jake Riedtke", country: "Niemcy", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "Norbert Major", country: "Węgry", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "Timo Harju", country: "Finlandia", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "George Jehirszki", country: "Węgry", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "Liam Lawrence", country: "Niemcy", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 },
    { name: "Arthur Hardy", country: "Anglia", ovr: 55, scoring: 56, doubles: 54, prizeMoney: 2000, proTourPrizeMoney: 2000, pcPrizeMoney: 0 }
];

// --- BAZA TURNIEJÓW ---
const tournamentDatabase = [
    // --- LUTY (Miesiąc 1) ---
    { name: "Pro Players Cup 1", month: 1, day: 3, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Pro Players Cup 2", month: 1, day: 4, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Global Darts League - Night 1", month: 1, day: 5, city: "Newcastle", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Global Darts League - Night 2", month: 1, day: 12, city: "Antwerpia", country: "Belgia", minOvr: 0, format: "501" },
    { name: "Global Darts League - Night 3", month: 1, day: 19, city: "Glasgow", country: "Szkocja", minOvr: 0, format: "501" },
    { name: "Continental Tour 1", month: 1, day: 20, endDay: 22, format: "legs", minOvr: 55, city: "Kraków", country: "Polska" },
    { name: "Global Darts League - Night 4", month: 1, day: 26, city: "Belfast", country: "Irlandia Północna", minOvr: 0, format: "501" },
    { name: "Continental Tour 2", month: 1, day: 27, endDay: 29, format: "legs", minOvr: 55, city: "Wieze", country: "Belgia" },

    // --- MARZEC (Miesiąc 2) ---
    { name: "Global Darts League - Night 5", month: 2, day: 5, city: "Cardiff", country: "Walia", minOvr: 0, format: "501" },
    { name: "British Open", month: 2, day: 6, endDay: 8, format: "legs", minOvr: 0, city: "Minehead", country: "Anglia" },
    { name: "Pro Players Cup 3", month: 2, day: 10, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Pro Players Cup 4", month: 2, day: 11, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Global Darts League - Night 6", month: 2, day: 12, city: "Nottingham", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 3", month: 2, day: 13, endDay: 15, format: "legs", minOvr: 55, city: "Göttingen", country: "Niemcy" },
    { name: "Continental Tour 4", month: 2, day: 18, endDay: 20, format: "legs", minOvr: 55, city: "Monachium", country: "Niemcy" },
    { name: "Global Darts League - Night 7", month: 2, day: 19, city: "Dublin", country: "Irlandia", minOvr: 0, format: "501" },
    { name: "Continental Tour 5", month: 2, day: 25, endDay: 27, format: "legs", minOvr: 55, city: "Riesa", country: "Niemcy" },
    { name: "Global Darts League - Night 8", month: 2, day: 26, city: "Berlin", country: "Niemcy", minOvr: 0, format: "501" },

    // --- KWIECIEŃ (Miesiąc 3) ---
    { name: "Global Darts League - Night 9", month: 3, day: 2, city: "Manchester", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Pro Players Cup 5", month: 3, day: 8, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Pro Players Cup 6", month: 3, day: 9, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Global Darts League - Night 10", month: 3, day: 9, city: "Brighton", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 6", month: 3, day: 15, endDay: 17, format: "legs", minOvr: 55, city: "Sindelfingen", country: "Niemcy" },
    { name: "Global Darts League - Night 11", month: 3, day: 16, city: "Rotterdam", country: "Holandia", minOvr: 0, format: "501" },
    { name: "Global Darts League - Night 12", month: 3, day: 23, city: "Liverpool", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Global Darts League - Night 13", month: 3, day: 30, city: "Aberdeen", country: "Szkocja", minOvr: 0, format: "501" },
    
    // --- MAJ (Miesiąc 4) ---
    { name: "Pro Players Cup 7", month: 4, day: 4, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Pro Players Cup 8", month: 4, day: 5, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Global Darts League - Night 14", month: 4, day: 7, city: "Leeds", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 7", month: 4, day: 8, endDay: 10, format: "legs", minOvr: 55, city: "Graz", country: "Austria" },
    { name: "Global Darts League - Night 15", month: 4, day: 14, city: "Birmingham", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 8", month: 4, day: 21, endDay: 23, format: "legs", minOvr: 55, city: "Leverkusen", country: "Niemcy" },
    { name: "Global Darts League - Night 16", month: 4, day: 21, city: "Sheffield", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Global Darts League - Play-offs", month: 4, day: 28, city: "Londyn", country: "Anglia", minOvr: 0, format: "501" },

    // --- CZERWIEC (Miesiąc 5) ---
    { name: "Pro Players Cup 9", month: 5, day: 11, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Pro Players Cup 10", month: 5, day: 12, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Continental Tour 9", month: 5, day: 19, endDay: 21, format: "legs", minOvr: 55, city: "Bratysława", country: "Słowacja" },
    { name: "Pro Players Cup 11", month: 5, day: 28, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Pro Players Cup 12", month: 5, day: 29, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },

    // --- LIPIEC (Miesiąc 6) ---
    { name: "Pro Players Cup 13", month: 6, day: 10, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Pro Players Cup 14", month: 6, day: 11, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Continental Tour 10", month: 6, day: 16, endDay: 18, format: "legs", minOvr: 55, city: "Hildesheim", country: "Niemcy" },
    { name: "Global Matchplay", month: 6, day: 22, endDay: 30, format: "legs", minOvr: 65, city: "Blackpool", country: "Anglia" },

    // --- SIERPIEŃ (Miesiąc 7) ---
    { name: "Pro Players Cup 15", month: 7, day: 2, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Pro Players Cup 16", month: 7, day: 3, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Continental Tour 11", month: 7, day: 6, endDay: 8, format: "legs", minOvr: 55, city: "Antwerpia", country: "Belgia" },
    { name: "Pro Players Cup 17", month: 7, day: 22, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Continental Tour 12", month: 7, day: 24, endDay: 26, format: "legs", minOvr: 55, city: "Budapeszt", country: "Węgry" },

    // --- WRZESIEŃ (Miesiąc 8) ---
    { name: "Pro Players Cup 18", month: 8, day: 1, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Pro Players Cup 19", month: 8, day: 2, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Global Grand Prix", month: 8, day: 7, endDay: 13, format: "DIDO", minOvr: 65, city: "Leicester", country: "Anglia" },
    { name: "Continental Tour 13", month: 8, day: 18, endDay: 20, format: "legs", minOvr: 55, city: "Praga", country: "Czechy" },

    // --- PAŹDZIERNIK (Miesiąc 9) ---
    { name: "Pro Players Cup 20", month: 9, day: 1, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Pro Players Cup 21", month: 9, day: 2, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Continental Tour 14", month: 9, day: 9, endDay: 11, format: "legs", minOvr: 55, city: "Bazylea", country: "Szwajcaria" },
    { name: "Continental Tour 15", month: 9, day: 16, endDay: 18, format: "legs", minOvr: 55, city: "Maastricht", country: "Holandia" },
    { name: "Pro Players Cup 22", month: 9, day: 24, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Continental Championship", month: 9, day: 28, endDay: 31, format: "legs", minOvr: 60, city: "Dortmund", country: "Niemcy" },

    // --- LISTOPAD (Miesiąc 10) ---
    { name: "Pro Players Cup 23", month: 10, day: 4, format: "legs", minOvr: 0, city: "Barnsley", country: "Anglia" },
    { name: "Pro Players Cup 24", month: 10, day: 5, format: "legs", minOvr: 0, city: "Barnsley", country: "Anglia" },
    { name: "Pro Players Cup 25", month: 10, day: 11, format: "legs", minOvr: 0, city: "Barnsley", country: "Anglia" },
    { name: "Champion's Slam", month: 10, day: 16, endDay: 24, format: "legs", minOvr: 65, city: "Wolverhampton", country: "Anglia" },
    { name: "Pro Players Finals", month: 10, day: 27, endDay: 29, format: "legs", minOvr: 60, city: "Minehead", country: "Anglia" },

    // --- GRUDZIEŃ (Miesiąc 11) ---
    { name: "Global Darts Championship", month: 11, day: 15, endDay: 31, format: "sets", minOvr: 60, city: "Londyn", country: "Anglia" }
];

// --- BAZA OSIĄGNIĘĆ ---
        const achievementsDB = [
            // KARIERA / STATYSTYKI
            { id: "first_win", icon: "🏆", title_pl: "Pierwsza Krew", desc_pl: "Wygraj swój pierwszy profesjonalny turniej.", target: 1, type: "tour_win", rewardMoney: 5000, title_en: "First Blood", desc_en: "Win your first professional tournament." },
            { id: "180_machine", icon: "🎯", title_pl: "Maszyna 180", desc_pl: "Rzuć łącznie 100 maxów (180) w karierze.", target: 100, type: "180s", rewardMoney: 15000, title_en: "180 Machine", desc_en: "Hit a total of 100 maximums (180s) in your career." },
            { id: "ton_plus_finisher", icon: "💯", title_pl: "Klub 100+", desc_pl: "Zamknij 100 lub więcej punktów 100 razy w karierze.", target: 100, type: "100plus_checkouts", rewardMoney: 20000, title_en: "Ton+ Finisher", desc_en: "Checkout 100 or more points 100 times in your career." },
            { id: "big_fish", icon: "🎣", title_pl: "Gruba Ryba (Big Fish)", desc_pl: "Zakończ lega najwyższym możliwym zamkiem (170).", target: 1, type: "170_checkout", rewardMoney: 25000, title_en: "The Big Fish", desc_en: "Finish a leg with the highest possible checkout (170)." },
            { id: "sudden_death", icon: "🥶", title_pl: "Stalowe Nerwy", desc_pl: "Wygraj mecz w rundzie nagłej śmierci (Sudden Death).", target: 1, type: "sudden_death", rewardMoney: 10000, title_en: "Nerves of Steel", desc_en: "Win a match in a sudden death round." },
            { id: "nine_darter", icon: "🦄", title_pl: "Święty Graal", desc_pl: "Rzuć 9-dartera w oficjalnym meczu.", target: 1, type: "9darter", rewardMoney: 100000, title_en: "Holy Grail", desc_en: "Hit a 9-darter in an official match." },
            
            // RANKINGI
            { id: "rank_64", icon: "🎫", title_pl: "Karta Tour Card", desc_pl: "Awansuj do Top 64 głównego rankingu Order of Merit.", target: 1, type: "rank", rankTarget: 64, rewardMoney: 10000, title_en: "Tour Card Holder", desc_en: "Reach the Top 64 in the main Order of Merit." },
            { id: "rank_32", icon: "⭐", title_pl: "Rozstawiony", desc_pl: "Awansuj do Top 32 głównego rankingu Order of Merit.", target: 1, type: "rank", rankTarget: 32, rewardMoney: 25000, title_en: "Seeded Player", desc_en: "Reach the Top 32 in the main Order of Merit." },
            { id: "rank_16", icon: "🔥", title_pl: "Elita", desc_pl: "Awansuj do Top 16 głównego rankingu Order of Merit.", target: 1, type: "rank", rankTarget: 16, rewardMoney: 50000, title_en: "The Elite", desc_en: "Reach the Top 16 in the main Order of Merit." },
            { id: "rank_5", icon: "💎", title_pl: "Ścisła Czołówka", desc_pl: "Awansuj do Top 5 głównego rankingu Order of Merit.", target: 1, type: "rank", rankTarget: 5, rewardMoney: 100000, title_en: "Top Contender", desc_en: "Reach the Top 5 in the main Order of Merit." },
            { id: "rank_1", icon: "👑", title_pl: "Numer 1 na Świecie", desc_pl: "Zostań liderem rankingu Order of Merit.", target: 1, type: "rank", rankTarget: 1, rewardMoney: 250000, title_en: "World Number 1", desc_en: "Become the leader of the Order of Merit." },

            // TURNIEJE
            { id: "win_et", icon: "🇪🇺", title_pl: "Europejski Podbój", desc_pl: "Wygraj turniej z cyklu European Tour.", target: 1, type: "specific_tour", tourMatch: "European Tour", rewardMoney: 15000, title_en: "European Conquest", desc_en: "Win a European Tour event." },
            { id: "win_pcf", icon: "🎯", title_pl: "Mistrz Podłogi", desc_pl: "Wygraj finały Players Championship.", target: 1, type: "specific_tour", tourMatch: "Players Championship Finals", rewardMoney: 25000, title_en: "Floor Master", desc_en: "Win the Players Championship Finals." },
            { id: "win_wgp", icon: "🇮🇪", title_pl: "Mistrz Double-In", desc_pl: "Wygraj World Grand Prix.", target: 1, type: "specific_tour", tourMatch: "Grand Prix", rewardMoney: 30000, title_en: "Double-In Master", desc_en: "Win the World Grand Prix." },
            { id: "win_ukopen", icon: "🇬🇧", title_pl: "FA Cup of Darts", desc_pl: "Wygraj turniej UK Open.", target: 1, type: "specific_tour", tourMatch: "UK Open", rewardMoney: 20000, title_en: "FA Cup of Darts", desc_en: "Win the UK Open tournament." },
            { id: "win_matchplay", icon: "🏖️", title_pl: "Król Blackpool", desc_pl: "Wygraj World Matchplay.", target: 1, type: "specific_tour", tourMatch: "Matchplay", rewardMoney: 30000, title_en: "King of Blackpool", desc_en: "Win the World Matchplay." },
            { id: "win_gdl", icon: "🏟️", title_pl: "Dominator Ligi", desc_pl: "Wygraj finały Premier League / GDL Play-offs.", target: 1, type: "specific_tour", tourMatch: "Play-offs", rewardMoney: 40000, title_en: "League Dominator", desc_en: "Win the Premier League / GDL Play-offs." },
            { id: "win_worlds", icon: "🌍", title_pl: "Mistrz Świata", desc_pl: "Wygraj World Darts Championship.", target: 1, type: "specific_tour", tourMatch: "World Darts Championship", rewardMoney: 150000, title_en: "World Champion", desc_en: "Win the World Darts Championship." }
        ];

        // --- BAZA WYWIADÓW TELEWIZYJNYCH ---
const interviewsDB = [
    {
        title_pl: "🎤 Wywiad po meczu", title_en: "🎤 Post-match Interview", title_de: "🎤 Interview nach dem Spiel", title_nl: "🎤 Interview na de wedstrijd",
        desc_pl: "Dziennikarz Cloud Sports pyta: 'Kibice na hali gwizdali dzisiaj przy Twoich podwójnych. Jak sobie z tym radzisz?'",
        desc_en: "Cloud Sports reporter asks: 'The crowd was whistling during your doubles tonight. How do you deal with that?'",
        desc_de: "Ein Cloud Sports-Reporter fragt: 'Die Zuschauer haben heute bei deinen Doubles gepfiffen. Wie gehst du damit um?'",
        desc_nl: "Cloud Sports-verslaggever vraagt: 'Het publiek floot vanavond tijdens je dubbels. Hoe ga je daarmee om?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Zawsze skupiam się tylko na tarczy. Szanuję kibiców, to część tego sportu.",
                text_en: "[Professionalism] I always focus purely on the board. I respect the crowd, it's part of the sport.",
                text_de: "[Professionalität] Ich konzentriere mich nur auf das Board. Ich respektiere die Fans, das gehört dazu.",
                text_nl: "[Professionaliteit] Ik focus me puur op het bord. Ik respecteer het publiek, het hoort erbij.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Eksperci chwalą Twój chłodny profesjonalizm.", outcome_en: "Pundits praise your cool professionalism.", outcome_de: "Experten loben deine professionelle Gelassenheit.", outcome_nl: "Analisten prijzen je professionele kalmte."
            },
            {
                text_pl: "[Medialność] Niech sobie gwiżdżą! I tak zamknąłem decydującego lega. Kocham uciszać halę!",
                text_en: "[Showmanship] Let them whistle! I still pinned the winning double. I love silencing the crowd!",
                text_de: "[Showmanship] Sollen sie doch pfeifen! Ich habe das Doppel trotzdem getroffen. Ich liebe es, die Halle zum Schweigen zu bringen!",
                text_nl: "[Showmanship] Laat ze maar fluiten! Ik raakte de winnende dubbel toch wel. Heerlijk om de zaal stil te krijgen!",
                effect: { prof: -3, pop: 4 },
                outcome_pl: "Internet płonie! Twoja bezczelność przyciąga rzesze nowych fanów.", outcome_en: "The internet is on fire! Your swagger attracts crowds of new fans.", outcome_de: "Das Internet brennt! Deine freche Art bringt dir viele neue Follower.", outcome_nl: "Het internet ontploft! Je bravoure trekt hordes nieuwe fans aan."
            }
        ]
    },
    {
        title_pl: "🎤 Studio DartsZone", title_en: "🎤 DartsZone Studio", title_de: "🎤 DartsZone Studio", title_nl: "🎤 DartsZone Studio",
        desc_pl: "Ekspert pyta: 'Twój kolejny rywal twierdzi, że gładko Cię ogra. Co mu odpowiesz?'",
        desc_en: "Pundit asks: 'Your next opponent claims he will easily blow you away. What's your response?'",
        desc_de: "Der Experte fragt: 'Dein nächster Gegner behauptet, er wird dich leicht schlagen. Deine Antwort?'",
        desc_nl: "De analist vraagt: 'Je volgende tegenstander beweert dat hij makkelijk van je wint. Wat zeg je daarop?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Tarcza wszystko zweryfikuje. Będę przygotowany na 100%.",
                text_en: "[Professionalism] The board does the talking. I will be 100% prepared.",
                text_de: "[Professionalität] Das Board wird die Antwort geben. Ich werde zu 100% bereit sein.",
                text_nl: "[Professionaliteit] Het bord zal het uitwijzen. Ik zal 100% voorbereid zijn.",
                effect: { prof: 2, pop: 0 },
                outcome_pl: "Spokojna, dojrzała wypowiedź. Zyskujesz szacunek w szatni.", outcome_en: "A mature, calm statement. You gain respect in the locker room.", outcome_de: "Eine reife, ruhige Aussage. Du gewinnst Respekt im Spielbereich.", outcome_nl: "Een volwassen, rustige reactie. Je wint respect in de kleedkamer."
            },
            {
                text_pl: "[Medialność] Może tak gadać, dopóki nie dostanie lania. Szybko pożałuje tych słów!",
                text_en: "[Showmanship] Big talk until he gets battered. He will regret saying that very soon!",
                text_de: "[Showmanship] Große Worte, bis er verliert. Er wird diese Worte sehr schnell bereuen!",
                text_nl: "[Showmanship] Grote woorden tot hij verliest. Hij krijgt heel snel spijt van die uitspraak!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Mocny trash-talk! Telewizja zapowiada ten pojedynek jako starcie wagi ciężkiej.", outcome_en: "Spicy trash-talk! TV promoters hype this up as a heavyweight clash.", outcome_de: "Heißer Trash-Talk! Das Fernsehen kündigt das Duell als Blockbuster an.", outcome_nl: "Pittige trash-talk! De tv kondigt dit duel aan als een titanenstrijd."
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Wywiadów ITVee", title_en: "🎤 ITVee Flash Zone", title_de: "🎤 ITVee Flash-Zone", title_nl: "🎤 ITVee Flash Zone",
        desc_pl: "Dziennikarz: 'Zanotowałeś dziś wybitną średnią powyżej 105 punktów. Jesteś w życiowej formie?'",
        desc_en: "Reporter: 'You averaged over 105 tonight. Are you playing the best darts of your life?'",
        desc_de: "Reporter: 'Du hattest heute einen Schnitt von über 105. Spielst du die besten Darts deines Lebens?'",
        desc_nl: "Verslaggever: 'Je gooide vanavond ruim 105 gemiddeld. Speel je de beste darts uit je leven?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] To owoc godzin spędzonych na tarczy treningowej, ale to dopiero początek.",
                text_en: "[Professionalism] It's the result of hours on the practice board, but the job is not done.",
                text_de: "[Professionalität] Das ist das Ergebnis harter Arbeit am Trainingsboard, aber es ist noch ein weiter Weg.",
                text_nl: "[Professionaliteit] Dit is het resultaat van urenlang trainen, maar we zijn er nog lang niet.",
                effect: { prof: 4, pop: -1 },
                outcome_pl: "Kibice doceniają Twoją etykę pracy i skromność.", outcome_en: "Fans appreciate your work ethic and modesty.", outcome_de: "Die Fans schätzen deine Arbeitsmoral und Bescheidenheit.", outcome_nl: "Fans waarderen je werkethiek en bescheidenheid."
            },
            {
                text_pl: "[Medialność] Kiedy rzucam w ten sposób, nikt na tej planecie nie jest w stanie mnie zatrzymać!",
                text_en: "[Showmanship] When I'm in this rhythm, nobody on this planet can stop me!",
                text_de: "[Showmanship] Wenn ich in diesem Rhythmus bin, kann mich niemand auf diesem Planeten stoppen!",
                text_nl: "[Showmanship] Als ik zo gooi, kan niemand op deze planeet me stoppen!",
                effect: { prof: -5, pop: 6 },
                outcome_pl: "Cytat obiega wszystkie portale społecznościowe!", outcome_en: "Your quote goes viral across all social media platforms!", outcome_de: "Dein Zitat geht in allen sozialen Medien viral!", outcome_nl: "Je quote gaat viraal op alle sociale kanalen!"
            }
        ]
    },
    {
        title_pl: "🎤 Konferencja Prasowa", title_en: "🎤 Press Conference", title_de: "🎤 Pressekonferenz", title_nl: "🎤 Persconferentie",
        desc_pl: "Pytanie od Viaplayr: 'Czy Twoja głośna celebracja po wygranym legu nie była przesadą w stronę rywala?'",
        desc_en: "Question from Viaplayr: 'Was your wild celebration after that leg a bit disrespectful to your rival?'",
        desc_de: "Frage von Viaplayr: 'War dein wilder Jubel nach dem Leg etwas respektlos gegenüber dem Gegner?'",
        desc_nl: "Vraag van Viaplayr: 'Was je uitbundige viering na die leg niet een beetje respectloos naar je rivaal?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Przepraszam, jeśli to tak wyglądało. To były czyste sportowe emocje w kluczowym momencie.",
                text_en: "[Professionalism] I apologize if it looked that way. It was just pure emotion in a crucial moment.",
                text_de: "[Professionalität] Entschuldigung, falls es so aussah. Das waren reine Emotionen in einem Schlüsselmoment.",
                text_nl: "[Professionaliteit] Mijn excuses als het zo leek. Het was pure ontlading op een belangrijk moment.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Sędziowie i oficjele chwalą Twoją klasę.", outcome_en: "Officials and tournament directors praise your class.", outcome_de: "Offizielle loben deine sportliche Größe.", outcome_nl: "Officials en toernooidirectie prijzen je klasse."
            },
            {
                text_pl: "[Medialność] To jest wielka scena, a nie partia szachów! Jeśli rywal nie potrafi tego znieść, niech zmieni dyscyplinę.",
                text_en: "[Showmanship] This is big-time entertainment, not chess! If he can't handle it, play something else.",
                text_de: "[Showmanship] Das ist die große Bühne und kein Schach! Wenn er das nicht aushält, soll er was anderes spielen.",
                text_nl: "[Showmanship] Dit is topsport en entertainment, geen schaken! Als hij er niet tegen kan, moet hij wat anders gaan doen.",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Nagranie z Twoim krzykiem trafia na czołówki gazet sportowych!", outcome_en: "Footage of your roar leads every major sports news outlet!", outcome_de: "Der Clip mit deinem Brüllen landet auf allen Titelseiten!", outcome_nl: "De beelden van je schreeuw halen alle sportvoorpagina's!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po zaciętym thrillerze", title_en: "🎤 Thriller Post-Match", title_de: "🎤 Nach dem Nervenkrimi", title_nl: "🎤 Na de zenuwslopende partij",
        desc_pl: "Darts Talk: 'Wygrałeś decydującego lega rzutem w sam środek tarczy. Co działo się w Twojej głowie?'",
        desc_en: "Darts Talk: 'You took out the decider on the Bullseye. What was going through your mind?'",
        desc_de: "Darts Talk: 'Du hast das Decider-Leg auf dem Bullseye geholt. Was ging dir durch den Kopf?'",
        desc_nl: "Darts Talk: 'Je pakte de beslissende leg via de Bullseye. Wat ging er door je heen?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Ćwiczyłem ten scenariusz setki razy. Po prostu zaufałem technice rzutu.",
                text_en: "[Professionalism] I've drilled that scenario hundreds of times. I simply trusted my mechanics.",
                text_de: "[Professionalität] Ich habe dieses Szenario hundertmal trainiert. Ich habe meiner Technik vertraut.",
                text_nl: "[Professionaliteit] Ik heb dit scenario honderden keren getraind. Ik vertrouwde op mijn techniek.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Trenerzy stawiają Cię za wzór opanowania.", outcome_en: "Coaches use your routine as a textbook example.", outcome_de: "Trainer nutzen deinen Wurf als Paradebeispiel.", outcome_nl: "Trainers noemen jouw routine een schoolvoorbeeld."
            },
            {
                text_pl: "[Medialność] Miałem w żyłach lód. Zrobiłem to dla widowiska, wiedziałem, że trybuny eksplodują!",
                text_en: "[Showmanship] Pure ice in my veins. Did it for the show, I knew the crowd would lose their minds!",
                text_de: "[Showmanship] Eis in meinen Adern. Ich tat es für die Show, ich wusste, die Fans rasten aus!",
                text_nl: "[Showmanship] Ijs in mijn aderen. Ik deed het voor de show, ik wist dat het dak eraf zou gaan!",
                effect: { prof: -2, pop: 4 },
                outcome_pl: "Komentatorzy okrzyknęli Cię graczem o nerwach ze stali.", outcome_en: "Commentators label you the coldest clutch player in darts.", outcome_de: "Kommentatoren nennen dich den eiskaltesten Crunch-Time-Spieler.", outcome_nl: "Commentatoren noemen je de meest ijskoude speler van het circuit."
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad dla Sport1 TV", title_en: "🎤 Sport1 TV Interview", title_de: "🎤 Sport1 TV Interview", title_nl: "🎤 Sport1 TV Interview",
        desc_pl: "Dziennikarz pyta: 'Twoja nowa koszulka meczowa i muzyka na wejście wzbudzają spore kontrowersje. Dlaczego taka zmiana?'",
        desc_en: "Reporter asks: 'Your new walk-on track and match shirt sparked a lot of debate. Why the drastic change?'",
        desc_de: "Reporter fragt: 'Dein neuer Walk-on-Song und dein Trikot sorgen für Diskussionen. Warum der Wechsel?'",
        desc_nl: "Verslaggever vraagt: 'Je nieuwe opkomstmuziek en shirt zorgen voor veel ophef. Waarom die verandering?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Sprzęt i strój mają być przede wszystkim wygodne, by nic nie przeszkadzało w rzucie.",
                text_en: "[Professionalism] My shirt and gear just need to be comfortable so nothing interferes with my throw.",
                text_de: "[Professionalität] Kleidung und Darts müssen bequem sein, damit der Wurf nicht gestört wird.",
                text_nl: "[Professionaliteit] Mijn kleding moet vooral comfortabel zijn zodat niets mijn worp hindert.",
                effect: { prof: 2, pop: -1 },
                outcome_pl: "Skupienie na sporcie zyskuje uznanie ekspertów.", outcome_en: "Focusing purely on the game earns you respect from purists.", outcome_de: "Der pure Fokus auf den Sport gefällt den Traditionalisten.", outcome_nl: "De pure focus op het spel wordt gewaardeerd door kenners."
            },
            {
                text_pl: "[Medialność] Bo tworzę markę! Ludzie przychodzą oglądać show, a ja daję im powód do zapamiętania mnie.",
                text_en: "[Showmanship] Because I'm building a brand! People pay to see rockstars, and I deliver.",
                text_de: "[Showmanship] Weil ich eine Marke baue! Die Leute wollen Rockstars sehen, und ich liefere ab.",
                text_nl: "[Showmanship] Omdat ik aan een merk bouw! Mensen betalen voor een show en ik lever die.",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Twoja koszulka bije rekordy sprzedaży w oficjalnym sklepie!", outcome_en: "Your match shirt breaks sales records in the merchandise shop!", outcome_de: "Dein Trikot bricht Verkaufsrekorde im Merchandise-Shop!", outcome_nl: "Je shirt breekt verkooprecords in de fanshop!"
            }
        ]
    },
    {
        title_pl: "🎤 Rozmowa w strefie mieszanej", title_en: "🎤 Mixed Zone Chat", title_de: "🎤 Mixed-Zone Interview", title_nl: "🎤 Mixed Zone Gesprek",
        desc_pl: "PDChat: 'Wielu zarzuca Ci, że rzucasz za wolno i celowo wybijasz rywali z rytmu. Odpowiesz na te zarzuty?'",
        desc_en: "PDChat asks: 'Critics say you throw too slowly and intentionally disrupt your opponent's rhythm. Thoughts?'",
        desc_de: "PDChat fragt: 'Kritiker sagen, du wirfst zu langsam und störst absichtlich den Rhythmus der Gegner. Was sagst du?'",
        desc_nl: "PDChat: 'Critici beweren dat je te traag gooit en bewust het ritme van je tegenstander breekt. Jouw reactie?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Każdy ma swój naturalny rytm oddechowy. Gram zgodnie z przepisami federacji.",
                text_en: "[Professionalism] Everyone has their own natural cadence. I play strictly within PDC rules.",
                text_de: "[Professionalität] Jeder hat seinen natürlichen Rhythmus. Ich halte mich streng an die PDC-Regeln.",
                text_nl: "[Professionaliteit] Iedereen heeft zijn eigen natuurlijke ritme. Ik speel strikt volgens de PDC-regels.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Zamykasz temat bez wywoływania zbędnego skandalu.", outcome_en: "You shut down the controversy with elegance.", outcome_de: "Du beendest die Kontroverse sachlich und elegant.", outcome_nl: "Je snoert critici de mond zonder relletjes te veroorzaken."
            },
            {
                text_pl: "[Medialność] Jeśli rywal nie potrafi utrzymać koncentracji, to jego problem. Gram tak, żeby wygrać!",
                text_en: "[Showmanship] If they can't handle my pace, that's their weakness. I play to win at all costs!",
                text_de: "[Showmanship] Wenn sie mein Tempo nicht abkönnen, ist das ihre Schwäche. Ich spiele, um zu gewinnen!",
                text_nl: "[Showmanship] Als ze mijn tempo niet aankunnen, is dat hun probleem. Ik speel om te winnen!",
                effect: { prof: -4, pop: 4 },
                outcome_pl: "Twoja wypowiedź wywołuje gorącą debatę w darterskich podcastach.", outcome_en: "Your comment triggers heated debates on all major darts podcasts.", outcome_de: "Dein Kommentar löst hitzige Debatten in Darts-Podcasts aus.", outcome_nl: "Je uitspraak zorgt voor felle discussies in dartspodcasts."
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad przed kamerami", title_en: "🎤 On-Camera Interview", title_de: "🎤 Kamera-Interview", title_nl: "🎤 Camera-interview",
        desc_pl: "Cloud Sports: 'Właśnie pokonałeś aktualnego mistrza świata. Czujesz się faworytem do trofeum?'",
        desc_en: "Cloud Sports: 'You just knocked out the reigning World Champion. Do you consider yourself the favorite now?'",
        desc_de: "Cloud Sports: 'Du hast gerade den amtierenden Weltmeister besiegt. Siehst du dich jetzt als Titelfavorit?'",
        desc_nl: "Cloud Sports: 'Je hebt zojuist de regerend wereldkampioen uitgeschakeld. Zie je jezelf nu als favoriet?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Podchodzę do każdego meczu krok po kroku. Następna runda to zupełnie nowe wyzwanie.",
                text_en: "[Professionalism] One match at a time. The next round is a completely fresh challenge.",
                text_de: "[Professionalität] Ein Spiel nach dem anderen. Die nächste Runde ist eine völlig neue Herausforderung.",
                text_nl: "[Professionaliteit] Wedstrijd voor wedstrijd. De volgende ronde is weer een heel nieuw duel.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Eksperci chwalą Twoje dojrzałe, mistrzowskie podejście.", outcome_en: "Pundits applaud your championship-level mindset.", outcome_de: "Experten loben deine meisterhafte Einstellung.", outcome_nl: "Analisten prijzen je volwassen kampioensmentaliteit."
            },
            {
                text_pl: "[Medialność] Skoro mistrz pakuje walizki, to puchar jest praktycznie mój. Kto ma mnie powstrzymać?",
                text_en: "[Showmanship] The champ is packing bags, so that trophy is mine. Who is gonna stop me now?",
                text_de: "[Showmanship] Der Champion packt ein, die Trophäe gehört mir. Wer soll mich jetzt noch stoppen?",
                text_nl: "[Showmanship] De kampioen ligt eruit, dus die beker is van mij. Wie gaat me nu nog tegenhouden?",
                effect: { prof: -4, pop: 6 },
                outcome_pl: "Bukmacherzy natychmiast drastycznie obniżają kursy na Twoje zwycięstwo!", outcome_en: "Bookmakers slash your title-winning odds to record lows!", outcome_de: "Wettanbieter senken die Quoten auf deinen Turniersieg drastisch!", outcome_nl: "Bookmakers verlagen direct de quoteringen voor jouw toernooiwinst!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Mediów", title_en: "🎤 Media Zone", title_de: "🎤 Medienbereich", title_nl: "🎤 Mediazone",
        desc_pl: "Pytanie od Darts Weekly: 'Zauważyliśmy, że przed meczami unikasz rozmów z innymi graczami. Dlaczego?'",
        desc_en: "Darts Weekly asks: 'We noticed you avoid backstage chats with players before matches. Why is that?'",
        desc_de: "Darts Weekly fragt: 'Uns ist aufgefallen, dass du Gespräche im Backstage meidest. Warum?'",
        desc_nl: "Darts Weekly vraagt: 'Het valt op dat je gesprekken backstage met collega's vermijdt. Waarom?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] W szatni muszę wejść w 'strefę' i skupić się na rozgrzewce. Przyjaźnie zostawiam na czas po turnieju.",
                text_en: "[Professionalism] Backstage I need to enter the zone and warm up. Friendships wait until after the tourney.",
                text_de: "[Professionalität] Im Backstage muss ich in den Tunnel. Freundschaften müssen bis nach dem Turnier warten.",
                text_nl: "[Professionaliteit] Backstage moet ik in mijn zone komen. Vriendschappen wachten maar tot na het toernooi.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Wszyscy w tourze wiedzą, że przy tarczy jesteś stuprocentowym profesjonalistą.", outcome_en: "The entire circuit recognizes you as an uncompromising professional.", outcome_de: "Die gesamte Tour respektiert deine kompromisslose Professionalität.", outcome_nl: "Iedereen op het circuit weet dat je een compromisloze prof bent."
            },
            {
                text_pl: "[Medialność] Nie przyjechałem tu zawierać przyjaźni, tylko zabierać im czeki z nagrodami!",
                text_en: "[Showmanship] I didn't come here to make buddies. I came to take their prize money!",
                text_de: "[Showmanship] Ich bin nicht hier, um Freunde zu finden. Ich bin hier, um ihre Preisgelder einzusacken!",
                text_nl: "[Showmanship] Ik ben hier niet om vrienden te maken. Ik ben hier om hun prijzengeld af te pakken!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Rywale czują przed Tobą respekt, a fani uwielbiają Twój bezwzględny styl.", outcome_en: "Rivals fear facing you, while fans love your ruthless attitude.", outcome_de: "Gegner fürchten dich, während die Fans deine Härte lieben.", outcome_nl: "Tegenstanders vrezen je en fans smullen van je meedogenloze houding."
            }
        ]
    },
    {
        title_pl: "🎤 Studio pomeczowe", title_en: "🎤 Post-Match Desk", title_de: "🎤 Nachbesprechung", title_nl: "🎤 Nabeschouwing",
        desc_pl: "Dziennikarz: 'W pierwszej rundzie omal nie odpadłeś ze skazywanym na pożarcie kwalifikantem. Skąd te nerwy?'",
        desc_en: "Reporter: 'You were on the brink of defeat against a rank outsider in round one. Why the struggle?'",
        desc_de: "Reporter: 'In Runde eins standest du gegen einen krassen Außenseiter kurz vor dem Aus. Woher die Nerven?'",
        desc_nl: "Verslaggever: 'In de eerste ronde kroop je door het oog van de naald tegen een underdog. Waar kwamen die zenuwen vandaan?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] W dzisiejszym darcie każdy rzuca wybitnie. Mój rywal zagrał wspaniały mecz, szacunek dla niego.",
                text_en: "[Professionalism] Modern darts is ruthless; anyone can average 100+. Huge respect to him for a great fight.",
                text_de: "[Professionalität] Das Niveau ist enorm hoch; jeder kann überraschen. Großer Respekt an ihn für den Kampf.",
                text_nl: "[Professionaliteit] Het niveau is tegenwoordig bizar hoog; iedereen kan stunten. Veel respect voor zijn partij.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Klasa i pokora przysparzają Ci uznania w oczach starszyzny darterskiej.", outcome_en: "Class and humility earn you praise from darts legends.", outcome_de: "Deine Demut und Klasse bringen dir Lob von Darts-Legenden ein.", outcome_nl: "Klasse en nederigheid leveren je lof op van dartlegendes."
            },
            {
                text_pl: "[Medialność] Po prostu dałem mu trochę tlenu, żeby widzowie przed telewizorami mieli ciekawszy spektakl!",
                text_en: "[Showmanship] Just gave him some air to make the TV broadcast more entertaining for the viewers!",
                text_de: "[Showmanship] Ich habe ihm nur etwas Luft gelassen, damit die TV-Zuschauer eine spannende Show bekommen!",
                text_nl: "[Showmanship] Ik gaf hem expres wat ruimte zodat de kijkers thuis een spannende show kregen!",
                effect: { prof: -4, pop: 4 },
                outcome_pl: "Twoja nonszalancja staje się memem w internecie!", outcome_en: "Your cheeky nonchalance turns into an instant viral meme!", outcome_de: "Deine freche Nonchalance wird sofort zum Internet-Meme!", outcome_nl: "Je brutale nonchalance verandert direct in een virale meme!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad dla Darts Live", title_en: "🎤 Darts Live Exclusive", title_de: "🎤 Darts Live Exklusiv", title_nl: "🎤 Darts Live Exclusief",
        desc_pl: "Pytanie: 'Często eksperymentujesz z wagą i piórkami lotek w trakcie turniejów. Czy to nie zbyt ryzykowne?'",
        desc_en: "Question: 'You often tweak your dart weights and flights mid-tournament. Isn't that too risky?'",
        desc_de: "Frage: 'Du wechselst mitten im Turnier oft Darts und Flights. Ist das nicht zu riskant?'",
        desc_nl: "Vraag: 'Je wisselt tijdens toernooien nogal eens van pijlen en flights. Is dat niet te riskant?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Testuję każdy detal w bazie treningowej. Zmiany opieram na analizie aerodynamiki.",
                text_en: "[Professionalism] Every micro-tweak is tested in my practice lair based on aerodynamic feedback.",
                text_de: "[Professionalität] Jedes Detail wird im Training getestet und basiert auf aerodynamischen Daten.",
                text_nl: "[Professionaliteit] Elk detail test ik uitgebreid in mijn trainingsruimte op basis van data.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Producenci sprzętu doceniają Twoją wiedzę techniczną.", outcome_en: "Equipment manufacturers praise your analytical understanding.", outcome_de: "Ausrüster schätzen dein tiefes technisches Verständnis.", outcome_nl: "Materiaalfabrikanten waarderen je technische inzicht."
            },
            {
                text_pl: "[Medialność] Dobrego rzucającego poznasz po tym, że wygra nawet gwoździami wyjętymi z płotu!",
                text_en: "[Showmanship] A truly elite darter can win throwing rusty nails pulled from a fence!",
                text_de: "[Showmanship] Ein echter Champ gewinnt selbst, wenn er rostige Nägel wirft!",
                text_nl: "[Showmanship] Een echte topspeler wint zelfs als hij met roestige spijkers gooit!",
                effect: { prof: -3, pop: 4 },
                outcome_pl: "Twoje hasło trafia na koszulki kibiców!", outcome_en: "Fans print your catchphrase onto custom T-shirts!", outcome_de: "Fans drucken deinen Spruch auf ihre Trikots!", outcome_nl: "Fans drukken jouw uitspraak op hun shirts!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Wywiadów", title_en: "🎤 Flash Interview", title_de: "🎤 Blitz-Interview", title_nl: "🎤 Flitsinterview",
        desc_pl: "Dziennikarz: 'W trakcie meczu wymieniłeś kilka ostrych spojrzeń z rywalem przy tarczy. Co tam zaszło?'",
        desc_en: "Reporter: 'You exchanged some fiery death-stares with your opponent at the oche. What happened?'",
        desc_de: "Reporter: 'Du hast dir am Oche einige giftige Blicke mit deinem Gegner zugeworfen. Was war da los?'",
        desc_nl: "Verslaggever: 'Je wisselde een paar giftige blikken uit met je tegenstander bij de oche. Wat gebeurde er?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Nic osobistego, walka o każdy milimetr tarczy budzi napięcie. Podaliśmy sobie dłonie.",
                text_en: "[Professionalism] Nothing personal, just intense battle for inches on the board. We shook hands.",
                text_de: "[Professionalität] Nichts Persönliches, nur ein harter Kampf um Millimeter. Wir haben uns die Hand gegeben.",
                text_nl: "[Professionaliteit] Niets persoonlijks, gewoon een felle strijd om centimeters. We hebben elkaar de hand geschud.",
                effect: { prof: 2, pop: 0 },
                outcome_pl: "Unikasz eskalacji konfliktu w mediach.", outcome_en: "You defuse any potential media-fueled feud.", outcome_de: "Du entschärfst den medialen Streit sofort.", outcome_nl: "Je voorkomt een door de media opgeblazen vete."
            },
            {
                text_pl: "[Medialność] Próbował wejść mi do głowy swoimi minami, więc pokazałem mu, kto tu rządzi!",
                text_en: "[Showmanship] He tried playing cheap psychological mind games, so I put him back in his place!",
                text_de: "[Showmanship] Er wollte Psycho-Spielchen spielen, also habe ich ihm gezeigt, wer hier der Boss ist!",
                text_nl: "[Showmanship] Hij probeerde mentale spelletjes te spelen, dus ik heb hem even op zijn plek gezet!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Fragmenty Waszego starcia stają się hitem YouTube!", outcome_en: "Clips of the staredown rack up millions of views on YouTube!", outcome_de: "Der Clip mit dem Staredown geht auf YouTube durch die Decke!", outcome_nl: "Beelden van de staredown gaan viraal op YouTube!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po awansie do Finału", title_en: "🎤 Finalist Interview", title_de: "🎤 Finalisten-Interview", title_nl: "🎤 Interview na plaatsing Finale",
        desc_pl: "Cloud Sports: 'Jutro zagrasz w wielkim finale o najważniejszy puchar w sezonie. Jak spędzisz dzisiejszy wieczór?'",
        desc_en: "Cloud Sports: 'Tomorrow you play in the Grand Final for the biggest title of the year. How will you spend tonight?'",
        desc_de: "Cloud Sports: 'Morgen spielst du im großen Finale um den wichtigsten Titel. Wie verbringst du den Abend?'",
        desc_nl: "Cloud Sports: 'Morgen speel je de grote finale om de belangrijkste titel. Hoe ziet je avond eruit?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Lekka kolacja, analiza zapisu meczów rywala i wczesny sen. Pełna regeneracja.",
                text_en: "[Professionalism] Light dinner, video analysis of my opponent's patterns, and early sleep. Pure recovery.",
                text_de: "[Professionalität] Leichtes Abendessen, Videoanalyse des Gegners und früh schlafen. Regeneration pur.",
                text_nl: "[Professionaliteit] Lichte maaltijd, video-analyse van mijn tegenstander en vroeg naar bed. Rust en herstel.",
                effect: { prof: 4, pop: -1 },
                outcome_pl: "Media opisują Cię jako absolutnego tytana dyscypliny.", outcome_en: "Media portrays you as the ultimate titan of self-discipline.", outcome_de: "Die Medien bezeichnen dich als Vorbild an Selbstdisziplin.", outcome_nl: "De media omschrijven je als een baken van zelfdiscipline."
            },
            {
                text_pl: "[Medialność] Zamawiam wielką pizzę, puszczę głośną muzykę i nagram vloga dla fanów. Zero stresu!",
                text_en: "[Showmanship] Ordering a massive pizza, blasting loud tunes, and dropping a vlog for the fans. Zero stress!",
                text_de: "[Showmanship] Ich bestelle eine Riesenpizza, drehe die Musik auf und mache einen Vlog für meine Fans. Null Stress!",
                text_nl: "[Showmanship] Ik bestel een grote pizza, zet harde muziek op en drop een vlog voor de fans. Geen stress!",
                effect: { prof: -4, pop: 6 },
                outcome_pl: "Twój profil społecznościowy zalewa fala pozytywnych komentarzy.", outcome_en: "Your social feeds are flooded with love and massive engagement.", outcome_de: "Deine Social-Media-Kanäle explodieren vor Zuspruch.", outcome_nl: "Je social media ontploft met duizenden reacties."
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Prasowa", title_en: "🎤 Press Hub", title_de: "🎤 Pressezentrum", title_nl: "🎤 Perscentrum",
        desc_pl: "Pytanie od The Daily Dart: 'Zarobiłeś w tym roku już fortunę na nagrodach. Czy pieniądze zmieniają Twoje podejście?'",
        desc_en: "The Daily Dart asks: 'You've banked a fortune in prize money this season. Does the wealth change you?'",
        desc_de: "The Daily Dart fragt: 'Du hast dieses Jahr ein Vermögen verdient. Verändert dich das viele Geld?'",
        desc_nl: "The Daily Dart vraagt: 'Je hebt dit jaar een fortuin verdiend. Verandert dat vele geld jou?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Pieniądze inwestuję w sprzęt, fizjoterapeutę i rozwój bazy. Liczą się tylko trofea.",
                text_en: "[Professionalism] The money is reinvested into my physio, training facility, and craft. Only trophies matter.",
                text_de: "[Professionalität] Ich investiere alles in Physio, Trainingsausstattung und mein Spiel. Nur Trophäen zählen.",
                text_nl: "[Professionaliteit] Ik herinvesteer alles in fysio, trainingsruimte en mijn spel. Alleen bekers tellen.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Inwestorzy i sponsorzy uznają Cię za niezwykle stabilnego partnera biznesowego.", outcome_en: "Major corporate sponsors view you as a premier, stable brand ambassador.", outcome_de: "Große Sponsoren sehen in dir einen seriösen, verlässlichen Werbeträger.", outcome_nl: "Grote bedrijven zien in jou een uiterst betrouwbare ambassadeur."
            },
            {
                text_pl: "[Medialność] Kupię sobie nowy sportowy samochód i złoty zegarek! Trzeba korzystać z życia!",
                text_en: "[Showmanship] Buying a brand new supercar and a gold watch! You gotta flaunt the success!",
                text_de: "[Showmanship] Ich kaufe mir einen Sportwagen und eine goldene Uhr! Man muss das Leben feiern!",
                text_nl: "[Showmanship] Ik koop een nieuwe sportwagen en een gouden horloge! Je moet van het succes genieten!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Tabloidy rozpisują się o Twoim ekstrawaganckim stylu życia!", outcome_en: "Tabloids eagerly write cover stories on your flashy, rockstar lifestyle!", outcome_de: "Boulevardblätter stürzen sich begeistert auf deinen Luxus-Lifestyle!", outcome_nl: "Tabloids schrijven gretig over jouw opvallende levensstijl!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po pudłach na dublach", title_en: "🎤 Post-Match Scramble", title_de: "🎤 Nach Doppel-Problemen", title_nl: "🎤 Na dubbel-problemen",
        desc_pl: "DartsZone: 'Wygrałeś, ale zmarnowałeś dziś aż 14 lotek na podwójnych. Skąd taki kryzys na finiszach?'",
        desc_en: "DartsZone: 'You survived, but squandered 14 darts at doubles today. What caused the checkout drought?'",
        desc_de: "DartsZone: 'Du hast gewonnen, aber 14 Darts auf Doppel vergeben. Woher kamen die Checkout-Probleme?'",
        desc_nl: "DartsZone: 'Je wint, maar miste wel 14 pijlen op de dubbels. Waar kwamen die problemen vandaan?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Zauważyłem techniczny błąd w wypuszczeniu lotki. Jutro rano spędzę 2 godziny tylko na rzutach w pierścień podwójny.",
                text_en: "[Professionalism] Spotted a tiny flaw in my release. Tomorrow morning I'm dedicating 2 hours solely to outer ring drills.",
                text_de: "[Professionalität] Ein kleiner technischer Fehler beim Abwurf. Morgen früh trainiere ich 2 Stunden nur Doppel.",
                text_nl: "[Professionaliteit] Ik zag een technisch foutje bij de release. Morgenochtend train ik 2 uur lang puur op dubbels.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Komentatorzy podziwiają Twoją samokrytykę i dążenie do perfekcji.", outcome_en: "Pundits admire your brutal honesty and relentless pursuit of perfection.", outcome_de: "Experten bewundern deine Selbstkritik und deinen Perfektionismus.", outcome_nl: "Analisten bewonderen je zelfkritiek en drang naar perfectie."
            },
            {
                text_pl: "[Medialność] Nieważne ile zmarnowałem, liczy się to, że ta najważniejsza wpadła. Zwycięzców się nie sądzi!",
                text_en: "[Showmanship] Doesn't matter how many I missed; the match-dart went in. History remembers winners!",
                text_de: "[Showmanship] Egal wie viele ich verpasst habe; der Matchdart saß. Geschichte schreiben die Sieger!",
                text_nl: "[Showmanship] Maakt niet uit hoeveel ik miste; de matchdart zat. Alleen de overwinning telt!",
                effect: { prof: -3, pop: 4 },
                outcome_pl: "Fani uwielbiają Twoją pewność siebie niezależnie od formy!", outcome_en: "Fans love that your swagger never wavers even on bad days!", outcome_de: "Fans lieben es, dass dein Selbstvertrauen niemals wankt!", outcome_nl: "Fans waarderen het dat je zelfvertrouwen nooit wankelt!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po 9-Darterze", title_en: "🎤 Nine-Darter Special", title_de: "🎤 Nach dem 9-Darter", title_nl: "🎤 Na de 9-Darter",
        desc_pl: "Cloud Sports: 'PERFEKCYJNY LEG! Trafiłeś perfekcyjnego 9-dartera przed milionami widzów! Jakie to uczucie?!'",
        desc_en: "Cloud Sports: 'THE PERFECT LEG! You threw a 9-darter on live global television! Describe the feeling!'",
        desc_de: "Cloud Sports: 'DAS PERFEKTE LEG! Du hast einen 9-Darter live im TV geworfen! Beschreibe das Gefühl!'",
        desc_nl: "Cloud Sports: 'DE PERFECTE LEG! Je gooide een 9-darter live op tv voor miljoenen kijkers! Hoe voelt dat?!'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Wspaniałe uczucie, ale najważniejsze to nie stracić koncentracji i doprowadzić mecz do zwycięstwa.",
                text_en: "[Professionalism] Magical moment, but the priority is maintaining focus to seal the entire match.",
                text_de: "[Professionalität] Ein magischer Moment, aber das Wichtigste ist, fokussiert zu bleiben und das Spiel zu gewinnen.",
                text_nl: "[Professionaliteit] Magisch, maar de prioriteit blijft om gefocust te blijven en de wedstrijd te winnen.",
                effect: { prof: 4, pop: 2 },
                outcome_pl: "Eksperci podkreślają Twoją niesamowitą dyscyplinę umysłu.", outcome_en: "Analysts highlight your incredible iron-clad mental focus.", outcome_de: "Experten betonen deinen unerschütterlichen mentalen Fokus.", outcome_nl: "Analisten roemen je ijzersterke mentale focus."
            },
            {
                text_pl: "[Medialność] TAAAK! Właśnie po to ludzie kupują bilety! Jestem artystą tej tarczy!",
                text_en: "[Showmanship] BOOM! That is exactly why fans buy tickets! You are watching pure genius!",
                text_de: "[Showmanship] BOOM! Genau dafür kaufen die Leute Tickets! Ihr seht hier pure Magie!",
                text_nl: "[Showmanship] BOOM! Dit is waarom mensen een kaartje kopen! Pure magie op het podium!",
                effect: { prof: -2, pop: 8 },
                outcome_pl: "Nagranie z Twoim 9-darterem osiąga 10 milionów wyświetleń na TikToku!", outcome_en: "The video of your 9-darter pulls over 10 million views overnight on TikTok!", outcome_de: "Dein 9-Darter-Video knackt über Nacht die 10-Millionen-Marke auf TikTok!", outcome_nl: "De video van je 9-darter haalt in één nacht meer dan 10 miljoen views op TikTok!"
            }
        ]
    },
    {
        title_pl: "🎤 Pytanie od kibiców", title_en: "🎤 Fan Q&A", title_de: "🎤 Fan-Fragen", title_nl: "🎤 Vragen van fans",
        desc_pl: "DartsZone: 'Kibice pytają w sieci: skąd czerpiesz inspirację do swojego unikalnego stylu rzutu?'",
        desc_en: "DartsZone: 'Fans online are asking: where do you draw inspiration for your distinct throwing technique?'",
        desc_de: "DartsZone: 'Fans im Netz fragen: Woher nimmst du die Inspiration für deinen Wurfstil?'",
        desc_nl: "DartsZone: 'Fans vragen online: waar haal je de inspiratie vandaan voor jouw unieke werpstijl?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Inspirowałem się legendami darta, ale styl wykułem przez tysiące godzin samotnych powtórzeń.",
                text_en: "[Professionalism] Inspired by past legends, but forged through thousands of hours of solo repetition.",
                text_de: "[Professionalität] Inspiriert von Legenden, aber geformt durch tausende Stunden einsames Training.",
                text_nl: "[Professionaliteit] Geïnspireerd door legendes, maar geslepen door duizenden uren van solo-training.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Młodzi zawodnicy analizują Twój chwyt klatka po klatce.", outcome_en: "Young darters dissect your grip frame-by-frame on training forums.", outcome_de: "Nachwuchsspieler analysieren deinen Griff Bild für Bild.", outcome_nl: "Jonge darters analyseren jouw grip beeld voor beeld."
            },
            {
                text_pl: "[Medialność] Urodziłem się z tym talentem! Rzucanie lotkami mam we krwi, tego nie da się nauczyć.",
                text_en: "[Showmanship] Born with pure god-given talent! You either have this magic in your blood or you don't.",
                text_de: "[Showmanship] Mit purem Talent geboren! Entweder man hat diese Magie im Blut, oder eben nicht.",
                text_nl: "[Showmanship] Geboren met puur natuurtalent! Dit heb je in je bloed of niet.",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Twoja pewność siebie budzi skrajne emocje – od uwielbienia po zazdrość!", outcome_en: "Your swagger polarizes the scene – people either adore you or love to hate you!", outcome_de: "Dein Selbstbewusstsein spaltet die Szene – man liebt oder hasst dich!", outcome_nl: "Je zelfvertrouwen verdeelt de dartwereld – men houdt van je of haat je!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po trudnym powrocie (Comeback)", title_en: "🎤 Great Comeback", title_de: "🎤 Nach großem Comeback", title_nl: "🎤 Na grote comeback",
        desc_pl: "Cloud Sports: 'Przegrywałeś już 1:5, a wygrałeś 6:5! Jak dokonałeś tego cudu?'",
        desc_en: "Cloud Sports: 'You were 1-5 down and pulled off a 6-5 miracle! How on earth did you turn it around?'",
        desc_de: "Cloud Sports: 'Du lagst 1:5 hinten und hast 6:5 gewonnen! Wie hast du dieses Wunder geschafft?'",
        desc_nl: "Cloud Sports: 'Je stond 1-5 achter en won alsnog met 6-5! Hoe flikte je dat huzarenstukje?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Zmieniłem tempo stania przy oche i skupiłem się na wygrywaniu pojedynczych legów.",
                text_en: "[Professionalism] Adjusted my setup rhythm at the oche and focused purely on one single leg at a time.",
                text_de: "[Professionalität] Ich habe meinen Rhythmus angepasst und mich nur auf jedes einzelne Leg konzentriert.",
                text_nl: "[Professionaliteit] Ik paste mijn ritme aan en focuste me puur op één leg tegelijk.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Twoja taktyczna dojrzałość trafia do analiz taktycznych stacji telewizyjnych.", outcome_en: "TV analysts break down your tactical discipline in the post-match breakdown.", outcome_de: "TV-Analysten loben deine taktische Disziplin im Replay.", outcome_nl: "Analisten prijzen je tactische discipline in de nabeschouwing."
            },
            {
                text_pl: "[Medialność] Rywal myślał, że ma mnie na widelcu. Zapomniał, że potwory budzą się pod presją!",
                text_en: "[Showmanship] He thought he had me buried. He forgot that beasts thrive under pressure!",
                text_de: "[Showmanship] Er dachte, er hätte mich erledigt. Aber Raubtiere wachen erst unter Druck auf!",
                text_nl: "[Showmanship] Hij dacht dat hij er al was. Hij vergat even dat roofdieren pas wakker worden onder druk!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Komentatorzy uznają ten comeback za najbardziej elektryzujący moment sezonu!", outcome_en: "Commentators call this turnaround the most electrifying spectacle of the tour!", outcome_de: "Kommentatoren küren das Comeback zum elektrisierendsten Moment der Saison!", outcome_nl: "Commentatoren noemen deze comeback het meest zinderende moment van het seizoen!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Flash", title_en: "🎤 Flash Zone", title_de: "🎤 Flash-Zone", title_nl: "🎤 Flitszone",
        desc_pl: "PDChat: 'Twój przeciwnik po meczu narzekał na przeciągi i temperaturę na scenie. Miałeś podobne odczucia?'",
        desc_en: "PDChat: 'Your opponent complained about stage draft and hall temperature. Did you feel the same?'",
        desc_de: "PDChat: 'Dein Gegner hat sich über Zugluft und Hallentemperatur beschwert. Hast du das auch so empfunden?'",
        desc_nl: "PDChat: 'Je tegenstander klaagde over tocht en temperatuur op het podium. Had jij daar ook last van?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Warunki na scenie są jednakowe dla obu graczy. Trzeba się dostosować, a nie szukać wymówek.",
                text_en: "[Professionalism] Conditions are identical for both darters. You adapt; you don't make excuses.",
                text_de: "[Professionalität] Die Bedingungen sind für beide gleich. Man passt sich an, statt Ausreden zu suchen.",
                text_nl: "[Professionaliteit] De omstandigheden zijn voor iedereen gelijk. Je past je aan, geen excuses.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Kibice i dziennikarze chwalą Twoje twarde, sportowe zasady.", outcome_en: "Fans and media laud your no-nonsense athletic mindset.", outcome_de: "Medien loben deine kompromisslose sportliche Haltung.", outcome_nl: "Media en fans prijzen je nuchtere topsportmentaliteit."
            },
            {
                text_pl: "[Medialność] Przeciąg? Jedyny wiatr, jaki tam wiał, to pęd moich lotek lądujących w potrójnej dwudziestce!",
                text_en: "[Showmanship] Draft? The only breeze up there was the wind from my darts crashing into the T20!",
                text_de: "[Showmanship] Zugluft? Der einzige Wind kam von meinen Darts, die im T20 einschlugen!",
                text_nl: "[Showmanship] Tocht? De enige wind op het podium kwam van mijn pijlen die in de T20 vlogen!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Twoja cięta riposta staje się viralem!", outcome_en: "Your sharp one-liner becomes an overnight internet sensation!", outcome_de: "Dein trockener Spruch wird zum absoluten Internet-Hit!", outcome_nl: "Je gevatte opmerking wordt een instant internethit!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po debiucie na scenie", title_en: "🎤 Stage Debut Interview", title_de: "🎤 Nach dem Bühnendebüt", title_nl: "🎤 Na het podiumdebuut",
        desc_pl: "DartsZone: 'To Twój pierwszy występ przed 5-tysięczną publicznością. Czułeś paraliżującą presję?'",
        desc_en: "DartsZone: 'First time playing in front of 5,000 screaming fans. Did you feel any stage fright?'",
        desc_de: "DartsZone: 'Dein erster Auftritt vor 5.000 Fans. Hattest du Lampenfieber?'",
        desc_nl: "DartsZone: 'Je eerste optreden voor 5.000 schreeuwende fans. Had je last van plankenkoorts?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Na początku tętno skoczyło, ale technika oddechowa pozwoliła mi szybko uspokoić rękę.",
                text_en: "[Professionalism] Heart was pounding early, but my breathing routine quickly steadied my hand.",
                text_de: "[Professionalität] Das Herz klopfte, aber Atemübungen brachten die nötige Ruhe in meine Hand.",
                text_nl: "[Professionaliteit] De hartslag was hoog, maar ademhalingsoefeningen brachten snel rust in mijn arm.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Psychologowie sportowi chwalą Twoje przygotowanie mentalne.", outcome_en: "Sports psychologists highlight your elite mental toolkit.", outcome_de: "Sportpsychologen loben deine mentale Vorbereitung.", outcome_nl: "Sportpsychologen prijzen je mentale beheersing."
            },
            {
                text_pl: "[Medialność] Paraliż? Ja się urodziłem dla takich tłumów! Im głośniej wyją, tym lepiej rzucam!",
                text_en: "[Showmanship] Fright? I feed on this noise! The louder they roar, the better I throw!",
                text_de: "[Showmanship] Angst? Ich lebe für diese Kulisse! Je lauter sie brüllen, desto besser werfe ich!",
                text_nl: "[Showmanship] Angst? Ik leef voor deze menigte! Hoe harder ze schreeuwen, hoe beter ik gooi!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Fani na hali skandują Twoje nazwisko jeszcze długo po meczu!", outcome_en: "The crowd keeps chanting your name long after the broadcast finishes!", outcome_de: "Die Fans in der Halle singen deinen Namen noch lange nach dem Spiel!", outcome_nl: "De fans in de zaal scanderen je naam nog lang na de uitzending!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad przed kamerami ITVee", title_en: "🎤 ITVee Stage Desk", title_de: "🎤 ITVee Bühneninterview", title_nl: "🎤 ITVee Podiuminterview",
        desc_pl: "Dziennikarz: 'Wygrałeś 10. mecz z rzędu w cyklu PDC. Widzisz kogoś, kto może przerwać tę serię?'",
        desc_en: "Reporter: 'That's 10 consecutive match wins on the PDC circuit. Can anyone stop this streak?'",
        desc_de: "Reporter: 'Das ist dein 10. Sieg in Folge auf der PDC-Tour. Kann diese Serie überhaupt jemand stoppen?'",
        desc_nl: "Verslaggever: 'Dat is je 10e overwinning op rij in het PDC-circuit. Kan iemand deze zegereeks stoppen?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Statystyki nic nie znaczą przy kolejnym losowaniu. Każdy rywal w Pro Tourze jest groźny.",
                text_en: "[Professionalism] Winning streaks mean nothing in the next draw. Every pro player is dangerous.",
                text_de: "[Professionalität] Serien bedeuten bei der nächsten Auslosung nichts. Jeder Profi ist gefährlich.",
                text_nl: "[Professionaliteit] Zegereeksen zeggen niets bij de volgende loting. Elke prof is gevaarlijk.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Szacunek wobec reszty stawki przysparza Ci sympatii rywali.", outcome_en: "Your respect toward the field earns you goodwill among tour pros.", outcome_de: "Dein Respekt bringt dir Sympathien bei den Kollegen ein.", outcome_nl: "Je respectvolle houding levert je veel sympathie op bij collega's."
            },
            {
                text_pl: "[Medialność] Szczerze? Musiałbym chyba rzucać lewą ręką, żeby któryś z nich miał ze mną szanse!",
                text_en: "[Showmanship] Honestly? I'd probably have to throw left-handed to give any of them a fighting chance!",
                text_de: "[Showmanship] Ehrlich? Ich müsste wohl mit links werfen, damit sie eine Chance haben!",
                text_nl: "[Showmanship] Eerlijk? Ik zou met links moeten gooien om ze een kans te geven!",
                effect: { prof: -5, pop: 7 },
                outcome_pl: "Arogancja najwyższej próby! Twoje nazwisko jest najgorętszym tematem w darcie.", outcome_en: "Peak arrogance! Your name is the most talked-about topic in global darts.", outcome_de: "Pure Arroganz! Dein Name ist das heißeste Thema der gesamten Darts-Welt.", outcome_nl: "Ongekende arrogantie! Je naam is het gesprek van de dag in de sportwereld."
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Flash Cloud Sports", title_en: "🎤 Cloud Sports Flash", title_de: "🎤 Cloud Sports Flash", title_nl: "🎤 Cloud Sports Flash",
        desc_pl: "Reporter: 'W połowie meczu zmieniłeś punkt celowania z T20 na T19. Skąd ta nagła decyzja taktyczna?'",
        desc_en: "Reporter: 'Mid-game you switched your scoring target from T20 down to T19. Why the sudden shift?'",
        desc_de: "Reporter: 'Mitten im Spiel hast du dein Scoring von T20 auf T19 umgestellt. Warum dieser Wechsel?'",
        desc_nl: "Verslaggever: 'Halverwege de partij schakelde je over van T20 naar T19. Waarom die plotselinge keuze?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Zauważyłem, że lotki w T20 układały się zbyt stromo i blokowały pole. T19 dawało lepszy kąt wlotu.",
                text_en: "[Professionalism] First dart was standing up and blocking the bed. T19 offered a cleaner entry angle.",
                text_de: "[Professionalität] Die erste Feder stand zu steil im T20. Das T19-Segment bot den besseren Einfallswinkel.",
                text_nl: "[Professionaliteit] De eerste pijl lag in de weg in de T20. De T19 bood een veel betere invalshoek.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Komentatorzy chwalą Twój wybitny zmysł taktyczny i geometrię rzutu.", outcome_en: "Pundits marvel at your tactical IQ and board geometry awareness.", outcome_de: "Experten loben deinen taktischen Scharfsinn am Board.", outcome_nl: "Analisten roemen je tactische inzicht en bordkennis."
            },
            {
                text_pl: "[Medialność] T20 zrobiło się dla mnie za nudne! Chciałem pokazać, że umiem niszczyć tarczę w każdym sektorze.",
                text_en: "[Showmanship] T20 got boring! Wanted to prove I can dismantle the board wherever I aim.",
                text_de: "[Showmanship] Das T20 wurde mir zu langweilig! Wollte zeigen, dass ich jedes Segment dominieren kann.",
                text_nl: "[Showmanship] T20 werd te saai! Ik wilde laten zien dat ik overal op het bord kan domineren.",
                effect: { prof: -3, pop: 4 },
                outcome_pl: "Fani na trybunach uwielbiają Twoją brawurę i styl zabawy!", outcome_en: "The crowd goes wild for your swagger and flair!", outcome_de: "Die Fans feiern deine Leichtigkeit und Show-Qualitäten!", outcome_nl: "Het publiek smult van je bravoure en flair!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po nerwowej końcówce", title_en: "🎤 Tension at the Oche", title_de: "🎤 Nervenkitzel am Oche", title_nl: "🎤 Spanning aan de oche",
        desc_pl: "Darts Talk: 'Rywal spudłował 6 lotek meczowych, po czym wszedłeś na tarczę i skończyłeś mecz. Miał pecha?'",
        desc_en: "Darts Talk: 'Opponent blew 6 match darts before you stepped up to steal the win. Did he get unlucky?'",
        desc_de: "Darts Talk: 'Dein Gegner hat 6 Matchdarts vergeben, bevor du zugeschlagen hast. Hatte er Pech?'",
        desc_nl: "Darts Talk: 'Je tegenstander miste 6 matchdarts voordat jij toesloeg. Had hij gewoon pech?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Znam to uczucie, presja bywa bezlitosna. Współczuję mu, bo walczył dzielnie.",
                text_en: "[Professionalism] I know that feeling; pressure is brutal. Sympathies to him, he put up a great fight.",
                text_de: "[Professionalität] Ich kenne dieses Gefühl; der Druck ist brutal. Mitgefühl für ihn, er hat stark gekämpft.",
                text_nl: "[Professionaliteit] Ik ken dat gevoel; de druk is enorm. Medeleven voor hem, hij vocht dapper.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Rywal dziękuje Ci za pełne klasy zachowanie po meczu.", outcome_en: "Your opponent thanks you backstage for showing true sportsmanship.", outcome_de: "Dein Gegner bedankt sich im Backstage für dein faires Verhalten.", outcome_nl: "Je tegenstander bedankt je backstage voor je sportieve houding."
            },
            {
                text_pl: "[Medialność] Presja rozbija słabych graczy w pył. Jeśli dajesz mi drugą szansę, to sam podpisujesz swój wyrok!",
                text_en: "[Showmanship] Pressure breaks pretenders. Give me a second life, and you sign your own defeat!",
                text_de: "[Showmanship] Druck bricht schwache Nerven. Gib mir eine zweite Chance, und du hast verloren!",
                text_nl: "[Showmanship] Druk breekt de zwakkeren. Geef je mij een tweede kans, dan teken je je eigen vonnis!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Eksperci okrzyknęli Cię bezlitosnym egzekutorem!", outcome_en: "Media pundits label you the most ruthless finisher on tour!", outcome_de: "Experten küren dich zum eiskaltesten Vollstrecker der Tour!", outcome_nl: "Analisten bestempelen je als de meest meedogenloze afmaker van het circuit!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po zwycięstwie w turnieju", title_en: "🎤 Champion's Circle", title_de: "🎤 Siegerinterview", title_nl: "🎤 Kampioensinterview",
        desc_pl: "Cloud Sports: 'Wznosisz trofeum w górę! Komu dedykujesz to wspaniałe zwycięstwo?'",
        desc_en: "Cloud Sports: 'Lifting the trophy into the air! Who do you dedicate this triumph to?'",
        desc_de: "Cloud Sports: 'Du stemmst die Trophäe in die Höhe! Wem widmest du diesen Triumph?'",
        desc_nl: "Cloud Sports: 'Je tilt de beker omhoog! Aan wie draag je deze overwinning op?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Mojej rodzinie, sponsorom i całemu zespołowi, który dba o moją formę każdego dnia.",
                text_en: "[Professionalism] To my family, my sponsors, and the whole support team working tirelessly behind me.",
                text_de: "[Professionalität] Meiner Familie, den Sponsoren und meinem Team, das täglich hinter mir steht.",
                text_nl: "[Professionaliteit] Aan mijn familie, sponsors en het hele team dat dagelijks voor me klaarstaat.",
                effect: { prof: 4, pop: 0 },
                outcome_pl: "Sponsorzy są zachwyceni Twoim lojalnym podejściem.", outcome_en: "Corporate partners are thrilled with your loyalty and class.", outcome_de: "Sponsoren sind begeistert von deiner Loyalität und Vorbildfunktion.", outcome_nl: "Sponsors zijn dolblij met je loyaliteit en professionele uitstraling."
            },
            {
                text_pl: "[Medialność] Wszystkim hejterom, którzy we mnie wątpili! Patrzcie na ten puchar i płaczcie!",
                text_en: "[Showmanship] To all the haters who doubted me! Look at this silverware and weep!",
                text_de: "[Showmanship] An alle Hater, die an mir gezweifelt haben! Schaut auf den Pokal und weint!",
                text_nl: "[Showmanship] Aan alle haters die aan me twijfelden! Kijk naar deze beker en huil maar!",
                effect: { prof: -4, pop: 7 },
                outcome_pl: "Nagranie z dedykacją staje się hitem w internecie!", outcome_en: "Your fiery victory speech goes ultra-viral across sports media!", outcome_de: "Deine Siegesrede schlägt im Internet ein wie eine Bombe!", outcome_nl: "Je overwinningsspeech wordt miljoenen keren bekeken op internet!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Wywiadów Viaplayr", title_en: "🎤 Viaplayr Flash Desk", title_de: "🎤 Viaplayr Flash-Desk", title_nl: "🎤 Viaplayr Flash Desk",
        desc_pl: "Dziennikarz: 'W trakcie meczu publiczność głośno wspierała Twojego rywala. Czułeś się samotny na scenie?'",
        desc_en: "Reporter: 'The entire arena was chanting for your rival. Did you feel completely alone up there?'",
        desc_de: "Reporter: 'Die ganze Halle hat deinen Gegner angefeuert. Hast du dich einsam auf der Bühne gefühlt?'",
        desc_nl: "Verslaggever: 'De hele zaal zong voor je tegenstander. Voelde je je eenzaam op het podium?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Kibice mają prawo kibicować komu chcą. Moim zadaniem jest trafianie potrójnych, nie walka z trybunami.",
                text_en: "[Professionalism] Crowd has every right to back their hero. My job is hitting trebles, not fighting the fans.",
                text_de: "[Professionalität] Die Fans dürfen anfeuern, wen sie wollen. Mein Job ist es, Trebles zu treffen, nicht gegen Fans zu kämpfen.",
                text_nl: "[Professionaliteit] Fans mogen aanmoedigen wie ze willen. Mijn taak is triples gooien, niet vechten met de zaal.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Dojrzała postawa zyskuje uznanie nawet wśród wrogich kibiców.", outcome_en: "Your stoic maturity wins over even hostile fanbases.", outcome_de: "Deine reife Haltung bringt dir selbst bei gegnerischen Fans Respekt ein.", outcome_nl: "Je volwassen houding dwingt zelfs bij vijandige fans respect af."
            },
            {
                text_pl: "[Medialność] Uwielbiam rolę złego charakteru! Im bardziej na mnie buczą, tym większą mam satysfakcję z ich uciszenia!",
                text_en: "[Showmanship] I love playing the villain! The louder they boo, the sweeter it feels when I take the win!",
                text_de: "[Showmanship] Ich liebe die Schurkenrolle! Je lauter sie buhen, desto süßer schmeckt der Sieg!",
                text_nl: "[Showmanship] Ik speel graag de schurk! Hoe harder ze jouwen, hoe zoeter de overwinning smaakt!",
                effect: { prof: -3, pop: 6 },
                outcome_pl: "Zyskujesz reputację największego antybohatera i showmana w tourze!", outcome_en: "You cement your status as the premier anti-hero and ultimate entertainer of the tour!", outcome_de: "Du festigst deinen Ruf als charismatischer Anti-Held der Darts-Welt!", outcome_nl: "Je vestigt je status als de ultieme antiheld en showman van het circuit!"
            }
        ]
    },
    {
        title_pl: "🎤 Studio Cloud Sports", title_en: "🎤 Cloud Sports Studio", title_de: "🎤 Cloud Sports Studio", title_nl: "🎤 Cloud Sports Studio",
        desc_pl: "Ekspert pyta: 'Twój styl rzutu wydaje się bardzo dynamiczny i agresywny. Czy to celowa taktyka zastraszania rywali?'",
        desc_en: "Pundit asks: 'Your throwing motion looks very rapid and aggressive. Is that an intentional intimidation tactic?'",
        desc_de: "Experte fragt: 'Dein Wurfstil wirkt extrem dynamisch und aggressiv. Ist das eine bewusste Taktik zur Einschüchterung?'",
        desc_nl: "Analist vraagt: 'Je werpstijl oogt enorm snel en agressief. Is dat een bewuste tactiek om tegenstanders te intimideren?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] To po prostu naturalna mechanika mojego ciała. Skupiam się na powtarzalności, nie na rywalu.",
                text_en: "[Professionalism] It is simply my natural biomechanics. I focus purely on consistency, not my opponent.",
                text_de: "[Professionalität] Das ist reine Biomechanik. Ich konzentriere mich auf Konstanz, nicht auf den Gegner.",
                text_nl: "[Professionaliteit] Dat is puur mijn natuurlijke biomechanica. Ik focus op herhaling, niet op de tegenstander.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Trenerzy i analitycy doceniają Twoją techniczną dojrzałość.", outcome_en: "Coaches and analysts praise your technical discipline.", outcome_de: "Trainer und Analysten loben deine technische Disziplin.", outcome_nl: "Trainers en analisten prijzen je technische discipline."
            },
            {
                text_pl: "[Medialność] Jeśli szybkie tempo ich przeraża, to świetnie! Lubię patrzeć, jak panikują przy tarczy.",
                text_en: "[Showmanship] If my lightning pace terrifies them, even better! I love seeing them panic at the oche.",
                text_de: "[Showmanship] Wenn mein Tempo ihnen Angst macht, umso besser! Ich liebe es, sie panisch zu sehen.",
                text_nl: "[Showmanship] Als mijn tempo ze angst inboezemt, des te beter! Mooi om ze te zien zweten bij de oche.",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Komentatorzy nadają Ci przydomek bezwzględnego rewolwerowca!", outcome_en: "Commentators nickname you the ruthless gunslinger of the tour!", outcome_de: "Kommentatoren geben dir den Spitznamen 'Gunslinger'!", outcome_nl: "Commentatoren bombarderen je tot de snelste scherpschutter van het circuit!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Wywiadów DartsZone", title_en: "🎤 DartsZone Flash Area", title_de: "🎤 DartsZone Interviewzone", title_nl: "🎤 DartsZone Interviewzone",
        desc_pl: "Dziennikarz: 'Wygrałeś spotkanie, rzucając aż osiem 180-tek w sześciu legach. Czy to był perfekcyjny scoring?'",
        desc_en: "Reporter: 'You won the match hitting eight 180s in just six legs. Was that maximum scoring perfection?'",
        desc_de: "Reporter: 'Acht 180er in sechs Legs! War das die absolute Perfektion beim Scoring?'",
        desc_nl: "Verslaggever: 'Acht 180-ers in slechts zes legs! Was dat ultieme perfectie op de triples?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Scoring był solidny, ale duble wciąż wymagają poprawy. Zawsze jest miejsce na postęp.",
                text_en: "[Professionalism] Scoring was solid, but doubles need work. There is always room for improvement.",
                text_de: "[Professionalität] Das Scoring war solide, aber die Doppel müssen besser werden. Man kann immer lernen.",
                text_nl: "[Professionaliteit] De scores waren degelijk, maar de dubbels moeten scherper. Er is altijd ruimte voor verbetering.",
                effect: { prof: 4, pop: -1 },
                outcome_pl: "Eksperci są pod wrażeniem Twoich wyśrubowanych standardów.", outcome_en: "Pundits are amazed by your extraordinarily high standards.", outcome_de: "Experten sind beeindruckt von deinen extrem hohen Ansprüchen.", outcome_nl: "Analisten zijn onder de indruk van jouw torenhoge standaarden."
            },
            {
                text_pl: "[Medialność] Czerwone pole w T20 dzisiaj płonęło! Fani dostali to, za co zapłacili – rzeź na potrójnych!",
                text_en: "[Showmanship] The T20 bed was on fire! Fans got what they paid for – pure maximum carnage!",
                text_de: "[Showmanship] Das T20-Bett hat gebrannt! Die Fans bekamen ihr Spektakel – ein absolutes Feuerwerk!",
                text_nl: "[Showmanship] Het rood van de T20 stond in brand! De fans kregen waar voor hun geld – pure show!",
                effect: { prof: -3, pop: 6 },
                outcome_pl: "Twój występ trafia do zestawienia najefektowniejszych meczów roku!", outcome_en: "Your highlights are compiled into the best displays of the season!", outcome_de: "Deine Highlights landen in den besten Zusammenschnitten des Jahres!", outcome_nl: "Jouw beelden belanden in de hoogtepunten van het jaar!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Prasowa ITVee", title_en: "🎤 ITVee Press Desk", title_de: "🎤 ITVee Pressebereich", title_nl: "🎤 ITVee Persdesk",
        desc_pl: "Pytanie: 'Twój przeciwnik po porażce nie podał Ci ręki i od razu zszedł ze sceny. Jak to skomentujesz?'",
        desc_en: "Question: 'Your opponent refused to shake hands and stormed off stage. What is your take on that?'",
        desc_de: "Frage: 'Dein Gegner hat dir den Handschlag verweigert und die Bühne verlassen. Dein Kommentar?'",
        desc_nl: "Vraag: 'Je tegenstander weigerde een handdruk en beende van het podium. Wat vind je daarvan?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Emocje biorą górę po ciężkim meczu. Porozmawiamy w szatni, gdy opadnie kurz.",
                text_en: "[Professionalism] Emotions run high after a grueling match. We will clear the air backstage later.",
                text_de: "[Professionalität] Emotionen kochen hoch nach so einem Spiel. Wir reden später im Backstage in Ruhe.",
                text_nl: "[Professionaliteit] Emoties lopen hoog op na zo'n zware partij. We praten het backstage wel uit.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Klasa i spokój w trudnej sytuacji zjednują Ci sympatię zarządu federacji.", outcome_en: "Your graceful response earns respect from tournament directors.", outcome_de: "Deine souveräne Antwort bringt dir Respekt bei der Turnierleitung ein.", outcome_nl: "Je beheerste reactie levert respect op bij de toernooidirectie."
            },
            {
                text_pl: "[Medialność] Boli go porażka! Jeśli nie umie przegrywać z uśmiechem, niech wraca grać w pubie!",
                text_en: "[Showmanship] The truth hurts! If he can't swallow a defeat, he should go back to local leagues!",
                text_de: "[Showmanship] Verlieren tut weh! Wenn er das nicht abkann, soll er zurück in die Kneipe!",
                text_nl: "[Showmanship] Verliezen doet pijn! Als hij daar niet tegen kan, moet hij weer in de kroeg gaan gooien!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Dziennikarze podchwytują konflikt, robiąc z tego główny nagłówek dnia!", outcome_en: "Tabloids turn the confrontation into the biggest sports headline of the week!", outcome_de: "Die Boulevardpresse macht daraus die Schlagzeile der Woche!", outcome_nl: "De media maken van het conflict het gesprek van de dag!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad dla Viaplayr", title_en: "🎤 Viaplayr Feature", title_de: "🎤 Viaplayr Feature", title_nl: "🎤 Viaplayr Feature",
        desc_pl: "Reporter: 'Wielu młodych adeptów darta kopiuje Twój chwyt lotki. Czujesz się wzorem do naśladowania?'",
        desc_en: "Reporter: 'Many young players are copying your exact grip. Do you see yourself as a role model?'",
        desc_de: "Reporter: 'Viele Nachwuchsspieler kopieren deinen Wurfstil. Siehst du dich als Vorbild?'",
        desc_nl: "Verslaggever: 'Veel jonge darters kopiëren jouw grip. Zie je jezelf als een rolmodel?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Cieszę się, ale radzę każdemu szukać własnego chwytu i budować indywidualny styl.",
                text_en: "[Professionalism] I am honored, but I advise every junior to develop their own natural grip.",
                text_de: "[Professionalität] Das ehrt mich, aber jeder sollte seinen eigenen natürlichen Stil entwickeln.",
                text_nl: "[Professionaliteit] Een eer, maar ik raad iedereen aan om zijn eigen natuurlijke stijl te vinden.",
                effect: { prof: 4, pop: 0 },
                outcome_pl: "Akademie darta chętnie zapraszają Cię na warsztaty z młodzieżą.", outcome_en: "Darts academies invite you to host youth masterclasses.", outcome_de: "Darts-Akademien laden dich zu Workshops für Junioren ein.", outcome_nl: "Dartsacademies nodigen je uit voor clinics met de jeugd."
            },
            {
                text_pl: "[Medialność] Kopiują najlepszych! Jeśli chcą zdobywać puchary, muszą rzucać dokładnie tak jak ja!",
                text_en: "[Showmanship] They copy the greatest! If they want glory, they better replicate my exact magic!",
                text_de: "[Showmanship] Man kopiert eben die Besten! Wer Trophäen will, muss werfen wie ich!",
                text_nl: "[Showmanship] Ze kopiëren de beste! Wie bekers wil winnen, kan maar beter precies gooien zoals ik!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Kolejne miliony wyświetleń na TikToku pod hashtagiem z Twoim nazwiskiem!", outcome_en: "Millions of impressions flood TikTok under your signature hashtag!", outcome_de: "Millionen Views auf TikTok unter deinem Namen!", outcome_nl: "Miljoenen views op TikTok onder jouw hashtag!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Mieszana PDChat", title_en: "🎤 PDChat Mixed Zone", title_de: "🎤 PDChat Mixed-Zone", title_nl: "🎤 PDChat Mixed Zone",
        desc_pl: "Dziennikarz pyta: 'Przed meczem widać było, że pijesz wyłącznie wodę, podczas gdy inni wolą piwo. Skąd taki rygor?'",
        desc_en: "Reporter asks: 'Pre-match you drank only water while others drank beer. Why this strict lifestyle?'",
        desc_de: "Reporter fragt: 'Vor dem Spiel trinkst du nur Wasser, während andere Bier trinken. Woher diese Strenge?'",
        desc_nl: "Verslaggever vraagt: 'Voor de partij dronk je puur water terwijl anderen bier drinken. Vanwaar die discipline?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Współczesny dart to zawodowy sport. Dobre nawodnienie i czysty umysł to podstawa sukcesu.",
                text_en: "[Professionalism] Modern darts is professional athletics. Clean hydration and sharp mind are essential.",
                text_de: "[Professionalität] Moderner Dartsport ist Hochleistungssport. Hydration und klarer Kopf sind Pflicht.",
                text_nl: "[Professionaliteit] Modern darts is topsport. Goede hydratatie en een scherpe focus zijn cruciaal.",
                effect: { prof: 4, pop: -1 },
                outcome_pl: "Lekarze i dietetycy sportowi stawiają Cię za wzór nowoczesnego atlety.", outcome_en: "Sports scientists hold you up as the gold standard of modern darts athletes.", outcome_de: "Sportmediziner loben deinen vorbildlichen Lebensstil.", outcome_nl: "Sportartsen prijzen je voorbeeldige levensstijl als topsporter."
            },
            {
                text_pl: "[Medialność] Każdy ma swój sposób na zabawę! Ja po prostu wolę świętować drogim szampanem po finale!",
                text_en: "[Showmanship] Everyone has their party routine! I just prefer popping vintage champagne after the final!",
                text_de: "[Showmanship] Jeder wie er mag! Ich feiere lieber mit teurem Champagner nach dem Finale!",
                text_nl: "[Showmanship] Ieder zijn ding! Ik trek liever een fles dure champagne open na de finale!",
                effect: { prof: -3, pop: 4 },
                outcome_pl: "Kluby nocne i producenci alkoholi luksusowych oferują lukratywne kontrakty!", outcome_en: "Luxury lifestyle brands queue up to offer endorsement deals!", outcome_de: "Lifestyle-Marken stehen Schlange für Werbedeals!", outcome_nl: "Luxe lifestylemerken staan in de rij voor sponsordeals!"
            }
        ]
    },
    {
        title_pl: "🎤 Studio Sport1 TV", title_en: "🎤 Sport1 TV Desk", title_de: "🎤 Sport1 TV Studio", title_nl: "🎤 Sport1 TV Studio",
        desc_pl: "Pytanie: 'Czy uważasz, że kalendarz turniejowy PDC jest obecnie zbyt przeładowany wyjazdami?'",
        desc_en: "Question: 'Do you feel the PDC tournament schedule has become overloaded with international travel?'",
        desc_de: "Frage: 'Glaubst du, dass der PDC-Turnierkalender mittlerweile zu vollgepackt mit Reisen ist?'",
        desc_nl: "Vraag: 'Vind je dat de PDC-toernooikalender tegenwoordig te vol zit met internationale reizen?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Podróże to trudny element tej pracy, ale profesjonalista musi umieć zarządzać regeneracją.",
                text_en: "[Professionalism] Travel is exhausting, but managing fatigue is the hallmark of a true professional.",
                text_de: "[Professionalität] Reisen ist anstrengend, aber Regenerationsmanagement gehört zum Profisein dazu.",
                text_nl: "[Professionaliteit] Reizen is zwaar, maar goed omgaan met herstel hoort bij een echte prof.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Organizatorzy cyklu turniejowego szanują Twoją dyscyplinę.", outcome_en: "Tour promoters respect your constructive attitude.", outcome_de: "Die Tour-Veranstalter schätzen deine professionelle Einstellung.", outcome_nl: "Toernooiorganisatoren waarderen je professionele houding."
            },
            {
                text_pl: "[Medialność] Więcej turniejów to więcej kasy do zgarnięcia! Mogę latać po całym świecie co weekend!",
                text_en: "[Showmanship] More tournaments mean more cash up for grabs! I will fly anywhere to claim my cheques!",
                text_de: "[Showmanship] Mehr Turniere bedeuten mehr Preisgeld! Ich fliege überall hin, um abzukassieren!",
                text_nl: "[Showmanship] Meer toernooien betekent meer prijzengeld! Ik vlieg overal heen om te cashen!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Fani uwielbiają Twój nieposkromiony apetyt na kolejne nagrody!", outcome_en: "Fans love your unquenchable hunger for prize money and glory!", outcome_de: "Die Fans lieben deinen unstillbaren Hunger auf Preisgelder!", outcome_nl: "Fans smullen van je honger naar overwinningen en prijzengeld!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Flash Darts Talk", title_en: "🎤 Darts Talk Flash", title_de: "🎤 Darts Talk Flash", title_nl: "🎤 Darts Talk Flash",
        desc_pl: "Dziennikarz: 'Wygrałeś spotkanie zaledwie jednym przełamaniem. Czy czujesz, że miałeś dziś sporo szczęścia?'",
        desc_en: "Reporter: 'You edged the match by a single break of throw. Did luck play a big role today?'",
        desc_de: "Reporter: 'Du hast das Spiel mit nur einem Break gewonnen. War da heute viel Glück im Spiel?'",
        desc_nl: "Verslaggever: 'Je won de partij met slechts één break verschil. Speelde geluk vandaag een grote rol?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Szczęście sprzyja przygotowanym. Wykorzystałem jedyną szansę, którą dał mi rywal.",
                text_en: "[Professionalism] Luck favors the prepared mind. I simply capitalized on the sole opening I got.",
                text_de: "[Professionalität] Glück hat nur der Tüchtige. Ich habe die einzige Chance eiskalt genutzt.",
                text_nl: "[Professionaliteit] Geluk dwing je af. Ik profiteerde optimaal van de enige kans die ik kreeg.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Eksperci podkreślają Twoją zabójczą skuteczność w kluczowych momentach.", outcome_en: "Commentators praise your clinical opportunism in high-leverage legs.", outcome_de: "Experten loben deine gnadenlose Effizienz in den Schlüsselmomenten.", outcome_nl: "Analisten roemen je dodelijke efficiëntie op cruciale momenten."
            },
            {
                text_pl: "[Medialność] Szczęście? To był czysty geniusz w najważniejszym legu meczu!",
                text_en: "[Showmanship] Luck? That was pure clutch genius in the biggest leg of the night!",
                text_de: "[Showmanship] Glück? Das war pure Genialität im wichtigsten Leg des Abends!",
                text_nl: "[Showmanship] Geluk? Dat was pure genialiteit in de belangrijkste leg van de avond!",
                effect: { prof: -4, pop: 4 },
                outcome_pl: "Klip z Twoim przełamaniem krąży jako podręcznik zimnej krwi!", outcome_en: "Clips of your break of throw circulate as the definition of cold-blooded darts!", outcome_de: "Der Clip deines Breaks geht als Musterbeispiel für Nervenstärke viral!", outcome_nl: "Het fragment van jouw break gaat rond als het ultieme bewijs van stalen zenuwen!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po wygranym ćwierćfinale", title_en: "🎤 Quarterfinal Debrief", title_de: "🎤 Nach dem Viertelfinale", title_nl: "🎤 Na de kwartfinale",
        desc_pl: "Cloud Sports: 'W półfinale czeka na Ciebie numer jeden rankingu światowego. Czy masz na niego specjalny plan?'",
        desc_en: "Cloud Sports: 'World Number 1 awaits you in the semifinal. Do you have a specialized gameplan?'",
        desc_de: "Cloud Sports: 'Im Halbfinale wartet die Nummer 1 der Welt. Hast du einen speziellen Matchplan?'",
        desc_nl: "Cloud Sports: 'In de halve finale wacht de nummer 1 van de wereld. Heb je een specifiek strijdplan?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Znamy się doskonale. Skupię się na utrzymaniu własnego licznika i regularnym domykaniu legów.",
                text_en: "[Professionalism] We know each other's games well. I will focus on holding my throw and hitting clinical checkouts.",
                text_de: "[Professionalität] Wir kennen uns gut. Mein Fokus liegt auf den eigenen Anwürfen und sicheren Checkouts.",
                text_nl: "[Professionaliteit] We kennen elkaar goed. De focus ligt op eigen legbehoud en strakke finishes.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Dojrzała zapowiedź budzi respekt przed jutrzejszym hitem.", outcome_en: "A mature statement builds immense anticipation for tomorrow's clash.", outcome_de: "Eine reife Aussage sorgt für Vorfreude auf den morgigen Kracher.", outcome_nl: "Een volwassen vooruitblik zorgt voor enorme voorpret bij de fans."
            },
            {
                text_pl: "[Medialność] Plan jest prosty: wyjść, rozbić go 180-tkami i zrzucić z tronu na oczach całego świata!",
                text_en: "[Showmanship] The plan is simple: blast him off the stage with 180s and take his crown on live TV!",
                text_de: "[Showmanship] Der Plan ist simpel: Ihn mit 180ern von der Bühne fegen und vor aller Welt entthronen!",
                text_nl: "[Showmanship] Het plan is simpel: hem wegblazen met 180-ers en live op tv van zijn troon stoten!",
                effect: { prof: -4, pop: 6 },
                outcome_pl: "Bilety na sesję wieczorną wyprzedają się w kilka minut!", outcome_en: "Tickets for the evening session sell out within minutes of your broadcast!", outcome_de: "Tickets für die Abendsession sind binnen Minuten restlos ausverkauft!", outcome_nl: "Kaarten voor de avondsessie zijn binnen enkele minuten uitverkocht!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Prasowa The Dart Paper", title_en: "🎤 The Dart Paper Interview", title_de: "🎤 The Dart Paper Presse", title_nl: "🎤 The Dart Paper Interview",
        desc_pl: "Pytanie: 'Wielu graczy zatrudnia psychologów sportowych. Czy korzystasz z pomocy specjalistów od głowy?'",
        desc_en: "Question: 'Many tour pros employ sports psychologists. Do you utilize mental performance coaches?'",
        desc_de: "Frage: 'Viele Profis arbeiten mit Mentaltrainern. Nutzt du sportpsychologische Unterstützung?'",
        desc_nl: "Vraag: 'Veel profs werken met sportpsychologen. Maak jij gebruik van mentale begeleiding?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Tak, regularny trening mentalny i techniki wizualizacji to klucz do stabilności w turniejach.",
                text_en: "[Professionalism] Yes, visualization and mental conditioning routines are critical for long-term consistency.",
                text_de: "[Professionalität] Ja, Visualisierung und mentales Training sind der Schlüssel zu konstanter Leistung.",
                text_nl: "[Professionaliteit] Ja, visualisatie en mentale training zijn essentieel voor constante topprestaties.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Trenerzy stawiają Twoje profesjonalne przygotowanie za wzór dla kadry.", outcome_en: "National coaching setups highlight your progressive approach.", outcome_de: "Leistungszentren loben deinen modernen Trainingsansatz.", outcome_nl: "Nationale bonden noemen jouw aanpak een lichtend voorbeeld."
            },
            {
                text_pl: "[Medialność] Moją psychologią jest wiara we własne ręce i chęć zmiażdżenia każdego, kto stanie naprzeciwko!",
                text_en: "[Showmanship] My psychology is believing in my right arm and crushing anyone standing across from me!",
                text_de: "[Showmanship] Meine Psychologie ist der Glaube an meinen Arm und der Wille, jeden Gegner zu dominieren!",
                text_nl: "[Showmanship] Mijn psychologie is blind vertrouwen in mijn rechterarm en iedereen van het bord vegen!",
                effect: { prof: -3, pop: 4 },
                outcome_pl: "Cytat staje się internetowym manifestem pewności siebie!", outcome_en: "Your quote becomes a viral manifesto of ultimate self-belief!", outcome_de: "Dein Zitat wird zum viralen Manifest für unbändiges Selbstvertrauen!", outcome_nl: "Je quote wordt een virale hit als ultiem symbool van zelfvertrouwen!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po zmianie lotek", title_en: "🎤 Equipment Change Chat", title_de: "🎤 Nach Materialwechsel", title_nl: "🎤 Na materiaalwissel",
        desc_pl: "DartsZone: 'Zagrałeś dziś nowym modelem lotek z innym frezowaniem. Jak oceniasz ich zachowanie w tarczy?'",
        desc_en: "DartsZone: 'You debuted a new barrel grip profile tonight. How did they sit in the sisal under TV heat?'",
        desc_de: "DartsZone: 'Du hast heute Darts mit neuem Grip gespielt. Wie fühlten sie sich unter den Scheinwerfern an?'",
        desc_nl: "DartsZone: 'Je speelde met een nieuw type grip op je barrels. Hoe voelde dat onder de warme tv-lampen?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Nowy mikrorowek daje lepszą kontrolę przy spoconych dłoniach. Sprzęt spisał się bez zarzutu.",
                text_en: "[Professionalism] The micro-grooves provide superior release control under hot lights. The barrels performed perfectly.",
                text_de: "[Professionalität] Das Micro-Grip-Profil gibt perfekte Kontrolle bei schwitzigen Händen. Top-Material.",
                text_nl: "[Professionaliteit] De micro-grip geeft perfecte controle bij warme handen. Het materiaal voldeed aan alle eisen.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Twój sponsor techniczny notuje natychmiastowy skok zamówień na ten model!", outcome_en: "Your technical darts sponsor reports an instant surge in pre-orders!", outcome_de: "Dein Ausrüster verzeichnet einen sofortigen Ansturm auf das Modell!", outcome_nl: "Je materiaalsponsor ziet direct een enorme piek in bestellingen!"
            },
            {
                text_pl: "[Medialność] Te lotki są jak pociski samonaprowadzające! W moich rękach każda lotka staje się śmiercionośna!",
                text_en: "[Showmanship] These barrels are laser-guided missiles! In my hands, any piece of tungsten is deadly!",
                text_de: "[Showmanship] Diese Darts sind lasergesteuerte Raketen! In meinen Händen ist jedes Tungsten tödlich!",
                text_nl: "[Showmanship] Deze pijlen zijn net lasergestuurde raketten! In mijn handen is elk stuk tungsten dodelijk!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Fani masowo wykupują Twoje sygnowane rzutki!", outcome_en: "Fans clean out stock of your signature darts worldwide!", outcome_de: "Fans kaufen weltweit deine Signature-Darts leer!", outcome_nl: "Fans kopen wereldwijd jouw signature pijlen massaal op!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Flash ITVee", title_en: "🎤 ITVee Flash Zone", title_de: "🎤 ITVee Flash-Zone", title_nl: "🎤 ITVee Flitszone",
        desc_pl: "Reporter: 'Wygrałeś mecz, zamykając 125 punktów przez Bull-25-Bullseye! Czy to była zaplanowana trasa?'",
        desc_en: "Reporter: 'You sealed victory checking out 125 via Bull-25-Bullseye! Was that planned showboating?'",
        desc_de: "Reporter: 'Du beendest das Spiel mit einem 125er Finish über Bull-25-Bull! War das geplante Show?'",
        desc_nl: "Verslaggever: 'Je besliste de partij met een 125 finish via Bull-25-Bullseye! Was dat gepland spektakel?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Pierwsza lotka trafiła w czerwony środek, więc matematycznie była to najbardziej logiczna ścieżka.",
                text_en: "[Professionalism] The first dart hit the red bull, so mathematically it was the cleanest remaining route.",
                text_de: "[Professionalität] Der erste Dart saß im Bull, mathematisch war es der sauberste verbliebene Weg.",
                text_nl: "[Professionaliteit] De eerste pijl zat in de bull, wiskundig gezien was het de meest logische route.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Eksperci matematyki darterskiej chwalą Twoje błyskawiczne liczenie.", outcome_en: "Darts mathematicians praise your split-second arithmetic brilliance.", outcome_de: "Darts-Mathematiker loben dein blitzschnelles Rechenvermögen.", outcome_nl: "Rekenmeesters in de studio prijzen je razendsnelle bordkennis."
            },
            {
                text_pl: "[Medialność] Oczywiście! Zwykłe końcówki są nudne, publiczność zasługuje na absolutną magię na tarczy!",
                text_en: "[Showmanship] Absolutely! Standard routes are boring; the paying audience deserves pure showtime wizardry!",
                text_de: "[Showmanship] Na klar! Standardwege sind langweilig, die Fans wollen echte Magie am Board sehen!",
                text_nl: "[Showmanship] Zeker weten! Standaard routes zijn saai, het publiek verdient pure tovenarij!",
                effect: { prof: -3, pop: 6 },
                outcome_pl: "Finisz zostaje okrzyknięty zagraniem miesiąca w telewizji!", outcome_en: "Your finish is voted the undisputed TV shot of the month!", outcome_de: "Dein Finish wird im TV zum Checkout des Monats gewählt!", outcome_nl: "Je finish wordt op tv unaniem verkozen tot finish van de maand!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad dla Viaplayr", title_en: "🎤 Viaplayr Exclusive", title_de: "🎤 Viaplayr Exklusiv", title_nl: "🎤 Viaplayr Exclusief",
        desc_pl: "Dziennikarz: 'Czy czujesz, że sędzia caller zbyt wolno wyciągał lotki, co spowalniało Twój rytm rzutowy?'",
        desc_en: "Reporter: 'Did you feel the stage referee pulled darts too slowly, disrupting your rhythm?'",
        desc_de: "Reporter: 'Fandest du, dass der Caller die Darts zu langsam notiert und deinen Fluss gestört hat?'",
        desc_nl: "Verslaggever: 'Vond je dat de caller de scores te langzaam omriep en je ritme verstoorde?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Sędziowie na scenie wykonują znakomitą i trudną pracę. Nie szukam problemów tam, gdzie ich nie ma.",
                text_en: "[Professionalism] Stage referees do an outstanding and difficult job. I focus entirely on my own performance.",
                text_de: "[Professionalität] Die Schiedsrichter leisten fantastische Arbeit. Ich suche Fehler nur bei mir selbst.",
                text_nl: "[Professionaliteit] De officials doen fantastisch werk. Ik zoek de fouten altijd bij mezelf.",
                effect: { prof: 4, pop: -1 },
                outcome_pl: "Sędziowie i oficjele turniejowi darzą Cię ogromnym szacunkiem.", outcome_en: "PDC officials and referees deeply respect your professionalism.", outcome_de: "Offizielle und Schiedsrichter schätzen deine vorbildliche Art.", outcome_nl: "PDC-officials en scheidsrechters waarderen je respectvolle opstelling."
            },
            {
                text_pl: "[Medialność] Powinien założyć wrotki! Kiedy jestem w transie, muszę mieć wolną tarczę w ułamku sekundy!",
                text_en: "[Showmanship] Put some roller skates on him! When I am in the zone, I need that board clear immediately!",
                text_de: "[Showmanship] Gebt dem Mann Rollschuhe! Wenn ich im Tunnel bin, muss das Board sofort frei sein!",
                text_nl: "[Showmanship] Geef die man rolschaatsen! Als ik in de zone zit, moet dat bord meteen leeg zijn!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Twoja wypowiedź wywołuje salwy śmiechu w studiu telewizyjnym!", outcome_en: "Your cheeky quote triggers bursts of laughter in the television studio!", outcome_de: "Dein Spruch sorgt für schallendes Gelächter im Fernsehstudio!", outcome_nl: "Je uitspraak zorgt voor grote hilariteit in de studio!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Mediów DartWorld 24", title_en: "🎤 DartWorld 24 Desk", title_de: "🎤 DartWorld 24 Studio", title_nl: "🎤 DartWorld 24 Studio",
        desc_pl: "Pytanie: 'Czy Twoja rutyna treningowa obejmuje bieganie lub trening na siłowni, jak u nowoczesnych sportowców?'",
        desc_en: "Question: 'Does your regimen include cardio and gym workouts like a modern athlete?'",
        desc_de: "Frage: 'Gehören Ausdauer- und Krafttraining zu deinem Alltag wie bei modernen Athleten?'",
        desc_nl: "Vraag: 'Maakt conditie- en krachttraining deel uit van jouw routine zoals bij moderne atleten?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Tak, wzmacnianie mięśni głębokich i nóg jest kluczem, by stać stabilnie przez 2 godziny meczu.",
                text_en: "[Professionalism] Yes, core strength and endurance workouts ensure absolute stability during long matches.",
                text_de: "[Professionalität] Ja, Rumpf- und Beintraining sind essenziell für einen felsenfesten Stand am Oche.",
                text_nl: "[Professionaliteit] Ja, core-stability en conditie zijn cruciaal om urenlang stabiel aan de oche te staan.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Dziennikarze sportowi chwalą Twoje nowatorskie podejście do przygotowania fizycznego.", outcome_en: "Mainstream sports media highlights your modern physical conditioning.", outcome_de: "Sportjournalisten loben deinen modernen Fitnessansatz.", outcome_nl: "Sportjournalisten prijzen jouw moderne fysieke benadering van de sport."
            },
            {
                text_pl: "[Medialność] Moją siłownią jest podnoszenie kufli i pucharów! Liczy się tylko oko i stalowa ręka!",
                text_en: "[Showmanship] My gym routine is lifting trophies! All that matters is razor vision and a golden arm!",
                text_de: "[Showmanship] Mein Fitnessstudio ist das Heben von Pokalen! Alles was zählt sind Auge und Hand!",
                text_nl: "[Showmanship] Mijn sportschool is het tillen van bekers! Het enige wat telt is een scherp oog en een gouden arm!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Tradycyjni fani darta uznają Cię za prawdziwą duszę towarzystwa!", outcome_en: "Old-school darts fans salute you as a true pub-culture legend!", outcome_de: "Oldschool-Dartsfans feiern dich als echte Kultfigur!", outcome_nl: "Oldschool dartfans eren jou als een echte cultheld van de sport!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po meczu w Premier League / GDL", title_en: "🎤 Premier League / GDL Night", title_de: "🎤 Premier League / GDL Abend", title_nl: "🎤 Premier League / GDL Avond",
        desc_pl: "Cloud Sports: 'Kolejny czwartkowy wieczór, kolejna pełna hala na 10 tysięcy widzów. Jak radzisz sobie ze zmęczeniem w lidze?'",
        desc_en: "Cloud Sports: 'Another Thursday night in front of 10,000 screaming fans. How do you manage the league grind?'",
        desc_de: "Cloud Sports: 'Wieder ein Donnerstag vor 10.000 Fans. Wie meisterst du diesen wöchentlichen Liga-Stress?'",
        desc_nl: "Cloud Sports: 'Weer een donderdagavond voor 10.000 man. Hoe ga je om met de loodzware wekelijkse competitie?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Odpowiednia dieta, sen i regeneracja między czwartkiem a turniejami weekendowymi to podstawa.",
                text_en: "[Professionalism] Strict nutrition, sleep discipline, and recovery between Thursdays and weekends are non-negotiable.",
                text_de: "[Professionalität] Disziplin bei Ernährung, Schlaf und Erholung zwischen den Spieltagen ist Pflicht.",
                text_nl: "[Professionaliteit] Strikte voeding, slaap en herstel tussen de donderdagen en het weekend zijn essentieel.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Komentatorzy wskazują Cię jako wzór wytrzymałości w maratonie ligowym.", outcome_en: "Pundits pinpoint your endurance as the blueprint for surviving the league grind.", outcome_de: "Kommentatoren loben deine Ausdauer im langen Liga-Marathon.", outcome_nl: "Analisten noemen jouw uithoudingsvermogen de blauwdruk voor de competitie."
            },
            {
                text_pl: "[Medialność] Kocham to! Dajcie mi mikrofon, dajcie mi 10 tysięcy ludzi i patrzcie, jak robię show!",
                text_en: "[Showmanship] I thrive on this! Give me the spotlight, 10,000 screaming fans, and watch me put on a show!",
                text_de: "[Showmanship] Ich liebe das! Gebt mir die Bühne, 10.000 Fans und schaut zu, wie ich die Hütte abreiße!",
                text_nl: "[Showmanship] Ik leef hiervoor! Geef mij de schijnwerpers, 10.000 man en geniet van de show!",
                effect: { prof: -3, pop: 6 },
                outcome_pl: "Organizatorzy ligi traktują Cię jako główną lokomotywę marketingową!", outcome_en: "League promoters utilize your face as the headline billboard for the tour!", outcome_de: "Die Liga-Vermarkter nutzen dein Gesicht als Hauptplakat der gesamten Tour!", outcome_nl: "De toernooiorganisatie gebruikt jouw beeltenis als het uithangbord van de competitie!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Błyskawiczna PDChat", title_en: "🎤 PDChat Flash Desk", title_de: "🎤 PDChat Blitz-Zone", title_nl: "🎤 PDChat Flitsdesk",
        desc_pl: "Dziennikarz: 'Wygrałeś mecz ze średnią poniżej 85 punktów. Jak podsumujesz to mało efektowne spotkanie?'",
        desc_en: "Reporter: 'You scraped through with a sub-85 average. How do you assess this scrappy performance?'",
        desc_de: "Reporter: 'Ein mühsamer Sieg mit einem Schnitt unter 85. Wie bewertest du diesen Arbeitssieg?'",
        desc_nl: "Verslaggever: 'Een moeizame zege met een gemiddelde onder de 85. Hoe kijk je terug op deze worstelpartij?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Czasami trzeba umieć wygrać brzydki mecz. Zwycięstwo to zwycięstwo, ale wracam prosto do tarczy treningowej.",
                text_en: "[Professionalism] Sometimes you have to win ugly. A win is a win, but I am heading straight back to the practice board.",
                text_de: "[Professionalität] Manchmal muss man dreckig gewinnen. Sieg ist Sieg, aber morgen wird hart trainiert.",
                text_nl: "[Professionaliteit] Soms moet je lelijk winnen. Winst is winst, maar ik sta morgen weer vroeg aan het bord.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Eksperci chwalą Twój pragmatyzm i umiejętność przepychania trudnych spotkań.", outcome_en: "Pundits praise your championship grit and ability to win when playing below par.", outcome_de: "Experten loben deine mentale Härte bei schwächeren Leistungen.", outcome_nl: "Analisten prijzen je vermogen om ook op mindere dagen de winst over de streep te trekken."
            },
            {
                text_pl: "[Medialność] Nawet rzucając na pół gwizdka, jestem lepszy od większości tych chłopaków!",
                text_en: "[Showmanship] Even throwing in second gear with my eyes half-closed, I am still levels above the rest!",
                text_de: "[Showmanship] Selbst im Schongang bin ich immer noch eine Klasse besser als die Konkurrenz!",
                text_nl: "[Showmanship] Zelfs op halve kracht ben ik nog steeds een klasse beter dan de rest hier!",
                effect: { prof: -4, pop: 4 },
                outcome_pl: "Twoja wypowiedź podgrzewa atmosferę w szatni przed kolejną rundą!", outcome_en: "Your swagger sparks fierce dressing-room debates ahead of the next round!", outcome_de: "Dein Spruch sorgt für reichlich Zündstoff im Spielbereich!", outcome_nl: "Je uitspraak zet de verhoudingen in de kleedkamer op scherp!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po zwycięstwie w World Grand Prix", title_en: "🎤 World Grand Prix Debrief", title_de: "🎤 Nach dem World Grand Prix", title_nl: "🎤 Na de World Grand Prix",
        desc_pl: "Cloud Sports: 'Zasady Double-In/Double-Out sprawiają wielu graczom ogromne trudności. Dlaczego dla Ciebie to taka łatwizna?'",
        desc_en: "Cloud Sports: 'Double-In/Double-Out format breaks so many players. Why do you make it look so effortless?'",
        desc_de: "Cloud Sports: 'Der Double-In/Double-Out-Modus bricht viele Stars. Warum wirkt das bei dir so spielend leicht?'",
        desc_nl: "Cloud Sports: 'Het Double-In/Double-Out format breekt veel toppers. Waarom oogt het bij jou zo moeiteloos?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Mój sekret to setki godzin spędzonych na rzutach w pierścień podwójny przed turniejem. Trening popłaca.",
                text_en: "[Professionalism] My secret is hundreds of hours practicing outer ring targets exclusively. Dedicated preparation pays off.",
                text_de: "[Professionalität] Mein Geheimnis sind hunderte Stunden gezieltes Doppeltraining. Harte Arbeit zahlt sich aus.",
                text_nl: "[Professionaliteit] Mijn geheim is honderden uren gericht trainen op de buitenste ring. Voorbereiding loont.",
                effect: { prof: 4, pop: 0 },
                outcome_pl: "Zostajesz uznany za najbardziej technicznego mistrza podwójnych w tourze.", outcome_en: "Pundits crown you the premier technical master of the outer wire in darts.", outcome_de: "Experten küren dich zum technisch versiertesten Doppel-Spezialisten der Welt.", outcome_nl: "Analisten kronen jou tot de meest begaafde dubbelspecialist van de tour."
            },
            {
                text_pl: "[Medialność] Bo ja trafiam duble na zawołanie! Nie ma znaczenia, czy zaczynam od góry, czy od dołu tarczy!",
                text_en: "[Showmanship] Because I hit doubles in my sleep! Doesn't matter if I start on top or finish on the wire!",
                text_de: "[Showmanship] Weil ich Doppel im Schlaf treffe! Egal ob zum Start oder zum Sieg – ich treffe immer!",
                text_nl: "[Showmanship] Omdat ik dubbels met mijn ogen dicht raak! Maakt niet uit of het om te beginnen of finishen is!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Kibice uznają Cię za króla formatu z podwójnym otwarciem!", outcome_en: "Fans celebrate you as the undisputed king of the Double-In format!", outcome_de: "Die Fans feiern dich als unumstrittenen König des Double-In-Formats!", outcome_nl: "Fans vieren jou als de onbetwiste koning van het Double-In format!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Prasowa DartsZone", title_en: "🎤 DartsZone Press Hub", title_de: "🎤 DartsZone Pressezentrum", title_nl: "🎤 DartsZone Pershub",
        desc_pl: "Pytanie: 'Widzieliśmy, że po wygranym meczu rozdałeś autografy i robiłeś zdjęcia z fanami przez ponad godzinę. Nie jesteś zmęczony?'",
        desc_en: "Question: 'You spent over an hour signing autographs and taking selfies with fans after your win. Not exhausted?'",
        desc_de: "Frage: 'Du hast nach dem Sieg über eine Stunde lang Autogramme geschrieben und Selfies gemacht. Gar nicht müde?'",
        desc_nl: "Vraag: 'Je hebt na je zege meer dan een uur handtekeningen uitgedeeld en selfies gemaakt. Ben je niet kapot?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Kibice płacą za bilety i wspierają nasz sport. Poświęcenie im czasu to mój zawodowy obowiązek.",
                text_en: "[Professionalism] Fans pay their hard-earned money to support us. Giving back my time is a professional duty.",
                text_de: "[Professionalität] Die Fans zahlen hart verdientes Geld für Tickets. Ihnen Zeit zu schenken, ist meine Pflicht als Profi.",
                text_nl: "[Professionaliteit] De fans betalen hun zuurverdiende geld voor tickets. Tijd voor ze maken is mijn plicht als prof.",
                effect: { prof: 3, pop: 1 },
                outcome_pl: "Kibice na całym świecie uznają Cię za wzór sportowca z klasą.", outcome_en: "Fans globally praise your down-to-earth humility and ambassadorial class.", outcome_de: "Fans weltweit schätzen deine Fannähe und Bodenständigkeit.", outcome_nl: "Fans wereldwijd prijzen jouw benaderbaarheid en klasse als ambassadeur."
            },
            {
                text_pl: "[Medialność] Uwielbiam blask fleszy i uwielbienie tłumów! Fani wiedzą, kto jest prawdziwą gwiazdą tego wieczoru!",
                text_en: "[Showmanship] I live for the flashing cameras and the adoration! The crowd knows who the real superstar is!",
                text_de: "[Showmanship] Ich lebe für das Scheinwerferlicht und den Jubel! Die Fans wissen, wer hier der Superstar ist!",
                text_nl: "[Showmanship] Ik leef voor de camera's en de adoratie! Het publiek weet wie de echte superster is!",
                effect: { prof: -2, pop: 6 },
                outcome_pl: "Twoje zdjęcia z fanami zalewają media społecznościowe, windując zasięgi!", outcome_en: "Fan selfies explode across social feeds, sending your follower count soaring!", outcome_de: "Fan-Selfies überfluten die Feeds und lassen deine Followerzahlen explodieren!", outcome_nl: "Fan-selfies overspoelen social media en laten je volgersaantal exploderen!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po Big Fishu (170 checkout)", title_en: "🎤 Big Fish Checkout Special", title_de: "🎤 Nach dem 'Big Fish' (170)", title_nl: "🎤 Na de 'Big Fish' (170 finish)",
        desc_pl: "Cloud Sports: 'BIG FISH! Zamknąłeś 170 punktów rzutem w sam środek tarczy! Czy to najpiękniejszy zamek w Twojej karierze?'",
        desc_en: "Cloud Sports: 'THE BIG FISH! You took out 170 right in the dead-center Bullseye! The greatest checkout of your life?'",
        desc_de: "Cloud Sports: 'THE BIG FISH! 170 Punkte mitten ins Bullseye zum Sieg! Der schönste Checkout deines Lebens?'",
        desc_nl: "Cloud Sports: 'THE BIG FISH! Je gooide 170 uit recht in de Bullseye! De mooiste finish uit je carrière?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Zawsze celuję w Bullseye z pełnym przekonaniem. Piękny finisz, ale najważniejsza jest wygrana w całym meczu.",
                text_en: "[Professionalism] I committed to the Bullseye with 100% conviction. A fantastic finish, but closing the match is what matters.",
                text_de: "[Professionalität] Ich habe das Bullseye mit voller Überzeugung anvisiert. Ein tolles Finish, aber der Sieg zählt.",
                text_nl: "[Professionaliteit] Ik gooide met volle overtuiging op de Bullseye. Een fantastische finish, maar de winst telt.",
                effect: { prof: 4, pop: 1 },
                outcome_pl: "Komentatorzy chwalą Twoje opanowanie przy najtrudniejszym zamku świata.", outcome_en: "Pundits applaud your cool composure executing the hardest finish in darts.", outcome_de: "Experten loben deine Eiseskälte beim schwierigsten Checkout der Welt.", outcome_nl: "Analisten prijzen je kalmte bij de moeilijkste finish in de dartssport."
            },
            {
                text_pl: "[Medialność] Wyciągnąłem wielką rybę na oczach całego świata! Kto potrafi to zrobić lepiej niż ja?!",
                text_en: "[Showmanship] Reeled in the Big Fish on live world television! Nobody on this earth does it with more swagger than me!",
                text_de: "[Showmanship] Den 'Big Fish' live vor Millionen gefangen! Niemand zelebriert das besser als ich!",
                text_nl: "[Showmanship] De Big Fish binnengehaald voor miljoenen kijkers! Niemand doet dit met meer klasse dan ik!",
                effect: { prof: -2, pop: 7 },
                outcome_pl: "Nagranie z Twoim 170 checkoutem staje się hitem programów sportowych!", outcome_en: "Broadcast replay of your 170 becomes the top sports reel of the week globally!", outcome_de: "Dein 170er-Finish wird zum weltweiten Top-Highlight der Sportwoche!", outcome_nl: "De beelden van je 170 finish worden wereldwijd het sporthoogtepunt van de week!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Wywiadów Viaplayr", title_en: "🎤 Viaplayr Flash Corner", title_de: "🎤 Viaplayr Blitz-Ecke", title_nl: "🎤 Viaplayr Flitshoek",
        desc_pl: "Reporter: 'Wygrałeś mecz bez straty ani jednego lega (tzw. whitewash 6:0). Czy rywal w ogóle zawiesił poprzeczkę?'",
        desc_en: "Reporter: 'You swept the match without conceding a single leg (6-0 whitewash). Did your rival even challenge you?'",
        desc_de: "Reporter: 'Ein glatter 6:0-Whitewash ohne Legverlust. War dein Gegner überhaupt eine Hürde?'",
        desc_nl: "Verslaggever: 'Een afgetekende 6-0 whitewash zonder legverlies. Was je tegenstander überhaupt een partij?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Wynik 6:0 nie oddaje walki na tarczy. Rywal miał swoje szanse na dublach, ja byłem po prostu skuteczniejszy.",
                text_en: "[Professionalism] The 6-0 scoreline is flattering. He had chances at doubles; I was just sharper on my checkouts.",
                text_de: "[Professionalität] Das 6:0 täuscht etwas. Er hatte seine Chancen auf Doppel, ich war heute einfach konsequenter.",
                text_nl: "[Professionaliteit] De 6-0 vertekent het beeld. Hij had kansen op de dubbels, ik was vandaag gewoon klinischer.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Rywal dziękuje Ci w wywiadzie za okazany szacunek mimo wysokiej porażki.", outcome_en: "Your defeated opponent publicly thanks you for your respectful comments.", outcome_de: "Dein Gegner bedankt sich öffentlich für deine fairen Worte trotz der Niederlage.", outcome_nl: "Je tegenstander bedankt je publiekelijk voor je respectvolle woorden na de afstraffing."
            },
            {
                text_pl: "[Medialność] Zmiotłem go ze sceny jak pył! Następnym razem niech lepiej odda mecz walkowerem, zaoszczędzi wstydu!",
                text_en: "[Showmanship] Absolute demolition job! Next time he should just concede a walkover and save himself the embarrassment!",
                text_de: "[Showmanship] Absolute Zerstörung! Nächstes Mal sollte er lieber kampflos aufgeben, um sich die Blamage zu sparen!",
                text_nl: "[Showmanship] Complete vernedering! Volgende keer kan hij beter forfait geven, dat scheelt hem schaamte!",
                effect: { prof: -4, pop: 6 },
                outcome_pl: "Twoje bezwzględne podsumowanie wywołuje burzę komentarzy w sieci!", outcome_en: "Your brutal assessment triggers an intense storm of comments across darts forums!", outcome_de: "Dein gnadenloser Spruch entfacht heftige Diskussionen in den Foren!", outcome_nl: "Je keiharde analyse zorgt voor een storm aan reacties op dartfora!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad dla Darts Talk", title_en: "🎤 Darts Talk Studio", title_de: "🎤 Darts Talk Studio", title_nl: "🎤 Darts Talk Studio",
        desc_pl: "Dziennikarz pyta: 'Twoje tempo rzutu jest uznawane za najszybsze w całym tourze. Nie boisz się utraty kontroli?'",
        desc_en: "Reporter asks: 'Your rhythm is officially clocked as the fastest in the PDC. Aren't you afraid of losing control?'",
        desc_de: "Reporter fragt: 'Dein Wurftempo gilt offiziell als das schnellste der Tour. Hast du keine Angst vor Kontrollverlust?'",
        desc_nl: "Verslaggever vraagt: 'Jouw werptempo is officieel het hoogste van het circuit. Ben je niet bang de controle te verliezen?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Płynność rzutu wynika z pamięci mięśniowej. Zbyt długie myślenie przy tarczy tylko przeszkadza.",
                text_en: "[Professionalism] Fluidity comes from pure muscle memory. Overthinking at the oche only creates unnecessary doubt.",
                text_de: "[Professionalität] Das Tempo kommt aus dem Muskelgedächtnis. Zu viel Nachdenken am Oche stört nur den Fluss.",
                text_nl: "[Professionaliteit] Dat tempo komt uit spiergeheugen. Te veel nadenken aan de oche verstoort alleen maar je flow.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Analitycy techniczni uznają Twój rzut za biomechaniczne arcydzieło.", outcome_en: "Biomechanical analysts praise your stroke as a masterpiece of efficient movement.", outcome_de: "Bewegungsanalysten loben deinen Wurf als Meisterwerk der Effizienz.", outcome_nl: "Bewegingswetenschappers noemen jouw worp een meesterwerk van efficiëntie."
            },
            {
                text_pl: "[Medialność] Rzucam szybko, trafiam celnie i nie marnuję czasu widzów! Jestem darterem ery TikToka!",
                text_en: "[Showmanship] I throw fast, strike true, and never waste viewers' time! I am the ultimate rapid-fire superstar!",
                text_de: "[Showmanship] Ich werfe schnell, treffe perfekt und verschwende keine Zeit! Ich bin der Rockstar der neuen Generation!",
                text_nl: "[Showmanship] Ik gooi snel, raak alles en verspil niemands tijd! Ik ben de superster van de nieuwe generatie!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Młodzi fani uwielbiają Twoje błyskawiczne tempo rzucania!", outcome_en: "Gen-Z darts fans celebrate your lightning-fast entertainment value!", outcome_de: "Junge Fans feiern dein rasantes Tempo und deinen Entertainment-Faktor!", outcome_nl: "De jonge generatie fans smult van jouw moordende tempo en entertainmentwaarde!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Flash Cloud Sports", title_en: "🎤 Cloud Sports Flash Area", title_de: "🎤 Cloud Sports Flash-Ecke", title_nl: "🎤 Cloud Sports Flitszone",
        desc_pl: "Reporter: 'Przed decydującym rzutem w podwójną odwróciłeś się do publiczności i poprosiłeś o hałas. Czy to nie było zbyt ryzykowne?'",
        desc_en: "Reporter: 'Before the winning match dart, you turned to the crowd asking for more noise. Too risky?'",
        desc_de: "Reporter: 'Vor dem Matchdart hast du dich umgedreht und die Fans angeheizt. War das nicht zu riskant?'",
        desc_nl: "Verslaggever: 'Voor de winnende matchdart draaide je je om naar het publiek voor meer lawaai. Te riskant?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Zrobiłem to pod wpływem ogromnych emocji, ale w przyszłości muszę zachować większy chłód.",
                text_en: "[Professionalism] Carried away by the moment, but moving forward I must keep my emotions strictly checked.",
                text_de: "[Professionalität] Das war der pure Adrenalinkick, aber künftig muss ich da professioneller und kühler bleiben.",
                text_nl: "[Professionaliteit] Dat was pure adrenaline, maar in het vervolg moet ik mijn hoofd koeler houden.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Dojrzała autorefleksja spotyka się z uznaniem ekspertów.", outcome_en: "Your mature self-awareness earns praise from veteran commentators.", outcome_de: "Deine reife Selbstkritik wird von Experten positiv hervorgehoben.", outcome_nl: "Je volwassen zelfreflectie wordt geprezen door ervaren analisten."
            },
            {
                text_pl: "[Medialność] Ryzykowne? Ja żyję dla takich chwil! Uwielbiam rzucać, kiedy 10 tysięcy gardeł krzyczy moje imię!",
                text_en: "[Showmanship] Risky? I live for this! I thrive when 10,000 screaming fans are roaring my name!",
                text_de: "[Showmanship] Riskant? Ich lebe dafür! Ich treffe am besten, wenn 10.000 Kehlen meinen Namen brüllen!",
                text_nl: "[Showmanship] Riskant? Ik leef hiervoor! Ik gooi het best als 10.000 kelen mijn naam schreeuwen!",
                effect: { prof: -3, pop: 6 },
                outcome_pl: "Klip z Twoim gestem staje się czołówką telewizyjnych zapowiedzi kolejnych gal!", outcome_en: "Footage of you hyping the crowd becomes the official TV promo opener!", outcome_de: "Der Clip wird zum offiziellen TV-Trailer für die nächsten Darts-Events!", outcome_nl: "De beelden waarin je het publiek opzweept worden de officiële tv-promo!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po meczu z legendą darta", title_en: "🎤 Legend Clash Interview", title_de: "🎤 Nach dem Duell mit der Legende", title_nl: "🎤 Na het duel met de legende",
        desc_pl: "DartsZone: 'Właśnie pokonałeś wielokrotnego mistrza świata i legendę tego sportu. Czas na zmianę warty na szczycie?'",
        desc_en: "DartsZone: 'You just dethroned a multi-time World Champion and living legend. Is this the official changing of the guard?'",
        desc_de: "DartsZone: 'Du hast gerade einen mehrfachen Weltmeister und Legende geschlagen. Ist das der Wachwechsel?'",
        desc_nl: "DartsZone: 'Je hebt zojuist een meervoudig wereldkampioen en levende legende verslagen. Is de macht gewisseld?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Gra z taką legendą to ogromny zaszczyt. Osiągnął w tym sporcie wszystko, mam do niego bezgraniczny szacunek.",
                text_en: "[Professionalism] Sharing the oche with a true icon is an honor. He paved the way for all of us; utmost respect.",
                text_de: "[Professionalität] Mit so einer Ikone auf der Bühne zu stehen, ist eine Ehre. Größter Respekt vor seiner Lebensleistung.",
                text_nl: "[Professionaliteit] Met zo'n icoon op het podium staan is een eer. Hij plaveide de weg voor ons allen; enorm veel respect.",
                effect: { prof: 4, pop: 0 },
                outcome_pl: "Pokora i szacunek wobec legendy zjednują Ci sympatię całego środowiska darterskiego.", outcome_en: "Your heartfelt respect for the icon wins the hearts of purists worldwide.", outcome_de: "Dein aufrichtiger Respekt bringt dir die Sympathie der gesamten Darts-Welt ein.", outcome_nl: "Je oprechte respect voor het icoon verovert de harten van alle dartfans."
            },
            {
                text_pl: "[Medialność] Jego czas minął, teraz nadchodzi moja era! Pora, żeby starzy mistrzowie zrobili miejsce nowemu królowi!",
                text_en: "[Showmanship] His era is over; my dynasty begins tonight! Time for the old guard to step aside for the new king!",
                text_de: "[Showmanship] Seine Zeit ist vorbei, meine Ära beginnt! Zeit für die alten Meister, Platz für den neuen König zu machen!",
                text_nl: "[Showmanship] Zijn tijd is voorbij, mijn tijdperk begint nu! Tijd voor de oude garde om plaats te maken voor de nieuwe koning!",
                effect: { prof: -5, pop: 7 },
                outcome_pl: "Twoja bezkompromisowa deklaracja staje się tematem numer jeden we wszystkich mediach sportowych!", outcome_en: "Your bold declaration dominates every sports front page and debate show worldwide!", outcome_de: "Deine Kampfansage dominiert weltweit die Titelseiten der Sportpresse!", outcome_nl: "Je gewaagde uitspraak domineert alle sportvoorpagina's en talkshows!"
            }
        ]
    }
];

// --- LOSOWE EVENTY ---
const randomEventsDatabase = [
    {
        title_pl: "Pokusa Kebabowa", title_en: "Kebab Temptation", title_de: "Kebab-Versuchung", title_nl: "Kebab-verleiding",
        desc_pl: "Zauważasz budkę z kebabem obok hali przed ważnym meczem. Co robisz?", desc_en: "You notice a kebab stand next to the arena before an important match. What do you do?", desc_de: "Du bemerkst eine Kebab-Bude neben der Arena vor einem wichtigen Spiel. Was machst du?", desc_nl: "Je ziet een kebabkraam naast de arena voor een belangrijk duel. Wat doe je?",
        choices: [
            { text_pl: "Kupuję mieszanego z ostrym sosem!", text_en: "I buy a mixed kebab with hot sauce!", text_de: "Ich kaufe einen gemischten Döner mit scharfer Soße!", text_nl: "Ik koop een gemengde kebab met pikante saus!", effect: { stamina: +15, doubles: -1 }, outcome_pl: "Czujesz się pełen energii, ale ostre przyprawy sprawiają, że lekko drży ci dłoń na podwójnych.", outcome_en: "You feel full of energy, but the spicy sauce makes your hand slightly shake on doubles.", outcome_de: "Du fühlst dich voller Energie, aber die scharfe Soße lässt deine Hand leicht bei Doubles zittern.", outcome_nl: "Je voelt je vol energie, maar de pikante saus laat je hand licht trillen bij doubles." },
            { text_pl: "Trzymam rygor. Tylko woda i banan.", text_en: "I stick to discipline. Only water and a banana.", text_de: "Ich halte mich an die Disziplin. Nur Wasser und eine Banane.", text_nl: "Ik houd me aan discipline. Alleen water en een banaan.", effect: { scoring: +1 }, outcome_pl: "Zjadłeś zdrowo. Czujesz niesamowitą lekkość i skupienie przy tarczy.", outcome_en: "You ate healthy. You feel amazing lightness and focus at the board.", outcome_de: "Du hast gesund gegessen. Du fühlst dich wunderbar leicht und konzentriert bei der Scheibe.", outcome_nl: "Je hebt gezond gegeten. Je voelt je fantastisch licht en geconcentreerd bij het bord." }
        ]
    },
    {
        title_pl: "Krzyki z widowni", title_en: "Crowd Noise", title_de: "Lärm aus dem Publikum", title_nl: "Lawaai van het publiek",
        desc_pl: "Kibice gwiżdżą przy każdym twoim rzucie. Sytuacja robi się napięta.", desc_en: "Fans are whistling at every throw you make. The situation is getting tense.", desc_de: "Fans pfeifen bei jedem deiner Würfe. Die Situation wird angespannt.", desc_nl: "Fans fluiten bij elke worp die je maakt. De situatie wordt gespannen.",
        choices: [
            { text_pl: "Zakładam wielkie słuchawki budowlane.", text_en: "I put on big construction headphones.", text_de: "Ich ziehe große Bau-Kopfhörer an.", text_nl: "Ik zet grote bouwkrijgkoptelefoons op.", effect: { doubles: +2, pop: -10 }, outcome_pl: "Publiczność cię wyśmiała i straciłeś fanów, ale totalnie odciąłeś się od hałasu!", outcome_en: "The crowd laughed at you and you lost fans, but you completely blocked out the noise!", outcome_de: "Das Publikum hat dich ausgelacht und du verlierst Fans, aber du hast den Lärm völlig blockiert!", outcome_nl: "Het publiek lachte je uit en je verliest fans, maar je blokkeerde het lawaai volledig!" },
            { text_pl: "Uśmiecham się i zachęcam ich do głośniejszego dopingu.", text_en: "I smile and encourage them to cheer louder.", text_de: "Ich lächle und ermutige sie, lauter zu jubeln.", text_nl: "Ik glimlach en moedig ze aan om harder te juichen.", effect: { pop: +15, stamina: -5 }, outcome_pl: "Kibice pokochali twoją charyzmę, ale interakcja z nimi mocno cię wyczerpała.", outcome_en: "Fans loved your charisma, but interacting with them exhausted you significantly.", outcome_de: "Die Fans liebten dein Charisma, aber die Interaktion mit ihnen erschöpfte dich stark.", outcome_nl: "Fans hielden van je charisma, maar interactie met hen uitputte je aanzienlijk." }
        ]
    },
    {
        title_pl: "Matematyczny Kłopot", title_en: "Math Problem", title_de: "Mathematisches Problem", title_nl: "Wiskundig probleem",
        desc_pl: "Zostało ci 107 punktów, a ty przez pomyłkę rzuciłeś T19. Zgubiłeś się w liczeniu...", desc_en: "You have 107 points left, but you accidentally threw T19. You're confused with the math...", desc_de: "Dir bleiben 107 Punkte, aber du wirfst versehentlich T19. Du bist mit der Mathematik verwirrt...", desc_nl: "Je hebt 107 punten over, maar je werpt per ongeluk T19. Je bent in de war met de wiskunde...",
        choices: [
            { text_pl: "Rzucam w środek na czuja!", text_en: "I throw to the center without thinking!", text_de: "Ich werfe ohne Nachdenken ins Zentrum!", text_nl: "Ik gooi zomaar naar het midden!", effect: { doubles: -2 }, outcome_pl: "Trafiłeś w 3... Komentatorzy mają z ciebie ubaw na żywo. Twoja pewność siebie spada.", outcome_en: "You hit a 3... The commentators are laughing at you live. Your confidence drops.", outcome_de: "Du triffst eine 3... Die Kommentatoren lachen live über dich. Dein Selbstvertrauen sinkt.", outcome_nl: "Je raakt een 3... De commentatoren lachen je live uit. Je zelfvertrouwen daalt." },
            { text_pl: "Proszę sędziego o podanie reszty punktów.", text_en: "I ask the referee to tell me how many points are left.", text_de: "Ich bitte den Schiedsrichter mir zu sagen, wie viele Punkte übrig sind.", text_nl: "Ik vraag de scheidsrechter hoeveel punten er over zijn.", effect: { scoring: +1, pop: -5 }, outcome_pl: "Wstyd na cały świat, ale przynajmniej uratowałeś lega dobrą matematyką sędziego.", outcome_en: "Shame on you in front of the whole world, but at least you saved the leg with the referee's math.", outcome_de: "Schande über die ganze Welt, aber du hast zumindest das Leg durch die Mathematik des Schiedsrichters gerettet.", outcome_nl: "Schande voor je uit voor de hele wereld, maar je redde tenminste het leg met de wiskunde van de scheidsrechter." }
        ]
    },
    {
        title_pl: "Tajemniczy Trunek", title_en: "Mystery Drink", title_de: "Geheimnisvolles Getränk", title_nl: "Mysterieuze drank",
        desc_pl: "W barze dla zawodników ktoś zostawił darmowego, niebieskiego drinka energetycznego.", desc_en: "Someone left a free blue energy drink in the player's bar.", desc_de: "Jemand hat ein kostenloses blaues Energy-Drink in der Spielerbar hinterlassen.", desc_nl: "Iemand liet een gratis blauwe energiedrank in de spelerbar achter.",
        choices: [
            { text_pl: "Piję do dna!", text_en: "I drink it all!", text_de: "Ich trinke es auf!", text_nl: "Ik drink het op!", effect: { stamina: +30, scoring: -2 }, outcome_pl: "MASZ TYLE ENERGII, ŻE NIE MOŻESZ USTAĆ W MIEJSCU! Lotki latają we wszystkie strony.", outcome_en: "YOU HAVE SO MUCH ENERGY YOU CAN'T STAND STILL! Darts fly everywhere.", outcome_de: "DU HAST SO VIEL ENERGIE, DASS DU NICHT STILLSTEHEN KANNST! Darts fliegen überall hin.", outcome_nl: "JE HEBT ZO VEEL ENERGIE DAT JE NIET STIL KUNT STAAN! Pijlen vliegen overal heen." },
            { text_pl: "Zostawiam to. Piję wodę.", text_en: "I leave it. I drink water.", text_de: "Ich lasse es stehen. Ich trinke Wasser.", text_nl: "Ik laat het staan. Ik drink water.", effect: { stamina: +5 }, outcome_pl: "Nuda, ale przynajmniej nie masz rewolucji żołądkowych.", outcome_en: "Boring, but at least you don't have a stomach revolution.", outcome_de: "Langweilig, aber zumindest hast du keine Magenrevolution.", outcome_nl: "Saai, maar je hebt op zijn minst geen maagrevolutie." }
        ]
    },
    {
        title_pl: "Bójka w Pubie", title_en: "Pub Fight", title_de: "Schlägerei in der Kneipe", title_nl: "Gevecht in de kroeg",
        desc_pl: "Podczas wieczornego relaksu widzisz jak pijany kibic obraża pewną legendę darta.", desc_en: "During evening relaxation, you see a drunk fan insulting a darts legend.", desc_de: "Während einer abendlichen Entspannung siehst du einen betrunkenen Fan eine Dart-Legende beleidigen.", desc_nl: "Tijdens een avondrelaxatie zie je een dronken fan een dartlegende beledigen.",
        choices: [
            { text_pl: "Staję w obronie legendy!", text_en: "I defend the legend!", text_de: "Ich verteidige die Legende!", text_nl: "Ik verdedig de legende!", effect: { pop: +20, stamina: -15 }, outcome_pl: "Awantura na całego! Masz podbite oko, ale zyskałeś szacunek w darterskim podziemiu.", outcome_en: "A full-blown brawl! You get a black eye, but you gain respect in the darts underworld.", outcome_de: "Ein ausgewachsener Kampf! Du bekommst ein blaues Auge, gewinnst aber Respekt in der Dart-Unterwelt.", outcome_nl: "Een volledige vechtpartij! Je krijgt een blauw oog, maar je wint respect in de dartonderwereld." },
            { text_pl: "Wychodzę po angielsku.", text_en: "I leave quietly.", text_de: "Ich gehe leise.", text_nl: "Ik ga stilletjes weg.", effect: { prof: +5 }, outcome_pl: "Uniknąłeś skandalu w tabloidach. Profesjonalne, choć tchórzliwe zachowanie.", outcome_en: "You avoided a tabloid scandal. Professional, if cowardly behavior.", outcome_de: "Du hast Skandale in der Boulevardpresse vermieden. Professionell, wenn auch feige.", outcome_nl: "Je vermijdt schandaal in de gele pers. Professioneel, zo niet laf gedrag." }
        ]
    },
    {
        title_pl: "Złamany Grot", title_en: "Broken Dart", title_de: "Gebrochener Dart", title_nl: "Gebroken pijl",
        desc_pl: "Twoja ulubiona lotka upada i grot łamie się na pół 10 minut przed meczem!", desc_en: "Your favorite dart falls and breaks in half 10 minutes before the match!", desc_de: "Dein Lieblingsdart fällt und bricht 10 Minuten vor dem Spiel in zwei!", desc_nl: "Je favoriete pijl valt en breekt 10 minuten voor het duel in tweeën!",
        choices: [
            { text_pl: "Gram zapasowym kompletem.", text_en: "I play with the spare set.", text_de: "Ich spiele mit dem Ersatzset.", text_nl: "Ik speel met de reserveset.", effect: { scoring: -1, doubles: -1 }, outcome_pl: "Nowe lotki dziwnie leżą w dłoni. Musisz się do nich przyzwyczaić.", outcome_en: "New darts feel strange in your hand. You need to get used to them.", outcome_de: "Neue Darts fühlen sich seltsam in der Hand an. Du musst dich daran gewöhnen.", outcome_nl: "Nieuwe pijlen voelen vreemd in je hand. Je moet eraan wennen." },
            { text_pl: "Biegnę do sklepu na hali po nowe groty (Płacisz £50).", text_en: "I run to the venue shop for new points (You pay £50).", text_de: "Ich renne zum Laden in der Halle für neue Spitzen (Du zahlst £50).", text_nl: "Ik ren naar de winkel in de hal voor nieuwe punten (Je betaalt £50).", effect: { budget: -50, prof: +2 }, outcome_pl: "Straciłeś trochę kasy, ale uratowałeś swój ukochany sprzęt.", outcome_en: "You lost some money, but you saved your beloved equipment.", outcome_de: "Du hast etwas Geld verloren, aber deine geliebte Ausrüstung gerettet.", outcome_nl: "Je hebt wat geld verloren, maar je geliefde uitrusting gered." }
        ]
    },
    {
        title_pl: "Propozycja Od Sponsora", title_en: "Sponsor Offer", title_de: "Sponsoren-Angebot", title_nl: "Sponsoraanbod",
        desc_pl: "Lokalny producent parówek chce zapłacić ci za wyjście na scenę w stroju hot-doga.", desc_en: "A local sausage producer wants to pay you to go on stage dressed as a hot dog.", desc_de: "Ein lokaler Wursthersteller möchte dich dafür bezahlen, im Hot-Dog-Kostüm auf die Bühne zu gehen.", desc_nl: "Een lokale worstproducent wil je betalen om in een hotdog-kostuum op het podium te gaan.",
        choices: [
            { text_pl: "Biorę to! (Zyskujesz £500).", text_en: "I'll take it! (You gain £500).", text_de: "Ich nehme es! (Du erhältst £500).", text_nl: "Ik neem het! (Je krijgt £500).", effect: { budget: 500, pop: +10, prof: -15 }, outcome_pl: "Internet płacze ze śmiechu! Zostałeś memem, masz kasę, ale organizacja patrzy na ciebie z politowaniem.", outcome_en: "The internet cries with laughter! You became a meme, have money, but the organization pities you.", outcome_de: "Das Internet weint vor Lachen! Du wurdest zum Meme, hast Geld, aber die Organisation bemitleidet dich.", outcome_nl: "Het internet huilt van het lachen! Je bent een meme geworden, hebt geld, maar de organisatie beklaagt je." },
            { text_pl: "Nie ma mowy, jestem poważnym sportowcem.", text_en: "No way, I'm a serious athlete.", text_de: "Auf keinen Fall, ich bin ein ernsthafter Sportler.", text_nl: "Echt niet, ik ben een serieuze atleet.", effect: { prof: +5 }, outcome_pl: "Odrzuciłeś ofertę, ale zachowałeś twarz.", outcome_en: "You rejected the offer but saved your face.", outcome_de: "Du hast das Angebot abgelehnt, aber dein Gesicht gewahrt.", outcome_nl: "Je hebt het aanbod afgewezen, maar je gezicht gered." }
        ]
    },
    {
        title_pl: "Dziwna Impreza", title_en: "Strange Party", title_de: "Seltsame Party", title_nl: "Vreemd Feest",
        desc_pl: "Jeden z liderów rankingu zaprasza cię na farbowanie włosów i piwo przed turniejem.", desc_en: "One of the top ranked players invites you to dye your hair and have a beer before the tournament.", desc_de: "Einer der Top-Spieler lädt dich ein, dir die Haare zu färben und vor dem Turnier ein Bier zu trinken.", desc_nl: "Een van de topspelers nodigt je uit om je haar te verven en een biertje te drinken voor het toernooi.",
        choices: [
            { text_pl: "Lecimy z tym!", text_en: "Let's do it!", text_de: "Los geht's!", text_nl: "Laten we het doen!", effect: { pop: +15, stamina: -20, doubles: -1 }, outcome_pl: "Wyglądasz jak papuga i masz potężnego kaca, ale fani cię kochają!", outcome_en: "You look like a parrot and have a massive hangover, but the fans love you!", outcome_de: "Du siehst aus wie ein Papagei und hast einen massiven Kater, aber die Fans lieben dich!", outcome_nl: "Je ziet eruit als een papegaai en hebt een enorme kater, maar de fans houden van je!" },
            { text_pl: "Odmawiam, muszę się wyspać.", text_en: "I refuse, I need to sleep.", text_de: "Ich lehne ab, ich muss schlafen.", text_nl: "Ik weiger, ik moet slapen.", effect: { stamina: +15 }, outcome_pl: "Obudziłeś się rześki jak skowronek. Twój znajomy rano wyglądał jak zombie.", outcome_en: "You woke up fresh as a daisy. Your friend looked like a zombie in the morning.", outcome_de: "Du bist frisch wie der Morgen aufgewacht. Dein Freund sah morgens wie ein Zombie aus.", outcome_nl: "Je werd fris als een hoentje wakker. Je vriend zag er 's ochtends uit als een zombie." }
        ]
    },
    {
        title_pl: "Awaria Tablicy", title_en: "Board Failure", title_de: "Board-Ausfall", title_nl: "Bordstoring",
        desc_pl: "W trakcie twojego rzutu gasną wszystkie światła na hali.", desc_en: "During your throw, all lights in the hall go out.", desc_de: "Während deines Wurfs gehen alle Lichter in der Halle aus.", desc_nl: "Tijdens je worp gaan alle lichten in de hal uit.",
        choices: [
            { text_pl: "Rzucam po ciemku z pamięci!", text_en: "I throw in the dark from memory!", text_de: "Ich werfe im Dunkeln aus dem Gedächtnis!", text_nl: "Ik gooi in het donker uit mijn hoofd!", effect: { scoring: -2, pop: +5 }, outcome_pl: "Trafiłeś w oponę, a jedna lotka wylądowała w dywanie. Ale widowisko było przednie!", outcome_en: "You hit the surround, and one dart landed in the carpet. But the show was great!", outcome_de: "Du hast die Umrandung getroffen und ein Dart landete im Teppich. Aber die Show war großartig!", outcome_nl: "Je raakte de rand en één pijl belandde in het tapijt. Maar de show was geweldig!" },
            { text_pl: "Czekam cierpliwie na naprawę.", text_en: "I wait patiently for repairs.", text_de: "Ich warte geduldig auf die Reparatur.", text_nl: "Ik wacht geduldig op reparatie.", effect: { prof: +5 }, outcome_pl: "Zachowałeś spokój. Zimna krew to podstawa.", outcome_en: "You stayed calm. Cold blood is key.", outcome_de: "Du bist ruhig geblieben. Kaltes Blut ist wichtig.", outcome_nl: "Je bleef kalm. Koud bloed is de sleutel." }
        ]
    },
    {
        title_pl: "Zapomniane Lotki", title_en: "Forgotten Darts", title_de: "Vergessene Darts", title_nl: "Vergeten Pijlen",
        desc_pl: "Zostawiłeś swój pokrowiec z lotkami w taksówce!", desc_en: "You left your dart case in a taxi!", desc_de: "Du hast dein Dart-Etui in einem Taxi gelassen!", desc_nl: "Je hebt je dartetui in de taxi laten liggen!",
        choices: [
            { text_pl: "Pożyczam lotki od kolegi z touru.", text_en: "I borrow darts from a tour buddy.", text_de: "Ich leihe mir Darts von einem Tour-Kumpel.", text_nl: "Ik leen pijlen van een tourmaatje.", effect: { scoring: +2, doubles: -2 }, outcome_pl: "Są tak lekkie, że ładujesz same T20, ale nie możesz trafić żadnej podwójnej!", outcome_en: "They are so light you keep hitting T20, but you can't hit any doubles!", outcome_de: "Sie sind so leicht, dass du immer T20 triffst, aber keine Doubles schaffst!", outcome_nl: "Ze zijn zo licht dat je steeds T20 raakt, maar geen enkele double kan raken!" },
            { text_pl: "Dzwonię na infolinię (Płacisz £100 za zwrot).", text_en: "I call the helpline (Pay £100 for return).", text_de: "Ich rufe die Hotline an (Zahle £100 für die Rückgabe).", text_nl: "Ik bel de hulplijn (Betaal £100 voor retournering).", effect: { budget: -100, stamina: -5 }, outcome_pl: "Taksówkarz dowiózł sprzęt na ostatnią chwilę. Ale ile nerwów cię to kosztowało...", outcome_en: "The driver delivered the gear at the last minute. But it cost you a lot of nerves...", outcome_de: "Der Taxifahrer hat die Ausrüstung in letzter Minute geliefert. Aber das hat dich Nerven gekostet...", outcome_nl: "De taxichauffeur leverde de uitrusting op het laatste moment. Maar het kostte je veel zenuwen..." }
        ]
    },
    {
        title_pl: "Zakład o Piwo", title_en: "Beer Bet", title_de: "Bierwette", title_nl: "Bierweddenschap",
        desc_pl: "Znajomy z pubu stawia £50, że nie trafisz Bullseye'a z zamkniętymi oczami.", desc_en: "A pub friend bets £50 that you can't hit the Bullseye with your eyes closed.", desc_de: "Ein Freund aus dem Pub wettet £50, dass du das Bullseye nicht mit geschlossenen Augen triffst.", desc_nl: "Een vriend uit de kroeg wedt £50 dat je de Bullseye niet met gesloten ogen kunt raken.",
        choices: [
            { text_pl: "Trzymaj mi piwo.", text_en: "Hold my beer.", text_de: "Halt mein Bier.", text_nl: "Houd mijn bier vast.", effect: { budget: 50, pop: +2 }, outcome_pl: "Trafiłeś w samo serce tarczy! Stówa w kieszeni i darmowe piwo.", outcome_en: "You hit the dead center! Fifty quid in your pocket and a free beer.", outcome_de: "Du hast genau die Mitte getroffen! Fünfzig Pfund in der Tasche und ein Freibier.", outcome_nl: "Je raakte precies in het midden! Vijftig pond in de pocket en een gratis biertje." },
            { text_pl: "Nie bawię się w to.", text_en: "I'm not doing this.", text_de: "Da mache ich nicht mit.", text_nl: "Ik doe hier niet aan mee.", effect: { prof: +2 }, outcome_pl: "Odrzuciłeś zakład. Nuda.", outcome_en: "You refused the bet. Boring.", outcome_de: "Du hast die Wette abgelehnt. Langweilig.", outcome_nl: "Je hebt de weddenschap afgewezen. Saai." }
        ]
    },
    {
        title_pl: "Zatrucie Pokarmowe", title_en: "Food Poisoning", title_de: "Lebensmittelvergiftung", title_nl: "Voedselvergiftiging",
        desc_pl: "Wczorajsze owoce morza nie były chyba pierwszej świeżości...", desc_en: "Yesterday's seafood probably wasn't the freshest...", desc_de: "Die Meeresfrüchte von gestern waren wohl nicht mehr die frischesten...", desc_nl: "De zeevruchten van gisteren waren waarschijnlijk niet de meest verse...",
        choices: [
            { text_pl: "Biorę leki i gram.", text_en: "I take meds and play.", text_de: "Ich nehme Medikamente und spiele.", text_nl: "Ik neem medicijnen en speel.", effect: { stamina: -25, doubles: -1 }, outcome_pl: "Ledwo stoisz na nogach przy oche. Tragedia.", outcome_en: "You can barely stand at the oche. A tragedy.", outcome_de: "Du kannst am Oche kaum stehen. Eine Tragödie.", outcome_nl: "Je kunt amper staan bij de oche. Een tragedie." },
            { text_pl: "Spędzam dzień w toalecie.", text_en: "I spend the day in the toilet.", text_de: "Ich verbringe den Tag auf der Toilette.", text_nl: "Ik breng de dag door op het toilet.", effect: { stamina: +10 }, outcome_pl: "Opuściłeś trening, ale przynajmniej żyjesz.", outcome_en: "You missed training, but at least you're alive.", outcome_de: "Du hast das Training verpasst, aber wenigstens lebst du.", outcome_nl: "Je hebt de training gemist, maar je leeft tenminste nog." }
        ]
    },
    {
        title_pl: "Nowa Technika Rzutu", title_en: "New Throwing Technique", title_de: "Neue Wurftechnik", title_nl: "Nieuwe Werptechniek",
        desc_pl: "Oglądając YouTube, odkryłeś dziwny chwyt lotki.", desc_en: "Watching YouTube, you discovered a weird dart grip.", desc_de: "Beim Anschauen von YouTube hast du einen seltsamen Dartgriff entdeckt.", desc_nl: "Terwijl je YouTube keek, ontdekte je een vreemde dartgreep.",
        choices: [
            { text_pl: "Próbuję tego na turnieju!", text_en: "I'll try this at the tournament!", text_de: "Ich probiere das beim Turnier aus!", text_nl: "Ik probeer dit op het toernooi!", effect: { scoring: -3, doubles: -3 }, outcome_pl: "Katastrofa. Lotki leciały bokiem. Czasem klasyka jest najlepsza.", outcome_en: "Disaster. Darts flew sideways. Sometimes classic is best.", outcome_de: "Katastrophe. Darts flogen seitwärts. Manchmal ist klassisch am besten.", outcome_nl: "Ramp. Pijlen vlogen zijwaarts. Soms is klassiek het beste." },
            { text_pl: "Zostaję przy swoim.", text_en: "I'll stick to my own.", text_de: "Ich bleibe bei meinem.", text_nl: "Ik blijf bij de mijne.", effect: { prof: +2 }, outcome_pl: "Twoja stabilność rzutu została nienaruszona.", outcome_en: "Your throw stability remained intact.", outcome_de: "Deine Wurfstabilität blieb intakt.", outcome_nl: "Je werpstabiliteit bleef intact." }
        ]
    },
    {
        title_pl: "Fanka z Plakatem", title_en: "Fan with a Poster", title_de: "Fan mit Plakat", title_nl: "Fan met een poster",
        desc_pl: "Fanka w pierwszym rzędzie ma wielki plakat z napisem 'Wyjdź za mnie!'.", desc_en: "A fan in the front row holds a huge poster saying 'Marry me!'.", desc_de: "Ein Fan in der ersten Reihe hält ein riesiges Plakat mit der Aufschrift 'Heirate mich!'.", desc_nl: "Een fan op de eerste rij heeft een enorme poster met 'Trouw met me!'.",
        choices: [
            { text_pl: "Puszczam jej oczko.", text_en: "I wink at her.", text_de: "Ich zwinkere ihr zu.", text_nl: "Ik knipoog naar haar.", effect: { pop: +10, doubles: -1 }, outcome_pl: "Zrobiłeś show, ale straciłeś koncentrację na zamek.", outcome_en: "You put on a show, but lost focus on the checkout.", outcome_de: "Du hast eine Show abgezogen, aber den Fokus auf den Checkout verloren.", outcome_nl: "Je gaf een show, maar verloor de focus op de checkout." },
            { text_pl: "Ignoruję ją.", text_en: "I ignore her.", text_de: "Ich ignoriere sie.", text_nl: "Ik negeer haar.", effect: { scoring: +1 }, outcome_pl: "Pełne skupienie. Nic cię nie rozprasza.", outcome_en: "Total focus. Nothing distracts you.", outcome_de: "Voller Fokus. Nichts lenkt dich ab.", outcome_nl: "Volledige focus. Niets leidt je af." }
        ]
    },
    {
        title_pl: "Głośny Caller", title_en: "Loud Caller", title_de: "Lauter Caller", title_nl: "Luide Caller",
        desc_pl: "Sędzia dzisiaj wyjątkowo głośno krzyczy twoje punkty, co cię dekoncentruje.", desc_en: "The caller is shouting your points exceptionally loud today, which distracts you.", desc_de: "Der Caller ruft deine Punkte heute besonders laut, was dich ablenkt.", desc_nl: "De caller roept vandaag je punten uitzonderlijk luid, wat je afleidt.",
        choices: [
            { text_pl: "Krzyczę razem z nim!", text_en: "I shout along with him!", text_de: "Ich schreie mit ihm!", text_nl: "Ik schreeuw met hem mee!", effect: { pop: +5, stamina: -5 }, outcome_pl: "Straciłeś głos, ale widownia szaleje!", outcome_en: "You lost your voice, but the crowd goes wild!", outcome_de: "Du hast deine Stimme verloren, aber das Publikum tobt!", outcome_nl: "Je verloor je stem, maar het publiek wordt gek!" },
            { text_pl: "Zatykam uszy przed rzutem.", text_en: "I plug my ears before throwing.", text_de: "Ich halte mir vor dem Wurf die Ohren zu.", text_nl: "Ik stop mijn oren dicht voor het gooien.", effect: { prof: -2, doubles: +1 }, outcome_pl: "Dziwnie to wyglądało, ale pomogło.", outcome_en: "It looked weird, but it helped.", outcome_de: "Es sah komisch aus, hat aber geholfen.", outcome_nl: "Het zag er raar uit, maar het hielp." }
        ]
    },
    {
        title_pl: "Zablokowana Karta", title_en: "Blocked Card", title_de: "Blockierte Karte", title_nl: "Geblokkeerde Kaart",
        desc_pl: "Twoja karta bankowa nie działa podczas opłacania hotelu.", desc_en: "Your bank card is declined while paying for the hotel.", desc_de: "Deine Bankkarte wird beim Bezahlen des Hotels abgelehnt.", desc_nl: "Je bankkaart wordt geweigerd tijdens het betalen van het hotel.",
        choices: [
            { text_pl: "Dzwonię do menedżera po pomoc.", text_en: "I call my manager for help.", text_de: "Ich rufe meinen Manager um Hilfe.", text_nl: "Ik bel mijn manager voor hulp.", effect: { prof: +2 }, outcome_pl: "Menedżer ogarnął sprawę. Uff.", outcome_en: "The manager handled it. Phew.", outcome_de: "Der Manager hat es geregelt. Puh.", outcome_nl: "De manager heeft het afgehandeld. Oef." },
            { text_pl: "Śpię w holu na kanapie.", text_en: "I sleep on the couch in the lobby.", text_de: "Ich schlafe auf der Couch in der Lobby.", text_nl: "Ik slaap op de bank in de lobby.", effect: { stamina: -30, form: -2 }, outcome_pl: "Masz tak połamane plecy, że nie możesz unieść ręki.", outcome_en: "Your back is so broken you can't lift your arm.", outcome_de: "Dein Rücken tut so weh, dass du den Arm nicht heben kannst.", outcome_nl: "Je rug is zo kapot dat je je arm niet kunt optillen." }
        ]
    },
    {
        title_pl: "Sparing z Mistrzem", title_en: "Sparring with a Champion", title_de: "Sparring mit einem Champion", title_nl: "Sparren met een Kampioen",
        desc_pl: "Jeden z mistrzów proponuje ci szybki sparing na rozgrzewce.", desc_en: "One of the champions offers you a quick sparring session during warm-up.", desc_de: "Einer der Champions bietet dir beim Aufwärmen eine schnelle Sparring-Session an.", desc_nl: "Een van de kampioenen biedt je een snelle sparsessie aan tijdens de warming-up.",
        choices: [
            { text_pl: "Gramy na 100%!", text_en: "We play at 100%!", text_de: "Wir spielen 100%!", text_nl: "We spelen 100%!", effect: { scoring: +2, stamina: -10 }, outcome_pl: "Mistrz cię zniszczył, ale wiele się od niego nauczyłeś.", outcome_en: "The champion destroyed you, but you learned a lot.", outcome_de: "Der Champion hat dich zerstört, aber du hast viel gelernt.", outcome_nl: "De kampioen vernietigde je, maar je hebt veel geleerd." },
            { text_pl: "Odmawiam, oszczędzam siły.", text_en: "I refuse, saving energy.", text_de: "Ich lehne ab, spare Energie.", text_nl: "Ik weiger, energie sparen.", effect: { stamina: +5 }, outcome_pl: "Odpocząłeś, ale zmarnowałeś świetną okazję do nauki.", outcome_en: "You rested, but wasted a great learning opportunity.", outcome_de: "Du hast dich ausgeruht, aber eine tolle Lerngelegenheit verpasst.", outcome_nl: "Je rustte uit, maar miste een geweldige leerkans." }
        ]
    },
    {
        title_pl: "Wyrzucony Telefon", title_en: "Thrown Phone", title_de: "Geworfenes Telefon", title_nl: "Gegooide Telefoon",
        desc_pl: "W złości po przegranym legu rzuciłeś telefonem o ścianę.", desc_en: "In anger after a lost leg, you threw your phone at the wall.", desc_de: "Aus Wut nach einem verlorenen Leg hast du dein Telefon gegen die Wand geworfen.", desc_nl: "In woede na een verloren leg, gooide je je telefoon tegen de muur.",
        choices: [
            { text_pl: "Ups...", text_en: "Oops...", text_de: "Huch...", text_nl: "Oeps...", effect: { budget: -150, prof: -5 }, outcome_pl: "Kupno nowego telefonu kosztowało cię £150. Naucz się panować nad nerwami.", outcome_en: "Buying a new phone cost you £150. Learn to control your nerves.", outcome_de: "Der Kauf eines neuen Telefons kostete £150. Lerne, deine Nerven zu kontrollieren.", outcome_nl: "Een nieuwe telefoon kopen kostte je £150. Leer je zenuwen onder controle te houden." },
            { text_pl: "Szukam sponsora na nowy telefon.", text_en: "I look for a sponsor for a new phone.", text_de: "Ich suche einen Sponsor für ein neues Telefon.", text_nl: "Ik zoek een sponsor voor een nieuwe telefoon.", effect: { pop: -5 }, outcome_pl: "Fani skrytykowali cię za żebractwo w internecie.", outcome_en: "Fans criticized you for begging online.", outcome_de: "Fans haben dich dafür kritisiert, dass du online bettelst.", outcome_nl: "Fans bekritiseerden je omdat je online bedelde." }
        ]
    },
    {
        title_pl: "Trening Mentalny", title_en: "Mental Training", title_de: "Mentales Training", title_nl: "Mentale Training",
        desc_pl: "Dostałeś ofertę darmowej sesji u psychologa sportowego.", desc_en: "You received an offer for a free session with a sports psychologist.", desc_de: "Du hast ein Angebot für eine kostenlose Sitzung bei einem Sportpsychologen erhalten.", desc_nl: "Je hebt een aanbod gekregen voor een gratis sessie bij een sportpsycholoog.",
        choices: [
            { text_pl: "Idę na to.", text_en: "I'll go for it.", text_de: "Ich mache mit.", text_nl: "Ik ga ervoor.", effect: { doubles: +2, stamina: +5 }, outcome_pl: "Twoja głowa jest teraz czysta. Podwójne wchodzą jak w masło.", outcome_en: "Your mind is clear now. Doubles go in like butter.", outcome_de: "Dein Kopf ist jetzt klar. Doubles gehen rein wie Butter.", outcome_nl: "Je geest is nu helder. Doubles gaan erin als boter." },
            { text_pl: "Nie potrzebuję prania mózgu.", text_en: "I don't need brainwashing.", text_de: "Ich brauche keine Gehirnwäsche.", text_nl: "Ik heb geen hersenspoeling nodig.", effect: { prof: -2 }, outcome_pl: "Odrzuciłeś pomocną dłoń.", outcome_en: "You slapped away a helping hand.", outcome_de: "Du hast eine helfende Hand zurückgewiesen.", outcome_nl: "Je sloeg een helpende hand weg." }
        ]
    },
    {
        title_pl: "Zły Bilet", title_en: "Wrong Ticket", title_de: "Falsches Ticket", title_nl: "Verkeerd Ticket",
        desc_pl: "Kupiłeś zły bilet na pociąg i jedziesz w złym kierunku!", desc_en: "You bought the wrong train ticket and are heading the wrong way!", desc_de: "Du hast das falsche Zugticket gekauft und fährst in die falsche Richtung!", desc_nl: "Je hebt het verkeerde treinkaartje gekocht en gaat de verkeerde kant op!",
        choices: [
            { text_pl: "Kupuję nowy bilet z telefonu.", text_en: "I buy a new ticket on my phone.", text_de: "Ich kaufe ein neues Ticket über das Handy.", text_nl: "Ik koop een nieuw kaartje op mijn telefoon.", effect: { budget: -80 }, outcome_pl: "Straciłeś £80 na bilet ratunkowy.", outcome_en: "You lost £80 on a rescue ticket.", outcome_de: "Du hast £80 für ein Rettungsticket verloren.", outcome_nl: "Je hebt £80 verloren aan een reddingskaartje." },
            { text_pl: "Wysiadam i idę piechotą.", text_en: "I get off and walk.", text_de: "Ich steige aus und laufe.", text_nl: "Ik stap uit en ga lopen.", effect: { stamina: -25 }, outcome_pl: "Szedłeś 10 kilometrów z walizkami. Jesteś wykończony.", outcome_en: "You walked 10 kilometers with luggage. You are exhausted.", outcome_de: "Du bist 10 Kilometer mit Gepäck gelaufen. Du bist erschöpft.", outcome_nl: "Je hebt 10 kilometer gelopen met bagage. Je bent uitgeput." }
        ]
    },
    {
        title_pl: "Wywiad dla TV", title_en: "TV Interview", title_de: "TV-Interview", title_nl: "TV-Interview",
        desc_pl: "Lokalna telewizja prosi cię o wywiad przed kamerami.", desc_en: "Local TV asks you for a camera interview.", desc_de: "Das lokale Fernsehen bittet dich um ein Kamera-Interview.", desc_nl: "Lokale tv vraagt je voor een camera-interview.",
        choices: [
            { text_pl: "Robię show i żartuję ze wszystkich.", text_en: "I put on a show and joke about everyone.", text_de: "Ich mache eine Show und mache Witze über jeden.", text_nl: "Ik geef een show en maak grappen over iedereen.", effect: { pop: +15, prof: -5 }, outcome_pl: "Widzowie pękają ze śmiechu, ale rywale na zapleczu nie są zachwyceni.", outcome_en: "Viewers burst with laughter, but rivals backstage are not amused.", outcome_de: "Zuschauer platzen vor Lachen, aber die Rivalen backstage finden es nicht lustig.", outcome_nl: "Kijkers barsten in lachen uit, maar rivalen backstage zijn niet geamuseerd." },
            { text_pl: "Udzielam nudnych, sztampowych odpowiedzi.", text_en: "I give boring, standard answers.", text_de: "Ich gebe langweilige, standardisierte Antworten.", text_nl: "Ik geef saaie, standaardantwoorden.", effect: { prof: +5, pop: -2 }, outcome_pl: "Klasyczne 'zobaczymy na tarczy'. Nikt nie zapamięta tego wywiadu.", outcome_en: "Classic 'we will see at the board'. No one will remember this interview.", outcome_de: "Klassisches 'wir werden sehen am Board'. Niemand wird sich an dieses Interview erinnern.", outcome_nl: "Klassiek 'we zullen het zien op het bord'. Niemand zal zich dit interview herinneren." }
        ]
    },
    {
        title_pl: "Brak Koszulki", title_en: "Missing Shirt", title_de: "Fehlendes Hemd", title_nl: "Ontbrekend Shirt",
        desc_pl: "Hotelowa pralnia zniszczyła twoją koszulkę meczową!", desc_en: "The hotel laundry ruined your match shirt!", desc_de: "Die Hotelwäscherei hat dein Spielhemd ruiniert!", desc_nl: "De hotelwasserij heeft je wedstrijdshirt verpest!",
        choices: [
            { text_pl: "Gram w zwykłym T-shircie.", text_en: "I play in a plain T-shirt.", text_de: "Ich spiele in einem einfachen T-Shirt.", text_nl: "Ik speel in een effen T-shirt.", effect: { prof: -10, pop: +5 }, outcome_pl: "Dostałeś karę za złamanie dress code'u, ale fanom spodobał się twój luz.", outcome_en: "You got fined for breaking the dress code, but fans liked your chill vibe.", outcome_de: "Du hast eine Strafe wegen Verstoßes gegen die Kleiderordnung bekommen, aber die Fans mochten deine lockere Art.", outcome_nl: "Je hebt een boete gekregen voor het overtreden van de dresscode, maar fans vonden je relaxte vibe leuk." },
            { text_pl: "Kupuję nową w sklepie na hali.", text_en: "I buy a new one at the venue shop.", text_de: "Ich kaufe ein neues im Hallenshop.", text_nl: "Ik koop een nieuwe in de halwinkel.", effect: { budget: -60, prof: +2 }, outcome_pl: "Musiałeś wydać £60, ale przynajmniej wyglądasz jak profesjonalista.", outcome_en: "You had to spend £60, but at least you look like a pro.", outcome_de: "Du musstest £60 ausgeben, aber wenigstens siehst du wie ein Profi aus.", outcome_nl: "Je moest £60 uitgeven, maar je ziet er tenminste uit als een pro." }
        ]
    },
    {
        title_pl: "Sesja Jogi", title_en: "Yoga Session", title_de: "Yoga-Sitzung", title_nl: "Yogasessie",
        desc_pl: "Masażysta proponuje ci przed meczem sesję rozciągającą.", desc_en: "The masseur offers you a stretching session before the match.", desc_de: "Der Masseur bietet dir vor dem Spiel eine Dehnungseinheit an.", desc_nl: "De masseur biedt je een reksessie aan voor de wedstrijd.",
        choices: [
            { text_pl: "Jasne, spróbujmy.", text_en: "Sure, let's try it.", text_de: "Klar, probieren wir es.", text_nl: "Zeker, laten we het proberen.", effect: { stamina: +20, scoring: +1 }, outcome_pl: "Jesteś rozluźniony i zrelaksowany. Rzuca się dużo lżej.", outcome_en: "You are loose and relaxed. Throwing feels much easier.", outcome_de: "Du bist locker und entspannt. Das Werfen fällt viel leichter.", outcome_nl: "Je bent los en ontspannen. Gooien voelt veel makkelijker." },
            { text_pl: "Joga jest dla mięczaków.", text_en: "Yoga is for wimps.", text_de: "Yoga ist für Weicheier.", text_nl: "Yoga is voor watjes.", effect: { stamina: -5 }, outcome_pl: "Masz spięte barki i ciężko ci wyrzucić rękę.", outcome_en: "Your shoulders are tense and it's hard to follow through.", outcome_de: "Deine Schultern sind verspannt und es ist schwer den Arm durchzuziehen.", outcome_nl: "Je schouders zijn gespannen en het is moeilijk om goed door te halen." }
        ]
    },
    {
        title_pl: "Fałszywy Alarm", title_en: "False Alarm", title_de: "Fehlalarm", title_nl: "Vals Alarm",
        desc_pl: "O 3 w nocy w hotelu włącza się alarm przeciwpożarowy.", desc_en: "At 3 AM the fire alarm goes off in the hotel.", desc_de: "Um 3 Uhr morgens geht im Hotel der Feueralarm los.", desc_nl: "Om 3 uur 's nachts gaat het brandalarm af in het hotel.",
        choices: [
            { text_pl: "Ewakuuję się na zewnątrz.", text_en: "I evacuate outside.", text_de: "Ich evakuiere nach draußen.", text_nl: "Ik evacueer naar buiten.", effect: { stamina: -15 }, outcome_pl: "Stałeś godzinę na mrozie. Jesteś niewyspany i zmarznięty.", outcome_en: "You stood freezing for an hour. You are tired and cold.", outcome_de: "Du standest eine Stunde in der Kälte. Du bist müde und frierst.", outcome_nl: "Je stond een uur in de kou. Je bent moe en hebt het koud." },
            { text_pl: "Śpię dalej w stoperach.", text_en: "I keep sleeping with earplugs.", text_de: "Ich schlafe mit Ohrstöpseln weiter.", text_nl: "Ik blijf slapen met oordopjes.", effect: { prof: -5 }, outcome_pl: "Zignorowałeś ewakuację. Na szczęście to był tylko błąd systemu.", outcome_en: "You ignored the evacuation. Luckily it was just a system error.", outcome_de: "Du hast die Evakuierung ignoriert. Zum Glück war es nur ein Systemfehler.", outcome_nl: "Je negeerde de evacuatie. Gelukkig was het maar een systeemfout." }
        ]
    },
    {
        title_pl: "Nieznośny Kaszel", title_en: "Unbearable Cough", title_de: "Unerträglicher Husten", title_nl: "Ondraaglijke Hoest",
        desc_pl: "Podczas decydującego rzutu zaczynasz potężnie kaszleć.", desc_en: "During a crucial throw, you start coughing heavily.", desc_de: "Während eines entscheidenden Wurfs beginnst du heftig zu husten.", desc_nl: "Tijdens een cruciale worp begin je hevig te hoesten.",
        choices: [
            { text_pl: "Rzucam mimo to!", text_en: "I throw anyway!", text_de: "Ich werfe trotzdem!", text_nl: "Ik gooi toch!", effect: { doubles: -3 }, outcome_pl: "Kaszel szarpnął twoim ciałem, trafiłeś w jedynkę.", outcome_en: "The cough jerked your body, you hit a single 1.", outcome_de: "Der Husten hat deinen Körper gerüttelt, du hast eine 1 getroffen.", outcome_nl: "De hoest schokte je lichaam, je raakte een 1." },
            { text_pl: "Przerywam i piję wodę.", text_en: "I stop and drink water.", text_de: "Ich höre auf und trinke Wasser.", text_nl: "Ik stop en drink water.", effect: { prof: +2, scoring: +1 }, outcome_pl: "Złapałeś oddech, wyciszyłeś się i trafiłeś. Dobra decyzja.", outcome_en: "You caught your breath, calmed down and hit it. Good decision.", outcome_de: "Du hast Luft geholt, dich beruhigt und getroffen. Gute Entscheidung.", outcome_nl: "Je kwam op adem, kalmeerde en raakte het. Goede beslissing." }
        ]
    },
    {
        title_pl: "Użądlenie Osy", title_en: "Wasp Sting", title_de: "Wespenstich", title_nl: "Wespensteek",
        desc_pl: "Osa użądliła cię prosto w palec rzucającej ręki!", desc_en: "A wasp stung you right on the finger of your throwing hand!", desc_de: "Eine Wespe hat dich direkt in den Finger deiner Wurfhand gestochen!", desc_nl: "Een wesp heeft je recht in de vinger van je werphand gestoken!",
        choices: [
            { text_pl: "Biorę lód i gram na zaciśniętych zębach.", text_en: "I take ice and play through the pain.", text_de: "Ich nehme Eis und spiele trotz Schmerzen.", text_nl: "Ik pak ijs en speel door de pijn heen.", effect: { scoring: -2, doubles: -2 }, outcome_pl: "Palec pulsuje bólem, nie czujesz dobrze lotki.", outcome_en: "The finger throbs with pain, you can't feel the dart well.", outcome_de: "Der Finger pocht vor Schmerz, du spürst den Dart nicht gut.", outcome_nl: "De vinger klopt van de pijn, je voelt de pijl niet goed." },
            { text_pl: "Owijam mocno taśmą.", text_en: "I wrap it tightly with tape.", text_de: "Ich wickle es fest mit Klebeband ein.", text_nl: "Ik wikkel het strak in met tape.", effect: { prof: +2 }, outcome_pl: "Taśma trochę pomogła, ale dyskomfort pozostał.", outcome_en: "The tape helped a bit, but the discomfort remained.", outcome_de: "Das Band hat ein bisschen geholfen, aber das Unbehagen blieb.", outcome_nl: "De tape hielp een beetje, maar het ongemak bleef." }
        ]
    },
    {
        title_pl: "Pechowa Trzynastka", title_en: "Unlucky Thirteen", title_de: "Unglückliche Dreizehn", title_nl: "Ongelukkige Dertien",
        desc_pl: "Organizator przydziela ci pokój hotelowy o numerze 13.", desc_en: "The organizer assigns you hotel room number 13.", desc_de: "Der Organisator weist dir Hotelzimmer Nummer 13 zu.", desc_nl: "De organisator wijst je hotelkamer nummer 13 toe.",
        choices: [
            { text_pl: "Proszę o zmianę, jestem przesądny.", text_en: "I ask for a change, I'm superstitious.", text_de: "Ich bitte um Änderung, ich bin abergläubisch.", text_nl: "Ik vraag om een wissel, ik ben bijgelovig.", effect: { prof: -2 }, outcome_pl: "Obsługa patrzy na ciebie jak na wariata.", outcome_en: "The staff looks at you like a madman.", outcome_de: "Das Personal schaut dich an wie einen Verrückten.", outcome_nl: "Het personeel kijkt je aan als een gek." },
            { text_pl: "Śpię tam, nie wierzę w zabobony.", text_en: "I sleep there, I don't believe in superstitions.", text_de: "Ich schlafe dort, ich glaube nicht an Aberglauben.", text_nl: "Ik slaap daar, ik geloof niet in bijgeloof.", effect: { stamina: +10 }, outcome_pl: "Wyspałeś się znakomicie. Pech to mit.", outcome_en: "You slept wonderfully. Bad luck is a myth.", outcome_de: "Du hast wunderbar geschlafen. Pech ist ein Mythos.", outcome_nl: "Je hebt heerlijk geslapen. Pech is een fabeltje." }
        ]
    },
    {
        title_pl: "Zimny Przeciąg", title_en: "Cold Draft", title_de: "Kalter Zug", title_nl: "Koude Tocht",
        desc_pl: "Z klimatyzacji na hali wieje zimnym powietrzem prosto na tarczę.", desc_en: "Cold air from the AC blows directly at the dartboard.", desc_de: "Kalte Luft aus der Klimaanlage bläst direkt auf das Dartboard.", desc_nl: "Koude lucht van de airco blaast recht op het dartbord.",
        choices: [
            { text_pl: "Zgłaszam to sędziemu.", text_en: "I report it to the referee.", text_de: "Ich melde es dem Schiedsrichter.", text_nl: "Ik meld het aan de scheidsrechter.", effect: { prof: +3 }, outcome_pl: "Sędzia wyłączył klimatyzację. Równe szanse przywrócone.", outcome_en: "The referee turned off the AC. Equal chances restored.", outcome_de: "Der Schiedsrichter hat die Klimaanlage ausgeschaltet. Chancengleichheit wiederhergestellt.", outcome_nl: "De scheidsrechter schakelde de airco uit. Gelijke kansen hersteld." },
            { text_pl: "Kompensuję rzut celując lekko w prawo.", text_en: "I compensate by aiming slightly to the right.", text_de: "Ich kompensiere, indem ich leicht nach rechts ziele.", text_nl: "Ik compenseer door iets naar rechts te richten.", effect: { scoring: +1, doubles: -1 }, outcome_pl: "Trafiasz 20, ale na podwójnych wiatr robi swoje.", outcome_en: "You hit the 20s, but on doubles the wind does its thing.", outcome_de: "Du triffst die 20er, aber bei den Doubles macht der Wind, was er will.", outcome_nl: "Je raakt de 20s, maar op doubles doet de wind zijn ding." }
        ]
    },
    {
        title_pl: "Spotkanie z Fanem", title_en: "Meeting a Fan", title_de: "Treffen mit einem Fan", title_nl: "Ontmoeting met een fan",
        desc_pl: "Spotykasz fana, który prosi o rzut twoją lotką.", desc_en: "You meet a fan who asks to throw your dart.", desc_de: "Du triffst einen Fan, der fragt, ob er deinen Dart werfen darf.", desc_nl: "Je ontmoet een fan die vraagt of hij je pijl mag gooien.",
        choices: [
            { text_pl: "Pozwalam mu.", text_en: "I let him.", text_de: "Ich erlaube es ihm.", text_nl: "Ik laat hem.", effect: { pop: +10 }, outcome_pl: "Fan jest wniebowzięty! Niestety rzucił lotką w ścianę i stępił grot.", outcome_en: "The fan is overjoyed! Unfortunately, he threw the dart into the wall and blunted the point.", outcome_de: "Der Fan ist überglücklich! Leider hat er den Dart in die Wand geworfen und die Spitze abgestumpft.", outcome_nl: "De fan is dolblij! Helaas gooide hij de pijl in de muur en maakte de punt bot." },
            { text_pl: "Przepraszam, ale to mój sprzęt roboczy.", text_en: "Sorry, but this is my work equipment.", text_de: "Tut mir leid, aber das ist meine Arbeitsausrüstung.", text_nl: "Sorry, maar dit is mijn werkuitrusting.", effect: { prof: +2, pop: -2 }, outcome_pl: "Fan odszedł smutny, ale sprzęt jest bezpieczny.", outcome_en: "The fan left sad, but your equipment is safe.", outcome_de: "Der Fan ging traurig, aber deine Ausrüstung ist sicher.", outcome_nl: "De fan vertrok verdrietig, maar je uitrusting is veilig." }
        ]
    },
    {
        title_pl: "Kawa czy Herbata?", title_en: "Coffee or Tea?", title_de: "Kaffee oder Tee?", title_nl: "Koffie of Thee?",
        desc_pl: "Przed finałem czujesz senność. Co pijesz?", desc_en: "You feel sleepy before the final. What do you drink?", desc_de: "Vor dem Finale fühlst du dich schläfrig. Was trinkst du?", desc_nl: "Je voelt je slaperig voor de finale. Wat drink je?",
        choices: [
            { text_pl: "Potrójne espresso!", text_en: "Triple espresso!", text_de: "Dreifacher Espresso!", text_nl: "Drievoudige espresso!", effect: { stamina: +10, doubles: -2 }, outcome_pl: "Energia rozsadza cię od środka, ale dłoń skacze na zamkach.", outcome_en: "Energy bursts from within, but your hand shakes on checkouts.", outcome_de: "Energie platzt von innen heraus, aber deine Hand zittert beim Auschecken.", outcome_nl: "De energie barst van binnenuit, maar je hand trilt bij checkouts." },
            { text_pl: "Ciepłą herbatę z melisą.", text_en: "Warm tea with lemon balm.", text_de: "Warmen Tee mit Melisse.", text_nl: "Warme thee met citroenmelisse.", effect: { stamina: -5, doubles: +2 }, outcome_pl: "Jesteś ospały, ale na podwójnych rzucasz z lodowatym spokojem.", outcome_en: "You are drowsy, but you throw doubles with icy calm.", outcome_de: "Du bist schläfrig, aber wirfst Doubles mit eisiger Ruhe.", outcome_nl: "Je bent slaperig, maar je gooit doubles met ijzige kalmte." }
        ]
    },
    {
        title_pl: "Oślepiający Reflektor", title_en: "Blinding Spotlight", title_de: "Blendender Scheinwerfer", title_nl: "Verblindende Spot",
        desc_pl: "Operator świateł skierował reflektor prosto w twoje oczy.", desc_en: "The lighting operator pointed the spotlight straight into your eyes.", desc_de: "Der Lichttechniker hat den Scheinwerfer direkt in deine Augen gerichtet.", desc_nl: "De lichttechnicus wees de schijnwerper recht in je ogen.",
        choices: [
            { text_pl: "Próbuję rzucać pod kątem.", text_en: "I try to throw from an angle.", text_de: "Ich versuche, aus einem Winkel zu werfen.", text_nl: "Ik probeer vanuit een hoek te gooien.", effect: { scoring: -2 }, outcome_pl: "Światło kompletnie zaburzyło twoje postrzeganie głębi tarczy.", outcome_en: "The light completely distorted your depth perception of the board.", outcome_de: "Das Licht hat deine Tiefenwahrnehmung vom Board völlig verzerrt.", outcome_nl: "Het licht vervormde je diepteperceptie van het bord volledig." },
            { text_pl: "Przerywam mecz i każę to wyłączyć.", text_en: "I stop the match and order to turn it off.", text_de: "Ich unterbreche das Spiel und befehle, es auszuschalten.", text_nl: "Ik stop de wedstrijd en laat het uitzetten.", effect: { prof: +2 }, outcome_pl: "Publika gwiżdże za opóźnianie gry, ale odzyskałeś widoczność.", outcome_en: "The crowd boos for delaying the game, but your vision is restored.", outcome_de: "Das Publikum buht wegen der Spielverzögerung, aber du hast deine Sicht wieder.", outcome_nl: "Het publiek joelt vanwege de spelvertraging, maar je zicht is hersteld." }
        ]
    },
    {
        title_pl: "Podejrzany Suplement", title_en: "Suspicious Supplement", title_de: "Verdächtiges Supplement", title_nl: "Verdacht Supplement",
        desc_pl: "Znajomy daje ci fiolkę z 'cudownym' płynem na koncentrację.", desc_en: "A friend gives you a vial of a 'miracle' liquid for concentration.", desc_de: "Ein Freund gibt dir ein Fläschchen mit einer 'Wunder'-Flüssigkeit für die Konzentration.", desc_nl: "Een vriend geeft je een flesje met een 'wonder' vloeistof voor concentratie.",
        choices: [
            { text_pl: "Wypijam to.", text_en: "I drink it.", text_de: "Ich trinke es.", text_nl: "Ik drink het.", effect: { prof: -20, form: -5 }, outcome_pl: "Dostałeś potężnej biegunki, a federacja wlepiła ci ostrzeżenie!", outcome_en: "You got severe diarrhea and the federation gave you a warning!", outcome_de: "Du hast schweren Durchfall bekommen und der Verband hat dir eine Warnung ausgesprochen!", outcome_nl: "Je kreeg ernstige diarree en de federatie gaf je een waarschuwing!" },
            { text_pl: "Wyrzucam to do kosza.", text_en: "I throw it in the trash.", text_de: "Ich werfe es in den Müll.", text_nl: "Ik gooi het in de prullenbak.", effect: { prof: +5 }, outcome_pl: "Nie ryzykujesz swojej kariery dla jakichś specyfików.", outcome_en: "You don't risk your career for some random stuff.", outcome_de: "Du riskierst deine Karriere nicht für irgendwelches Zeug.", outcome_nl: "Je riskeert je carrière niet voor die rotzooi." }
        ]
    },
    {
        title_pl: "Wyjazd na Ryby", title_en: "Fishing Trip", title_de: "Angelausflug", title_nl: "Vistrip",
        desc_pl: "Masz dzień wolnego. Co robisz?", desc_en: "You have a day off. What do you do?", desc_de: "Du hast einen freien Tag. Was machst du?", desc_nl: "Je hebt een vrije dag. Wat doe je?",
        choices: [
            { text_pl: "Jadę z kumplami na ryby.", text_en: "I go fishing with my buddies.", text_de: "Ich gehe mit meinen Kumpels angeln.", text_nl: "Ik ga vissen met mijn vrienden.", effect: { stamina: +20, prof: +2 }, outcome_pl: "Wspaniały reset. Zapomniałeś o presji i wracasz z naładowanymi bateriami.", outcome_en: "Great reset. You forgot about the pressure and return with recharged batteries.", outcome_de: "Toller Reset. Du hast den Druck vergessen und kehrst mit aufgeladenen Batterien zurück.", outcome_nl: "Geweldige reset. Je vergat de druk en keert terug met opgeladen batterijen." },
            { text_pl: "Siedzę 8 godzin i trenuję rzuty.", text_en: "I sit for 8 hours and practice throws.", text_de: "Ich sitze 8 Stunden und übe Würfe.", text_nl: "Ik zit 8 uur en oefen worpen.", effect: { scoring: +1, stamina: -15 }, outcome_pl: "Ręka boli, ale czujesz, że poczyniłeś malutki progres.", outcome_en: "Your arm hurts, but you feel you made a tiny progress.", outcome_de: "Dein Arm tut weh, aber du fühlst einen kleinen Fortschritt.", outcome_nl: "Je arm doet pijn, maar je voelt dat je een beetje vooruitgang hebt geboekt." }
        ]
    },
    {
        title_pl: "Głośna Impreza", title_en: "Loud Party", title_de: "Laute Party", title_nl: "Luid Feest",
        desc_pl: "Sąsiedzi w hotelu puszczają głośną muzykę o 2 w nocy.", desc_en: "Hotel neighbors play loud music at 2 AM.", desc_de: "Hotel-Nachbarn spielen um 2 Uhr morgens laute Musik.", desc_nl: "Buren in het hotel spelen luide muziek om 2 uur 's nachts.",
        choices: [
            { text_pl: "Walę w ścianę i krzyczę.", text_en: "I bang on the wall and shout.", text_de: "Ich schlage gegen die Wand und schreie.", text_nl: "Ik sla op de muur en schreeuw.", effect: { stamina: -10 }, outcome_pl: "Zdenerwowałeś się i nie mogłeś potem zasnąć.", outcome_en: "You got angry and couldn't fall asleep afterwards.", outcome_de: "Du wurdest wütend und konntest danach nicht einschlafen.", outcome_nl: "Je werd boos en kon daarna niet in slaap vallen." },
            { text_pl: "Dzwonię na recepcję.", text_en: "I call the reception.", text_de: "Ich rufe die Rezeption an.", text_nl: "Ik bel de receptie.", effect: { prof: +2, stamina: +5 }, outcome_pl: "Obsługa szybko załatwiła sprawę. Wracasz do spania.", outcome_en: "Staff quickly resolved it. You go back to sleep.", outcome_de: "Das Personal hat das Problem schnell gelöst. Du gehst wieder schlafen.", outcome_nl: "Het personeel heeft het snel opgelost. Je gaat weer slapen." }
        ]
    },
    {
        title_pl: "Nowe Lotki", title_en: "New Darts", title_de: "Neue Darts", title_nl: "Nieuwe Pijlen",
        desc_pl: "Otrzymujesz nowiutki prototyp lotek z fabryki.", desc_en: "You receive a brand new prototype darts from the factory.", desc_de: "Du erhältst fabrikneue Prototyp-Darts aus der Fabrik.", desc_nl: "Je ontvangt een gloednieuw prototype pijlen uit de fabriek.",
        choices: [
            { text_pl: "Gram nimi od razu w meczu!", text_en: "I play with them in a match immediately!", text_de: "Ich spiele sofort in einem Spiel damit!", text_nl: "Ik speel er onmiddellijk mee in een wedstrijd!", effect: { scoring: -4, doubles: -4 }, outcome_pl: "Kompletna pomyłka! Nie czujesz balansu, przegrywasz lega za legiem.", outcome_en: "Total mistake! You don't feel the balance, you lose leg after leg.", outcome_de: "Totaler Fehler! Du spürst die Balance nicht und verlierst ein Leg nach dem anderen.", outcome_nl: "Grote fout! Je voelt de balans niet, je verliest leg na leg." },
            { text_pl: "Chowam do futerału, przetestuję na treningu.", text_en: "I put them in the case, I'll test them in training.", text_de: "Ich lege sie ins Etui, ich teste sie im Training.", text_nl: "Ik doe ze in de etui, ik test ze tijdens de training.", effect: { prof: +2 }, outcome_pl: "Mądra decyzja. Turniej to nie czas na eksperymenty ze sprzętem.", outcome_en: "Smart choice. A tournament is not the time for equipment experiments.", outcome_de: "Kluge Entscheidung. Ein Turnier ist nicht die Zeit für Ausrüstungsexperimente.", outcome_nl: "Slimme keuze. Een toernooi is niet het moment voor uitrustingsexperimenten." }
        ]
    },
    {
        title_pl: "Podarte Spodnie", title_en: "Torn Pants", title_de: "Zerrissene Hose", title_nl: "Gescheurde Broek",
        desc_pl: "Schylając się po upuszczoną lotkę, słyszysz głośne pęknięcie na spodniach...", desc_en: "Bending to pick up a dropped dart, you hear a loud tear in your pants...", desc_de: "Beim Bücken nach einem heruntergefallenen Dart hörst du ein lautes Reißen in deiner Hose...", desc_nl: "Terwijl je bukt om een gevallen pijl op te pakken, hoor je een luide scheur in je broek...",
        choices: [
            { text_pl: "Gram dalej, udając, że nic się nie stało.", text_en: "I keep playing, pretending nothing happened.", text_de: "Ich spiele weiter und tue so, als wäre nichts passiert.", text_nl: "Ik speel door alsof er niets is gebeurd.", effect: { pop: +15, doubles: -2 }, outcome_pl: "Publika rechocze. Ze wstydu masz trzęsące się ręce na zamkach.", outcome_en: "The audience chuckles. From shame, your hands shake on checkouts.", outcome_de: "Das Publikum kichert. Vor Scham zittern deine Hände bei den Checkouts.", outcome_nl: "Het publiek giechelt. Van schaamte trillen je handen bij de checkouts." },
            { text_pl: "Proszę sędziego o przerwę na zmianę stroju.", text_en: "I ask the ref for a break to change clothes.", text_de: "Ich bitte den Schiedsrichter um eine Pause, um mich umzuziehen.", text_nl: "Ik vraag de scheidsrechter om een pauze om me om te kleden.", effect: { prof: +2 }, outcome_pl: "Komentatorzy trochę się pośmiali, ale wróciłeś z pełną godnością.", outcome_en: "Commentators had a laugh, but you returned with full dignity.", outcome_de: "Die Kommentatoren haben etwas gelacht, aber du kehrst mit voller Würde zurück.", outcome_nl: "De commentatoren lachten erom, maar je keerde met volle waardigheid terug." }
        ]
    },
    {
        title_pl: "Brak Magnezji", title_en: "No Chalk", title_de: "Kein Magnesium", title_nl: "Geen Krijt",
        desc_pl: "Twoje ręce bardzo się pocą, a zapomniałeś wosku do palców.", desc_en: "Your hands are sweating a lot, and you forgot your finger wax.", desc_de: "Deine Hände schwitzen stark und du hast dein Fingerwachs vergessen.", desc_nl: "Je handen zweten veel, en je bent je vingerwax vergeten.",
        choices: [
            { text_pl: "Pocieram dłonie o dywan na scenie.", text_en: "I rub my hands on the stage carpet.", text_de: "Ich reibe meine Hände am Bühnenteppich.", text_nl: "Ik wrijf mijn handen over het podiumtapijt.", effect: { prof: -5, scoring: -1 }, outcome_pl: "Ohyda. Do tego lotki i tak wyślizgują ci się z palców.", outcome_en: "Gross. Plus, darts keep slipping from your fingers anyway.", outcome_de: "Eklig. Und die Darts rutschen dir trotzdem aus den Fingern.", outcome_nl: "Vies. Plus, de pijlen glijden nog steeds uit je vingers." },
            { text_pl: "Pożyczam od przeciwnika.", text_en: "I borrow from the opponent.", text_de: "Ich leihe etwas vom Gegner.", text_nl: "Ik leen van de tegenstander.", effect: { prof: +2, scoring: +1 }, outcome_pl: "Rywal zachował się w porządku. Rzuty odzyskały pewność.", outcome_en: "Rival was a good sport. Your throws regained confidence.", outcome_de: "Der Rivale war fair. Deine Würfe gewannen an Sicherheit.", outcome_nl: "De tegenstander was sportief. Je worpen kregen weer vertrouwen." }
        ]
    },
    {
        title_pl: "Wyrzutnia Koszulek", title_en: "T-shirt Cannon", title_de: "T-Shirt-Kanone", title_nl: "T-shirt Kanon",
        desc_pl: "W przerwie meczu animatorka strzela z armatki koszulkami. Jedna leci w twoją stronę!", desc_en: "During a break, an animator shoots t-shirts from a cannon. One flies your way!", desc_de: "In einer Pause feuert ein Animator T-Shirts aus einer Kanone. Eines fliegt in deine Richtung!", desc_nl: "Tijdens een pauze schiet een animator t-shirts uit een kanon. Eén vliegt jouw kant op!",
        choices: [
            { text_pl: "Łapię ją jedną ręką!", text_en: "I catch it with one hand!", text_de: "Ich fange es mit einer Hand!", text_nl: "Ik vang het met één hand!", effect: { pop: +10, stamina: -2 }, outcome_pl: "Wspaniały refleks! Kibice nagrodzili cię owacją na stojąco.", outcome_en: "Great reflexes! Fans gave you a standing ovation.", outcome_de: "Tolle Reflexe! Die Fans gaben dir stehende Ovationen.", outcome_nl: "Geweldige reflexen! Fans gaven je een staande ovatie." },
            { text_pl: "Uchylam się.", text_en: "I duck.", text_de: "Ich ducke mich.", text_nl: "Ik duik weg.", effect: { prof: +2 }, outcome_pl: "Koszulka trafiła ochroniarza. Ty skupiasz się tylko na tarczy.", outcome_en: "The shirt hit a security guard. You just focus on the board.", outcome_de: "Das T-Shirt traf einen Wachmann. Du konzentrierst dich nur auf das Board.", outcome_nl: "Het shirt raakte een beveiliger. Je focust je alleen op het bord." }
        ]
    },
    {
        title_pl: "Rozlana Woda", title_en: "Spilled Water", title_de: "Verschüttetes Wasser", title_nl: "Gemorst Water",
        desc_pl: "Niechcący wylałeś szklankę wody na swój stolik boczny.", desc_en: "You accidentally spilled a glass of water on your side table.", desc_de: "Du hast versehentlich ein Glas Wasser auf deinen Beistelltisch geschüttet.", desc_nl: "Je hebt per ongeluk een glas water op je bijzettafeltje gemorst.",
        choices: [
            { text_pl: "Szybko wycieram ręcznikiem.", text_en: "I quickly wipe it with a towel.", text_de: "Ich wische es schnell mit einem Handtuch auf.", text_nl: "Ik veeg het snel af met een handdoek.", effect: { stamina: -5 }, outcome_pl: "Musiałeś w pośpiechu sprzątać. Lekko wybiło cię to z rytmu.", outcome_en: "You had to clean in a hurry. It slightly threw you off rhythm.", outcome_de: "Du musstest in Eile putzen. Das hat dich leicht aus dem Rhythmus gebracht.", outcome_nl: "Je moest haastig schoonmaken. Het bracht je een beetje uit je ritme." },
            { text_pl: "Wołam obsługę techniczną.", text_en: "I call the technical staff.", text_de: "Ich rufe das technische Personal.", text_nl: "Ik bel het technisch personeel.", effect: { prof: +2 }, outcome_pl: "Ktoś to posprzątał za ciebie, mogłeś w spokoju przemyśleć taktykę.", outcome_en: "Someone cleaned it up for you, you could rethink your tactics in peace.", outcome_de: "Jemand hat für dich aufgeräumt, du konntest in Ruhe deine Taktik überdenken.", outcome_nl: "Iemand maakte het voor je schoon, je kon rustig je tactiek overdenken." }
        ]
    },
    {
        title_pl: "Ciężki Trening", title_en: "Heavy Training", title_de: "Hartes Training", title_nl: "Zware Training",
        desc_pl: "Znalazłeś w sieci stary, katorżniczy reżim treningowy.", desc_en: "You found an old, grueling training regime online.", desc_de: "Du hast online ein altes, zermürbendes Trainingsprogramm gefunden.", desc_nl: "Je hebt online een oud, slopend trainingsschema gevonden.",
        choices: [
            { text_pl: "Robię 500 rzutów dziennie!", text_en: "I do 500 throws a day!", text_de: "Ich mache 500 Würfe am Tag!", text_nl: "Ik doe 500 worpen per dag!", effect: { scoring: +2, doubles: +1, stamina: -25 }, outcome_pl: "Statystyki delikatnie w górę, ale bark płonie z bólu.", outcome_en: "Stats are slightly up, but your shoulder burns with pain.", outcome_de: "Statistiken leicht nach oben, aber deine Schulter brennt vor Schmerz.", outcome_nl: "Statistieken iets omhoog, maar je schouder brandt van de pijn." },
            { text_pl: "Zbyt duże ryzyko kontuzji.", text_en: "Too much risk of injury.", text_de: "Zu hohes Verletzungsrisiko.", text_nl: "Te veel risico op blessures.", effect: { stamina: +5 }, outcome_pl: "Odpuszczasz katorgę. Energia zachowana.", outcome_en: "You skip the torture. Energy preserved.", outcome_de: "Du lässt die Quälerei bleiben. Energie gespart.", outcome_nl: "Je slaat de marteling over. Energie behouden." }
        ]
    },
    {
        title_pl: "Nowe Buty", title_en: "New Shoes", title_de: "Neue Schuhe", title_nl: "Nieuwe Schoenen",
        desc_pl: "Kupiłeś przed meczem eleganckie, ale strasznie sztywne buty lakierki.", desc_en: "Before the match, you bought elegant but terribly stiff dress shoes.", desc_de: "Vor dem Spiel hast du dir elegante, aber furchtbar steife Lackschuhe gekauft.", desc_nl: "Voor de wedstrijd kocht je elegante, maar vreselijk stijve lakschoenen.",
        choices: [
            { text_pl: "Muszę w nich grać, regulamin tego wymaga.", text_en: "I must play in them, rules require it.", text_de: "Ich muss darin spielen, die Regeln verlangen es.", text_nl: "Ik moet erin spelen, regels vereisen het.", effect: { scoring: -2, doubles: -1 }, outcome_pl: "Twoja postawa na oche jest niestabilna przez ból pięty.", outcome_en: "Your stance at the oche is unstable due to heel pain.", outcome_de: "Deine Haltung am Oche ist aufgrund von Fersenschmerzen instabil.", outcome_nl: "Je houding aan de oche is instabiel door hielpijn." },
            { text_pl: "Zmieniam na miękkie, czarne adidasy.", text_en: "I change into soft, black sneakers.", text_de: "Ich wechsle in weiche, schwarze Turnschuhe.", text_nl: "Ik wissel naar zachte, zwarte sneakers.", effect: { prof: -5, budget: -100 }, outcome_pl: "Otrzymałeś karę za zły ubiór, ale rzuca się cudownie.", outcome_en: "You got a fine for bad attire, but throwing feels wonderful.", outcome_de: "Du hast eine Strafe für schlechte Kleidung bekommen, aber das Werfen fühlt sich wunderbar an.", outcome_nl: "Je kreeg een boete voor slechte kleding, maar gooien voelt geweldig." }
        ]
    },
    {
        title_pl: "Zdjęcie z Rywalem", title_en: "Photo with Rival", title_de: "Foto mit dem Rivalen", title_nl: "Foto met Rivaal",
        desc_pl: "Rywal proponuje dziwne, śmieszne zdjęcie do social mediów przed startem spotkania.", desc_en: "The rival suggests a weird, funny photo for social media before the match starts.", desc_de: "Der Rivale schlägt vor dem Spiel ein seltsames, lustiges Foto für Social Media vor.", desc_nl: "De rivaal stelt een gekke, grappige foto voor sociale media voor voor de wedstrijd begint.",
        choices: [
            { text_pl: "Robimy zeza i pokazujemy języki!", text_en: "We cross our eyes and stick out our tongues!", text_de: "Wir schielen und strecken die Zungen heraus!", text_nl: "We kijken scheel en steken onze tongen uit!", effect: { pop: +15, prof: -2 }, outcome_pl: "Zdjęcie stało się viralem. Młodzież cię uwielbia!", outcome_en: "The photo went viral. The youth love you!", outcome_de: "Das Foto wurde viral. Die Jugend liebt dich!", outcome_nl: "De foto ging viral. De jeugd houdt van je!" },
            { text_pl: "Odmowa, muszę wejść w 'strefę'.", text_en: "Declined, I need to get in the 'zone'.", text_de: "Abgelehnt, ich muss in meine 'Zone' kommen.", text_nl: "Geweigerd, ik moet in de 'zone' komen.", effect: { prof: +5 }, outcome_pl: "Wyglądałeś na gbura, ale pokazałeś 100% profesjonalizmu.", outcome_en: "You looked like a jerk, but showed 100% professionalism.", outcome_de: "Du sahst aus wie ein Idiot, hast aber 100% Professionalität gezeigt.", outcome_nl: "Je zag eruit als een eikel, maar toonde 100% professionaliteit." }
        ]
    },
    {
        title_pl: "Upadek Lotki na Stopę", title_en: "Dart Dropped on Foot", title_de: "Dart auf den Fuß gefallen", title_nl: "Pijl op Voet Gevallen",
        desc_pl: "Podczas rozgrzewki lotka (24 gramy) wbija ci się prosto w czubek buta!", desc_en: "During warm-up, a dart (24 grams) sticks right into the tip of your shoe!", desc_de: "Beim Aufwärmen bleibt ein Dart (24 Gramm) direkt in deiner Schuhspitze stecken!", desc_nl: "Tijdens de warming-up steekt een pijl (24 gram) recht in de punt van je schoen!",
        choices: [
            { text_pl: "Zaciskam zęby i ukrywam ból.", text_en: "I grit my teeth and hide the pain.", text_de: "Ich beiße die Zähne zusammen und verberge den Schmerz.", text_nl: "Ik bijt op mijn tanden en verberg de pijn.", effect: { stamina: -10, doubles: -1 }, outcome_pl: "Czujesz ból przy każdym wychyleniu się do rzutu.", outcome_en: "You feel pain every time you lean in for a throw.", outcome_de: "Du fühlst bei jedem Vorbeugen zum Wurf Schmerzen.", outcome_nl: "Je voelt pijn elke keer dat je leunt voor een worp." },
            { text_pl: "Wzywam medyka.", text_en: "I call a medic.", text_de: "Ich rufe einen Sanitäter.", text_nl: "Ik roep een medicus.", effect: { prof: +2 }, outcome_pl: "Spryskali stopę lodo-sprayem. Boli, ale da się żyć.", outcome_en: "They sprayed your foot with ice spray. It hurts, but you can live with it.", outcome_de: "Sie haben deinen Fuß mit Eisspray eingesprüht. Es tut weh, aber man kann damit leben.", outcome_nl: "Ze spoten je voet in met ijsspray. Het doet pijn, maar je kunt ermee leven." }
        ]
    },
    {
        title_pl: "Wściekły Wpis", title_en: "Angry Post", title_de: "Wütender Beitrag", title_nl: "Boze Post",
        desc_pl: "Po irytującym pudle chcesz napisać przekleństwo w internecie.", desc_en: "After an annoying miss, you want to post a swear word online.", desc_de: "Nach einem ärgerlichen Fehlschuss möchtest du ein Schimpfwort online posten.", desc_nl: "Na een irritante misser, wil je online een scheldwoord posten.",
        choices: [
            { text_pl: "Wysyłam post w świat!", text_en: "I send the post into the world!", text_de: "Ich sende den Beitrag in die Welt hinaus!", text_nl: "Ik stuur de post de wereld in!", effect: { pop: -10, prof: -15 }, outcome_pl: "Kibice i sponsorzy są zbulwersowani. Zrobił się ogromny dym.", outcome_en: "Fans and sponsors are outraged. It caused a huge backlash.", outcome_de: "Fans und Sponsoren sind empört. Es gab einen riesigen Aufschrei.", outcome_nl: "Fans en sponsors zijn verontwaardigd. Het veroorzaakte veel ophef." },
            { text_pl: "Biorę głęboki oddech i kasuję roboczą wiadomość.", text_en: "I take a deep breath and delete the draft.", text_de: "Ich atme tief durch und lösche den Entwurf.", text_nl: "Ik haal diep adem en verwijder de concepttekst.", effect: { prof: +5 }, outcome_pl: "Powstrzymałeś się przed błędem, którego byś długo żałował.", outcome_en: "You stopped yourself from a mistake you'd regret for a long time.", outcome_de: "Du hast dich vor einem Fehler bewahrt, den du lange bereut hättest.", outcome_nl: "Je behoedde jezelf voor een fout waar je lang spijt van zou hebben." }
        ]
    },
    {
        title_pl: "Oferta VIP", title_en: "VIP Offer", title_de: "VIP-Angebot", title_nl: "VIP-aanbod",
        desc_pl: "Dostajesz wejściówkę VIP na wieczorny mecz piłki nożnej.", desc_en: "You get a VIP pass for an evening football match.", desc_de: "Du bekommst einen VIP-Pass für ein Fußball-Abendspiel.", desc_nl: "Je krijgt een VIP-pas voor een avondvoetbalwedstrijd.",
        choices: [
            { text_pl: "Idę oglądać mecz na żywo!", text_en: "I go to watch the match live!", text_de: "Ich gehe, um das Spiel live zu sehen!", text_nl: "Ik ga de wedstrijd live kijken!", effect: { pop: +10, stamina: -15 }, outcome_pl: "Wspaniały wieczór, mnóstwo darmowych drinków. Jesteś jednak potwornie zmęczony.", outcome_en: "Great evening, lots of free drinks. However, you are terribly tired.", outcome_de: "Ein toller Abend, viele Freigetränke. Allerdings bist du furchtbar müde.", outcome_nl: "Geweldige avond, veel gratis drankjes. Je bent echter vreselijk moe." },
            { text_pl: "Oddaję bilet koledze.", text_en: "I give the ticket to a friend.", text_de: "Ich gebe das Ticket einem Freund.", text_nl: "Ik geef het kaartje aan een vriend.", effect: { prof: +2 }, outcome_pl: "Zostałeś w pokoju hotelowym, regenerując organizm.", outcome_en: "You stayed in the hotel room, recovering your body.", outcome_de: "Du bist in deinem Hotelzimmer geblieben und hast deinen Körper regeneriert.", outcome_nl: "Je bleef in je hotelkamer om te herstellen." }
        ]
    },
    {
        title_pl: "Zakład z Menedżerem", title_en: "Bet with Manager", title_de: "Wette mit Manager", title_nl: "Weddenschap met Manager",
        desc_pl: "Menedżer obiecuje zapłacić £200, jeśli zmienisz dziś muzykę na wejście na disco-polo.", desc_en: "Your manager promises to pay £200 if you change your walk-on music to disco-polo today.", desc_de: "Dein Manager verspricht dir £200, wenn du deine Walk-on-Musik heute auf Disco-Polo änderst.", desc_nl: "Je manager belooft £200 te betalen als je vandaag je walk-on muziek verandert naar disco-polo.",
        choices: [
            { text_pl: "Pieniądz nie śmierdzi!", text_en: "Money doesn't stink!", text_de: "Geld stinkt nicht!", text_nl: "Geld stinkt niet!", effect: { budget: 200, pop: -5, prof: -5 }, outcome_pl: "Wyszedłeś do piosenki 'Jesteś szalona'. Komentator zaniemówił, fani w szoku.", outcome_en: "You walked out to a cheesy song. The commentator was speechless, fans in shock.", outcome_de: "Du bist zu einem kitschigen Lied eingelaufen. Der Kommentator war sprachlos, die Fans unter Schock.", outcome_nl: "Je liep op een kazig liedje naar buiten. De commentator was sprakeloos, fans in shock." },
            { text_pl: "Mam swoją godność.", text_en: "I have my dignity.", text_de: "Ich habe meine Würde.", text_nl: "Ik heb mijn waardigheid.", effect: { prof: +5 }, outcome_pl: "Odrzuciłeś te nędzne grosze na rzecz budowania poważnej marki.", outcome_en: "You rejected those pennies in favor of building a serious brand.", outcome_de: "Du hast diese paar Groschen abgelehnt, um eine ernsthafte Marke aufzubauen.", outcome_nl: "Je weigerde die centen ten gunste van het opbouwen van een serieus merk." }
        ]
    },
    {
        title_pl: "Zły Wzrok", title_en: "Bad Eyesight", title_de: "Schlechtes Sehvermögen", title_nl: "Slecht Zicht",
        desc_pl: "Zaczynasz lekko mrużyć oczy przy celowaniu w D20. Zmęczenie czy wada wzroku?", desc_en: "You start squinting slightly when aiming at D20. Fatigue or a vision defect?", desc_de: "Du fängst an leicht zu blinzeln, wenn du auf D20 zielst. Müdigkeit oder Sehfehler?", desc_nl: "Je begint lichtjes te knijpen bij het richten op D20. Vermoeidheid of een oogafwijking?",
        choices: [
            { text_pl: "Idę do okulisty po okulary.", text_en: "I go to the eye doctor for glasses.", text_de: "Ich gehe zum Augenarzt für eine Brille.", text_nl: "Ik ga naar de oogarts voor een bril.", effect: { doubles: +2, budget: -150 }, outcome_pl: "Nowe okulary trochę kosztowały, ale teraz widzisz druty jak pod mikroskopem.", outcome_en: "New glasses cost a bit, but now you see the wires like under a microscope.", outcome_de: "Neue Brillen kosten etwas, aber jetzt siehst du die Drähte wie unter einem Mikroskop.", outcome_nl: "Nieuwe brillen kosten wat, maar nu zie je de draden als onder een microscoop." },
            { text_pl: "Samo przejdzie.", text_en: "It will pass.", text_de: "Es wird vorbeigehen.", text_nl: "Het gaat wel over.", effect: { doubles: -2 }, outcome_pl: "Często lądujesz milimetry obok cienkich drutów. Szkoda.", outcome_en: "You often land millimeters next to the thin wires. Pity.", outcome_de: "Du landest oft Millimeter neben den dünnen Drähten. Schade.", outcome_nl: "Je landt vaak millimeters naast de dunne draden. Jammer." }
        ]
    },
    {
        title_pl: "Darmowe Lody", title_en: "Free Ice Cream", title_de: "Kostenloses Eis", title_nl: "Gratis IJs",
        desc_pl: "Przed halą rozdają darmowe lody włoskie na upał.", desc_en: "They are handing out free ice cream outside the venue for the heat.", desc_de: "Vor der Halle wird bei der Hitze kostenlos Eis verteilt.", desc_nl: "Ze delen gratis ijsjes uit buiten de locatie voor de hitte.",
        choices: [
            { text_pl: "Biorę ogromną porcję czekoladową!", text_en: "I take a huge chocolate portion!", text_de: "Ich nehme eine riesige Schokoladenportion!", text_nl: "Ik neem een enorme chocoladeportie!", effect: { stamina: +5, prof: -1 }, outcome_pl: "Chłodne orzeźwienie! Ale masz teraz tłuste ręce...", outcome_en: "Cool refreshment! But now your hands are greasy...", outcome_de: "Kühle Erfrischung! Aber jetzt hast du fettige Hände...", outcome_nl: "Koele verfrissing! Maar nu zijn je handen vettig..." },
            { text_pl: "Dziękuję, cukier obniża refleks.", text_en: "Thank you, sugar lowers reflexes.", text_de: "Nein danke, Zucker senkt die Reflexe.", text_nl: "Dank je, suiker vermindert reflexen.", effect: { prof: +2 }, outcome_pl: "Pełna powaga. Odmawiasz darmowego loda w imię sportu.", outcome_en: "Full seriousness. You refuse free ice cream in the name of sport.", outcome_de: "Volle Ernsthaftigkeit. Du lehnst ein kostenloses Eis im Namen des Sports ab.", outcome_nl: "Volledige ernst. Je weigert gratis ijs in naam van de sport." }
        ]
    },
    {
        title_pl: "Szczęśliwy Pieniążek", title_en: "Lucky Coin", title_de: "Glücksmünze", title_nl: "Geluksmuntje",
        desc_pl: "Znalazłeś na ulicy starego pensa.", desc_en: "You found an old penny on the street.", desc_de: "Du hast einen alten Penny auf der Straße gefunden.", desc_nl: "Je hebt een oude stuiver op straat gevonden.",
        choices: [
            { text_pl: "Chowam go do kieszeni spodni na szczęście.", text_en: "I put it in my pocket for luck.", text_de: "Ich stecke ihn als Glücksbringer in die Tasche.", text_nl: "Ik stop het in mijn zak voor geluk.", effect: { pop: +2 }, outcome_pl: "Czujesz dziwny przypływ pewności siebie. Szczęście ci sprzyja!", outcome_en: "You feel a strange surge of confidence. Luck is on your side!", outcome_de: "Du spürst einen seltsamen Anstieg von Selbstvertrauen. Das Glück ist auf deiner Seite!", outcome_nl: "Je voelt een vreemde toename van zelfvertrouwen. Geluk staat aan jouw kant!" },
            { text_pl: "Rzucam go do puszki charytatywnej.", text_en: "I throw it in a charity box.", text_de: "Ich werfe ihn in eine Spendendose.", text_nl: "Ik gooi het in een collectebus.", effect: { prof: +5 }, outcome_pl: "Karmisz dobrą karmę. Wspaniały gest dobrej woli.", outcome_en: "Feeding good karma. A great gesture of goodwill.", outcome_de: "Gutes Karma aufbauen. Eine tolle Geste des guten Willens.", outcome_nl: "Goede karma voeden. Een geweldig gebaar van goede wil." }
        ]
    },
    {
        title_pl: "Pechowy Krawiec", title_en: "Unlucky Tailor", title_de: "Pechvogel-Schneider", title_nl: "Ongelukkige Kleermaker",
        desc_pl: "Krawiec zwęził twoją koszulkę w barkach za bardzo.", desc_en: "The tailor made your shirt too tight across the shoulders.", desc_de: "Der Schneider hat dein Hemd an den Schultern zu eng gemacht.", desc_nl: "De kleermaker heeft je shirt te strak over de schouders gemaakt.",
        choices: [
            { text_pl: "Próbuję w tym rzucać.", text_en: "I'll try to throw in it.", text_de: "Ich versuche, darin zu werfen.", text_nl: "Ik probeer erin te gooien.", effect: { scoring: -3, doubles: -2 }, outcome_pl: "Materiał krępuje ruch ramienia. Rzuty lądują regularnie w piątkach.", outcome_en: "The fabric restricts arm movement. Throws regularly land in the fives.", outcome_de: "Der Stoff schränkt die Armbewegung ein. Würfe landen regelmäßig in den Fünfen.", outcome_nl: "De stof beperkt de armbeweging. Worpen landen regelmatig in de vijven." },
            { text_pl: "Rozrywam lekko szew pod pachą.", text_en: "I slightly rip the seam under the armpit.", text_de: "Ich reiße die Naht unter der Achsel leicht auf.", text_nl: "Ik scheur de naad onder de oksel een beetje los.", effect: { pop: +5, prof: -5 }, outcome_pl: "Wyglądasz trochę jak menel, ale ręka ma pełen zasięg ruchu.", outcome_en: "You look a bit like a tramp, but your arm has full range of motion.", outcome_de: "Du siehst ein bisschen aus wie ein Penner, aber dein Arm hat volle Bewegungsfreiheit.", outcome_nl: "Je ziet er een beetje uit als een zwerver, maar je arm heeft volledige bewegingsvrijheid." }
        ]
    },
    {
        title_pl: "Kradzież Pseudonimu", title_en: "Nickname Theft", title_de: "Spitznamen-Diebstahl", title_nl: "Bijnaam Diefstal",
        desc_pl: "Pewien młody amator zaczyna używać twojego pseudonimu na lokalnych turniejach.", desc_en: "A young amateur starts using your nickname in local tournaments.", desc_de: "Ein junger Amateur fängt an, deinen Spitznamen bei lokalen Turnieren zu verwenden.", desc_nl: "Een jonge amateur begint je bijnaam te gebruiken op lokale toernooien.",
        choices: [
            { text_pl: "Piszę do niego groźnego maila z groźbą pozwu.", text_en: "I write him a threatening email with a lawsuit threat.", text_de: "Ich schreibe ihm eine drohende E-Mail mit der Androhung einer Klage.", text_nl: "Ik schrijf hem een dreigende e-mail met een dreigement voor een rechtszaak.", effect: { prof: -10, pop: -5 }, outcome_pl: "Wyszedłeś na tyrana. Tabloidy podchwyciły temat, niszcząc twój wizerunek.", outcome_en: "You came off as a tyrant. Tabloids picked up the story, ruining your image.", outcome_de: "Du wirktest wie ein Tyrann. Tabloids griffen die Geschichte auf und ruinierten dein Image.", outcome_nl: "Je kwam over als een tiran. Tabloids pikten het verhaal op en verpestten je imago." },
            { text_pl: "Wysyłam mu w prezencie komplet moich lotek.", text_en: "I send him a set of my darts as a gift.", text_de: "Ich schicke ihm als Geschenk ein Set meiner Darts.", text_nl: "Ik stuur hem een set van mijn pijlen als cadeau.", effect: { pop: +15, budget: -50 }, outcome_pl: "Wspaniały gest! Fani są zachwyceni twoją postawą, a chłopak zmienił ksywę.", outcome_en: "A great gesture! Fans are delighted with your attitude, and the boy changed his nickname.", outcome_de: "Eine tolle Geste! Die Fans sind begeistert von deiner Einstellung, und der Junge hat seinen Spitznamen geändert.", outcome_nl: "Een geweldig gebaar! Fans zijn enthousiast over je houding, en de jongen veranderde zijn bijnaam." }
        ]
    },
    {
        title_pl: "Tajemniczy Zapach", title_en: "Mysterious Smell", title_de: "Geheimnisvoller Geruch", title_nl: "Mysterieuze Geur",
        desc_pl: "Przeciwnik na scenie puszcza 'cichacza', a atmosfera wokół the oche gęstnieje.", desc_en: "The opponent silently passes gas on stage, and the atmosphere around the oche thickens.", desc_de: "Der Gegner lässt auf der Bühne lautlos einen fahren, und die Luft um das Oche wird dicker.", desc_nl: "De tegenstander laat stilletjes een wind op het podium, en de atmosfeer rond de oche verdikt.",
        choices: [
            { text_pl: "Krzywię się i macham ręką do kamer.", text_en: "I grimace and wave my hand to the cameras.", text_de: "Ich schneide Grimassen und winke in die Kameras.", text_nl: "Ik trek een grimas en zwaai naar de camera's.", effect: { pop: +10, doubles: -1 }, outcome_pl: "Fani pękają ze śmiechu, ale smród dekoncentruje cię przy rzucie na podwójną.", outcome_en: "The fans burst with laughter, but the stench distracts you on the double.", outcome_de: "Die Fans brechen in Gelächter aus, aber der Gestank lenkt dich beim Double ab.", outcome_nl: "De fans barsten in lachen uit, maar de stank leidt je af op de double." },
            { text_pl: "Ignoruję to i rzucam na wdechu.", text_en: "I ignore it and throw while holding my breath.", text_de: "Ich ignoriere es und werfe, während ich die Luft anhalte.", text_nl: "Ik negeer het en gooi terwijl ik mijn adem inhou.", effect: { prof: +5, scoring: +1 }, outcome_pl: "Brak tlenu ci służy. Trafiasz grubą 180-tkę nic nie czując.", outcome_en: "Lack of oxygen serves you well. You hit a fat 180 smelling nothing.", outcome_de: "Sauerstoffmangel tut dir gut. Du triffst eine fette 180 und riechst nichts.", outcome_nl: "Zuurstoftekort doet je goed. Je gooit een dikke 180 zonder iets te ruiken." }
        ]
    },
    {
        title_pl: "Opóźniacz", title_en: "The Delayer", title_de: "Der Verzögerer", title_nl: "De Vertrager",
        desc_pl: "Grasz z zawodnikiem, który wykonuje swój rzut w nieskończoność. Ty w tym czasie stygniesz.", desc_en: "You are playing an opponent who takes forever to throw. You get cold in the meantime.", desc_de: "Du spielst gegen einen Gegner, der ewig für seinen Wurf braucht. In der Zwischenzeit kühlst du aus.", desc_nl: "Je speelt tegen een tegenstander die er eeuwen over doet om te gooien. Je wordt intussen koud.",
        choices: [
            { text_pl: "Rozgrzewam rękę machając nią w tle.", text_en: "I warm up my arm by swinging it in the background.", text_de: "Ich wärme meinen Arm auf, indem ich ihn im Hintergrund schwinge.", text_nl: "Ik warm mijn arm op door hem op de achtergrond te zwaaien.", effect: { stamina: -5, scoring: +1 }, outcome_pl: "Ramię jest rozgrzane, ale straciłeś na to trochę zbędnej energii.", outcome_en: "Your arm is warmed up, but you wasted some unnecessary energy.", outcome_de: "Dein Arm ist aufgewärmt, aber du hast unnötig Energie verschwendet.", outcome_nl: "Je arm is opgewarmd, maar je hebt wat onnodige energie verspild." },
            { text_pl: "Siadam na krzesełku i wzdycham demonstracyjnie.", text_en: "I sit on the chair and sigh demonstratively.", text_de: "Ich setze mich auf den Stuhl und seufze demonstrativ.", text_nl: "Ik ga op de stoel zitten en zucht demonstratief.", effect: { prof: -5, form: -1 }, outcome_pl: "Sędzia upomniał cię za brak szacunku. Wpadłeś we własną pułapkę mentalną.", outcome_en: "The referee warned you for disrespect. You fell into your own mental trap.", outcome_de: "Der Schiedsrichter hat dich wegen Respektlosigkeit verwarnt. Du bist in deine eigene mentale Falle getappt.", outcome_nl: "De scheidsrechter heeft je gewaarschuwd voor respectloosheid. Je trapte in je eigen mentale val." }
        ]
    },
    {
        title_pl: "Wpadka DJ-a", title_en: "DJ Blunder", title_de: "DJ-Patzer", title_nl: "DJ Blunder",
        desc_pl: "Wchodzisz na scenę, a zamiast twojego agresywnego rocka z głośników leci motyw z kreskówki.", desc_en: "You walk on stage, and instead of your aggressive rock, a cartoon theme plays from the speakers.", desc_de: "Du betrittst die Bühne, und anstelle deines aggressiven Rocks läuft eine Cartoon-Melodie aus den Lautsprechern.", desc_nl: "Je loopt het podium op, en in plaats van je agressieve rock klinkt er een tekenfilmmelodie uit de speakers.",
        choices: [
            { text_pl: "Wkurzam się i wracam na zaplecze.", text_en: "I get angry and go back backstage.", text_de: "Ich werde wütend und gehe zurück hinter die Bühne.", text_nl: "Ik word boos en ga terug backstage.", effect: { prof: -10, form: -2 }, outcome_pl: "Zrobiłeś scenę. Organizacja nakłada na ciebie karę za opóźnianie transmisji.", outcome_en: "You made a scene. The organization fines you for delaying the broadcast.", outcome_de: "Du hast eine Szene gemacht. Die Organisation belegt dich mit einer Geldstrafe für die Verzögerung der Übertragung.", outcome_nl: "Je hebt een scène gemaakt. De organisatie geeft je een boete voor het vertragen van de uitzending." },
            { text_pl: "Tańczę do tego z pełnym zaangażowaniem!", text_en: "I dance to it with full commitment!", text_de: "Ich tanze mit vollem Einsatz dazu!", text_nl: "Ik dans erop met volle overgave!", effect: { pop: +20, form: +1 }, outcome_pl: "Hala ryczy ze śmiechu! Zostałeś hitem internetu, a dobry humor niesie cię w meczu.", outcome_en: "The hall roars with laughter! You became an internet hit, and the good mood carries you in the match.", outcome_de: "Die Halle brüllt vor Lachen! Du wurdest ein Internet-Hit, und die gute Laune trägt dich im Spiel.", outcome_nl: "De hal brult van het lachen! Je werd een internet hit, en de goede stemming draagt je in de wedstrijd." }
        ]
    },
    {
        title_pl: "Zgubiony Bagaż", title_en: "Lost Luggage", title_de: "Verlorenes Gepäck", title_nl: "Verloren Bagage",
        desc_pl: "Linie lotnicze zgubiły twoją walizkę. Turniej za 3 godziny!", desc_en: "The airline lost your suitcase. The tournament is in 3 hours!", desc_de: "Die Fluggesellschaft hat deinen Koffer verloren. Das Turnier beginnt in 3 Stunden!", desc_nl: "De luchtvaartmaatschappij is je koffer kwijt. Het toernooi begint over 3 uur!",
        choices: [
            { text_pl: "Kupuję tanie rzutki w lokalnym sklepie sportowym.", text_en: "I buy cheap darts at a local sports store.", text_de: "Ich kaufe billige Darts in einem lokalen Sportgeschäft.", text_nl: "Ik koop goedkope pijlen bij een lokale sportwinkel.", effect: { budget: -20, scoring: -4, doubles: -4 }, outcome_pl: "Mosiężne beczułki z kiosku latają jak kamienie. To będzie ciężki wieczór.", outcome_en: "Brass barrels from a kiosk fly like stones. It's going to be a tough night.", outcome_de: "Messingfässer aus einem Kiosk fliegen wie Steine. Das wird ein harter Abend.", outcome_nl: "Koperen barrels uit een kiosk vliegen als stenen. Het wordt een zware avond." },
            { text_pl: "Dzwonię do menedżera po zapas (Express kurier).", text_en: "I call my manager for a spare set (Express courier).", text_de: "Ich rufe meinen Manager für ein Ersatzset an (Expresskurier).", text_nl: "Ik bel mijn manager voor een reserveset (Express koerier).", effect: { budget: -200, scoring: +1 }, outcome_pl: "Słono zapłaciłeś za ekspresową dostawę, ale grasz swoim sprzętem. Odetchnąłeś z ulgą.", outcome_en: "You paid dearly for express delivery, but you play with your gear. You sighed with relief.", outcome_de: "Du hast teuer für die Expresslieferung bezahlt, aber du spielst mit deiner Ausrüstung. Du atmetest erleichtert auf.", outcome_nl: "Je hebt duur betaald voor express levering, maar je speelt met je eigen uitrusting. Je slaakte een zucht van verlichting." }
        ]
    },
    {
        title_pl: "Muchozol", title_en: "Fly Spray", title_de: "Fliegenspray", title_nl: "Vliegenspray",
        desc_pl: "Natrętna mucha krąży wokół twojej twarzy, gdy mierzysz do D20.", desc_en: "A pesky fly circles around your face as you aim at D20.", desc_de: "Eine lästige Fliege kreist um dein Gesicht, als du auf die D20 zielst.", desc_nl: "Een lastige vlieg cirkelt rond je gezicht terwijl je richt op D20.",
        choices: [
            { text_pl: "Próbuję ją złapać w rękę w locie!", text_en: "I try to catch it in mid-air with my hand!", text_de: "Ich versuche, sie im Flug mit der Hand zu fangen!", text_nl: "Ik probeer hem in de lucht te vangen met mijn hand!", effect: { doubles: -2, pop: +5 }, outcome_pl: "Wyglądasz komicznie. Oczywiście nie złapałeś jej, a rytm rzutu przepadł.", outcome_en: "You look comical. Of course, you didn't catch it, and your throwing rhythm is gone.", outcome_de: "Du siehst komisch aus. Natürlich hast du sie nicht gefangen, und dein Wurfrhythmus ist weg.", outcome_nl: "Je ziet er komisch uit. Natuurlijk heb je hem niet gevangen, en je werpritme is weg." },
            { text_pl: "Cofam się z linii i czekam aż odleci.", text_en: "I step back from the line and wait for it to fly away.", text_de: "Ich trete von der Linie zurück und warte, bis sie wegfliegt.", text_nl: "Ik stap terug van de lijn en wacht tot hij wegvliegt.", effect: { prof: +2, scoring: +1 }, outcome_pl: "Spokojnie przeczekałeś intruza. Profesjonalizm procentuje.", outcome_en: "You calmly waited out the intruder. Professionalism pays off.", outcome_de: "Du hast den Eindringling ruhig abgewartet. Professionalität zahlt sich aus.", outcome_nl: "Je wachtte de indringer rustig af. Professionaliteit loont." }
        ]
    },
    {
        title_pl: "Śliska Oche", title_en: "Slippery Oche", title_de: "Rutschiges Oche", title_nl: "Glibberige Oche",
        desc_pl: "Ktoś rozlał napój na podwyższeniu, a podłoga jest niebezpiecznie śliska.", desc_en: "Someone spilled a drink on the raised area, and the floor is dangerously slippery.", desc_de: "Jemand hat ein Getränk auf dem Podest verschüttet, und der Boden ist gefährlich rutschig.", desc_nl: "Iemand heeft een drankje gemorst op de verhoging, en de vloer is gevaarlijk glad.",
        choices: [
            { text_pl: "Rzucam uważając na ułożenie stopy.", text_en: "I throw, being careful with my foot placement.", text_de: "Ich werfe und achte auf meine Fußstellung.", text_nl: "Ik gooi en pas op waar ik mijn voet zet.", effect: { scoring: -2 }, outcome_pl: "Przez asekuracyjną postawę twoje rzuty tracą dynamikę.", outcome_en: "Because of your cautious stance, your throws lose momentum.", outcome_de: "Wegen deiner vorsichtigen Haltung verlieren deine Würfe an Dynamik.", outcome_nl: "Vanwege je voorzichtige houding verliezen je worpen dynamiek." },
            { text_pl: "Żądam od obsługi przetarcia podłogi ręcznikiem.", text_en: "I demand the staff to wipe the floor with a towel.", text_de: "Ich verlange vom Personal, den Boden mit einem Handtuch zu wischen.", text_nl: "Ik eis dat het personeel de vloer dweilt met een handdoek.", effect: { prof: +3 }, outcome_pl: "Krótka przerwa techniczna uratowała cię przed potencjalną kontuzją.", outcome_en: "A short technical break saved you from a potential injury.", outcome_de: "Eine kurze technische Pause hat dich vor einer möglichen Verletzung bewahrt.", outcome_nl: "Een korte technische pauze redde je van een mogelijke blessure." }
        ]
    },
    {
        title_pl: "Zaproszenie na Podcast", title_en: "Podcast Invite", title_de: "Podcast-Einladung", title_nl: "Podcast Uitnodiging",
        desc_pl: "Zostałeś zaproszony do popularnego podcastu o rzutkach w dniu wolnym.", desc_en: "You have been invited to a popular darts podcast on your day off.", desc_de: "Du wurdest an deinem freien Tag zu einem beliebten Darts-Podcast eingeladen.", desc_nl: "Je bent op je vrije dag uitgenodigd voor een populaire dartspodcast.",
        choices: [
            { text_pl: "Chętnie, pogadajmy o kulisach touru!", text_en: "Gladly, let's talk about behind the scenes of the tour!", text_de: "Gerne, lass uns über die Kulissen der Tour sprechen!", text_nl: "Graag, laten we praten over achter de schermen van de tour!", effect: { pop: +10, stamina: -10 }, outcome_pl: "Rozmowa trwała 3 godziny. Jesteś trochę niewyspany, ale fani cię uwielbiają.", outcome_en: "The conversation lasted 3 hours. You're a bit sleep-deprived, but the fans love you.", outcome_de: "Das Gespräch dauerte 3 Stunden. Du hast ein wenig Schlafmangel, aber die Fans lieben dich.", outcome_nl: "Het gesprek duurde 3 uur. Je bent een beetje slaaptekort, maar de fans houden van je." },
            { text_pl: "Odmawiam, muszę trenować.", text_en: "I refuse, I have to train.", text_de: "Ich lehne ab, ich muss trainieren.", text_nl: "Ik weiger, ik moet trainen.", effect: { scoring: +1, pop: -2 }, outcome_pl: "Kibice są lekko zawiedzeni twoim brakiem otwartości, ale tarcza to docenia.", outcome_en: "Fans are slightly disappointed with your lack of openness, but the board appreciates it.", outcome_de: "Fans sind leicht enttäuscht von deiner mangelnden Offenheit, aber das Board schätzt es.", outcome_nl: "Fans zijn licht teleurgesteld over je gebrek aan openheid, maar het bord waardeert het." }
        ]
    },
    {
        title_pl: "Brak Okularów", title_en: "Missing Glasses", title_de: "Fehlende Brille", title_nl: "Ontbrekende Bril",
        desc_pl: "Zostawiłeś swoje okulary w pokoju hotelowym.", desc_en: "You left your glasses in your hotel room.", desc_de: "Du hast deine Brille in deinem Hotelzimmer gelassen.", desc_nl: "Je hebt je bril in je hotelkamer achtergelaten.",
        choices: [
            { text_pl: "Przymrużam oczy i gram.", text_en: "I squint and play.", text_de: "Ich blinzle und spiele.", text_nl: "Ik knijp mijn ogen dicht en speel.", effect: { doubles: -3, scoring: -2 }, outcome_pl: "Trzy dwudziestki zlewają się w jedną. Koszmar.", outcome_en: "The three twenties merge into one. A nightmare.", outcome_de: "Die drei Zwanziger verschmelzen zu einem. Ein Albtraum.", outcome_nl: "De drie twintigen smelten samen tot één. Een nachtmerrie." },
            { text_pl: "Wysyłam menedżera taksówką.", text_en: "I send the manager by taxi.", text_de: "Ich schicke den Manager mit dem Taxi.", text_nl: "Ik stuur de manager met een taxi.", effect: { budget: -50, form: +1 }, outcome_pl: "Opóźniło to twoją rozgrzewkę, ale odzyskałeś ostrość widzenia.", outcome_en: "It delayed your warm-up, but you regained your sharp vision.", outcome_de: "Es verzögerte dein Aufwärmen, aber du hast deine scharfe Sicht wieder.", outcome_nl: "Het vertraagde je warming-up, maar je kreeg je scherpe zicht terug." }
        ]
    },
    {
        title_pl: "Tłuste Śniadanie", title_en: "Greasy Breakfast", title_de: "Fettiges Frühstück", title_nl: "Vettig Ontbijt",
        desc_pl: "Na śniadanie wciągasz fasolę, bekon i kiełbaski tuż przed poranną sesją w turnieju z cyklu Pro.", desc_en: "For breakfast, you devour beans, bacon, and sausages right before the morning session in a Pro tour event.", desc_de: "Zum Frühstück verdrückst du Bohnen, Speck und Würstchen kurz vor der Vormittagssession in einem Pro-Tour-Event.", desc_nl: "Als ontbijt verslind je bonen, spek en worstjes vlak voor de ochtendsessie in een Pro tour-evenement.",
        choices: [
            { text_pl: "Popijam to mocną kawą.", text_en: "I wash it down with strong coffee.", text_de: "Ich spüle es mit starkem Kaffee hinunter.", text_nl: "Ik spoel het weg met sterke koffie.", effect: { stamina: +15, scoring: -1 }, outcome_pl: "Masz paliwo na cały dzień, ale pełny żołądek trochę ogranicza twój zamach.", outcome_en: "You have fuel for the whole day, but a full stomach slightly restricts your swing.", outcome_de: "Du hast Treibstoff für den ganzen Tag, aber ein voller Magen schränkt deinen Schwung etwas ein.", outcome_nl: "Je hebt brandstof voor de hele dag, maar een volle maag beperkt je zwaai enigszins." },
            { text_pl: "Zostawiam połowę porcji na talerzu.", text_en: "I leave half the portion on the plate.", text_de: "Ich lasse die Hälfte der Portion auf dem Teller.", text_nl: "Ik laat de helft van de portie op het bord liggen.", effect: { prof: +2 }, outcome_pl: "Głód zaspokojony, a sylwetka przy oche pozostaje zwarta.", outcome_en: "Hunger satisfied, and your stance at the oche remains compact.", outcome_de: "Hunger gestillt, und deine Haltung am Oche bleibt kompakt.", outcome_nl: "Honger gestild, en je houding aan de oche blijft compact." }
        ]
    },
    {
        title_pl: "Kolega w Potrzebie", title_en: "Friend in Need", title_de: "Freund in Not", title_nl: "Vriend in Nood",
        desc_pl: "Kolega z touru prosi o pożyczkę £500, bo przegrał w kasynie.", desc_en: "A tour buddy asks for a £500 loan because he lost at the casino.", desc_de: "Ein Tour-Kumpel bittet um ein Darlehen von £500, weil er im Casino verloren hat.", desc_nl: "Een tourmaatje vraagt om een lening van £500 omdat hij verloor in het casino.",
        choices: [
            { text_pl: "Daję mu te pieniądze.", text_en: "I give him the money.", text_de: "Ich gebe ihm das Geld.", text_nl: "Ik geef hem het geld.", effect: { budget: -500, pop: +5 }, outcome_pl: "Nie odzyskasz tej kasy, ale w środowisku uchodzisz za złotego człowieka.", outcome_en: "You won't get this money back, but in the community, you're seen as a golden guy.", outcome_de: "Du wirst dieses Geld nicht zurückbekommen, aber in der Community giltst du als goldener Typ.", outcome_nl: "Je krijgt dit geld niet terug, maar in de gemeenschap word je gezien als een gouden vent." },
            { text_pl: "Mówię, żeby poszedł na odwyk.", text_en: "I tell him to go to rehab.", text_de: "Ich sage ihm, er soll in die Entzugsklinik gehen.", text_nl: "Ik vertel hem dat hij naar een afkickkliniek moet gaan.", effect: { prof: +5 }, outcome_pl: "Trudna miłość. Zrobiłeś to, co było najlepsze dla jego kariery.", outcome_en: "Tough love. You did what was best for his career.", outcome_de: "Harte Liebe. Du hast das getan, was am besten für seine Karriere war.", outcome_nl: "Harde liefde. Je deed wat het beste was voor zijn carrière." }
        ]
    },
    {
        title_pl: "Zakład z Sędzią", title_en: "Bet with Referee", title_de: "Wette mit Schiedsrichter", title_nl: "Weddenschap met Scheidsrechter",
        desc_pl: "Główny arbiter zakłada się z tobą, że nie wyrzucisz dzisiaj ani jednej 180-tki.", desc_en: "The main referee bets you that you won't throw a single 180 today.", desc_de: "Der Hauptschiedsrichter wettet mit dir, dass du heute keine einzige 180 wirfst.", desc_nl: "De hoofdscheidsrechter wedt dat je vandaag geen enkele 180 zult gooien.",
        choices: [
            { text_pl: "Przyjmuję zakład! Lecimy po maksa.", text_en: "I take the bet! Let's go for the max.", text_de: "Ich nehme die Wette an! Auf zum Maximum.", text_nl: "Ik neem de weddenschap aan! We gaan voor de max.", effect: { scoring: +2, doubles: -1 }, outcome_pl: "Skupiasz się tak mocno na T20, że całkowicie ignorujesz trening kończenia legów.", outcome_en: "You focus so much on T20 that you completely ignore finishing practice.", outcome_de: "Du konzentrierst dich so sehr auf T20, dass du das Checkout-Training völlig ignorierst.", outcome_nl: "Je focust je zo erg op T20 dat je de checkout-training volledig negeert." },
            { text_pl: "Śmieję się i wracam do gry.", text_en: "I laugh and get back to the game.", text_de: "Ich lache und kehre zum Spiel zurück.", text_nl: "Ik lach en ga terug naar het spel.", effect: { prof: +2 }, outcome_pl: "Nie dajesz się wciągnąć w gierki. Skupiasz się na wygranej.", outcome_en: "You don't let yourself get pulled into mind games. You focus on winning.", outcome_de: "Du lässt dich nicht in Psychospiele verwickeln. Du konzentrierst dich auf den Sieg.", outcome_nl: "Je laat je niet meeslepen in mindgames. Je focust op winnen." }
        ]
    },
    {
        title_pl: "Zła Piosenka", title_en: "Bad Song", title_de: "Schlechtes Lied", title_nl: "Slecht Lied",
        desc_pl: "Fani złośliwie śpiewają chamską piosenkę na twój temat.", desc_en: "Fans maliciously sing a rude song about you.", desc_de: "Fans singen boshaft ein unhöfliches Lied über dich.", desc_nl: "Fans zingen kwaadwillig een onbeleefd lied over je.",
        choices: [
            { text_pl: "Pokazuję im środkowy palec w ukryciu.", text_en: "I show them the middle finger secretly.", text_de: "Ich zeige ihnen heimlich den Mittelfinger.", text_nl: "Ik steek stiekem mijn middelvinger naar ze op.", effect: { pop: -15, prof: -10 }, outcome_pl: "Kamera to uchwyciła. Masz ogromne kłopoty wizerunkowe.", outcome_en: "The camera caught it. You have huge image problems.", outcome_de: "Die Kamera hat es eingefangen. Du hast riesige Imageprobleme.", outcome_nl: "De camera heeft het vastgelegd. Je hebt enorme imagoproblemen." },
            { text_pl: "Uśmiecham się i puszczam całuska w ich stronę.", text_en: "I smile and blow a kiss their way.", text_de: "Ich lächle und werfe ihnen einen Kuss zu.", text_nl: "Ik glimlach en blaas een kus hun kant op.", effect: { pop: +15, form: +1 }, outcome_pl: "Kibice w szoku! Odwróciłeś ich nienawiść w sympatię jednym zgrabnym gestem.", outcome_en: "Fans in shock! You turned their hate into sympathy with one graceful gesture.", outcome_de: "Die Fans stehen unter Schock! Du hast ihren Hass mit einer anmutigen Geste in Sympathie verwandelt.", outcome_nl: "Fans in shock! Je veranderde hun haat in sympathie met één gracieuze gemaar." }
        ]
    },
    {
        title_pl: "Problem z Szafką", title_en: "Locker Problem", title_de: "Spind-Problem", title_nl: "Kluisje Probleem",
        desc_pl: "Kluczyk do twojej szafki w szatni złamał się w zamku.", desc_en: "The key to your locker in the changing room broke off in the lock.", desc_de: "Der Schlüssel zu deinem Spind in der Umkleidekabine ist im Schloss abgebrochen.", desc_nl: "De sleutel van je kluisje in de kleedkamer is afgebroken in het slot.",
        choices: [
            { text_pl: "Wyważam drzwi ramieniem!", text_en: "I force the door open with my shoulder!", text_de: "Ich breche die Tür mit meiner Schulter auf!", text_nl: "Ik forceer de deur met mijn schouder!", effect: { stamina: -15, scoring: -2 }, outcome_pl: "Drzwi puściły, ale mocno nadwyrężyłeś bark tuż przed meczem.", outcome_en: "The door gave way, but you severely strained your shoulder right before the match.", outcome_de: "Die Tür gab nach, aber du hast dir kurz vor dem Spiel die Schulter stark gezerrt.", outcome_nl: "De deur gaf mee, maar je hebt je schouder vlak voor de wedstrijd zwaar overbelast." },
            { text_pl: "Wołam konserwatora z łomem.", text_en: "I call the maintenance guy with a crowbar.", text_de: "Ich rufe den Hausmeister mit einem Brecheisen.", text_nl: "Ik bel de onderhoudsmedewerker met een koevoet.", effect: { prof: +2 }, outcome_pl: "Drobne opóźnienie, ale twoje ręce są całe i zdrowe.", outcome_en: "A slight delay, but your hands are safe and sound.", outcome_de: "Eine kleine Verzögerung, aber deine Hände sind heil und gesund.", outcome_nl: "Een lichte vertraging, maar je handen zijn veilig en gezond." }
        ]
    },
    {
        title_pl: "Zmiana Wizerunku", title_en: "Image Change", title_de: "Image-Wechsel", title_nl: "Imago Verandering",
        desc_pl: "Twój PR-owiec proponuje, żebyś przefarbował włosy na neonowy róż.", desc_en: "Your PR guy suggests you dye your hair neon pink.", desc_de: "Dein PR-Manager schlägt vor, deine Haare neonpink zu färben.", desc_nl: "Je PR-manager stelt voor om je haar neonroze te verven.",
        choices: [
            { text_pl: "Robię to dla sławy!", text_en: "I'll do it for the fame!", text_de: "Ich mache es für den Ruhm!", text_nl: "Ik doe het voor de roem!", effect: { pop: +20, prof: -5, budget: -100 }, outcome_pl: "Wyglądasz jak żelka, kosztowało to stówę, ale masz milion nowych followersów.", outcome_en: "You look like a jellybean, it cost a hundred quid, but you have a million new followers.", outcome_de: "Du siehst aus wie ein Gummibärchen, es hat einen Hunderter gekostet, aber du hast eine Million neue Follower.", outcome_nl: "Je ziet eruit als een jellybean, het kostte honderd pond, maar je hebt een miljoen nieuwe volgers." },
            { text_pl: "Wykluczone. Zostaję sobą.", text_en: "Out of the question. I stay myself.", text_de: "Kommt nicht in Frage. Ich bleibe ich selbst.", text_nl: "Geen sprake van. Ik blijf mezelf.", effect: { prof: +5 }, outcome_pl: "Klasyka i elegancja. Stawiasz na dart, a nie na cyrk.", outcome_en: "Class and elegance. You focus on darts, not a circus.", outcome_de: "Klasse und Eleganz. Du konzentrierst dich auf Darts, nicht auf einen Zirkus.", outcome_nl: "Klasse en elegantie. Je focust op darten, niet op een circus." }
        ]
    },
    {
        title_pl: "Krzywa Podłoga", title_en: "Uneven Floor", title_de: "Schiefer Boden", title_nl: "Ongelijke Vloer",
        desc_pl: "Masz wrażenie, że podłoga przy tarczy na podłogowym turnieju jest lekko pochylona.", desc_en: "You feel like the floor at the oche during the floor tournament is slightly slanted.", desc_de: "Du hast das Gefühl, dass der Boden am Oche beim Floor-Turnier leicht schräg ist.", desc_nl: "Je hebt het gevoel dat de vloer bij de oche tijdens het vloertoernooi iets schuin afloopt.",
        choices: [
            { text_pl: "Narzekam sędziemu przez 10 minut.", text_en: "I complain to the referee for 10 minutes.", text_de: "Ich beschwere mich 10 Minuten lang beim Schiedsrichter.", text_nl: "Ik klaag 10 minuten lang bij de scheidsrechter.", effect: { prof: -5, doubles: -1 }, outcome_pl: "Zrobiłeś z igły widły, wybijając z rytmu głównie samego siebie.", outcome_en: "You made a mountain out of a molehill, knocking yourself off rhythm.", outcome_de: "Du hast aus einer Mücke einen Elefanten gemacht und dich selbst aus dem Rhythmus gebracht.", outcome_nl: "Je maakte van een mug een olifant en haalde jezelf uit het ritme." },
            { text_pl: "Kompensuję to stając szerzej.", text_en: "I compensate by taking a wider stance.", text_de: "Ich kompensiere es, indem ich einen breiteren Stand einnehme.", text_nl: "Ik compenseer door een wijdere houding aan te nemen.", effect: { scoring: +1, stamina: -5 }, outcome_pl: "Poradziłeś sobie z problemem fizycznie, co jednak kosztowało cię trochę energii.", outcome_en: "You dealt with the problem physically, which cost you some energy.", outcome_de: "Du bist physisch mit dem Problem umgegangen, was dich etwas Energie gekostet hat.", outcome_nl: "Je ging fysiek met het probleem om, wat je wat energie kostte." }
        ]
    },
    {
        title_pl: "Soft Darty w Japonii", title_en: "Soft Darts in Japan", title_de: "Soft Darts in Japan", title_nl: "Soft Darts in Japan",
        desc_pl: "Zostałeś zaproszony na pokazowy turniej na tarczach elektronicznych w Azji.", desc_en: "You've been invited to an exhibition soft-tip tournament in Asia.", desc_de: "Du wurdest zu einem Einladungs-Soft-Tip-Turnier in Asien eingeladen.", desc_nl: "Je bent uitgenodigd voor een demonstratie soft-tip toernooi in Azië.",
        choices: [
            { text_pl: "Lecę zarobić trochę kasy!", text_en: "I fly over to make some cash!", text_de: "Ich fliege hin, um etwas Geld zu verdienen!", text_nl: "Ik vlieg ernaartoe om wat geld te verdienen!", effect: { budget: 1500, stamina: -30, doubles: -2 }, outcome_pl: "Zarobiłeś £1500, ale jetlag i plastikowe tarcze zrujnowały twoje czucie sizalu.", outcome_en: "You made £1500, but jetlag and plastic boards ruined your feel for sisal.", outcome_de: "Du hast £1500 verdient, aber Jetlag und Plastik-Boards haben dein Gefühl für Sisal ruiniert.", outcome_nl: "Je hebt £1500 verdiend, maar jetlag en plastic borden hebben je gevoel voor sisal verpest." },
            { text_pl: "Odmawiam, to psuje technikę.", text_en: "I refuse, it ruins my technique.", text_de: "Ich lehne ab, es ruiniert meine Technik.", text_nl: "Ik weiger, het ruïneert mijn techniek.", effect: { prof: +5, form: +1 }, outcome_pl: "Odrzuciłeś łatwą kasę, chroniąc formę na ważne, telewizyjne zawody.", outcome_en: "You refused easy money, protecting your form for important TV events.", outcome_de: "Du hast einfaches Geld abgelehnt und deine Form für wichtige TV-Events geschützt.", outcome_nl: "Je weigerde makkelijk geld en beschermde je vorm voor belangrijke tv-evenementen." }
        ]
    },
    {
        title_pl: "Woda z Cytryną", title_en: "Lemon Water", title_de: "Zitronenwasser", title_nl: "Citroenwater",
        desc_pl: "Ktoś dolał soku z cytryny do twojej wody na scenie bez twojej wiedzy.", desc_en: "Someone poured lemon juice into your water on stage without your knowledge.", desc_de: "Jemand hat ohne dein Wissen Zitronensaft in dein Wasser auf der Bühne gegossen.", desc_nl: "Iemand heeft zonder jouw medeweten citroensap in je water op het podium gegoten.",
        choices: [
            { text_pl: "Wypluwam z obrzydzeniem!", text_en: "I spit it out in disgust!", text_de: "Ich spucke es angewidert aus!", text_nl: "Ik spuug het vol walging uit!", effect: { pop: -5, prof: -2 }, outcome_pl: "Publika myśli, że zachowujesz się jak rozpieszczona diva.", outcome_en: "The crowd thinks you act like a spoiled diva.", outcome_de: "Das Publikum denkt, du benimmst dich wie eine verwöhnte Diva.", outcome_nl: "Het publiek denkt dat je je gedraagt als een verwende diva." },
            { text_pl: "Przełykam gładko i gram dalej.", text_en: "I swallow it smoothly and play on.", text_de: "Ich schlucke es glatt runter und spiele weiter.", text_nl: "Ik slik het soepel door en speel verder.", effect: { stamina: +5, scoring: +1 }, outcome_pl: "Cytryna pobudziła cię do działania. Niezły zastrzyk orzeźwienia!", outcome_en: "The lemon stimulated you into action. A nice refreshing boost!", outcome_de: "Die Zitrone hat dich zum Handeln angeregt. Ein schöner Erfrischungsschub!", outcome_nl: "De citroen stimuleerde je tot actie. Een lekkere verfrissende boost!" }
        ]
    },
    {
        title_pl: "Złośliwy Lot", title_en: "Malicious Flight", title_de: "Bösartiger Flug", title_nl: "Kwaadaardige Vlucht",
        desc_pl: "Twoja pierwsza lotka wbiła się w D20 pod dziwnym kątem, blokując resztę pola.", desc_en: "Your first dart went into D20 at an odd angle, blocking the rest of the bed.", desc_de: "Dein erster Dart steckte in einem seltsamen Winkel in D20 und blockierte den Rest des Feldes.", desc_nl: "Je eerste pijl ging onder een rare hoek in D20, waardoor de rest van het bed werd geblokkeerd.",
        choices: [
            { text_pl: "Rzucam ryzykując bouncera.", text_en: "I throw risking a bounce-out.", text_de: "Ich werfe und riskiere einen Bouncer.", text_nl: "Ik gooi en riskeer een bouncer.", effect: { scoring: +2, doubles: -2 }, outcome_pl: "Wcisnąłeś drugą lotkę siłą, ale trzecia odbiła się i spadła na ziemię.", outcome_en: "You forced the second dart in, but the third bounced and hit the floor.", outcome_de: "Du hast den zweiten Dart hineingezwungen, aber der dritte prallte ab und fiel auf den Boden.", outcome_nl: "Je dwong de tweede pijl erin, maar de derde kaatste af en viel op de grond." },
            { text_pl: "Zmieniam cel na D10.", text_en: "I switch my aim to D10.", text_de: "Ich wechsle mein Ziel auf D10.", text_nl: "Ik verander mijn doel naar D10.", effect: { doubles: +1 }, outcome_pl: "Mądra zmiana taktyki uchroniła cię przed bezsensownym pudłem.", outcome_en: "A smart tactical change saved you from a pointless miss.", outcome_de: "Ein kluger Taktikwechsel hat dich vor einem sinnlosen Fehlwurf bewahrt.", outcome_nl: "Een slimme tactische wijziging behoedde je voor een zinloze misser." }
        ]
    },
    {
        title_pl: "Brak Ochroniarza", title_en: "No Security Guard", title_de: "Kein Sicherheitsdienst", title_nl: "Geen Beveiliger",
        desc_pl: "Musisz przejść przez tłum pijanych fanów do hotelu po wygranym meczu.", desc_en: "You have to walk through a crowd of drunk fans to your hotel after a win.", desc_de: "Du musst nach einem Sieg durch eine Menge betrunkener Fans zu deinem Hotel gehen.", desc_nl: "Je moet na een overwinning door een menigte dronken fans naar je hotel lopen.",
        choices: [
            { text_pl: "Piję z nimi i śpiewam!", text_en: "I drink and sing with them!", text_de: "Ich trinke und singe mit ihnen!", text_nl: "Ik drink en zing met ze!", effect: { pop: +15, stamina: -20 }, outcome_pl: "Niesamowita noc, ale rano nie mogłeś zwlec się z łóżka.", outcome_en: "Amazing night, but you couldn't get out of bed in the morning.", outcome_de: "Erstaunliche Nacht, aber du konntest morgens nicht aus dem Bett kommen.", outcome_nl: "Geweldige nacht, maar je kon 's ochtends niet uit bed komen." },
            { text_pl: "Biegnę sprintem do windy z kapturem na głowie.", text_en: "I sprint to the elevator with my hood up.", text_de: "Ich sprinte mit hochgezogener Kapuze zum Aufzug.", text_nl: "Ik sprint met mijn capuchon op naar de lift.", effect: { pop: -5, stamina: -5 }, outcome_pl: "Fani uznali, że zadzierasz nosa, ale ty po prostu wolałeś ciszę.", outcome_en: "Fans thought you were being a snob, but you just preferred silence.", outcome_de: "Die Fans dachten, du wärst ein Snob, aber du hast einfach die Ruhe vorgezogen.", outcome_nl: "Fans dachten dat je een snob was, maar je gaf gewoon de voorkeur aan stilte." }
        ]
    },
    {
        title_pl: "Zaklinacz Węży", title_en: "Snake Charmer", title_de: "Schlangenbeschwörer", title_nl: "Slangenbezweerder",
        desc_pl: "Przeciwnik próbuje cię zdekoncentrować powolnym, niemal hipnotycznym ruchem ręki przy rzucie.", desc_en: "The opponent tries to distract you with a slow, almost hypnotic arm movement.", desc_de: "Der Gegner versucht, dich mit einer langsamen, fast hypnotischen Armbewegung abzulenken.", desc_nl: "De tegenstander probeert je af te leiden met een trage, bijna hypnotiserende armbeweging.",
        choices: [
            { text_pl: "Wpatruję się w jego dłoń żeby go stresować.", text_en: "I stare at his hand to stress him out.", text_de: "Ich starre auf seine Hand, um ihn zu stressen.", text_nl: "Ik staar naar zijn hand om hem te stressen.", effect: { scoring: -2, prof: -2 }, outcome_pl: "Wciągnąłeś się w głupią grę i zapomniałeś o własnej technice.", outcome_en: "You got drawn into a stupid game and forgot your own technique.", outcome_de: "Du wurdest in ein dummes Spiel hineingezogen und hast deine eigene Technik vergessen.", outcome_nl: "Je werd in een dom spel meegezogen en vergat je eigen techniek." },
            { text_pl: "Patrzę w podłogę aż skończy.", text_en: "I stare at the floor until he finishes.", text_de: "Ich starre auf den Boden, bis er fertig ist.", text_nl: "Ik staar naar de vloer tot hij klaar is.", effect: { prof: +3, scoring: +1 }, outcome_pl: "Całkowity brak reakcji z twojej strony zniszczył jego plan.", outcome_en: "Your complete lack of reaction destroyed his plan.", outcome_de: "Dein völliger Mangel an Reaktion hat seinen Plan zerstört.", outcome_nl: "Je totale gebrek aan reactie vernietigde zijn plan." }
        ]
    },
    {
        title_pl: "Dziura w Oponie", title_en: "Hole in Surround", title_de: "Loch im Surround", title_nl: "Gat in Surround",
        desc_pl: "Lotka wbiła się w pierścień ochronny tarczy z taką siłą, że nie możesz jej wyciągnąć.", desc_en: "The dart stuck into the surround with such force that you can't pull it out.", desc_de: "Der Dart steckte mit solcher Wucht im Surround, dass du ihn nicht herausziehen kannst.", desc_nl: "De pijl stak met zo'n kracht in de surround dat je hem er niet uit kunt trekken.",
        choices: [
            { text_pl: "Szarpę z całej siły!", text_en: "I pull with all my might!", text_de: "Ich ziehe mit all meiner Kraft!", text_nl: "Ik trek met al mijn macht!", effect: { stamina: -10, doubles: -1 }, outcome_pl: "Lotka wyszła, ale naciągnąłeś nadgarstek. Co za siła!", outcome_en: "The dart came out, but you strained your wrist. What strength!", outcome_de: "Der Dart kam heraus, aber du hast dein Handgelenk gezerrt. Was für eine Kraft!", outcome_nl: "De pijl kwam eruit, maar je verrekte je pols. Wat een kracht!" },
            { text_pl: "Proszę sędziego o pomoc.", text_en: "I ask the ref for help.", text_de: "Ich bitte den Schiri um Hilfe.", text_nl: "Ik vraag de scheidsrechter om hulp.", effect: { pop: +5 }, outcome_pl: "Sędzia musiał zaprzeć się nogą. Śmieszna scena dla kibiców.", outcome_en: "The referee had to brace with his leg. A funny scene for the fans.", outcome_de: "Der Schiedsrichter musste sich mit dem Bein abstützen. Eine lustige Szene für die Fans.", outcome_nl: "De scheidsrechter moest zich schrap zetten met zijn been. Een grappige scène voor de fans." }
        ]
    },
    {
        title_pl: "Zła Dykcja", title_en: "Bad Diction", title_de: "Schlechte Aussprache", title_nl: "Slechte Dictie",
        desc_pl: "Caller dziwnie wymawia punkty i cię to rozprasza.", desc_en: "The caller pronounces scores weirdly and it distracts you.", desc_de: "Der Caller spricht die Punktzahlen seltsam aus und lenkt dich ab.", desc_nl: "De caller spreekt de scores raar uit en dat leidt je af.",
        choices: [
            { text_pl: "Przedrzeźniam go pod nosem.", text_en: "I mock him under my breath.", text_de: "Ich spotte leise über ihn.", text_nl: "Ik bespot hem binnensmonds.", effect: { prof: -5, pop: -5 }, outcome_pl: "Kamera cię nagrała. Wyszedłeś na bardzo niekulturalnego gracza.", outcome_en: "The camera caught you. You came off as a very uncultured player.", outcome_de: "Die Kamera hat dich erfasst. Du wirktest wie ein sehr unkultivierter Spieler.", outcome_nl: "De camera betrapte je. Je kwam over als een zeer onbeschaafde speler." },
            { text_pl: "Polegam tylko na matematyce w swojej głowie.", text_en: "I rely only on the math in my head.", text_de: "Ich verlasse mich nur auf die Mathematik in meinem Kopf.", text_nl: "Ik vertrouw alleen op de wiskunde in mijn hoofd.", effect: { scoring: +2 }, outcome_pl: "Skupienie na własnych obliczeniach przyniosło poprawę punktacji.", outcome_en: "Focusing on your own calculations improved your scoring.", outcome_de: "Die Konzentration auf deine eigenen Berechnungen verbesserte dein Scoring.", outcome_nl: "Focussen op je eigen berekeningen verbeterde je score." }
        ]
    },
    {
        title_pl: "Zepsuta Tablica Wyników", title_en: "Broken Scoreboard", title_de: "Kaputte Anzeigetafel", title_nl: "Kapot Scorebord",
        desc_pl: "Ekran za twoimi plecami zawiesił się i pokazuje stary wynik.", desc_en: "The screen behind your back froze and shows an old score.", desc_de: "Der Bildschirm hinter dir ist eingefroren und zeigt einen alten Punktestand.", desc_nl: "Het scherm achter je bevroor en toont een oude score.",
        choices: [
            { text_pl: "Kłócę się z sędzią, że wynik jest inny.", text_en: "I argue with the ref that the score is different.", text_de: "Ich streite mit dem Schiri, dass das Ergebnis anders ist.", text_nl: "Ik maak ruzie met de scheidsrechter dat de score anders is.", effect: { prof: -2, stamina: -5 }, outcome_pl: "Traciłeś czas. Sędzia i tak ma zapiski na kartce.", outcome_en: "You wasted time. The referee has notes on paper anyway.", outcome_de: "Du hast Zeit verschwendet. Der Schiedsrichter hat sowieso Notizen auf Papier.", outcome_nl: "Je verspilde tijd. De scheidsrechter heeft toch aantekeningen op papier." },
            { text_pl: "Gram dalej, wiem ile mi zostało.", text_en: "I play on, I know what I have left.", text_de: "Ich spiele weiter, ich weiß, was ich noch habe.", text_nl: "Ik speel door, ik weet wat ik over heb.", effect: { prof: +5, doubles: +1 }, outcome_pl: "Kalkulator w głowie działa idealnie. Pełen profesjonalizm.", outcome_en: "The calculator in your head works perfectly. Full professionalism.", outcome_de: "Der Taschenrechner in deinem Kopf funktioniert perfekt. Volle Professionalität.", outcome_nl: "De rekenmachine in je hoofd werkt perfect. Volledig professionalisme." }
        ]
    },
    {
        title_pl: "Reklama Szamponu", title_en: "Shampoo Ad", title_de: "Shampoo-Werbung", title_nl: "Shampoo Reclame",
        desc_pl: "Firma farmaceutyczna oferuje ci dużą kwotę za reklamę szamponu przeciwłupieżowego.", desc_en: "A pharmaceutical company offers you a large sum for an anti-dandruff shampoo ad.", desc_de: "Ein Pharmaunternehmen bietet dir eine große Summe für eine Anti-Schuppen-Shampoo-Werbung.", desc_nl: "Een farmaceutisch bedrijf biedt je een groot bedrag voor een anti-roos shampoo-reclame.",
        choices: [
            { text_pl: "Biorę to z uśmiechem!", text_en: "I take it with a smile!", text_de: "Ich nehme es mit einem Lächeln!", text_nl: "Ik neem het met een glimlach aan!", effect: { budget: 800, pop: -10 }, outcome_pl: "Zarobiłeś £800, ale koledzy z touru śmieją się z ciebie w szatni.", outcome_en: "You made £800, but the tour buddies laugh at you in the locker room.", outcome_de: "Du hast £800 verdient, aber deine Tour-Kollegen lachen dich in der Umkleidekabine aus.", outcome_nl: "Je hebt £800 verdiend, maar de tourvrienden lachen je uit in de kleedkamer." },
            { text_pl: "Nie jestem modelem.", text_en: "I'm not a model.", text_de: "Ich bin kein Model.", text_nl: "Ik ben geen model.", effect: { prof: +2 }, outcome_pl: "Odmówiłeś. Twoje włosy to twoja sprawa.", outcome_en: "You declined. Your hair is your business.", outcome_de: "Du hast abgelehnt. Deine Haare sind deine Sache.", outcome_nl: "Je weigerde. Je haar is jouw zaak." }
        ]
    },
    {
        title_pl: "Gorący Kubek", title_en: "Hot Mug", title_de: "Heißer Becher", title_nl: "Hete Mok",
        desc_pl: "Oparzyłeś język przedmeczową herbatą.", desc_en: "You burned your tongue with pre-match tea.", desc_de: "Du hast dir die Zunge an deinem Vor-Spiel-Tee verbrannt.", desc_nl: "Je verbrandde je tong aan de thee voor de wedstrijd.",
        choices: [
            { text_pl: "Zaciskam zęby i gram w bólu.", text_en: "I grit my teeth and play in pain.", text_de: "Ich beiße die Zähne zusammen und spiele unter Schmerzen.", text_nl: "Ik bijt op mijn tanden en speel met pijn.", effect: { doubles: -2 }, outcome_pl: "Piekący język potrafi wybić z rytmu podczas celowania.", outcome_en: "A burning tongue can throw you off rhythm when aiming.", outcome_de: "Eine brennende Zunge kann dich beim Zielen aus dem Rhythmus bringen.", outcome_nl: "Een brandende tong kan je uit je ritme halen bij het richten." },
            { text_pl: "Piję duszkiem szklankę lodowatej wody.", text_en: "I gulp down a glass of ice water.", text_de: "Ich schlucke ein Glas Eiswasser hinunter.", text_nl: "Ik slok een glas ijswater naar binnen.", effect: { stamina: +5 }, outcome_pl: "Szybka reakcja ukoiła ból, choć dyskomfort pozostał.", outcome_en: "The quick reaction soothed the pain, although the discomfort remained.", outcome_de: "Die schnelle Reaktion linderte den Schmerz, obwohl das Unbehagen blieb.", outcome_nl: "De snelle reactie verzachtte de pijn, hoewel het ongemak bleef." }
        ]
    },
    {
        title_pl: "Nieznany Rywal", title_en: "Unknown Rival", title_de: "Unbekannter Rivale", title_nl: "Onbekende Rivaal",
        desc_pl: "Grasz z zupełnie anonimowym amatorem, który cudem dostał się do turnieju.", desc_en: "You're playing a completely unknown amateur who miraculously got into the tournament.", desc_de: "Du spielst gegen einen völlig unbekannten Amateur, der es wie durch ein Wunder ins Turnier geschafft hat.", desc_nl: "Je speelt tegen een compleet onbekende amateur die wonderbaarlijk in het toernooi kwam.",
        choices: [
            { text_pl: "Lekceważę go i rzucam od niechcenia.", text_en: "I underestimate him and throw casually.", text_de: "Ich unterschätze ihn und werfe beiläufig.", text_nl: "Ik onderschat hem en gooi terloops.", effect: { scoring: -3, form: -2 }, outcome_pl: "Ledwo wygrałeś. Brak szacunku odbił się na twojej skuteczności.", outcome_en: "You barely won. Disrespect reflected on your accuracy.", outcome_de: "Du hast kaum gewonnen. Respektlosigkeit spiegelte sich in deiner Genauigkeit wider.", outcome_nl: "Je hebt amper gewonnen. Respectloosheid weerspiegelde zich in je nauwkeurigheid." },
            { text_pl: "Traktuję go jak najgroźniejszego rywala.", text_en: "I treat him as the most dangerous rival.", text_de: "Ich behandle ihn als den gefährlichsten Rivalen.", text_nl: "Ik behandel hem als de gevaarlijkste rivaal.", effect: { scoring: +2, prof: +3 }, outcome_pl: "Zniszczyłeś go wybitną średnią. Zero litości, czysty sport.", outcome_en: "You destroyed him with a brilliant average. Zero mercy, pure sport.", outcome_de: "Du hast ihn mit einem brillanten Durchschnitt zerstört. Keine Gnade, reiner Sport.", outcome_nl: "Je hebt hem vernietigd met een briljant gemiddelde. Geen genade, pure sport." }
        ]
    },
    {
        title_pl: "Literówka", title_en: "Typo", title_de: "Tippfehler", title_nl: "Typo",
        desc_pl: "Organizatorzy napisali twoje imię z błędem na koszulce i grafice telewizyjnej.", desc_en: "The organizers misspelled your name on the shirt and TV graphics.", desc_de: "Die Organisatoren haben deinen Namen auf dem Hemd und den TV-Grafiken falsch geschrieben.", desc_nl: "De organisatoren hebben je naam verkeerd gespeld op het shirt en tv-graphics.",
        choices: [
            { text_pl: "Robię o to awanturę przed kamerami.", text_en: "I make a fuss about it on camera.", text_de: "Ich mache vor der Kamera ein Aufheben darum.", text_nl: "Ik maak er stampij over voor de camera.", effect: { pop: -5, prof: -10 }, outcome_pl: "Władze ukarały cię grzywną za rzucanie się do ekipy technicznej.", outcome_en: "Authorities fined you for throwing a tantrum at the tech crew.", outcome_de: "Die Behörden haben dir eine Geldstrafe auferlegt, weil du das Technikteam angeschrien hast.", outcome_nl: "Autoriteiten beboetten je voor een woede-uitbarsting naar de tech crew." },
            { text_pl: "Obracam to w żart na swoim profilu społecznościowym.", text_en: "I turn it into a joke on my social profile.", text_de: "Ich mache auf meinem sozialen Profil einen Witz daraus.", text_nl: "Ik maak er een grap van op mijn sociale profiel.", effect: { pop: +20, form: +1 }, outcome_pl: "Zrobiłeś z tego kapitalny mem. Ludzie kochają twój dystans do siebie!", outcome_en: "You made a great meme out of it. People love your self-distance!", outcome_de: "Du hast ein tolles Meme daraus gemacht. Die Leute lieben deine Selbstironie!", outcome_nl: "Je hebt er een geweldige meme van gemaakt. Mensen houden van je zelfspot!" }
        ]
    },
    {
        title_pl: "Rozpraszający Dźwięk", title_en: "Distracting Sound", title_de: "Ablenkendes Geräusch", title_nl: "Afleidend Geluid",
        desc_pl: "Z komórki kibica w pierwszym rzędzie głośno dzwoni dzwonek podczas twojego rzutu.", desc_en: "A fan's phone in the front row rings loudly during your throw.", desc_de: "Das Telefon eines Fans in der ersten Reihe klingelt während deines Wurfs laut.", desc_nl: "De telefoon van een fan op de eerste rij rinkelt luid tijdens je worp.",
        choices: [
            { text_pl: "Zatrzymuję rzut i rzucam mordercze spojrzenie.", text_en: "I stop the throw and give a death glare.", text_de: "Ich stoppe den Wurf und werfe einen Todesblick zu.", text_nl: "Ik stop de worp en geef een dodelijke blik.", effect: { pop: +5, prof: -2 }, outcome_pl: "Kibic schował telefon ze wstydem. Trochę gwiazdorzysz, ale podziałało.", outcome_en: "The fan hid the phone in shame. You're acting like a diva a bit, but it worked.", outcome_de: "Der Fan versteckte das Telefon beschämt. Du benimmst dich ein bisschen wie eine Diva, aber es hat funktioniert.", outcome_nl: "De fan verborg de telefoon uit schaamte. Je gedraagt je een beetje als een diva, maar het werkte." },
            { text_pl: "Rzucam mimo wszystko.", text_en: "I throw anyway.", text_de: "Ich werfe trotzdem.", text_nl: "Ik gooi toch.", effect: { scoring: -2, doubles: -1 }, outcome_pl: "Dzwonek zdekoncentrował cię w kluczowym momencie i lotka wylądowała w '1'.", outcome_en: "The ringtone distracted you at a crucial moment and the dart landed in '1'.", outcome_de: "Der Klingelton hat dich in einem entscheidenden Moment abgelenkt und der Dart landete in der '1'.", outcome_nl: "De ringtone leidde je af op een cruciaal moment en de pijl belandde in de '1'." }
        ]
    },
    {
        title_pl: "Zimna Szatnia", title_en: "Cold Locker Room", title_de: "Kalte Umkleidekabine", title_nl: "Koude Kleedkamer",
        desc_pl: "Ogrzewanie na zapleczu wysiadło. Masz skostniałe ręce.", desc_en: "The backstage heating broke down. You have stiff hands.", desc_de: "Die Heizung hinter der Bühne ist ausgefallen. Du hast steife Hände.", desc_nl: "De verwarming backstage is kapot. Je hebt stijve handen.",
        choices: [
            { text_pl: "Piję szybką 'małpkę' z wódką na rozgrzewkę.", text_en: "I drink a quick shot of vodka to warm up.", text_de: "Ich trinke schnell einen Schuss Wodka zum Aufwärmen.", text_nl: "Ik drink een snel shotje wodka om op te warmen.", effect: { scoring: -4, doubles: -5, prof: -15 }, outcome_pl: "Piekielnie zły pomysł. Nie mogłeś trafić w tarczę, a do tego zionęło od ciebie.", outcome_en: "Hell of a bad idea. You couldn't hit the board, and you reeked of alcohol.", outcome_de: "Verdammt schlechte Idee. Du konntest das Board nicht treffen, und du hast nach Alkohol gestunken.", outcome_nl: "Heel slecht idee. Je kon het bord niet raken en je stonk naar alcohol." },
            { text_pl: "Rozgrzewam ręce w kubku z gorącą wodą.", text_en: "I warm my hands in a cup of hot water.", text_de: "Ich wärme meine Hände in einer Tasse mit heißem Wasser.", text_nl: "Ik warm mijn handen aan een beker heet water.", effect: { prof: +3, scoring: +1 }, outcome_pl: "Sprytny, stary darterski trik. Ręce wróciły do idealnej temperatury roboczej.", outcome_en: "A clever, old darts trick. Hands returned to ideal working temperature.", outcome_de: "Ein cleverer, alter Darts-Trick. Die Hände kehrten zur idealen Arbeitstemperatur zurück.", outcome_nl: "Een slimme, oude dartstruc. Handen keerden terug naar ideale werktemperatuur." }
        ]
    },
{
        title_pl: "Lotniskowa Kontrola", title_en: "Airport Security", title_de: "Flughafenkontrolle", title_nl: "Luchthavenbeveiliging",
        desc_pl: "Ochrona na lotnisku chce skonfiskować twoje lotki w bagażu podręcznym.", desc_en: "Airport security wants to confiscate your darts from your hand luggage.", desc_de: "Die Flughafensicherheit möchte deine Darts im Handgepäck beschlagnahmen.", desc_nl: "De luchthavenbeveiliging wil je pijlen in je handbagage in beslag nemen.",
        choices: [
            { text_pl: "Kłócę się z nimi do upadłego!", text_en: "I argue with them to the end!", text_de: "Ich streite mit ihnen bis zum Ende!", text_nl: "Ik maak ruzie met ze tot het bittere eind!", effect: { pop: -5, prof: -10, stamina: -10 }, outcome_pl: "Zostałeś zatrzymany na godzinę i ledwo zdążyłeś na lot. Dużo stresu.", outcome_en: "You were detained for an hour and barely made your flight. Lots of stress.", outcome_de: "Du wurdest eine Stunde festgehalten und hast deinen Flug kaum erwischt. Viel Stress.", outcome_nl: "Je werd een uur vastgehouden en haalde amper je vlucht. Veel stress." },
            { text_pl: "Oddaję je z bólem serca i kupuję nowe.", text_en: "I give them up with a heavy heart and buy new ones.", text_de: "Ich gebe sie schweren Herzens ab und kaufe neue.", text_nl: "Ik geef ze met pijn in het hart af en koop nieuwe.", effect: { budget: -100, scoring: -2 }, outcome_pl: "Straciłeś ulubiony sprzęt i pieniądze, ale zdążyłeś na samolot.", outcome_en: "You lost your favorite gear and money, but caught your plane.", outcome_de: "Du hast deine Lieblingsausrüstung und Geld verloren, aber deinen Flug erwischt.", outcome_nl: "Je bent je favoriete spullen en geld kwijt, maar je haalde je vlucht." }
        ]
    },
    {
        title_pl: "Za Małe Łóżko", title_en: "Bed Too Small", title_de: "Bett zu klein", title_nl: "Bed Te Klein",
        desc_pl: "Łóżko w tanim hotelu jest za krótkie i twoje nogi wystają za materac.", desc_en: "The bed in the cheap hotel is too short and your legs hang off the mattress.", desc_de: "Das Bett im billigen Hotel ist zu kurz und deine Beine ragen über die Matratze.", desc_nl: "Het bed in het goedkope hotel is te kort en je benen hangen over het matras.",
        choices: [
            { text_pl: "Śpię skulony w pozycję embrionalną.", text_en: "I sleep curled up in a fetal position.", text_de: "Ich schlafe zusammengekauert in fötaler Position.", text_nl: "Ik slaap opgerold in een foetushouding.", effect: { stamina: -15, doubles: -1 }, outcome_pl: "Obudziłeś się z potwornym bólem pleców.", outcome_en: "You woke up with terrible back pain.", outcome_de: "Du bist mit schrecklichen Rückenschmerzen aufgewacht.", outcome_nl: "Je werd wakker met vreselijke rugpijn." },
            { text_pl: "Dopłacam za apartament z królewskim łożem.", text_en: "I pay extra for a suite with a king-size bed.", text_de: "Ich zahle extra für eine Suite mit Kingsize-Bett.", text_nl: "Ik betaal extra voor een suite met een kingsize bed.", effect: { budget: -120, stamina: +10 }, outcome_pl: "Drogo, ale wstałeś wypoczęty i gotowy do gry.", outcome_en: "Expensive, but you woke up rested and ready to play.", outcome_de: "Teuer, aber du bist ausgeruht und bereit zum Spielen aufgewacht.", outcome_nl: "Duur, maar je werd uitgerust en klaar om te spelen wakker." }
        ]
    },
    {
        title_pl: "Tatuaż Sponsora", title_en: "Sponsor Tattoo", title_de: "Sponsoren-Tattoo", title_nl: "Sponsor Tatoeage",
        desc_pl: "Firma bukmacherska oferuje £2000, jeśli zrobisz sobie ich logo na karku.", desc_en: "A betting company offers £2000 if you tattoo their logo on your neck.", desc_de: "Ein Wettunternehmen bietet £2000, wenn du dir ihr Logo auf den Nacken tätowierst.", desc_nl: "Een gokbedrijf biedt £2000 als je hun logo op je nek laat tatoeëren.",
        choices: [
            { text_pl: "Jasne! Pieniądz to pieniądz.", text_en: "Sure! Money is money.", text_de: "Klar! Geld ist Geld.", text_nl: "Zeker! Geld is geld.", effect: { budget: 2000, pop: -20, prof: -30 }, outcome_pl: "Masz kasę, ale telewizja odmawia pokazywania cię z bliska, a fani są zniesmaczeni.", outcome_en: "You have money, but TV refuses to show you up close, and fans are disgusted.", outcome_de: "Du hast Geld, aber das Fernsehen weigert sich, dich aus der Nähe zu zeigen, und die Fans sind angewidert.", outcome_nl: "Je hebt geld, maar tv weigert je van dichtbij te laten zien en fans walgen ervan." },
            { text_pl: "Moje ciało nie jest na sprzedaż.", text_en: "My body is not for sale.", text_de: "Mein Körper steht nicht zum Verkauf.", text_nl: "Mijn lichaam is niet te koop.", effect: { prof: +10 }, outcome_pl: "Zachowałeś godność i szacunek środowiska darta.", outcome_en: "You kept your dignity and the respect of the darts community.", outcome_de: "Du hast deine Würde und den Respekt der Darts-Community bewahrt.", outcome_nl: "Je behield je waardigheid en het respect van de dartgemeenschap." }
        ]
    },
    {
        title_pl: "Zgubione Soczewki", title_en: "Lost Contact Lenses", title_de: "Verlorene Kontaktlinsen", title_nl: "Verloren Contactlenzen",
        desc_pl: "Jedna z twoich soczewek kontaktowych wypadła i zaginęła w dywanie.", desc_en: "One of your contact lenses fell out and got lost in the carpet.", desc_de: "Eine deiner Kontaktlinsen ist herausgefallen und im Teppich verschwunden.", desc_nl: "Een van je contactlenzen viel uit en is kwijtgeraakt in het tapijt.",
        choices: [
            { text_pl: "Gram z jednym okiem zamkniętym.", text_en: "I play with one eye closed.", text_de: "Ich spiele mit einem geschlossenen Auge.", text_nl: "Ik speel met één oog dicht.", effect: { scoring: -3, doubles: -4 }, outcome_pl: "Brak widzenia przestrzennego to koszmar przy tarczy.", outcome_en: "Lack of depth perception is a nightmare at the dartboard.", outcome_de: "Fehlendes räumliches Sehen ist ein Albtraum am Dartboard.", outcome_nl: "Gebrek aan diepteperceptie is een nachtmerrie bij het dartbord." },
            { text_pl: "Wyjmuję drugą i zakładam grube okulary zapasowe.", text_en: "I take out the other one and put on thick spare glasses.", text_de: "Ich nehme die andere heraus und setze eine dicke Ersatzbrille auf.", text_nl: "Ik doe de andere uit en zet een dikke reservebril op.", effect: { pop: -5, prof: +2 }, outcome_pl: "Wyglądasz trochę jak kujon, ale widzisz druty bez problemu.", outcome_en: "You look a bit like a nerd, but you can see the wires perfectly.", outcome_de: "Du siehst ein bisschen aus wie ein Nerd, aber du kannst die Drähte problemlos sehen.", outcome_nl: "Je ziet er een beetje uit als een nerd, maar je ziet de draden perfect." }
        ]
    },
    {
        title_pl: "Zapomniany Identyfikator", title_en: "Forgotten ID Badge", title_de: "Vergessener Ausweis", title_nl: "Vergeten ID-kaart",
        desc_pl: "Ochroniarz nie chce cię wpuścić na halę, bo zapomniałeś identyfikatora PDC.", desc_en: "The security guard won't let you into the arena because you forgot your PDC badge.", desc_de: "Der Sicherheitsdienst lässt dich nicht in die Halle, weil du deinen PDC-Ausweis vergessen hast.", desc_nl: "De beveiliger laat je de arena niet in omdat je je PDC-badge bent vergeten.",
        choices: [
            { text_pl: "Krzyczę 'Nie wiesz kim jestem?!'", text_en: "I shout 'Do you know who I am?!'", text_de: "Ich schreie 'Weißt du nicht, wer ich bin?!'", text_nl: "Ik schreeuw 'Weet je wel wie ik ben?!'", effect: { pop: -10, prof: -10 }, outcome_pl: "Zostałeś wpuszczony po interwencji sędziego, ale ochroniarz napisał o tym w sieci.", outcome_en: "You were let in after the ref intervened, but the guard posted about it online.", outcome_de: "Du wurdest nach Eingreifen des Schiris reingelassen, aber der Wächter hat online darüber gepostet.", outcome_nl: "Je werd binnengelaten na ingrijpen van de scheidsrechter, maar de beveiliger postte erover online." },
            { text_pl: "Spokojnie dzwonię do menedżera, by go przyniósł.", text_en: "I calmly call my manager to bring it.", text_de: "Ich rufe ruhig meinen Manager an, damit er ihn bringt.", text_nl: "Ik bel rustig mijn manager om het te brengen.", effect: { stamina: -5, prof: +2 }, outcome_pl: "Czekałeś 20 minut na mrozie, co skróciło twój czas na rozgrzewkę.", outcome_en: "You waited 20 mins in the cold, which shortened your warm-up time.", outcome_de: "Du hast 20 Minuten in der Kälte gewartet, was deine Aufwärmzeit verkürzt hat.", outcome_nl: "Je wachtte 20 minuten in de kou, wat je opwarmtijd verkortte." }
        ]
    },
    {
        title_pl: "Niestabilna Scena", title_en: "Wobbly Stage", title_de: "Wackelige Bühne", title_nl: "Wiebelig Podium",
        desc_pl: "Podłoga przy the oche wydaje się lekko uginać pod twoim ciężarem.", desc_en: "The floor at the oche seems to slightly dip under your weight.", desc_de: "Der Boden am Oche scheint unter deinem Gewicht leicht nachzugeben.", desc_nl: "De vloer bij de oche lijkt iets door te buigen onder je gewicht.",
        choices: [
            { text_pl: "Rzucam asymetrycznie, z ciężarem na jednej nodze.", text_en: "I throw asymmetrically, with weight on one leg.", text_de: "Ich werfe asymmetrisch, mit Gewicht auf einem Bein.", text_nl: "Ik gooi asymmetrisch, met gewicht op één been.", effect: { scoring: -2, doubles: -1 }, outcome_pl: "Zaburzony środek ciężkości mocno wpłynął na twoje skupienie.", outcome_en: "A disturbed center of gravity heavily impacted your focus.", outcome_de: "Ein gestörter Schwerpunkt hat deinen Fokus stark beeinträchtigt.", outcome_nl: "Een verstoord zwaartepunt had een zware impact op je focus." },
            { text_pl: "Zgłaszam to i żądam podłożenia klinów.", text_en: "I report it and demand wedges to be placed.", text_de: "Ich melde es und fordere, dass Keile untergelegt werden.", text_nl: "Ik meld het en eis dat er wiggen onder geplaatst worden.", effect: { prof: +2 }, outcome_pl: "Technicy szybko usztywnili podłogę. Warto być stanowczym.", outcome_en: "Technicians quickly stiffened the floor. It pays to be firm.", outcome_de: "Techniker haben den Boden schnell versteift. Es zahlt sich aus, bestimmt zu sein.", outcome_nl: "Technici hebben de vloer snel verstevigd. Het loont om kordaat te zijn." }
        ]
    },
    {
        title_pl: "Kawa na Koszuli", title_en: "Coffee on Shirt", title_de: "Kaffee auf dem Hemd", title_nl: "Koffie op Shirt",
        desc_pl: "Ktoś wpadł na ciebie na korytarzu i wylał kawę na twoją koszulkę meczową.", desc_en: "Someone bumped into you in the hallway and spilled coffee on your match shirt.", desc_de: "Jemand ist im Flur mit dir zusammengestoßen und hat Kaffee auf dein Spielhemd geschüttet.", desc_nl: "Iemand botste tegen je aan in de gang en morste koffie op je wedstrijdshirt.",
        choices: [
            { text_pl: "Wychodzę na scenę z wielką plamą.", text_en: "I go on stage with a huge stain.", text_de: "Ich gehe mit einem riesigen Fleck auf die Bühne.", text_nl: "Ik ga het podium op met een enorme vlek.", effect: { pop: +5, prof: -10 }, outcome_pl: "Wyglądasz nieprofesjonalnie, ale fani śmieją się z twojego wyluzowania.", outcome_en: "You look unprofessional, but fans laugh at your relaxed attitude.", outcome_de: "Du siehst unprofessionell aus, aber die Fans lachen über deine lockere Art.", outcome_nl: "Je ziet er onprofessioneel uit, maar fans lachen om je relaxte houding." },
            { text_pl: "Kupuję w biegu koszulkę w oficjalnym sklepiku.", text_en: "I quickly buy a shirt at the official merchandise shop.", text_de: "Ich kaufe schnell ein Hemd im offiziellen Fanshop.", text_nl: "Ik koop snel een shirt in de officiële merchandise winkel.", effect: { budget: -40, doubles: +1 }, outcome_pl: "Jesteś £40 w plecy, ale grasz w czystym ciuchu z dumą.", outcome_en: "You're £40 down, but you play in clean clothes with pride.", outcome_de: "Du bist £40 ärmer, aber spielst mit Stolz in sauberer Kleidung.", outcome_nl: "Je bent £40 armer, maar speelt met trots in schone kleding." }
        ]
    },
    {
        title_pl: "Wygadany Fryzjer", title_en: "Chatty Barber", title_de: "Geschwätziger Friseur", title_nl: "Kletsgrage Kapper",
        desc_pl: "Przed wyjazdem na turniej idziesz do fryzjera, który za dużo gada i strzyże cię krzywo.", desc_en: "Before leaving for the tournament, you go to a barber who talks too much and cuts your hair crookedly.", desc_de: "Vor der Abfahrt zum Turnier gehst du zu einem Friseur, der zu viel redet und dir die Haare schief schneidet.", desc_nl: "Voor je vertrek naar het toernooi ga je naar een kapper die te veel praat en je haar scheef knipt.",
        choices: [
            { text_pl: "Krzyczę, że zrujnował mi wizerunek!", text_en: "I shout that he ruined my image!", text_de: "Ich schreie, dass er mein Image ruiniert hat!", text_nl: "Ik schreeuw dat hij mijn imago heeft geruïneerd!", effect: { stamina: -5, pop: -5 }, outcome_pl: "Straciłeś nerwy przed ważnym weekendem.", outcome_en: "You lost your temper before an important weekend.", outcome_de: "Du hast vor einem wichtigen Wochenende die Nerven verloren.", outcome_nl: "Je verloor je geduld voor een belangrijk weekend." },
            { text_pl: "Proszę, by zgolił mnie maszynką na łyso.", text_en: "I ask him to shave my head bald with clippers.", text_de: "Ich bitte ihn, mir mit der Maschine eine Glatze zu rasieren.", text_nl: "Ik vraag hem om mijn hoofd kaal te scheren met een tondeuse.", effect: { pop: +15, prof: +2 }, outcome_pl: "Nowy, groźny wygląd! Fani nazywają cię teraz zabójcą na tarczy.", outcome_en: "A new, fierce look! Fans now call you the hitman at the board.", outcome_de: "Ein neuer, wilder Look! Die Fans nennen dich jetzt den Hitman am Board.", outcome_nl: "Een nieuwe, woeste look! Fans noemen je nu de huurmoordenaar aan het bord." }
        ]
    },
    {
        title_pl: "Burza z Ulewą", title_en: "Thunderstorm", title_de: "Gewittersturm", title_nl: "Onweersbui",
        desc_pl: "Potężna ulewa łapie cię w drodze z hotelu na halę. Taksówki nie jeżdżą.", desc_en: "A massive downpour catches you on your way from the hotel to the venue. Taxis aren't running.", desc_de: "Ein massiver Regenguss erwischt dich auf dem Weg vom Hotel zur Halle. Taxis fahren nicht.", desc_nl: "Een enorme stortbui overvalt je op weg van het hotel naar de locatie. Taxi's rijden niet.",
        choices: [
            { text_pl: "Biegnę w deszczu, by nie spóźnić się na mecz.", text_en: "I run in the rain so I'm not late for the match.", text_de: "Ich renne im Regen, um nicht zu spät zum Spiel zu kommen.", text_nl: "Ik ren in de regen zodat ik niet te laat ben voor de wedstrijd.", effect: { stamina: -15, scoring: -1 }, outcome_pl: "Jesteś przemoczony do suchej nitki i trzęsiesz się z zimna przy tarczy.", outcome_en: "You are soaked to the bone and shivering with cold at the board.", outcome_de: "Du bist bis auf die Knochen durchnässt und zitterst am Board vor Kälte.", outcome_nl: "Je bent tot op het bot doorweekt en rilt van de kou aan het bord." },
            { text_pl: "Kupuję parasol i kalosze od ulicznego sprzedawcy za £80.", text_en: "I buy an umbrella and rain boots from a street vendor for £80.", text_de: "Ich kaufe einen Regenschirm und Gummistiefel bei einem Straßenverkäufer für £80.", text_nl: "Ik koop een paraplu en regenlaarzen van een straatverkoper voor £80.", effect: { budget: -80, prof: +2 }, outcome_pl: "Przepłaciłeś, ale dotarłeś na miejsce suchy i gotowy do walki.", outcome_en: "You overpaid, but arrived dry and ready to fight.", outcome_de: "Du hast zu viel bezahlt, bist aber trocken und kampfbereit angekommen.", outcome_nl: "Je hebt te veel betaald, maar kwam droog en klaar om te vechten aan." }
        ]
    },
    {
        title_pl: "Zastrzyk z Witamin", title_en: "Vitamin Shot", title_de: "Vitaminspritze", title_nl: "Vitamineshot",
        desc_pl: "Kolega proponuje ci 'cudowny' zastrzyk witaminowy przed długim turniejem.", desc_en: "A colleague offers you a 'miracle' vitamin shot before a long tournament.", desc_de: "Ein Kollege bietet dir vor einem langen Turnier eine 'Wunder'-Vitaminspritze an.", desc_nl: "Een collega biedt je een 'wonder' vitamineshot aan voor een lang toernooi.",
        choices: [
            { text_pl: "Odmawiam, igły to nie moja bajka.", text_en: "I refuse, needles aren't my thing.", text_de: "Ich lehne ab, Nadeln sind nicht mein Ding.", text_nl: "Ik weiger, naalden zijn niets voor mij.", effect: { prof: +2 }, outcome_pl: "Polegasz na własnej sile. Zero zbędnego ryzyka.", outcome_en: "You rely on your own strength. Zero unnecessary risk.", outcome_de: "Du verlässt dich auf deine eigene Stärke. Null unnötiges Risiko.", outcome_nl: "Je vertrouwt op je eigen kracht. Nul onnodig risico." },
            { text_pl: "Dajcie mi to!", text_en: "Give it to me!", text_de: "Gebt es mir!", text_nl: "Geef het aan mij!", effect: { stamina: +25, doubles: -2 }, outcome_pl: "Czujesz się jak młody bóg, ale masz dziwne skurcze w dłoniach.", outcome_en: "You feel like a young god, but have weird cramps in your hands.", outcome_de: "Du fühlst dich wie ein junger Gott, hast aber seltsame Krämpfe in den Händen.", outcome_nl: "Je voelt je als een jonge god, maar hebt rare krampen in je handen." }
        ]
    },
    {
        title_pl: "Pijany Sędzia", title_en: "Drunk Referee", title_de: "Betrunkener Schiedsrichter", title_nl: "Dronken Scheidsrechter",
        desc_pl: "Caller w mniejszym turnieju wyraźnie bełkocze i myli wyniki.", desc_en: "The caller in a smaller tournament is slurring his words and messing up scores.", desc_de: "Der Caller bei einem kleineren Turnier lallt und bringt die Punkte durcheinander.", desc_nl: "De caller op een kleiner toernooi spreekt met dubbele tong en verknoeit de scores.",
        choices: [
            { text_pl: "Gram dalej i liczę sam w głowie.", text_en: "I play on and calculate in my head.", text_de: "Ich spiele weiter und rechne im Kopf mit.", text_nl: "Ik speel door en reken in mijn hoofd.", effect: { scoring: +1, stamina: -5 }, outcome_pl: "Mózg pracuje na pełnych obrotach, co trochę cię męczy.", outcome_en: "Your brain is working in overdrive, which tires you out a bit.", outcome_de: "Dein Gehirn arbeitet auf Hochtouren, was dich etwas ermüdet.", outcome_nl: "Je brein draait overuren, wat je een beetje vermoeit." },
            { text_pl: "Żądam zmiany sędziego natychmiast.", text_en: "I demand a referee change immediately.", text_de: "Ich fordere sofort einen Schiedsrichterwechsel.", text_nl: "Ik eis onmiddellijk een wisseling van scheidsrechter.", effect: { prof: +5, pop: +2 }, outcome_pl: "Zrobiłeś porządek. Wszyscy inni zawodnicy ci za to podziękowali.", outcome_en: "You sorted it out. All other players thanked you for it.", outcome_de: "Du hast für Ordnung gesorgt. Alle anderen Spieler haben dir dafür gedankt.", outcome_nl: "Je hebt het geregeld. Alle andere spelers bedankten je er stiekem voor." }
        ]
    },
    {
        title_pl: "Uparty Pająk", title_en: "Stubborn Spider", title_de: "Hartnäckige Spinne", title_nl: "Koppige Spin",
        desc_pl: "Podczas meczu ogromny pająk spaceruje dokładnie po sektorze podwójnej 20.", desc_en: "During the match, a huge spider walks right across the double 20 sector.", desc_de: "Während des Spiels läuft eine riesige Spinne genau über das Doppel-20-Feld.", desc_nl: "Tijdens de wedstrijd loopt een enorme spin recht over de double 20 sector.",
        choices: [
            { text_pl: "Biorę lotkę i strącam go!", text_en: "I take a dart and flick him off!", text_de: "Ich nehme einen Dart und schnippe sie weg!", text_nl: "Ik pak een pijl en tik hem eraf!", effect: { pop: +10, doubles: -2 }, outcome_pl: "Pająk uciekł, publika wiwatuje, ale twój pierwszy rzut był zmarnowany.", outcome_en: "The spider ran away, the crowd cheers, but your first throw was wasted.", outcome_de: "Die Spinne lief weg, die Menge jubelt, aber dein erster Wurf war verschwendet.", outcome_nl: "De spin rende weg, het publiek juicht, maar je eerste worp was verspild." },
            { text_pl: "Zmieniam ustawienie i kończę mecz na D18.", text_en: "I change my setup and finish the match on D18.", text_de: "Ich ändere mein Setup und beende das Spiel auf D18.", text_nl: "Ik verander mijn opzet en eindig de wedstrijd op D18.", effect: { prof: +2, scoring: +1 }, outcome_pl: "Inteligentne wyjście z sytuacji. Pająk został nietknięty.", outcome_en: "Smart way out. The spider remained untouched.", outcome_de: "Ein kluger Ausweg. Die Spinne blieb unversehrt.", outcome_nl: "Slimme uitweg. De spin bleef ongedeerd." }
        ]
    },
    {
        title_pl: "Rozładowany Telefon", title_en: "Dead Phone", title_de: "Leeres Handy", title_nl: "Lege Telefoon",
        desc_pl: "Twój telefon rozładował się, a nie pamiętasz o której godzinie zaczyna się twój mecz na pobocznej tarczy.", desc_en: "Your phone died and you don't remember what time your match starts on the side board.", desc_de: "Dein Handy ist leer und du weißt nicht mehr, um wie viel Uhr dein Spiel am Nebenboard beginnt.", desc_nl: "Je telefoon viel uit en je weet niet meer hoe laat je wedstrijd begint op het zijbord.",
        choices: [
            { text_pl: "Biegam w panice po całej hali i pytam ludzi.", text_en: "I run around the hall in panic asking people.", text_de: "Ich renne in Panik durch die Halle und frage Leute.", text_nl: "Ik ren in paniek door de hal en vraag mensen.", effect: { stamina: -15, form: -1 }, outcome_pl: "Znalazłeś swoją tarczę, ale jesteś zdyszany i spocony przed samym startem.", outcome_en: "You found your board, but you're out of breath and sweaty right before the start.", outcome_de: "Du hast dein Board gefunden, bist aber kurz vor dem Start außer Atem und verschwitzt.", outcome_nl: "Je vond je bord, maar je bent buiten adem en bezweet vlak voor de start." },
            { text_pl: "Idę spokojnie do punktu kontrolnego sędziów.", text_en: "I calmly walk to the referee's control desk.", text_de: "Ich gehe ruhig zum Kontrollschalter der Schiedsrichter.", text_nl: "Ik loop rustig naar de controlebalie van de scheidsrechter.", effect: { prof: +2 }, outcome_pl: "Szybko ci pomogli. Doszedłeś na czas bez zbędnego stresu.", outcome_en: "They helped you quickly. You arrived on time without unnecessary stress.", outcome_de: "Sie haben dir schnell geholfen. Du bist pünktlich ohne unnötigen Stress angekommen.", outcome_nl: "Ze hielpen je snel. Je kwam op tijd aan zonder onnodige stress." }
        ]
    },
    {
        title_pl: "Pomyłka Tożsamości", title_en: "Mistaken Identity", title_de: "Verwechslung", title_nl: "Verkeerde Identiteit",
        desc_pl: "Ochrona myli cię z kibicem i każe ci usiąść na trybunach.", desc_en: "Security mistakes you for a fan and tells you to sit in the stands.", desc_de: "Der Sicherheitsdienst verwechselt dich mit einem Fan und sagt dir, du sollst dich auf die Tribüne setzen.", desc_nl: "De beveiliging ziet je aan voor een fan en zegt dat je op de tribune moet gaan zitten.",
        choices: [
            { text_pl: "Pokazuję im moje własne lotki jako dowód!", text_en: "I show them my own darts as proof!", text_de: "Ich zeige ihnen meine eigenen Darts als Beweis!", text_nl: "Ik laat ze mijn eigen pijlen zien als bewijs!", effect: { pop: +5, prof: -2 }, outcome_pl: "Udało się wyjaśnić sprawę, ale trochę się przy tym ośmieszyłeś.", outcome_en: "You cleared it up, but embarrassed yourself a little.", outcome_de: "Du konntest es aufklären, hast dich dabei aber etwas blamiert.", outcome_nl: "Je hebt het opgehelderd, maar zette jezelf wel een beetje voor schut." },
            { text_pl: "Wołam organizatora, by ich zwolnił.", text_en: "I call the organizer to fire them.", text_de: "Ich rufe den Organisator, um sie zu feuern.", text_nl: "Ik roep de organisator om ze te ontslaan.", effect: { prof: -10, pop: -5 }, outcome_pl: "Zachowałeś się jak primadonna. Ludzie z obsługi nie pałają do ciebie sympatią.", outcome_en: "You acted like a prima donna. The staff holds a grudge against you.", outcome_de: "Du hast dich wie eine Primadonna verhalten. Das Personal hegt einen Groll gegen dich.", outcome_nl: "Je gedroeg je als een prima donna. Het personeel koestert wrok tegen je." }
        ]
    },
    {
        title_pl: "Kłótnia w Taksówce", title_en: "Taxi Argument", title_de: "Taxistreit", title_nl: "Taxiruzie",
        desc_pl: "Taksówkarz wiezie cię okrężną drogą na halę i żąda podwójnej stawki.", desc_en: "The cab driver takes you the long way to the venue and demands double the fare.", desc_de: "Der Taxifahrer fährt einen Umweg zur Halle und verlangt den doppelten Fahrpreis.", desc_nl: "De taxichauffeur neemt een omweg naar de hal en eist de dubbele ritprijs.",
        choices: [
            { text_pl: "Płacę i wychodzę. Szkoda nerwów.", text_en: "I pay and leave. Not worth the nerves.", text_de: "Ich zahle und gehe. Nicht die Nerven wert.", text_nl: "Ik betaal en vertrek. De zenuwen niet waard.", effect: { budget: -60, stamina: +5 }, outcome_pl: "Straciłeś dużo funtów, ale zachowałeś spokój umysłu.", outcome_en: "You lost a lot of pounds, but kept your peace of mind.", outcome_de: "Du hast viele Pfund verloren, aber deinen Seelenfrieden bewahrt.", outcome_nl: "Je bent veel ponden kwijt, maar behield je gemoedsrust." },
            { text_pl: "Wdaję się w potężną awanturę na ulicy!", text_en: "I get into a massive argument on the street!", text_de: "Ich lasse mich auf einen massiven Streit auf der Straße ein!", text_nl: "Ik beland in een enorme ruzie op straat!", effect: { stamina: -20, pop: +5 }, outcome_pl: "Nie dałeś się okraść, ale na scenę wchodzisz naładowany złą energią.", outcome_en: "You didn't get scammed, but you enter the stage charged with bad energy.", outcome_de: "Du wurdest nicht abgezockt, betrittst aber die Bühne voller schlechter Energie.", outcome_nl: "Je bent niet opgelicht, maar je stapt het podium op vol slechte energie." }
        ]
    },
    {
        title_pl: "Nowa Podprowadzająca", title_en: "New Walk-on Girl", title_de: "Neues Walk-on-Girl", title_nl: "Nieuwe Walk-on Girl",
        desc_pl: "Podczas wejścia na scenę, nowa dziewczyna puszcza do ciebie oczko.", desc_en: "While entering the stage, the new walk-on girl winks at you.", desc_de: "Beim Betreten der Bühne zwinkert dir das neue Walk-on-Girl zu.", desc_nl: "Terwijl je het podium oploopt, knipoogt de nieuwe walk-on girl naar je.",
        choices: [
            { text_pl: "Odwzajemniam uśmiech i gramy razem do kamery.", text_en: "I smile back and we play to the camera together.", text_de: "Ich lächle zurück und wir spielen zusammen für die Kamera.", text_nl: "Ik glimlach terug en we spelen samen voor de camera.", effect: { pop: +15, prof: -2 }, outcome_pl: "Internet wrze od plotek! Świetny PR, choć menedżer kręci nosem.", outcome_en: "The internet is boiling with rumors! Great PR, though your manager frowns.", outcome_de: "Das Internet kocht vor Gerüchten! Tolle PR, obwohl dein Manager die Stirn runzelt.", outcome_nl: "Het internet kookt van de geruchten! Geweldige PR, hoewel je manager fronst." },
            { text_pl: "Patrzę prosto w tarczę, mam tu robotę do wykonania.", text_en: "I look straight at the board, I have a job to do here.", text_de: "Ich schaue gerade aufs Board, ich habe hier einen Job zu erledigen.", text_nl: "Ik kijk recht naar het bord, ik heb hier een klus te klaren.", effect: { scoring: +2, prof: +5 }, outcome_pl: "Zero dystrakcji. Wyszedłeś jak zaprogramowana maszyna do wygrywania.", outcome_en: "Zero distraction. You walked out like a programmed winning machine.", outcome_de: "Null Ablenkung. Du bist wie eine programmierte Gewinnmaschine aufgetreten.", outcome_nl: "Nul afleiding. Je kwam op als een geprogrammeerde winmachine." }
        ]
    },
    {
        title_pl: "Charytatywny Mecz", title_en: "Charity Match", title_de: "Wohltätigkeitsspiel", title_nl: "Liefdadigheidswedstrijd",
        desc_pl: "Zostałeś poproszony o zagranie pokazowego meczu dla lokalnego szpitala w dniu wolnym.", desc_en: "You've been asked to play an exhibition match for a local hospital on your day off.", desc_de: "Du wurdest gebeten, an deinem freien Tag ein Schaukampf für ein örtliches Krankenhaus zu spielen.", desc_nl: "Je bent gevraagd om op je vrije dag een demonstratiewedstrijd te spelen voor een plaatselijk ziekenhuis.",
        choices: [
            { text_pl: "Oczywiście, to zaszczyt!", text_en: "Of course, it's an honor!", text_de: "Natürlich, das ist eine Ehre!", text_nl: "Natuurlijk, het is een eer!", effect: { pop: +25, stamina: -15 }, outcome_pl: "Pomogłeś zebrać mnóstwo pieniędzy. Jesteś ulubieńcem lokalnej prasy, choć straciłeś dzień na regenerację.", outcome_en: "You helped raise a lot of money. You're a local press favorite, though you lost a rest day.", outcome_de: "Du hast geholfen, viel Geld zu sammeln. Du bist der Liebling der lokalen Presse, obwohl du einen Ruhetag verloren hast.", outcome_nl: "Je hielp veel geld in te zamelen. Je bent de favoriet van de lokale pers, hoewel je een rustdag verloor." },
            { text_pl: "Przekazuję czek na £500, ale zostaję w łóżku.", text_en: "I donate a £500 cheque, but stay in bed.", text_de: "Ich spende einen £500-Scheck, bleibe aber im Bett.", text_nl: "Ik doneer een cheque van £500, maar blijf in bed.", effect: { budget: -500, prof: +5, stamina: +5 }, outcome_pl: "Pomogłeś finansowo, dbając o własne zdrowie. Mądry kompromis.", outcome_en: "You helped financially while taking care of your health. A smart compromise.", outcome_de: "Du hast finanziell geholfen und dich gleichzeitig um deine Gesundheit gekümmert. Ein kluger Kompromiss.", outcome_nl: "Je hielp financieel terwijl je voor je eigen gezondheid zorgde. Een slim compromis." }
        ]
    },
    {
        title_pl: "Brak Gorącej Wody", title_en: "No Hot Water", title_de: "Kein warmes Wasser", title_nl: "Geen Warm Water",
        desc_pl: "Rano w hotelu odkrywasz, że z kranu leci tylko lodowata woda.", desc_en: "In the morning at the hotel, you discover only freezing water comes from the tap.", desc_de: "Am Morgen stellst du im Hotel fest, dass nur eiskaltes Wasser aus dem Hahn kommt.", desc_nl: "In de ochtend ontdek je in het hotel dat er alleen ijskoud water uit de kraan komt.",
        choices: [
            { text_pl: "Biorę lodowaty prysznic jak twardziel!", text_en: "I take an ice-cold shower like a tough guy!", text_de: "Ich nehme eine eiskalte Dusche wie ein harter Kerl!", text_nl: "Ik neem een ijskoude douche als een stoere man!", effect: { stamina: +15, scoring: -1 }, outcome_pl: "Krew krąży szybciej, obudziłeś się w sekundę! Trzęsą ci się jednak trochę dłonie.", outcome_en: "Blood circulates faster, you woke up in a second! Your hands shake slightly, though.", outcome_de: "Das Blut zirkuliert schneller, du bist in einer Sekunde wach geworden! Allerdings zittern deine Hände etwas.", outcome_nl: "Bloed stroomt sneller, je was in een seconde wakker! Je handen trillen wel een beetje." },
            { text_pl: "Czekam, aż obsługa to naprawi.", text_en: "I wait for the staff to fix it.", text_de: "Ich warte, bis das Personal es repariert.", text_nl: "Ik wacht tot het personeel het oplost.", effect: { stamina: -5, doubles: +1 }, outcome_pl: "Naprawa trwała 2 godziny. Musisz się spieszyć, ale wykąpałeś się w cieple.", outcome_en: "The repair took 2 hours. You have to hurry, but you bathed in warmth.", outcome_de: "Die Reparatur dauerte 2 Stunden. Du musst dich beeilen, hast aber warm gebadet.", outcome_nl: "De reparatie duurde 2 uur. Je moet opschieten, maar je baadde in de warmte." }
        ]
    },
    {
        title_pl: "Złamane Piórko", title_en: "Broken Flight", title_de: "Gebrochener Flight", title_nl: "Gebroken Flight",
        desc_pl: "Lotka 'Robin Hood' kompletnie miażdży ci piórko podczas decydującego lega.", desc_en: "A 'Robin Hood' throw completely crushes your flight during a deciding leg.", desc_de: "Ein 'Robin Hood'-Wurf zerstört deinen Flight während eines entscheidenden Legs völlig.", desc_nl: "Een 'Robin Hood' worp verplettert je flight volledig tijdens een beslissende leg.",
        choices: [
            { text_pl: "Zmieniam je w 5 sekund na nowe.", text_en: "I change it to a new one in 5 seconds.", text_de: "Ich wechsle ihn in 5 Sekunden gegen einen neuen aus.", text_nl: "Ik wissel hem in 5 seconden voor een nieuwe.", effect: { prof: +5 }, outcome_pl: "Masz przy sobie zapas na każdą ewentualność. Profesjonalne zachowanie.", outcome_en: "You have spares for every eventuality on you. Professional behavior.", outcome_de: "Du hast für alle Fälle Ersatz dabei. Professionelles Verhalten.", outcome_nl: "Je hebt reserveonderdelen voor elke gebeurtenis bij je. Professioneel gedrag." },
            { text_pl: "Gram dalej pękniętym!", text_en: "I keep playing with the broken one!", text_de: "Ich spiele mit dem kaputten weiter!", text_nl: "Ik speel door met de kapotte!", effect: { doubles: -5, pop: +5 }, outcome_pl: "Lotka wpadła w piątkę z powodu złej aerodynamiki. Zaryzykowałeś i przegrałeś.", outcome_en: "The dart landed in the 5 due to bad aerodynamics. You took a risk and lost.", outcome_de: "Der Dart landete wegen schlechter Aerodynamik in der 5. Du bist ein Risiko eingegangen und hast verloren.", outcome_nl: "De pijl belandde in de 5 vanwege slechte aerodynamica. Je nam een risico en verloor." }
        ]
    },
    {
        title_pl: "Znaleziony Banknot", title_en: "Found Banknote", title_de: "Gefundener Geldschein", title_nl: "Gevonden Bankbiljet",
        desc_pl: "Podążając do pokoju graczy zauważasz na podłodze 100 funtów.", desc_en: "Walking to the players' lounge, you spot £100 on the floor.", desc_de: "Auf dem Weg in den Spielerbereich entdeckst du £100 auf dem Boden.", desc_nl: "Lopend naar de spelersruimte zie je £100 op de vloer liggen.",
        choices: [
            { text_pl: "Biorę dla siebie! Dzisiaj ja stawiam.", text_en: "I take it for myself! Drinks are on me today.", text_de: "Ich behalte es für mich! Die Getränke gehen heute auf mich.", text_nl: "Ik neem het zelf! Drankjes zijn vandaag van mij.", effect: { budget: 100, prof: -5 }, outcome_pl: "Jesteś £100 bogatszy, ale ktoś z obsługi mógł to zauważyć...", outcome_en: "You're £100 richer, but someone from the staff might have noticed...", outcome_de: "Du bist £100 reicher, aber jemand vom Personal könnte es bemerkt haben...", outcome_nl: "Je bent £100 rijker, maar iemand van het personeel heeft het misschien gemerkt..." },
            { text_pl: "Oddaję to na recepcję, ktoś może szukać.", text_en: "I hand it into reception, someone might be looking for it.", text_de: "Ich gebe es an der Rezeption ab, jemand sucht vielleicht danach.", text_nl: "Ik lever het in bij de receptie, iemand zoekt er misschien naar.", effect: { prof: +10, pop: +5 }, outcome_pl: "Okazało się, że to pieniądze starszej fanki. W ramach wdzięczności wszyscy ci kibicują!", outcome_en: "It turned out to be an elderly fan's money. In gratitude, everyone is cheering for you!", outcome_de: "Es stellte sich heraus, dass es das Geld eines älteren Fans war. Aus Dankbarkeit jubeln dir alle zu!", outcome_nl: "Het bleek het geld van een oudere fan te zijn. Uit dankbaarheid juicht iedereen voor je!" }
        ]
    }
];

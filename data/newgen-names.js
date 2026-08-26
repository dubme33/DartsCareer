// Imiona i nazwiska newgenów są grupowane kulturowo. Kraje mogą współdzielić
// profil tylko tam, gdzie personlia rzeczywiście mają zbliżoną formę.
const NEWGEN_NAME_PROFILES = Object.freeze({
    english: {
        male: ['Oliver', 'Jack', 'Harry', 'George', 'Charlie', 'Thomas', 'William', 'James', 'Henry', 'Freddie', 'Oscar', 'Arthur', 'Daniel', 'Callum', 'Lewis', 'Nathan', 'Bradley', 'Connor'],
        female: ['Olivia', 'Amelia', 'Isla', 'Ava', 'Emily', 'Sophie', 'Grace', 'Jessica', 'Charlotte', 'Ella', 'Lucy', 'Hannah', 'Chloe', 'Megan'],
        last: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright', 'Thompson', 'Evans', 'Walker', 'White', 'Edwards', 'Hughes', 'Green', 'Hall', 'Clarke', 'Baker', 'Harris', 'Cooper', 'Morgan', 'King']
    },
    scottish: {
        male: ['Callum', 'Ewan', 'Alasdair', 'Fraser', 'Finlay', 'Hamish', 'Ruairidh', 'Craig', 'Duncan', 'Graeme', 'Ross', 'Scott', 'Iain', 'Lewis'],
        female: ['Isla', 'Eilidh', 'Mairi', 'Ailsa', 'Fiona', 'Kirsty', 'Shona', 'Catriona', 'Morag', 'Iona', 'Heather', 'Erin'],
        last: ['MacDonald', 'Campbell', 'Stewart', 'Fraser', 'Murray', 'Robertson', 'Kerr', 'McLean', 'Sinclair', 'Douglas', 'Ferguson', 'Gordon', 'Hamilton', 'Scott', 'Ross', 'Buchanan', 'Morrison', 'Grant', 'McGregor', 'Wallace']
    },
    welsh: {
        male: ['Rhys', 'Owain', 'Gareth', 'Geraint', 'Iwan', 'Dylan', 'Elis', 'Aled', 'Carwyn', 'Emyr', 'Gruffydd', 'Huw', 'Ieuan', 'Osian'],
        female: ['Carys', 'Nia', 'Ffion', 'Lowri', 'Eleri', 'Seren', 'Megan', 'Rhiannon', 'Bethan', 'Gwen', 'Anwen', 'Catrin'],
        last: ['Jones', 'Williams', 'Davies', 'Evans', 'Thomas', 'Roberts', 'Lewis', 'Hughes', 'Morgan', 'Griffiths', 'Lloyd', 'Owen', 'Price', 'Powell', 'Rees', 'Jenkins', 'Watkins', 'Vaughan']
    },
    irish: {
        male: ['Cian', 'Oisín', 'Darragh', 'Seán', 'Conor', 'Ronan', 'Eoin', 'Fionn', 'Niall', 'Ciarán', 'Declan', 'Padraig', 'Aidan', 'Colm'],
        female: ['Aoife', 'Saoirse', 'Niamh', 'Caoimhe', 'Orla', 'Róisín', 'Ciara', 'Aisling', 'Maeve', 'Siobhán', 'Clodagh', 'Gráinne'],
        last: ['Murphy', 'Kelly', "O'Sullivan", 'Walsh', 'Byrne', 'Ryan', "O'Connor", "O'Neill", 'McCarthy', 'Doyle', 'Gallagher', 'Doherty', 'Kennedy', 'Lynch', 'Murray', 'Quinn', 'Reilly', 'Brennan']
    },
    german: {
        male: ['Lukas', 'Leon', 'Felix', 'Jonas', 'Finn', 'Noah', 'Paul', 'Elias', 'Moritz', 'Maximilian', 'Julian', 'Tobias', 'Florian', 'Niklas', 'Sebastian', 'Matthias'],
        female: ['Lea', 'Lena', 'Emma', 'Mia', 'Hannah', 'Anna', 'Clara', 'Sophie', 'Laura', 'Johanna', 'Katharina', 'Franziska'],
        last: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann']
    },
    dutch: {
        male: ['Daan', 'Sem', 'Luuk', 'Bram', 'Thijs', 'Jesse', 'Niels', 'Jeroen', 'Sven', 'Koen', 'Wouter', 'Ruben', 'Pim', 'Joost'],
        female: ['Sanne', 'Lotte', 'Femke', 'Eline', 'Sophie', 'Anouk', 'Merel', 'Noa', 'Iris', 'Fleur', 'Maud', 'Roos'],
        last: ['de Jong', 'Jansen', 'de Vries', 'van Dijk', 'Bakker', 'Visser', 'Smit', 'Meijer', 'de Boer', 'Mulder', 'de Groot', 'Bos', 'Vos', 'Peters', 'Hendriks', 'Dekker', 'van Leeuwen', 'Kuiper']
    },
    belgian: {
        male: ['Bram', 'Wout', 'Jeroen', 'Thibaut', 'Mathias', 'Dries', 'Niels', 'Jelle', 'Seppe', 'Pieter', 'Lars', 'Quinten', 'Louis', 'Maxime'],
        female: ['Lotte', 'Fien', 'Lore', 'Anke', 'Elke', 'Julie', 'Manon', 'Amélie', 'Louise', 'Charlotte', 'Hanne', 'Eline'],
        last: ['Peeters', 'Janssens', 'Maes', 'Willems', 'Claes', 'Goossens', 'Wouters', 'De Smet', 'Vermeulen', 'Jacobs', 'Mertens', 'Lambert', 'Dubois', 'Leclercq', 'Simon', 'Laurent', 'Renard', 'François']
    },
    polish: {
        male: ['Jakub', 'Kacper', 'Jan', 'Antoni', 'Szymon', 'Filip', 'Mikołaj', 'Piotr', 'Mateusz', 'Bartosz', 'Michał', 'Patryk', 'Dawid', 'Łukasz', 'Maciej', 'Tomasz'],
        female: ['Julia', 'Zuzanna', 'Zofia', 'Hanna', 'Maja', 'Lena', 'Alicja', 'Amelia', 'Oliwia', 'Natalia', 'Aleksandra', 'Karolina', 'Katarzyna', 'Magdalena'],
        last: ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski', 'Mazur', 'Wojciechowski', 'Kwiatkowski', 'Krawczyk', 'Kaczmarek'],
        femaleLast: ['Nowak', 'Kowalska', 'Wiśniewska', 'Wójcik', 'Kowalczyk', 'Kamińska', 'Lewandowska', 'Zielińska', 'Szymańska', 'Woźniak', 'Dąbrowska', 'Kozłowska', 'Jankowska', 'Mazur', 'Wojciechowska', 'Kwiatkowska', 'Krawczyk', 'Kaczmarek']
    },
    swedish: {
        male: ['Liam', 'Noah', 'Hugo', 'William', 'Elias', 'Nils', 'Viktor', 'Oskar', 'Emil', 'Albin', 'Gustav', 'Linus', 'Jesper', 'Axel'],
        female: ['Astrid', 'Maja', 'Elsa', 'Alma', 'Freja', 'Ebba', 'Wilma', 'Linnea', 'Elin', 'Ida', 'Sanna', 'Agnes'],
        last: ['Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson', 'Gustafsson', 'Pettersson', 'Jonsson', 'Jansson', 'Hansson', 'Bengtsson', 'Lindberg']
    },
    danish: {
        male: ['William', 'Oscar', 'Noah', 'Emil', 'Magnus', 'Mikkel', 'Frederik', 'Rasmus', 'Kasper', 'Søren', 'Mathias', 'Anders', 'Jesper', 'Lasse'],
        female: ['Alma', 'Clara', 'Freja', 'Ida', 'Sofie', 'Maja', 'Laura', 'Camilla', 'Julie', 'Line', 'Nanna', 'Katrine'],
        last: ['Jensen', 'Nielsen', 'Hansen', 'Pedersen', 'Andersen', 'Christensen', 'Larsen', 'Sørensen', 'Rasmussen', 'Jørgensen', 'Petersen', 'Madsen', 'Kristensen', 'Olsen', 'Thomsen', 'Poulsen']
    },
    norwegian: {
        male: ['Jakob', 'Emil', 'Noah', 'Oliver', 'Isak', 'Magnus', 'Sander', 'Henrik', 'Kristian', 'Marius', 'Eirik', 'Bjørn', 'Lars', 'Anders'],
        female: ['Nora', 'Emma', 'Ingrid', 'Sofie', 'Maja', 'Thea', 'Frida', 'Linnea', 'Hedda', 'Astrid', 'Solveig', 'Marte'],
        last: ['Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen', 'Pedersen', 'Nilsen', 'Kristiansen', 'Jensen', 'Karlsen', 'Johnsen', 'Pettersen', 'Eriksen', 'Berg', 'Haugen', 'Moen']
    },
    finnish: {
        male: ['Elias', 'Eino', 'Onni', 'Väinö', 'Aleksi', 'Mikko', 'Jari', 'Juha', 'Antti', 'Teemu', 'Sami', 'Ville', 'Lauri', 'Oskari'],
        female: ['Aino', 'Sofia', 'Emilia', 'Venla', 'Helmi', 'Ella', 'Laura', 'Sanna', 'Riikka', 'Johanna', 'Kaisa', 'Anni'],
        last: ['Korhonen', 'Virtanen', 'Mäkinen', 'Nieminen', 'Mäkelä', 'Hämäläinen', 'Laine', 'Heikkinen', 'Koskinen', 'Järvinen', 'Lehtonen', 'Lehtinen', 'Saarinen', 'Salminen', 'Heinonen', 'Toivonen']
    },
    czech: {
        male: ['Jakub', 'Jan', 'Tomáš', 'Matěj', 'Adam', 'Ondřej', 'Lukáš', 'David', 'Martin', 'Petr', 'Michal', 'Vojtěch', 'Filip', 'Jiří'],
        female: ['Eliška', 'Tereza', 'Anna', 'Adéla', 'Karolína', 'Lucie', 'Kateřina', 'Barbora', 'Veronika', 'Klára', 'Nikola', 'Petra'],
        last: ['Novák', 'Svoboda', 'Novotný', 'Dvořák', 'Černý', 'Procházka', 'Kučera', 'Veselý', 'Horák', 'Němec', 'Pokorný', 'Marek', 'Král', 'Růžička', 'Beneš', 'Fiala'],
        femaleLast: ['Nováková', 'Svobodová', 'Novotná', 'Dvořáková', 'Černá', 'Procházková', 'Kučerová', 'Veselá', 'Horáková', 'Němcová', 'Pokorná', 'Marková', 'Králová', 'Růžičková', 'Benešová', 'Fialová']
    },
    slovak: {
        male: ['Jakub', 'Samuel', 'Adam', 'Michal', 'Martin', 'Tomáš', 'Lukáš', 'Matej', 'Filip', 'Peter', 'Patrik', 'Dominik', 'Andrej', 'Marek'],
        female: ['Sofia', 'Ema', 'Nina', 'Viktória', 'Natália', 'Lucia', 'Katarína', 'Zuzana', 'Michaela', 'Veronika', 'Barbora', 'Petra'],
        last: ['Horváth', 'Kováč', 'Varga', 'Tóth', 'Nagy', 'Baláž', 'Molnár', 'Szabó', 'Novák', 'Kováčik', 'Hudák', 'Polák', 'Bartoš', 'Kollár', 'Urban', 'Šimko'],
        femaleLast: ['Horváthová', 'Kováčová', 'Vargová', 'Tóthová', 'Nagyová', 'Balážová', 'Molnárová', 'Szabóová', 'Nováková', 'Kováčiková', 'Hudáková', 'Poláková', 'Bartošová', 'Kollárová', 'Urbanová', 'Šimková']
    },
    hungarian: {
        male: ['Bence', 'Máté', 'Levente', 'Dávid', 'Ádám', 'Balázs', 'Gergő', 'Zoltán', 'Tamás', 'Péter', 'Attila', 'Márton', 'Norbert', 'László'],
        female: ['Hanna', 'Anna', 'Luca', 'Zsófia', 'Réka', 'Eszter', 'Boglárka', 'Viktória', 'Dóra', 'Kata', 'Noémi', 'Judit'],
        last: ['Nagy', 'Kovács', 'Tóth', 'Szabó', 'Horváth', 'Varga', 'Kiss', 'Molnár', 'Németh', 'Farkas', 'Balogh', 'Papp', 'Lakatos', 'Takács', 'Juhász', 'Mészáros']
    },
    french: {
        male: ['Gabriel', 'Léo', 'Louis', 'Jules', 'Arthur', 'Hugo', 'Lucas', 'Nathan', 'Théo', 'Maxime', 'Antoine', 'Julien', 'Nicolas', 'Baptiste'],
        female: ['Emma', 'Louise', 'Jade', 'Alice', 'Chloé', 'Léa', 'Manon', 'Camille', 'Juliette', 'Élodie', 'Clara', 'Amélie'],
        last: ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel']
    },
    spanish: {
        male: ['Hugo', 'Martín', 'Lucas', 'Mateo', 'Leo', 'Daniel', 'Alejandro', 'Pablo', 'Álvaro', 'Adrián', 'Javier', 'Sergio', 'Carlos', 'Raúl'],
        female: ['Lucía', 'Sofía', 'Martina', 'María', 'Julia', 'Paula', 'Valeria', 'Daniela', 'Alba', 'Carmen', 'Elena', 'Irene'],
        last: ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Muñoz', 'Álvarez', 'Romero']
    },
    portuguese: {
        male: ['João', 'Francisco', 'Afonso', 'Duarte', 'Tomás', 'Miguel', 'Gonçalo', 'Tiago', 'Diogo', 'Rui', 'André', 'Pedro', 'Bruno', 'Ricardo'],
        female: ['Maria', 'Leonor', 'Matilde', 'Beatriz', 'Carolina', 'Mariana', 'Inês', 'Margarida', 'Ana', 'Sofia', 'Rita', 'Catarina'],
        last: ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Jesus', 'Sousa', 'Fernandes', 'Gonçalves', 'Gomes', 'Lopes', 'Marques', 'Alves', 'Almeida', 'Ribeiro']
    },
    italian: {
        male: ['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Mattia', 'Andrea', 'Gabriele', 'Matteo', 'Tommaso', 'Davide', 'Marco', 'Luca', 'Simone', 'Federico'],
        female: ['Sofia', 'Giulia', 'Aurora', 'Alice', 'Ginevra', 'Emma', 'Giorgia', 'Martina', 'Chiara', 'Francesca', 'Elisa', 'Valentina'],
        last: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Costa', 'Giordano', 'Mancini', 'Lombardi']
    },
    southSlavic: {
        male: ['Luka', 'Ivan', 'Marko', 'Nikola', 'Filip', 'Matej', 'Josip', 'Petar', 'Milan', 'Stefan', 'Andrej', 'Damir', 'Bojan', 'Dario'],
        female: ['Ana', 'Mia', 'Lana', 'Sara', 'Petra', 'Ivana', 'Marija', 'Nina', 'Jelena', 'Katarina', 'Lucija', 'Tea'],
        last: ['Horvat', 'Kovačević', 'Babić', 'Marić', 'Jurić', 'Novak', 'Kovačić', 'Petrović', 'Nikolić', 'Jovanović', 'Marković', 'Pavlović', 'Popović', 'Ilić', 'Stojanović', 'Đorđević']
    },
    greek: {
        male: ['Giorgos', 'Dimitris', 'Nikos', 'Kostas', 'Giannis', 'Andreas', 'Christos', 'Vasilis', 'Panagiotis', 'Michalis', 'Stavros', 'Alexandros'],
        female: ['Maria', 'Eleni', 'Katerina', 'Sofia', 'Dimitra', 'Georgia', 'Christina', 'Anastasia', 'Vasiliki', 'Ioanna', 'Niki', 'Despina'],
        last: ['Papadopoulos', 'Nikolaidis', 'Georgiou', 'Dimitriou', 'Pappas', 'Vasileiou', 'Christodoulou', 'Oikonomou', 'Karagiannis', 'Konstantinou', 'Ioannidis', 'Antoniou', 'Makris', 'Alexiou']
    },
    latvian: {
        male: ['Jānis', 'Mārtiņš', 'Kārlis', 'Kristaps', 'Artūrs', 'Rihards', 'Roberts', 'Edgars', 'Kaspars', 'Andris', 'Māris', 'Raimonds'],
        female: ['Anna', 'Laura', 'Elīna', 'Līga', 'Ieva', 'Anete', 'Marta', 'Kristīne', 'Dace', 'Ilze', 'Liene', 'Zane'],
        last: ['Bērziņš', 'Kalniņš', 'Ozoliņš', 'Jansons', 'Liepiņš', 'Krūmiņš', 'Balodis', 'Zariņš', 'Eglītis', 'Vītols', 'Kļaviņš', 'Siliņš', 'Grīnbergs', 'Lapiņš']
    },
    lithuanian: {
        male: ['Tomas', 'Mantas', 'Lukas', 'Dominykas', 'Rokas', 'Dovydas', 'Paulius', 'Mindaugas', 'Andrius', 'Vytautas', 'Giedrius', 'Saulius'],
        female: ['Gabija', 'Austėja', 'Greta', 'Ieva', 'Emilija', 'Ugnė', 'Viktorija', 'Eglė', 'Rūta', 'Monika', 'Agnė', 'Gintarė'],
        last: ['Kazlauskas', 'Petrauskas', 'Jankauskas', 'Stankevičius', 'Vasiliauskas', 'Žukauskas', 'Butkus', 'Paulauskas', 'Urbonas', 'Kavaliauskas', 'Navickas', 'Bieliauskas', 'Šimkus', 'Mikalauskas']
    },
    estonian: {
        male: ['Rasmus', 'Markus', 'Tarmo', 'Andres', 'Erik', 'Kaspar', 'Kristjan', 'Martin', 'Marten', 'Jaan', 'Siim', 'Toomas'],
        female: ['Katrin', 'Liis', 'Maarja', 'Kristiina', 'Kadi', 'Laura', 'Anu', 'Kadri', 'Piret', 'Grete', 'Triin', 'Eliis'],
        last: ['Tamm', 'Saar', 'Sepp', 'Kask', 'Kukk', 'Ilves', 'Pärn', 'Mägi', 'Koppel', 'Oja', 'Rebane', 'Raudsepp', 'Kuusik', 'Lepp']
    },
    ukrainian: {
        male: ['Oleksandr', 'Maksym', 'Dmytro', 'Andrii', 'Artem', 'Bohdan', 'Mykola', 'Taras', 'Vladyslav', 'Yurii', 'Roman', 'Serhii'],
        female: ['Sofiia', 'Anna', 'Viktoriia', 'Anastasiia', 'Kateryna', 'Olena', 'Iryna', 'Yuliia', 'Oksana', 'Nataliia', 'Mariia', 'Tetiana'],
        last: ['Shevchenko', 'Kovalenko', 'Bondarenko', 'Tkachenko', 'Kovalchuk', 'Kravchenko', 'Oliinyk', 'Polishchuk', 'Lysenko', 'Melnyk', 'Savchenko', 'Boyko', 'Marchenko', 'Rudenko']
    },
    japanese: {
        male: ['Haruto', 'Yuto', 'Sota', 'Ren', 'Kaito', 'Daiki', 'Takumi', 'Ryota', 'Kenta', 'Yuki', 'Naoki', 'Shota'],
        female: ['Yui', 'Aoi', 'Hina', 'Sakura', 'Mio', 'Akari', 'Rin', 'Nanami', 'Ayaka', 'Haruka', 'Yuna', 'Riko'],
        last: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Matsumoto', 'Inoue']
    },
    filipino: {
        male: ['Angelo', 'Joshua', 'Mark', 'Paolo', 'Miguel', 'Carlo', 'Jerome', 'Christian', 'John Paul', 'Rafael', 'Nico', 'Gabriel'],
        female: ['Angela', 'Maria', 'Angelica', 'Jasmine', 'Camille', 'Patricia', 'Bianca', 'Mikaela', 'Samantha', 'Clarisse', 'Nicole', 'Bea'],
        last: ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Mendoza', 'Torres', 'Flores', 'Villanueva', 'Ramos', 'Castillo', 'Navarro', 'Aquino', 'Castro', 'Rivera', 'Del Rosario']
    },
    chinese: {
        male: ['Wei', 'Jun', 'Hao', 'Ming', 'Jie', 'Tao', 'Bo', 'Peng', 'Lei', 'Qiang', 'Yong', 'Chen'],
        female: ['Mei', 'Li', 'Xiu', 'Fang', 'Yan', 'Jing', 'Lan', 'Ying', 'Na', 'Min', 'Hui', 'Qian'],
        last: ['Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou', 'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo']
    },
    hongKong: {
        male: ['Ka Ho', 'Chi Wai', 'Man Ho', 'Wai Kit', 'Chun Hei', 'Tsz Ho', 'Ho Yin', 'Kin Pong', 'Pak Hei', 'Lok Man', 'Wing Hong', 'Yat Long'],
        female: ['Ka Yan', 'Wing Yan', 'Tsz Ying', 'Hoi Lam', 'Man Yee', 'Sze Wing', 'Ching Yi', 'Pui Shan', 'Lok Yi', 'Yan Tung', 'Ka Man', 'Wai Ling'],
        last: ['Chan', 'Cheung', 'Lee', 'Wong', 'Ho', 'Leung', 'Lam', 'Lau', 'Yeung', 'Cheng', 'Ng', 'Kwok', 'Tang', 'Yip', 'Chow', 'Lo']
    },
    indian: {
        male: ['Arjun', 'Aarav', 'Rohan', 'Vikram', 'Rahul', 'Karan', 'Aditya', 'Nikhil', 'Sanjay', 'Dev', 'Ravi', 'Manish'],
        female: ['Aanya', 'Anika', 'Diya', 'Isha', 'Kavya', 'Meera', 'Priya', 'Riya', 'Saanvi', 'Neha', 'Pooja', 'Nisha'],
        last: ['Sharma', 'Verma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Mehta', 'Joshi', 'Malhotra', 'Kapoor', 'Reddy', 'Nair', 'Iyer', 'Chopra', 'Desai', 'Bose']
    },
    southAfrican: {
        male: ['Liam', 'Ethan', 'Daniel', 'Jason', 'Ruan', 'Jaco', 'Pieter', 'Johan', 'Thabo', 'Siyabonga', 'Kagiso', 'Lwazi'],
        female: ['Emma', 'Leah', 'Mia', 'Anika', 'Marli', 'Nadine', 'Naledi', 'Lerato', 'Zanele', 'Thandi', 'Amahle', 'Ayanda'],
        last: ['van der Merwe', 'Botha', 'Pretorius', 'Coetzee', 'Nel', 'Jacobs', 'Williams', 'Mokoena', 'Dlamini', 'Ndlovu', 'Khumalo', 'Molefe', 'Naidoo', 'Pillay', 'Daniels', 'Adams']
    },
    icelandic: {
        male: ['Jón', 'Aron', 'Viktor', 'Emil', 'Magnús', 'Einar', 'Bjarni', 'Kristján', 'Gunnar', 'Ólafur', 'Sigurður', 'Haukur'],
        female: ['Anna', 'Emilía', 'Sara', 'Katrín', 'Elín', 'Sigríður', 'Guðrún', 'Helga', 'Lilja', 'Hildur', 'Ásta', 'Ragnheiður'],
        last: ['Jónsson', 'Sigurðsson', 'Guðmundsson', 'Einarsson', 'Kristjánsson', 'Magnússon', 'Ólafsson', 'Gunnarsson', 'Björnsson', 'Árnason', 'Stefánsson', 'Pálsson'],
        femaleLast: ['Jónsdóttir', 'Sigurðardóttir', 'Guðmundsdóttir', 'Einarsdóttir', 'Kristjánsdóttir', 'Magnúsdóttir', 'Ólafsdóttir', 'Gunnarsdóttir', 'Björnsdóttir', 'Árnadóttir', 'Stefánsdóttir', 'Pálsdóttir']
    }
});

// Wagi odzwierciedlają wielkość sceny darterskiej, a nie liczbę państw na
// świecie. Mikropaństwa bez rozpoznawalnego zaplecza nie są losowane z taką
// samą częstotliwością jak duże rynki. Łączny udział krajów z wagą <= 3 jest
// celowo marginalny.
const NEWGEN_COUNTRY_DISTRIBUTION = Object.freeze([
    { country: 'Anglia', weight: 260, profile: 'english' },
    { country: 'Niemcy', weight: 115, profile: 'german' },
    { country: 'Holandia', weight: 105, profile: 'dutch' },
    { country: 'Szkocja', weight: 75, profile: 'scottish' },
    { country: 'Walia', weight: 55, profile: 'welsh' },
    { country: 'Irlandia', weight: 45, profile: 'irish' },
    { country: 'Irlandia Północna', weight: 40, profile: 'irish' },
    { country: 'Polska', weight: 40, profile: 'polish' },
    { country: 'Belgia', weight: 30, profile: 'belgian' },
    { country: 'Australia', weight: 28, profile: 'english' },
    { country: 'USA', weight: 24, profile: 'english' },
    { country: 'Austria', weight: 18, profile: 'german' },
    { country: 'Kanada', weight: 15, profile: 'english' },
    { country: 'Szwecja', weight: 14, profile: 'swedish' },
    { country: 'Dania', weight: 12, profile: 'danish' },
    { country: 'Finlandia', weight: 12, profile: 'finnish' },
    { country: 'Czechy', weight: 12, profile: 'czech' },
    { country: 'Norwegia', weight: 11, profile: 'norwegian' },
    { country: 'Słowacja', weight: 8, profile: 'slovak' },
    { country: 'Hiszpania', weight: 8, profile: 'spanish' },
    { country: 'Nowa Zelandia', weight: 8, profile: 'english' },
    { country: 'Francja', weight: 8, profile: 'french' },
    { country: 'Węgry', weight: 7, profile: 'hungarian' },
    { country: 'Portugalia', weight: 7, profile: 'portuguese' },
    { country: 'Chorwacja', weight: 6, profile: 'southSlavic' },
    { country: 'Włochy', weight: 6, profile: 'italian' },
    { country: 'RPA', weight: 5, profile: 'southAfrican' },
    { country: 'Szwajcaria', weight: 5, profile: 'german' },
    { country: 'Słowenia', weight: 4, profile: 'southSlavic' },
    { country: 'Serbia', weight: 4, profile: 'southSlavic' },
    { country: 'Łotwa', weight: 4, profile: 'latvian' },
    { country: 'Litwa', weight: 4, profile: 'lithuanian' },
    { country: 'Ukraina', weight: 4, profile: 'ukrainian' },
    { country: 'Estonia', weight: 3, profile: 'estonian' },
    { country: 'Grecja', weight: 3, profile: 'greek' },
    { country: 'Japonia', weight: 3, profile: 'japanese' },
    { country: 'Filipiny', weight: 3, profile: 'filipino' },
    { country: 'Brazylia', weight: 2, profile: 'portuguese' },
    { country: 'Chiny', weight: 2, profile: 'chinese' },
    { country: 'Hongkong', weight: 2, profile: 'hongKong' },
    { country: 'Indie', weight: 2, profile: 'indian' },
    { country: 'Islandia', weight: 1, profile: 'icelandic' }
]);

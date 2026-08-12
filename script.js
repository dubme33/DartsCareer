// --- SŁOWNIK JĘZYKÓW ---
const translations = {
    pl: {
        createTitle: "Stwórz swojego zawodnika",
        lblFirstname: "Imię:",
        lblLastname: "Nazwisko:",
        lblAge: "Wiek:",
        lblNationality: "Narodowość:",
        lblPotential: "Potencjał (wpływa na początkowy OVR):",
        optWeak: "Słaby",
        optMedium: "Średni",
        optGood: "Dobry",
        optVerygood: "Bardzo dobry",
        optGoat: "GOAT",
        lblPhoto: "Link do zdjęcia (URL):",
        btnCreate: "Rozpocznij Karierę"
    },
    en: {
        createTitle: "Create your player",
        lblFirstname: "First Name:",
        lblLastname: "Last Name:",
        lblAge: "Age:",
        lblNationality: "Nationality:",
        lblPotential: "Potential (affects starting OVR):",
        optWeak: "Weak",
        optMedium: "Medium",
        optGood: "Good",
        optVerygood: "Very Good",
        optGoat: "GOAT",
        lblPhoto: "Photo URL:",
        btnCreate: "Start Career"
    },
    de: {
        createTitle: "Erstelle deinen Spieler",
        lblFirstname: "Vorname:",
        lblLastname: "Nachname:",
        lblAge: "Alter:",
        lblNationality: "Nationalität:",
        lblPotential: "Potenzial (beeinflusst Start-OVR):",
        optWeak: "Schwach",
        optMedium: "Mittel",
        optGood: "Gut",
        optVerygood: "Sehr gut",
        optGoat: "GOAT",
        lblPhoto: "Foto-URL:",
        btnCreate: "Karriere starten"
    },
    nl: {
        createTitle: "Maak je speler",
        lblFirstname: "Voornaam:",
        lblLastname: "Achternaam:",
        lblAge: "Leeftijd:",
        lblNationality: "Nationaliteit:",
        lblPotential: "Potentieel (beïnvloedt start OVR):",
        optWeak: "Zwak",
        optMedium: "Gemiddeld",
        optGood: "Goed",
        optVerygood: "Erg goed",
        optGoat: "GOAT",
        lblPhoto: "Foto URL:",
        btnCreate: "Start Carrière"
    }
};

// Funkcja zmieniająca język w interfejsie
function changeLanguage(lang) {
    const t = translations[lang];
    document.getElementById('create-title').innerText = t.createTitle;
    document.getElementById('label-firstname').innerText = t.lblFirstname;
    document.getElementById('label-lastname').innerText = t.lblLastname;
    document.getElementById('label-age').innerText = t.lblAge;
    document.getElementById('label-nationality').innerText = t.lblNationality;
    document.getElementById('label-potential').innerText = t.lblPotential;
    
    document.getElementById('opt-weak').innerText = t.optWeak;
    document.getElementById('opt-medium').innerText = t.optMedium;
    document.getElementById('opt-good').innerText = t.optGood;
    document.getElementById('opt-verygood').innerText = t.optVerygood;
    document.getElementById('opt-goat').innerText = t.optGoat;
    
    document.getElementById('label-photo').innerText = t.lblPhoto;
    document.getElementById('btn-create').innerText = t.btnCreate;
}

// --- GENEROWANIE LISTY PAŃSTW ---
// Lista zawiera większość państw dla demonstracji (można rozszerzać w razie potrzeby)
const countries = [
    "Polska", "Anglia", "Holandia", "Niemcy", "Szkocja", "Walia", "Irlandia", "Irlandia Północna",
    "Belgia", "Austria", "Australia", "USA", "Kanada", "Japonia", "Hiszpania", "Włochy", "Francja",
    "Chiny", "RPA", "Brazylia", "Szwecja", "Dania", "Norwegia", "Finlandia", "Czechy", "Słowacja",
    "Chorwacja", "Węgry", "Portugalia", "Grecja", "Argentyna", "Meksyk" // dodałem najpopularniejsze darterowo + inne
];

function populateCountries() {
    const select = document.getElementById('nationality');
    // Sortowanie alfabetyczne
    countries.sort().forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.innerText = country;
        // Domyślnie wybrana Anglia jako kolebka darta
        if (country === "Anglia") option.selected = true;
        select.appendChild(option);
    });
}

// --- OBSŁUGA FORMULARZA ---
// Zmienna, w której będziemy trzymać dane naszego zawodnika
let player = {};

document.getElementById('create-player-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Zapobiega przeładowaniu strony
    
    player = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        age: parseInt(document.getElementById('age').value),
        nationality: document.getElementById('nationality').value,
        potential: document.getElementById('potential').value,
        photoUrl: document.getElementById('photoUrl').value || 'default_avatar.png',
        overall: calculateStartingOVR(document.getElementById('potential').value)
    };

    console.log("Stworzono zawodnika:", player);
    alert(`Witaj w Darts Road to Glory, ${player.firstName} ${player.lastName}! Twój OVR: ${player.overall}`);
    
    // Tutaj w kolejnym etapie dodamy kod, który ukryje ten ekran i pokaże menu główne
});

// Prosta funkcja wyliczająca OVR na podstawie potencjału
function calculateStartingOVR(potential) {
    switch(potential) {
        case 'weak': return Math.floor(Math.random() * 10) + 40; // 40-49
        case 'medium': return Math.floor(Math.random() * 10) + 50; // 50-59
        case 'good': return Math.floor(Math.random() * 10) + 60; // 60-69
        case 'very_good': return Math.floor(Math.random() * 10) + 70; // 70-79
        case 'goat': return Math.floor(Math.random() * 5) + 80; // 80-84
        default: return 50;
    }
}

// Inicjalizacja przy starcie
window.onload = function() {
    populateCountries();
};
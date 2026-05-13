const titoliCategorie = {
    'drink': 'Drink e Aperitivi',
    'antipasti': 'Antipasti e Sfiziosità', 
    'panuozzi': 'I Nostri Panuozzi',       
    'cucina': 'Piatti Unici',
    'dolci': 'I Nostri Dolci',
    'vini': 'La Cantina',
    'birre': 'Le Birre',
    'caffetteria': 'Bar & Caffetteria'
    'ginSelection': 'Gin Selection'
};

// --- DIZIONARIO DEGLI ALLERGENI (Da Numero a Simbolo) ---
const mappaAllergeni = {
    '1': '🌾', '2': '🦐', '3': '🥚', '4': '🐟',
    '5': '🥜', '6': '🌱', '7': '🥛', '8': '🌰',
    '9': '🥬', '10': '🌭', '11': '🥯', '12': '🍷',
    '13': '🫘', '14': '🦪'
};

// --- BANCA DEI CONSIGLI (INTELLIGENZA ORARIA + ANTI-RIPETIZIONE) ---
const bancaConsigli = {
    'taglieri': [
        { prodotto: 'spritz', orario: 'aperitivo', testo: "L'abbinamento perfetto per l'aperitivo? Il nostro Spritz!" },
        { prodotto: 'aglianico', orario: 'cena', testo: "Esaltane il sapore con un calice di Aglianico strutturato." },
        { prodotto: 'birra-rossa', orario: 'cena', testo: "Provalo con una Birra Rossa Artigianale, non te ne pentirai." },
        { prodotto: 'frittella', orario: 'sempre', testo: "Aggiungi una frittella calda per accompagnare i salumi." }
    ],
    'primi-carne': [
        { prodotto: 'aglianico', orario: 'sempre', testo: "Un calice di Aglianico esalterà al massimo il sapore della carne." },
        { prodotto: 'birra-ambrata', orario: 'sempre', testo: "Questo piatto merita di essere accompagnato da una Birra Artigianale." }
    ],
    'pesce': [
        { prodotto: 'falanghina', orario: 'sempre', testo: "Accompagnalo con un fresco calice di Falanghina del Sannio." },
        { prodotto: 'greco', orario: 'sempre', testo: "Il Greco di Tufo è la scelta ideale per esaltare i sapori del mare." }
    ],
    'dolci': [
        { prodotto: 'limoncello', orario: 'sempre', testo: "Chiudi in bellezza: accompagnalo con un Limoncello ghiacciato." },
        { prodotto: 'amaro', orario: 'sempre', testo: "Ideale da gustare insieme al nostro Amaro della Casa." }
    ]
};

// --- MOTORE DI NAVIGAZIONE E INIZIALIZZAZIONE ---
window.addEventListener('hashchange', gestisciNavigazione);
window.addEventListener('load', function() {
    
    // 1. Converte i numeri in Emoji
    let icone = document.querySelectorAll('.allergen-icon');
    icone.forEach(icona => {
        let numero = icona.innerText.trim();
        if (mappaAllergeni[numero]) {
            icona.innerText = mappaAllergeni[numero];
            icona.setAttribute('title', 'Allergene ' + numero); 
        }
    });

    // 2. Carica i consigli leggendo l'orologio
    let boxConsigli = document.querySelectorAll('.chef-tip-box');
    let prodottiGiaConsigliati = new Set();
    
    let dataAttuale = new Date();
    let oraDecimale = dataAttuale.getHours() + (dataAttuale.getMinutes() / 60);
    let isAperitivo = (oraDecimale >= 17.0 && oraDecimale < 18.5);
    
    boxConsigli.forEach(box => {
        let tipo = box.getAttribute('data-tip-type'); 
        if (bancaConsigli[tipo]) {
            let consigliValidi = bancaConsigli[tipo].filter(consiglio => {
                if (consiglio.orario === 'aperitivo' && !isAperitivo) return false;
                if (consiglio.orario === 'cena' && isAperitivo) return false;
                if (prodottiGiaConsigliati.has(consiglio.prodotto)) return false;
                return true; 
            });

            if (consigliValidi.length === 0) { 
                consigliValidi = bancaConsigli[tipo].filter(c => {
                    if (c.orario === 'aperitivo' && !isAperitivo) return false;
                    if (c.orario === 'cena' && isAperitivo) return false;
                    return true;
                });
            }
            
            if (consigliValidi.length > 0) {
                let consiglioScelto = consigliValidi[Math.floor(Math.random() * consigliValidi.length)];
                prodottiGiaConsigliati.add(consiglioScelto.prodotto);
                box.innerHTML = `${consiglioScelto.testo}`;
                box.style.display = 'block'; 
            }
        }
    });

    gestisciNavigazione();
});

function gestisciNavigazione() {
    let hash = window.location.hash.replace('#', '');

    document.getElementById('home-view').style.display = 'none';
    document.getElementById('menu-view').style.display = 'none';
    document.getElementById('info-view').style.display = 'none';
    
    chiudiFinestraAllergeni();

    if (hash === 'info' || titoliCategorie[hash]) {
        document.body.classList.add('menu-active');
        document.querySelector('.app-container').classList.add('menu-active');

        if (hash === 'info') {
            document.getElementById('info-view').style.display = 'block';
        } else {
            document.getElementById('titolo-sezione').innerText = titoliCategorie[hash];
            document.querySelectorAll('.piatti-list').forEach(el => el.style.display = 'none');
            
            let sezioneScelta = document.getElementById(hash);
            if(sezioneScelta) {
                sezioneScelta.style.display = 'block';
                document.getElementById('menu-view').style.display = 'block';
            }
        }
        window.scrollTo(0, 0);
    } else {
        document.body.classList.remove('menu-active');
        document.querySelector('.app-container').classList.remove('menu-active');
        
        document.getElementById('home-view').style.display = 'block';
        if(window.location.hash !== '') {
            history.replaceState(null, null, ' ');
        }
    }
}

function apriPagina(idPagina) {
    window.location.hash = idPagina;
}

function tornaIndietro() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.hash = ''; 
    }
}

function apriFinestraAllergeni() {
    document.getElementById('finestra-allergeni').style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function chiudiFinestraAllergeni() {
    document.getElementById('finestra-allergeni').style.display = 'none';
    document.body.style.overflow = 'auto'; 
}

let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

document.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, {passive: true});

document.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    
    let spostamentoX = touchendX - touchstartX;
    let spostamentoY = Math.abs(touchendY - touchstartY);

    if (spostamentoX > 150 && spostamentoY < 40 && document.getElementById('finestra-allergeni').style.display !== 'flex') {
        if (document.getElementById('home-view').style.display !== 'block') {
            tornaIndietro();
        }
    }
}, {passive: true});

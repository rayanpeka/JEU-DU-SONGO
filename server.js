const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(__dirname));

let partie = {
    plateau: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    tour: "joueur1" // joueur1 ou joueur2
};


app.get('/api/etat', (req, res) => {
    res.json(partie);
});

app.post('/api/jouer', (req, res) => {
    const { indexCase, joueur } = req.body;

    if (joueur !== partie.tour) {
        return res.status(400).json({ message: "Ce n'est pas ton tour !" });
    }


    let graines = partie.plateau[indexCase];
    partie.plateau[indexCase] = 0;
    let i = indexCase;
    
    while (graines > 0) {
        i = (i + 1) % 14;
        partie.plateau[i]++;
        graines--;
    }

    partie.tour = partie.tour === "joueur1" ? "joueur2" : "joueur1";

    
    res.json(partie);
});

app.post('/api/reset', (req, res) => {
    partie = {
        plateau: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        tour: "joueur1"
    };
    res.json(partie);
});

app.listen(PORT, () => {
    console.log(`Le serveur Songo tourne sur le port ${PORT}`);
});
const monProfil = "joueur1";
let plateau = new Array(14).fill(5);

let joueurCourant = 1;

let scoreJoueur1 = 0;
let scoreJoueur2 = 0;

const cases = document.querySelectorAll(".case");

function afficherPlateau ()
{

cases.forEach(c => {

        let index = parseInt(c.dataset.index);

        c.textContent = plateau[index];

        c.classList.remove("joueur1");
        c.classList.remove("joueur2");

        if(index <= 6)
        {
            c.classList.add("joueur1");
        }
        else
        {
            c.classList.add("joueur2");
        }
    });
}

function jouer(index)
{
    if(joueurCourant === 1 && index > 6)
    {
        alert("C'est au Joueur 1 de jouer");
        return;
    }

    if(joueurCourant === 2 && index < 7)
    {
        alert("C'est au Joueur 2 de jouer");
        return;
    }

    let graines = plateau[index];

    if(graines === 0)
    {
        alert("Case vide");
        return;
    }

    plateau[index] = 0;

    let position = index;

    while(graines > 0)
    {
        position = (position + 1) % 14;

        if(position === index)
        {
            position = (position + 1) % 14;
        }

        plateau[position]++;
        graines--;
    }

    joueurCourant = (joueurCourant === 1) ? 2 : 1;

    document.getElementById("tour").textContent =
        "Joueur " + joueurCourant;

    afficherPlateau();
}

cases.forEach(c => {

    c.addEventListener("click", () => {

        let index = parseInt(c.dataset.index);

        jouer(index);

    });

});

afficherPlateau();
;
const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", () => {

    plateau = new Array(14).fill(5);

    joueurCourant = 1;

    document.getElementById("tour").textContent =
        "Tour du Joueur 1";

    afficherPlateau();

});
function afficherScores()
{
    document.getElementById("score1").textContent =
        scoreJoueur1;

    document.getElementById("score2").textContent =
        scoreJoueur2;
}
afficherScores();
function afficherScores()
{
    document.getElementById("score1").textContent =
        scoreJoueur1;

    document.getElementById("score2").textContent =
        scoreJoueur2;
}

function estCampAdverse(index, joueur)
{
    if(joueur === 1)
    {
        return index >= 7;
    }

    return index <= 6;
}
function capturer(position, joueur)
{
    if(!estCampAdverse(position, joueur))
    {
        return;
    }

    let graines = plateau[position];

    if(graines >= 2 && graines <= 4)
    {
        plateau[position] = 0;

        if(joueur === 1)
        {
            scoreJoueur1 += graines;
        }
        else
        {
            scoreJoueur2 += graines;
        }
    }
}
function chargerEtatJeu() {
    fetch('/api/etat')
        .then(response => response.json())
        .then(data => {
            // data contient { plateau: [...], tour: "..." }
            mettreAJourAffichage(data.plateau);
            
            // Afficher à l'écran si c'est le tour du joueur ou pas
            const statut = document.getElementById('statut'); // si tu as une div statut
            if (statut) {
                statut.innerText = data.tour === monProfil ? "À toi de jouer !" : "En attente de l'adversaire...";
            }
        })
        .catch(err => console.error("Erreur AJAX:", err));
}

// Lancer le polling : l'application demande l'état au serveur toutes les 2000ms (2s)
setInterval(chargerEtatJeu, 2000);
function cliquersurCase(indexCase) {
    // Optionnel : bloquer le clic si ce n'est pas le tour du joueur actuel
    
    fetch('/api/jouer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            indexCase: indexCase,
            joueur: monProfil
        })
    })
    .then(response => {
        if (!response.ok) throw new Error("Action impossible");
        return response.json();
    })
    .then(data => {
        mettreAJourAffichage(data.plateau); // Mise à jour immédiate après avoir joué
    })
    .catch(err => alert("Ce n'est pas ton tour ou coup invalide !"));
}
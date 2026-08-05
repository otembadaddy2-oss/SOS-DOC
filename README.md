# SOS DOC

**Un monde. Un médecin. Un espoir.**

Plateforme internationale de téléconsultation pédiatrique — site web + application (PWA) gratuite. Prototype / propriété de **STAR ENTREPRISE** — Fondateur & PDG Directeur Général : **Carry OTEMBA**.

Site 100 % statique (HTML/CSS/JS), sans backend, hébergeable gratuitement (Netlify, GitHub Pages, etc.).

## Pages

| Fichier | Espace |
|---|---|
| `index.html` | Accueil |
| `espace-patient.html` | Parents / patients — dossier enfant, consultation, paiement, ordonnance, suivi |
| `espace-medecin.html` | Médecins — consultations, prescriptions |
| `espace-centre.html` | Centres médicaux partenaires |
| `espace-partenaire.html` | Partenaires / assureurs |
| `espace-organisation-humanitaire.html` | Organisations humanitaires |
| `espace-admin.html` | Administration de la plateforme |

## PIOUPIOU

Assistante vocale intégrée (`assets/js/pioupiou.js`), voix douce destinée aux enfants et aux parents. Accueille les familles, explique le parcours (inscription → consultation → rendez‑vous de contrôle), et — une fois la prescription du médecin transmise et le paiement effectué par Mobile Money (+242 06 656 50 50) ou Airtel Money (+242 05 597 24 27) — envoie un message de prompt rétablissement personnalisé au nom de l'enfant sur le WhatsApp inscrit sur le dossier.

## Suivi statistique

`assets/docs/SOS_DOC_Suivi_Statistiques_2026-2035.xlsx` — classeur Excel (formules, tableau de bord, pyramide des âges, suivi par médecin, avis du site) téléchargeable depuis les espaces Admin / Centre / Médecin / Partenaire / Organisation humanitaire. Données 2026 démonstratives, 2027-2035 en projection. Voir l'onglet « Légende » du fichier pour le détail.

## Développement local

```bash
python3 -m http.server 8800
```

Puis ouvrir `http://localhost:8800/`.

# WellTrack 🏋️‍♂️🥗💤

WellTrack est une application mobile de suivi de santé holistique alimentée par l'intelligence artificielle (Gemini). Elle permet de suivre l'activité physique, la nutrition, le sommeil et propose des défis gamifiés.

## Fonctionnalités

*   **Tableau de bord** : Vue d'ensemble des statistiques journalières.
*   **Musculation** : Création de programmes, suivi de séances, générateur de programmes par IA.
*   **Nutrition** : Suivi des calories et macronutriments (analyse photo IA à venir).
*   **Sommeil** : Analyse de la qualité du sommeil.
*   **Gamification** : Système de niveaux, badges et défis.

## Installation

1.  Cloner le dépôt :
    ```bash
    git clone https://github.com/VOTRE_NOM_UTILISATEUR/WellTrack.git
    cd WellTrack
    ```

2.  Installer les dépendances :
    ```bash
    npm install
    ```

3.  Configurer la clé API :
    *   Créez un fichier `.env` à la racine.
    *   Ajoutez votre clé Gemini : `API_KEY=votre_cle_api_ici`

4.  Lancer le projet :
    ```bash
    npm run dev
    ```

## Technologies

*   React 19
*   TypeScript
*   Tailwind CSS
*   Google Gemini API (@google/genai)
*   Recharts
*   Lucide React
*   Vite

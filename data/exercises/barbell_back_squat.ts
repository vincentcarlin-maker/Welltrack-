
export const barbell_back_squat = {
  identity: {
    exercise_id: "sq_bb_001",
    name: "Squat Arrière à la Barre",
    category: "compound",
    difficulty_level: "intermediate"
  },
  muscles: {
    primary_muscles: ["Quadriceps", "Gluteus Maximus"],
    secondary_muscles: ["Hamstrings", "Adductors", "Erector Spinae", "Core"]
  },
  equipment: {
    equipment_type: "barbell"
  },
  training_purpose: {
    main_goals: ["strength", "hypertrophy"],
    recommended_rep_range: { min: 5, max: 8 },
    recommended_set_range: { min: 3, max: 5 },
    target_RPE_range: { min: 7, max: 9 }
  },
  execution_guidelines: {
    start_position: "Barre reposant sur les trapèzes (high bar) ou l'arrière des deltoïdes (low bar). Pieds largeur d'épaules, orteils légèrement vers l'extérieur. Regard droit devant.",
    movement_execution: "Inspirer et gainer les abdos. Descendre en poussant les hanches vers l'arrière et en ouvrant les genoux. Maintenir le buste fier. Descendre jusqu'à ce que les hanches soient sous les genoux. Remonter en poussant fort dans les talons.",
    breathing_cues: "Inspiration diaphragmatique avant la descente (Manœuvre de Valsalva). Expiration après le point critique de la remontée."
  },
  coaching_cues: {
    key_technique_points: ["Garder le poids sur le milieu du pied", "Genoux alignés avec les orteils", "Poitrine sortie", "Coudes tirés vers le bas pour stabiliser la barre"],
    common_mistakes: ["Arrondir le bas du dos", "Genoux qui rentrent (valgus)", "Lever les talons", "Regarder vers le haut"],
    safety_notes: ["Utiliser des barres de sécurité", "Ne pas verrouiller brutalement les genoux en haut", "Maintenir un gainage abdominal constant"],
    contraindications: ["Lésions discales vertébrales aiguës", "Douleurs articulaires sévères au genou sans avis médical"]
  },
  intelligent_behavior: {
    progression_priority: "load",
    progression_increment_rules: {
      standard_increase: 2.5, // kg
      micro_loading: 1, // kg
      trigger: "RPE < 8 sur toutes les séries de la séance"
    },
    regression_rules: {
      fatigue_threshold: "RPE > 9.5 sur la première série",
      pain_trigger: "Toute douleur vive immédiate = arrêt immédiat",
      action: "Réduction de charge de 10% ou passage au Goblet Squat"
    },
    deload_recommendations: "Réduction de 50% du volume (sets) et 10% de l'intensité (poids) toutes les 4 à 8 semaines."
  },
  adaptation_rules: {
    type: "compound_conservative",
    logic: "Priorité à la surcharge progressive lente. Si plateau > 3 séances, modifier le tempo ou passer temporairement sur une variante (Front Squat)."
  }
};

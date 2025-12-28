
export const dumbbell_bicep_curl = {
  identity: {
    exercise_id: "bc_db_001",
    name: "Curl Biceps aux Haltères",
    category: "isolation",
    difficulty_level: "beginner"
  },
  muscles: {
    primary_muscles: ["Biceps Brachii"],
    secondary_muscles: ["Brachialis", "Brachioradialis", "Forearm flexors"]
  },
  equipment: {
    equipment_type: "dumbbell"
  },
  training_purpose: {
    main_goals: ["hypertrophy", "endurance"],
    recommended_rep_range: { min: 10, max: 15 },
    recommended_set_range: { min: 3, max: 4 },
    target_RPE_range: { min: 8, max: 10 }
  },
  execution_guidelines: {
    start_position: "Debout, dos droit, haltères sur les côtés, paumes vers l'intérieur (prise neutre).",
    movement_execution: "Monter l'haltère en effectuant une rotation du poignet (supination). Garder les coudes immobiles contre les côtes. Contracter fort en haut. Descendre lentement en contrôlant.",
    breathing_cues: "Expirer lors de la contraction (montée), inspirer lors de l'étirement (descente)."
  },
  coaching_cues: {
    key_technique_points: ["Zéro élan du buste", "Isolation maximale : seul l'avant-bras bouge", "Coudes verrouillés au corps", "Amplitude complète"],
    common_mistakes: ["Balancer le corps (cheating)", "Lever les coudes vers l'avant", "Relâcher la tension en bas"],
    safety_notes: ["Garder les genoux légèrement déverrouillés", "Maintenir le neutre de la colonne"],
    contraindications: ["Tendinite du biceps distale", "Douleur vive au coude"]
  },
  intelligent_behavior: {
    progression_priority: "reps",
    progression_increment_rules: {
      standard_increase: 1, // rép par série
      trigger: "Atteinte du haut de la fourchette de répétitions sur tous les sets",
      load_increase: 2, // kg (quand reps max atteintes)
    },
    regression_rules: {
      fatigue_threshold: "Incapacité à contrôler la descente (négative)",
      action: "Réduction immédiate du poids ou repos prolongé"
    },
    deload_recommendations: "Utiliser des charges très légères pour favoriser le flux sanguin (récupération active)."
  },
  adaptation_rules: {
    type: "isolation_progressive",
    logic: "Privilégier l'augmentation du nombre de répétitions avant d'augmenter la charge. L'accent est mis sur la connexion cerveau-muscle."
  }
};

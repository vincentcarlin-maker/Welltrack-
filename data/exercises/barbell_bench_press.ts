
export const barbell_bench_press = {
  identity: {
    exercise_id: "bp_bb_001",
    name: "Développé Couché à la Barre",
    category: "compound",
    difficulty_level: "beginner"
  },
  muscles: {
    primary_muscles: ["Pectoralis Major"],
    secondary_muscles: ["Triceps Brachii", "Anterior Deltoid", "Serratus Anterior"]
  },
  equipment: {
    equipment_type: "barbell"
  },
  training_purpose: {
    main_goals: ["strength", "hypertrophy"],
    recommended_rep_range: { min: 6, max: 10 },
    recommended_set_range: { min: 3, max: 4 },
    target_RPE_range: { min: 7, max: 8.5 }
  },
  execution_guidelines: {
    start_position: "Allongé sur le banc, yeux sous la barre. Pieds ancrés au sol. Omoplates serrées et rétractées. Prise légèrement plus large que les épaules.",
    movement_execution: "Décrocher la barre. Descendre lentement vers le milieu de la poitrine. Coudes à 45-60 degrés du buste. Toucher légèrement la poitrine. Pousser vers le haut et légèrement vers l'arrière.",
    breathing_cues: "Inspirer à la descente, expirer à la remontée (après l'effort maximal)."
  },
  coaching_cues: {
    key_technique_points: ["Garder les omoplates ancrées", "Maintenir les pieds stables", "Trajectoire de barre en 'J' inversé", "Poignets alignés avec les avant-bras"],
    common_mistakes: ["Écarter les coudes à 90 degrés", "Décoller les fesses du banc", "Rebondir sur la poitrine", "Poignets cassés"],
    safety_notes: ["Utiliser un pareur (spotter) pour les charges lourdes", "Ne jamais utiliser une prise sans pouce (suicide grip)"],
    contraindications: ["Conflit sous-acromial aigu", "Blessure au tendon du grand pectoral"]
  },
  intelligent_behavior: {
    progression_priority: "load",
    progression_increment_rules: {
      standard_increase: 2.5, // kg
      micro_loading: 1.25, // kg
      trigger: "Toutes les répétitions complétées avec technique parfaite"
    },
    regression_rules: {
      fatigue_threshold: "Échec technique avant la fin du set",
      action: "Réduction de 5kg ou passage aux haltères pour améliorer la stabilité unilatérale"
    },
    deload_recommendations: "Remplacer par des pompes ou haltères légers pendant une semaine de récupération active."
  },
  adaptation_rules: {
    type: "compound_standard",
    logic: "Progression linéaire possible pour les débutants. Pour les avancés, alterner avec des phases d'isométrie ou de tempo lent."
  }
};

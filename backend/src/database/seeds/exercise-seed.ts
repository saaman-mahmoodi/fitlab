import { ExerciseCategory, Equipment } from '../../modules/exercises/entities/exercise.entity';

export const exerciseSeeds = [
  { name: 'Bench Press', category: ExerciseCategory.CHEST, equipment: Equipment.BARBELL, muscle_groups: ['chest', 'triceps', 'anterior deltoids'], instructions: 'Lie on a flat bench, grip the barbell slightly wider than shoulder-width, lower to chest, then press up.' },
  { name: 'Incline Bench Press', category: ExerciseCategory.CHEST, equipment: Equipment.BARBELL, muscle_groups: ['upper chest', 'anterior deltoids', 'triceps'], instructions: 'Lie on an incline bench set to 30-45 degrees, press the barbell up from upper chest level.' },
  { name: 'Dumbbell Fly', category: ExerciseCategory.CHEST, equipment: Equipment.DUMBBELL, muscle_groups: ['chest', 'anterior deltoids'], instructions: 'Lie flat, arms extended above chest, lower dumbbells out to sides with slight elbow bend, then raise back up.' },
  { name: 'Push-Up', category: ExerciseCategory.CHEST, equipment: Equipment.BODYWEIGHT, muscle_groups: ['chest', 'triceps', 'anterior deltoids', 'core'], instructions: 'Start in plank position, lower chest to floor by bending elbows, push back up.' },
  { name: 'Cable Crossover', category: ExerciseCategory.CHEST, equipment: Equipment.CABLE, muscle_groups: ['chest', 'anterior deltoids'], instructions: 'Stand between cable machines, pull cables together in front of chest with arms slightly bent.' },
  { name: 'Dumbbell Press', category: ExerciseCategory.CHEST, equipment: Equipment.DUMBBELL, muscle_groups: ['chest', 'triceps', 'anterior deltoids'], instructions: 'Lie flat on bench, press dumbbells from chest level to full extension overhead.' },

  { name: 'Deadlift', category: ExerciseCategory.BACK, equipment: Equipment.BARBELL, muscle_groups: ['back', 'hamstrings', 'glutes', 'traps'], instructions: 'Stand with feet hip-width, grip barbell, lift by extending hips while keeping back straight.' },
  { name: 'Barbell Row', category: ExerciseCategory.BACK, equipment: Equipment.BARBELL, muscle_groups: ['upper back', 'lats', 'rhomboids', 'rear deltoids'], instructions: 'Bend at hips, grip barbell, pull towards lower chest, squeeze shoulder blades together.' },
  { name: 'Pull-Up', category: ExerciseCategory.BACK, equipment: Equipment.BODYWEIGHT, muscle_groups: ['lats', 'upper back', 'biceps'], instructions: 'Hang from bar with overhand grip, pull chin above bar, lower with control.' },
  { name: 'Lat Pulldown', category: ExerciseCategory.BACK, equipment: Equipment.CABLE, muscle_groups: ['lats', 'upper back', 'biceps'], instructions: 'Sit at lat pulldown machine, pull bar down to upper chest, squeeze lats, return slowly.' },
  { name: 'Seated Cable Row', category: ExerciseCategory.BACK, equipment: Equipment.CABLE, muscle_groups: ['mid back', 'lats', 'rhomboids'], instructions: 'Sit at cable row machine, pull handle to lower chest, squeeze back, return with control.' },
  { name: 'Single-Arm Dumbbell Row', category: ExerciseCategory.BACK, equipment: Equipment.DUMBBELL, muscle_groups: ['lats', 'rhomboids', 'rear deltoids'], instructions: 'Brace on bench with one arm, pull dumbbell to hip, squeeze back at top.' },

  { name: 'Overhead Press', category: ExerciseCategory.SHOULDERS, equipment: Equipment.BARBELL, muscle_groups: ['anterior deltoids', 'medial deltoids', 'triceps'], instructions: 'Stand with barbell at collarbone, press overhead to full extension.' },
  { name: 'Lateral Raise', category: ExerciseCategory.SHOULDERS, equipment: Equipment.DUMBBELL, muscle_groups: ['medial deltoids'], instructions: 'Stand holding dumbbells at sides, raise arms out to shoulder height, lower slowly.' },
  { name: 'Front Raise', category: ExerciseCategory.SHOULDERS, equipment: Equipment.DUMBBELL, muscle_groups: ['anterior deltoids'], instructions: 'Hold dumbbells in front of thighs, raise to shoulder height, lower with control.' },
  { name: 'Face Pull', category: ExerciseCategory.SHOULDERS, equipment: Equipment.CABLE, muscle_groups: ['rear deltoids', 'rotator cuff', 'mid back'], instructions: 'Attach rope to high cable, pull toward face while spreading rope apart.' },
  { name: 'Reverse Fly', category: ExerciseCategory.SHOULDERS, equipment: Equipment.DUMBBELL, muscle_groups: ['rear deltoids', 'mid back'], instructions: 'Bend forward at hips, raise dumbbells out to sides, squeeze at top.' },

  { name: 'Barbell Curl', category: ExerciseCategory.ARMS, equipment: Equipment.BARBELL, muscle_groups: ['biceps', 'brachialis'], instructions: 'Stand with barbell, curl weight up by bending elbows, squeeze biceps, lower slowly.' },
  { name: 'Dumbbell Curl', category: ExerciseCategory.ARMS, equipment: Equipment.DUMBBELL, muscle_groups: ['biceps', 'brachialis'], instructions: 'Hold dumbbells at sides, curl up one arm at a time, squeeze biceps at top.' },
  { name: 'Hammer Curl', category: ExerciseCategory.ARMS, equipment: Equipment.DUMBBELL, muscle_groups: ['biceps', 'brachioradialis', 'brachialis'], instructions: 'Hold dumbbells with neutral grip (palms facing), curl up keeping wrists neutral.' },
  { name: 'Tricep Pushdown', category: ExerciseCategory.ARMS, equipment: Equipment.CABLE, muscle_groups: ['triceps'], instructions: 'Stand at cable machine, push bar down by extending elbows, squeeze triceps.' },
  { name: 'Overhead Tricep Extension', category: ExerciseCategory.ARMS, equipment: Equipment.DUMBBELL, muscle_groups: ['triceps'], instructions: 'Hold dumbbell overhead, lower behind head by bending elbows, extend back up.' },
  { name: 'Skull Crusher', category: ExerciseCategory.ARMS, equipment: Equipment.BARBELL, muscle_groups: ['triceps'], instructions: 'Lie flat, lower barbell to forehead by bending elbows, extend back up.' },

  { name: 'Back Squat', category: ExerciseCategory.LEGS, equipment: Equipment.BARBELL, muscle_groups: ['quadriceps', 'glutes', 'hamstrings', 'core'], instructions: 'Place barbell on upper back, squat down until thighs parallel, drive up through heels.' },
  { name: 'Front Squat', category: ExerciseCategory.LEGS, equipment: Equipment.BARBELL, muscle_groups: ['quadriceps', 'glutes', 'core'], instructions: 'Hold barbell in front rack position, squat down, keep chest up, drive up.' },
  { name: 'Romanian Deadlift', category: ExerciseCategory.LEGS, equipment: Equipment.BARBELL, muscle_groups: ['hamstrings', 'glutes', 'lower back'], instructions: 'Hold barbell at hip height, hinge forward at hips with slight knee bend, lower bar down legs.' },
  { name: 'Leg Press', category: ExerciseCategory.LEGS, equipment: Equipment.MACHINE, muscle_groups: ['quadriceps', 'glutes', 'hamstrings'], instructions: 'Sit in leg press machine, place feet shoulder-width, press platform away.' },
  { name: 'Leg Curl', category: ExerciseCategory.LEGS, equipment: Equipment.MACHINE, muscle_groups: ['hamstrings'], instructions: 'Sit or lie in leg curl machine, curl weight by bending knees, squeeze hamstrings.' },
  { name: 'Calf Raise', category: ExerciseCategory.LEGS, equipment: Equipment.MACHINE, muscle_groups: ['calves'], instructions: 'Stand on calf raise machine, raise up on toes, lower slowly below platform level.' },
  { name: 'Lunge', category: ExerciseCategory.LEGS, equipment: Equipment.BODYWEIGHT, muscle_groups: ['quadriceps', 'glutes', 'hamstrings'], instructions: 'Step forward into a lunge, lowering back knee toward floor, push back to start.' },
  { name: 'Bulgarian Split Squat', category: ExerciseCategory.LEGS, equipment: Equipment.DUMBBELL, muscle_groups: ['quadriceps', 'glutes', 'hamstrings'], instructions: 'Rear foot elevated on bench, lower into single-leg squat, drive up through front leg.' },

  { name: 'Plank', category: ExerciseCategory.CORE, equipment: Equipment.BODYWEIGHT, muscle_groups: ['core', 'abdominals', 'obliques', 'lower back'], instructions: 'Hold push-up position on forearms, keep body straight, engage core.' },
  { name: 'Hanging Leg Raise', category: ExerciseCategory.CORE, equipment: Equipment.BODYWEIGHT, muscle_groups: ['lower abdominals', 'hip flexors'], instructions: 'Hang from pull-up bar, raise straight legs to hip height, lower slowly.' },
  { name: 'Cable Crunch', category: ExerciseCategory.CORE, equipment: Equipment.CABLE, muscle_groups: ['abdominals'], instructions: 'Kneel below cable with rope attachment, crunch down pulling rope, squeeze abs.' },
  { name: 'Russian Twist', category: ExerciseCategory.CORE, equipment: Equipment.BODYWEIGHT, muscle_groups: ['obliques', 'abdominals'], instructions: 'Sit with torso at 45 degrees, feet off floor, rotate side to side.' },
  { name: 'Ab Wheel Rollout', category: ExerciseCategory.CORE, equipment: Equipment.OTHER, muscle_groups: ['core', 'abdominals', 'lower back'], instructions: 'Kneel holding ab wheel, roll forward extending body, pull back to start.' },

  { name: 'Treadmill Run', category: ExerciseCategory.CARDIO, equipment: Equipment.OTHER, muscle_groups: ['quadriceps', 'hamstrings', 'calves', 'heart'], instructions: 'Run on treadmill at desired pace and incline.' },
  { name: 'Rowing Machine', category: ExerciseCategory.CARDIO, equipment: Equipment.MACHINE, muscle_groups: ['back', 'legs', 'arms', 'core', 'heart'], instructions: 'Sit on rower, extend legs then pull handle to chest, reverse the motion.' },
  { name: 'Jump Rope', category: ExerciseCategory.CARDIO, equipment: Equipment.OTHER, muscle_groups: ['calves', 'quadriceps', 'heart'], instructions: 'Hold rope handles, swing rope overhead, jump as it passes under feet.' },
  { name: 'Cycling', category: ExerciseCategory.CARDIO, equipment: Equipment.MACHINE, muscle_groups: ['quadriceps', 'hamstrings', 'calves', 'heart'], instructions: 'Pedal on stationary bike at desired resistance and speed.' },
  { name: 'Burpee', category: ExerciseCategory.CARDIO, equipment: Equipment.BODYWEIGHT, muscle_groups: ['full body', 'heart'], instructions: 'From standing, squat down, jump feet back to plank, jump feet forward, jump up with arms overhead.' },

  { name: 'Thruster', category: ExerciseCategory.FULL_BODY, equipment: Equipment.BARBELL, muscle_groups: ['quadriceps', 'shoulders', 'core', 'triceps'], instructions: 'Front squat the barbell, then press overhead in one fluid motion.' },
  { name: 'Clean and Press', category: ExerciseCategory.FULL_BODY, equipment: Equipment.BARBELL, muscle_groups: ['full body'], instructions: 'Explosively lift barbell from floor to shoulders (clean), then press overhead.' },
  { name: 'Kettlebell Swing', category: ExerciseCategory.FULL_BODY, equipment: Equipment.KETTLEBELL, muscle_groups: ['hips', 'glutes', 'core', 'hamstrings'], instructions: 'Hinge at hips, swing kettlebell between legs then thrust hips forward to swing to eye level.' },
  { name: 'Turkish Get-Up', category: ExerciseCategory.FULL_BODY, equipment: Equipment.KETTLEBELL, muscle_groups: ['full body', 'core', 'shoulders'], instructions: 'Lie flat holding kettlebell overhead, stand up in specific sequence, then reverse.' },
  { name: 'Man Maker', category: ExerciseCategory.FULL_BODY, equipment: Equipment.DUMBBELL, muscle_groups: ['full body'], instructions: 'Push-up on dumbbells, row each side, clean to squat position, thruster overhead.' },
];
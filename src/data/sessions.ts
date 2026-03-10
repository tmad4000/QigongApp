export type SessionCategory = 'quick-gentle' | 'quick-intense' | 'deep-gentle' | 'deep-intense';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  videoUrl?: string; // YouTube or local video
  thumbnailUrl?: string;
}

export interface Session {
  id: SessionCategory;
  title: string;
  subtitle: string;
  durationMin: number;
  color: string; // accent color
  icon: string; // emoji or icon name
  primary: Exercise;
  alternatives: Exercise[];
}

export const SESSIONS: Session[] = [
  {
    id: 'quick-gentle',
    title: 'Quick Break',
    subtitle: 'Gentle',
    durationMin: 5,
    color: '#6EC6A7',
    icon: '🌿',
    primary: {
      id: 'yogic-coffee',
      title: '"Yogic Coffee" Bastrika Breathing',
      description:
        'An energizing breathwork practice that awakens the body and clears the mind. Rhythmic belly breathing creates internal heat and boosts alertness — a natural caffeine replacement.',
      durationMin: 5,
      videoUrl: 'https://www.youtube.com/watch?v=NH0ZdkGSAPU',
    },
    alternatives: [
      {
        id: 'donna-eden',
        title: 'Donna Eden Daily Energy Routine',
        description:
          'A gentle 5-minute energy medicine routine that balances your meridians, strengthens your aura, and gets your energies flowing in the right direction. Nine easy exercises developed from nearly four decades of energy medicine work.',
        durationMin: 5,
        videoUrl: 'https://www.youtube.com/results?search_query=Donna+Eden+Daily+Energy+Routine+official',
      },
      {
        id: 'max-strom-16',
        title: 'Max Strom Breathe to Heal (16 min)',
        description:
          'Guided 16-minute anxiety release practice by Max Strom. Inhale for 4 counts, hold for 7, exhale for 8. His signature breathwork — ten to twenty minutes daily can meaningfully reduce anxiety, stress, and sleep dysfunction.',
        durationMin: 16,
        videoUrl: 'https://www.youtube.com/watch?v=KCIjGum4TyA',
      },
      {
        id: 'max-strom-tedx',
        title: 'Max Strom TEDx Talk + Practice',
        description:
          'Max Strom\'s TEDx Cape May talk "Breathe to Heal" (3M+ views). Timestamped to the guided breathing exercise portion at 14:25.',
        durationMin: 5,
        videoUrl: 'https://youtu.be/4Lb5L-VEm34?si=wbPA3AjJr3GqKEeY&t=865',
      },
      {
        id: 'peter-caughey-10',
        title: 'Peter Caughey 10 Min Set',
        description:
          'A short but complete qigong set from Forest Rock Qigong. Includes warm-up, Fire Element exercise, Rowing the Boat, Pushing Clouds, Crane Flies South, and Painting a Rainbow.',
        durationMin: 10,
        videoUrl: 'https://www.facebook.com/watch/?v=298532812239923',
      },
    ],
  },
  {
    id: 'quick-intense',
    title: 'Quick Break',
    subtitle: 'Intense',
    durationMin: 5,
    color: '#E88B6E',
    icon: '🔥',
    primary: {
      id: 'shaking-medicine',
      title: 'Shaking Medicine',
      description:
        'Vigorous whole-body shaking to release tension, shake off stagnant energy, and activate your natural healing response. Used across indigenous traditions worldwide.',
      durationMin: 5,
    },
    alternatives: [
      {
        id: 'wim-hof-breathing',
        title: 'Wim Hof Breathing Round',
        description:
          '3 rounds of power breathing followed by breath retention. Alkalizes the blood, reduces inflammation, and produces a natural high.',
        durationMin: 5,
      },
      {
        id: 'eight-brocades-express',
        title: '8 Brocades Express',
        description:
          'The classic Ba Duan Jin set performed at a brisk, dynamic pace to build heat and circulate qi.',
        durationMin: 5,
      },
    ],
  },
  {
    id: 'deep-gentle',
    title: 'Deep Cultivation',
    subtitle: 'Gentle',
    durationMin: 60,
    color: '#7B9FD4',
    icon: '🌊',
    primary: {
      id: 'spring-forest',
      title: 'Spring Forest Qigong – Level 1',
      description:
        'Master Chunyi Lin\'s foundational practice. Combines gentle movements, visualization, and mantra to open energy blockages and activate self-healing.',
      durationMin: 60,
    },
    alternatives: [
      {
        id: 'zhineng-lift-qi',
        title: 'Zhineng Qigong – Lift Qi Up Pour Qi Down',
        description:
          'Dr. Pang Ming\'s most practiced form. Opens the body to universal qi through expansive arm movements and focused intention.',
        durationMin: 45,
      },
      {
        id: 'yi-jin-jing',
        title: 'Yi Jin Jing (Muscle Tendon Change)',
        description:
          'Ancient Shaolin practice for strengthening tendons and ligaments, improving flexibility, and cultivating deep internal power.',
        durationMin: 30,
      },
    ],
  },
  {
    id: 'deep-intense',
    title: 'Deep Cultivation',
    subtitle: 'Intense',
    durationMin: 20,
    color: '#C084D8',
    icon: '⚡',
    primary: {
      id: 'iron-shirt',
      title: 'Iron Shirt Chi Kung',
      description:
        'Mantak Chia\'s powerful standing practice. Packs chi into organs, strengthens fascia, and builds a "shield" of condensed energy around the body.',
      durationMin: 20,
    },
    alternatives: [
      {
        id: 'five-animal-frolics',
        title: 'Five Animal Frolics (Wu Qin Xi)',
        description:
          'Hua Tuo\'s ancient health practice mimicking tiger, deer, bear, monkey, and crane. Each animal targets different organs and emotions.',
        durationMin: 25,
      },
      {
        id: 'dragon-tiger',
        title: 'Dragon & Tiger Medical Qigong',
        description:
          'Bruce Frantzis\' 1,500-year-old medical qigong set. Seven movements that trace and clear the body\'s etheric energy channels.',
        durationMin: 20,
      },
    ],
  },
];

export function getSession(id: string): Session | undefined {
  return SESSIONS.find((s) => s.id === id);
}

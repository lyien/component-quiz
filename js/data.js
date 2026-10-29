// Quiz content — sourced from the "What UI Component Are You?" copy deck.
// Scoring: each answer gives +2 to its main component and +1 to a secondary one.

export const COPY = {
  title: 'What Component Are You?',
  subtitle:
    "Every interface needs a full team. Answer 8 questions to find out which component you are, and who on the team you'd ship well with.",
  start: 'Find my component',
  progress: (n, total) => `Question ${n} of ${total}`,
  back: 'Back',
  next: 'Next',
  loading: 'Finding your component',
  resultEyebrow: "You're the...",
  strengths: 'What you bring',
  bugs: 'Known bugs',
  pairing: 'Ships well with',
  save: 'Save my card',
  retake: 'Take it again',
  allComponents: 'All components',
  galleryTitle: 'Component Gallery',
  backToGallery: 'Back to Gallery',
  menu: '[Quiz] What Component Are You?',
  footer: 'Designed and built by Laura Yien',
  cardHeadline: (name) => `I'm the ${name}!`,
  cardFooter: (link) => `What component are you? Find out at ${link}`,
};

// Order here is also the final tie-break fallback and the gallery order.
export const RESULTS = {
  button: {
    name: 'Button',
    tagline: "Click me. Let's go.",
    description:
      "You see a problem and you press go. You're decisive and direct, and people always know what you'll do next. Teams move faster with you in them.",
    strengths: 'Decisive · Clear about next steps · Gets things moving',
    bug: 'Occasionally clicked before reading the fine print.',
    pairing: 'Hero',
    art: { file: 'button.svg', w: 309, h: 122 },
  },
  hero: {
    name: 'Hero',
    tagline: 'Making an entrance.',
    description:
      "Main-character energy. You make a big first impression, set the vision, and get everyone excited about what's next.",
    strengths: 'Inspiring · Confident · Great storyteller',
    bug: 'Takes up the whole screen.',
    pairing: 'Button',
    art: { file: 'hero.svg', w: 477, h: 208 },
  },
  carousel: {
    name: 'Carousel',
    tagline: "Wait, there's more.",
    description:
      "You're always onto the next idea, hobby or browser tab. Your curiosity keeps things fresh, and you always have something new to show.",
    strengths: 'Curious · Full of ideas · Keeps things fresh',
    bug: "Auto-advances before anyone's finished reading.",
    pairing: 'Navigation',
    art: { file: 'carousel.svg', w: 649, h: 190 },
  },
  accordion: {
    name: 'Accordion',
    tagline: "There's more to me than meets the eye.",
    description:
      "You're calm on the surface and layered underneath. You open up once people show interest, and there's always more to discover.",
    strengths: 'Thoughtful · Deep · Good listener',
    bug: 'Sometimes stays collapsed a little too long.',
    pairing: 'Footer',
    art: { file: 'accordion.svg', w: 483, h: 205 },
  },
  toast: {
    name: 'Toast',
    tagline: 'Just popping in!',
    description:
      "You're quick, cheerful and perfectly timed. You bring the good news, share it, and leave before it gets awkward.",
    strengths: 'Upbeat · Great timing · Easy to talk to',
    bug: 'Gone before anyone can reply.',
    pairing: 'Tag',
    art: { file: 'toast.svg', w: 525, h: 87 },
  },
  navigation: {
    name: 'Navigation',
    tagline: 'Follow me.',
    description:
      "You know where everything is and how to get there. People come to you when they're lost, and you calmly get them sorted.",
    strengths: 'Organized · Big-picture thinker · Helpful guide',
    bug: "Has opinions about everyone's folder structure.",
    pairing: 'Carousel',
    art: { file: 'navigation.svg', w: 525, h: 87 },
  },
  tag: {
    name: 'Tag',
    tagline: 'Keeping it simple',
    description:
      "Small but mighty. You know everyone's niche, connect the right people, and make sure everything is labeled.",
    strengths: 'Connector · Organized · Detail-minded',
    bug: "Can't stop @-mentioning people in Figma comments.",
    pairing: 'Toast',
    art: { file: 'tag.svg', w: 287, h: 88 },
  },
  footer: {
    name: 'Footer',
    tagline: 'Got your back (from down here).',
    description:
      "You're dependable and underrated. You hold everything together, know the fine print, and are always there at the end.",
    strengths: 'Reliable · Thorough · Quietly supportive',
    bug: "Doesn't get scrolled to enough.",
    pairing: 'Accordion',
    art: { file: 'footer.svg', w: 309, h: 150 },
  },
};

// Each answer: [label, main (+2), secondary (+1)]
export const QUESTIONS = [
  {
    q: "It's Tuesday, 9:30am. Where are you?",
    a: [
      ['At my desk with my coffee, laptop open', 'button', 'footer'],
      ['In the elevator, still on time right?', 'navigation', 'tag'],
      ['Downstairs assembling my breakfast', 'accordion', 'carousel'],
      ['Still on the train, I promise it was delayed...', 'toast', 'hero'],
    ],
  },
  {
    q: 'Your desktop looks like...',
    a: [
      ['Folders inside folders, every file named properly.', 'tag', 'navigation'],
      ['One wallpaper, zero files. Total zen.', 'footer', 'toast'],
      ['I never see it since I never close my tabs.', 'carousel', 'button'],
      ['It looks like chaos, but I know exactly where everything is.', 'accordion', 'hero'],
    ],
  },
  {
    q: 'Pick an office lunch spot',
    a: [
      ['Mangia', 'button', 'toast'],
      ['Dig', 'navigation', 'tag'],
      ['Soup Kiosk', 'footer', 'accordion'],
      ['This Bowl', 'hero', 'carousel'],
    ],
  },
  {
    q: "It's your stand up week, what activity are we doing?",
    a: [
      ['Coffee walk', 'hero', 'toast'],
      ['The Crossword', 'tag', 'navigation'],
      ['Morning stretches', 'accordion', 'footer'],
      ['A fun craft', 'carousel', 'button'],
    ],
  },
  {
    q: 'Pick a Figma Tool',
    a: [
      ['Figma Make', 'toast', 'accordion'],
      ['Figma Design', 'navigation', 'tag'],
      ['FigJam', 'hero', 'button'],
      ['Figma Motion', 'carousel', 'footer'],
    ],
  },
  {
    q: "What's your favorite office perk?",
    a: [
      ['Coffee machine', 'tag', 'navigation'],
      ['Tea and soda in the fridge', 'carousel', 'hero'],
      ['Thursday lunch', 'toast', 'button'],
      ['Tangerines, apples, and bananas', 'footer', 'accordion'],
    ],
  },
  {
    q: 'Pick a tedious design task',
    a: [
      ['Component documentation', 'button', 'toast'],
      ['Setting up variables', 'navigation', 'tag'],
      ['Componentizing approved designs', 'hero', 'accordion'],
      ['Working file clean up', 'footer', 'carousel'],
    ],
  },
  {
    q: "If you could choose, you'd be designing...",
    a: [
      ['Marketing Site', 'toast', 'carousel'],
      ['Financial Dashboard', 'accordion', 'footer'],
      ['Mobile app', 'button', 'hero'],
      ['Blue Sky Pitch', 'tag', 'navigation'],
    ],
  },
];

// Order of illustrations in the loading-screen row (matches the Figma motion frame).
export const LOADING_ROW = ['button', 'toast', 'hero', 'accordion', 'tag', 'carousel', 'footer', 'navigation'];

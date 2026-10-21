// Voice-tag page copy and samples, carried over from the June 2026 build.

const dir = '/assets/voicetags/'

export const samples = [
  { name: 'Doxy', phrase: 'Doxy', note: 'Smooth, laid-back 95 BPM vibe', style: 'Smooth', type: 'Wet (FX)', file: 'doxy tag 1 95bpm.mp3' },
  { name: 'Callout', phrase: 'What? Callout!', note: 'Hype trap energy at 130 BPM', style: 'Aggressive', type: 'Wet (FX)', file: 'callout tag 1 130bpm.mp3' },
  { name: 'Bizzy Beats', phrase: 'Lil Bizzy Beats', note: 'Energetic 130 BPM trap tag', style: 'Aggressive', type: 'Wet (FX)', file: 'bizzy 1 130bpm.mp3' },
  { name: 'CJ', phrase: 'CJ, turn off the aux', note: 'Confident 110 BPM drill vibe', style: 'Smooth', type: 'Wet (FX)', file: 'cj tag 1 110bpm.mp3' },
  { name: 'Base', phrase: 'Running back Base', note: 'Hard-hitting 130 BPM trap', style: 'Aggressive', type: 'Wet (FX)', file: 'base tag 1 130bpm.mp3' },
  { name: 'Badman', phrase: 'Hey yo, Badman', note: 'UK drill style at 110 BPM', style: 'Aggressive', type: 'Wet (FX)', file: 'badman tag 1 110bpm.mp3' },
  { name: 'Maisie', phrase: 'Only hits Maisie', note: 'Female R&B tag (AI voice)', style: 'Seductive', type: 'AI female voice', file: 'ElevenLabs_2025-10-23T20_43_42_Natasha - Whispery ASMR _pvc_sp115_s50_sb16_se95_b_m2.mp3' },
  { name: 'Maki', phrase: 'Maki made it', note: 'Clean, versatile dry stem at 140 BPM', style: 'Versatile', type: 'Dry stem', file: 'all dry manic tag 140bpm.mp3' },
  { name: 'T Lou', phrase: 'They ready for this, T Lou?', note: 'Smooth dry stem, 140 BPM', style: 'Smooth', type: 'Dry stem', file: 'dry Lew what it do tag 1 140bpm.mp3' },
  { name: 'Drackz', phrase: 'DRX', note: 'Professional versatile tag at 110 BPM', style: 'Versatile', type: 'Wet (FX)', file: 'drackz tag 1 110bpm.mp3' },
  { name: 'Napalm', phrase: 'Damn Napalm, you going crazy', note: 'Aggressive dry stem, 140 BPM', style: 'Aggressive', type: 'Dry stem', file: 'dry Naari TAG 1 140BPM.mp3' },
  { name: 'Molly', phrase: 'This has to be 9-5', note: 'High-energy dry stem, 140 BPM', style: 'Aggressive', type: 'Dry stem', file: 'dry snoo tag 1 140bpm.mp3' },
].map((s) => ({ ...s, src: dir + encodeURIComponent(s.file) }))

export const perks = [
  { title: 'Fast delivery', body: 'Custom tags delivered in 24 hours or less. Rush delivery is available for urgent projects.' },
  { title: 'Multiple voice styles', body: 'Aggressive trap, smooth Metro-style, clean versatile, playful or radio. A female voice is available as a labelled AI option.' },
  { title: 'Studio quality', body: 'Recorded on professional gear, mixed, mastered and ready to drop into your beats.' },
  { title: 'Wet + dry versions', body: 'A dry stem for your own mix, plus a wet version fully produced with FX.' },
  { title: 'Revisions', body: '2 revisions on a single tag, up to 10 across the Brand Pack.' },
  { title: 'Commercial rights', body: 'Use your tag on beats you sell, monetized YouTube, Spotify, Apple Music and DJ sets.' },
]

export const styles = [
  { name: 'Aggressive / Trap', body: 'High-energy, chesty, powerful delivery.', bestFor: 'Trap, drill, hard-hitting beats', energy: '9–10', example: '“[NAME] made this heat!”' },
  { name: 'Smooth / Metro-style', body: 'Confident, breathy, laid-back.', bestFor: 'R&B, melodic hip-hop, chill beats', energy: '6–7', example: '“You know it’s [NAME]…”' },
  { name: 'Clean / Versatile', body: 'Professional, neutral energy that works across genres.', bestFor: 'Any genre, YouTube beats', energy: '7–8', example: '“[NAME] on the beat”' },
  { name: 'Seductive / R&B (AI female voice)', body: 'Smooth, breathy, intimate. Produced with an AI voice, mixed by me.', bestFor: 'R&B, soul, late-night productions', energy: '5–6', example: '“It’s Natasha… you know the vibe”' },
  { name: 'Playful / Pi’erre-style', body: 'Staccato, bouncy, energetic. Fun and hype.', bestFor: 'Playful trap, bouncy beats', energy: '9–10', example: '“[NAME]! Let’s go!”' },
  { name: 'Radio / DJ drop', body: 'Professional announcer voice.', bestFor: 'DJ sets, mixtapes, radio', energy: '7–8', example: '“DJ [NAME] in the mix”' },
]

// Mirrors the two live AirGigs listings; `order` is the key into site.airgigs.
type Package = { name: string; price: number; order: 'tag' | 'pack'; popular?: boolean; features: string[] }

export const packages: Package[] = [
  { name: 'Producer Tag', price: 20, order: 'tag', features: ['1 custom tag, up to 10 seconds', 'Wet (with FX) + dry stem', '2 revisions', '24-hour delivery', 'WAV + MP3', 'Full commercial rights'] },
  { name: 'Producer Brand Pack', price: 85, popular: true, order: 'pack', features: ['3 custom tags', '1 DJ drop (up to 15 s)', 'Beat intro + outro', 'Wet + dry + stems for every piece', 'Up to 10 revisions', '48-hour delivery', 'Full commercial rights'] },
]

export const faq = [
  { q: 'What is a voice tag (producer tag)?', a: 'A short vocal recording of your name or catchphrase that marks you as the creator of a beat. It’s your sonic business card.' },
  { q: 'How long does delivery take?', a: 'A single tag arrives within 24 hours; the Brand Pack within 48. Rush 12-hour delivery is available on request.' },
  { q: 'Can you match Metro Boomin or Pi’erre Bourne?', a: 'Yes. Send examples and I’ll match the style and energy while keeping it original.' },
  { q: 'Do you offer female voices?', a: 'Yes, as an AI voice: clearly labelled, then mixed and FX’d by me like any other tag.' },
  { q: 'Can I use it on YouTube and Spotify?', a: 'Yes. Full commercial rights come with every order: beats you sell, monetized YouTube, Spotify, Apple Music, DJ sets.' },
  { q: 'What if I don’t like the first version?', a: 'I’ll revise it. A single tag includes 2 revisions; the Brand Pack includes up to 10.' },
]

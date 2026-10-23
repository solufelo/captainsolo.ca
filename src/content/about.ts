// The About page and the résumé PDF (scripts/resume_pdf.mjs reads this file, so it imports nothing).
// Experience comes from his résumés, keeping only what holds up in public: no unverifiable numbers, grades, pay or
// how a job ended (2026-10-22 review). Credits come from public pages that name him; work on this site is read from site.ts.

export const intro =
  'I’m Solomon Olufelo, a videographer, web developer and music producer from Brampton. I film for Laurier Athletics, shoot and edit music videos and brand promos for GTA artists and businesses, build websites and web apps, and produce music as Solufelo. One person for the shoot, the site and the sound, so it all looks and sounds like one brand.'

/** The résumé's opening line (scripts/resume_pdf.mjs). */
export const summary =
  'Videographer, web developer and music producer from Brampton. Films for Laurier Athletics; directs, shoots and edits music videos and brand promos for GTA artists and businesses; designs and builds websites and web apps; produces music as Solufelo.'

export type Job = { role: string; org: string; place: string; when: string; points: string[] }

export const experience: Job[] = [
  {
    role: 'Video Assistant',
    org: 'Laurier Athletics & Recreation',
    place: 'Waterloo, ON',
    when: '2023 – present',
    points: [
      'Film Golden Hawks basketball, football and soccer, often on multi-camera setups.',
      'Edit highlight packages, trailers and social reels for Instagram, TikTok and YouTube.',
      'Build game-day broadcast graphics and 3D scenes, including the 2026 Senior Day videoboard opener.',
    ],
  },
  {
    role: 'Videographer, editor and web developer',
    org: 'Independent',
    place: 'Brampton and the GTA',
    when: '2020 – present',
    points: [
      'Brand promos, event coverage and social reels for local businesses, from DoubleRFades to Sevynn Shades Beauty Salon.',
      'Music videos for Kenoh, JFinesse, TGK, Yung Koba, Dela, J.V and FujiWill; edits and VFX for 10k Moss and No Losses Productions.',
      'Websites and web apps, designed, built and launched, from Captain Funds and Velare to StepWhiz and this site.',
    ],
  },
  {
    role: 'Music producer and voice-tag artist',
    org: 'Independent, as Solufelo',
    place: 'Online',
    when: '2019 – present',
    points: [
      'Custom producer tags, voice tags and DJ drops, delivered wet and dry with commercial rights.',
      'Producer as Solufelo on releases by MurchMan, Smoke Scar, Young Sun and others; songwriter on TGK’s “I’m An Artist”.',
    ],
  },
]

export const education = [
  { school: 'Wilfrid Laurier University', detail: 'Faculty of Arts, with coursework in computer science and film studies', when: '2021 – present' },
  { school: 'St. Roch Catholic Secondary School', detail: 'Regional Arts Media Program', when: '2018 – 2021' },
]

export const awards = [{ name: 'Skills Ontario medallist, 3D Animation', when: '2018' }]

export const tools = [
  { area: 'Camera and post', items: ['Sony A6100', 'Gimbal and multi-cam', 'Premiere Pro', 'After Effects', 'Photoshop', 'Blender'] },
  { area: 'Web', items: ['React', 'TypeScript', 'Next.js', 'Node.js', 'MongoDB', 'PostgreSQL', 'three.js', 'Cloudflare Workers'] },
  { area: 'Sound', items: ['Producer and voice tags', 'Mixing and mastering', 'Sound design'] },
]

/** Public posts that credit him, for work that has no case study here. */
export const postCredits = [
  { title: 'Studio vlog', who: 'JFinesse & TGK, The Only1 Collective', role: 'Collaboration', year: 2025, href: 'https://www.instagram.com/theonly1collective/reel/DSA2y48CQV8/' },
  { title: 'Homecoming', who: 'Laurier Golden Hawks football', role: 'Shot and edited', year: 2023, href: 'https://www.tiktok.com/@caaptainsolo/video/7282467680630672646' },
  { title: 'Win over Windsor', who: 'Laurier Golden Hawks football', role: 'Shot and edited', year: 2023, href: 'https://www.tiktok.com/@caaptainsolo/video/7290236072456391941' },
]

/** Music he produced, wrote or appears on, as the release credits him (as Solufelo, or as Solomon Olufelo for writing),
 *  on Apple Music, Tidal or the artist's YouTube. Newest first. Leased-beat placements on SoundCloud and co-produced
 *  type beats are left off (2026-10-22 music search). */
export const musicCredits = [
  { title: 'Five on Em', who: 'MurchMan', role: 'Producer', year: 2024, href: 'https://music.apple.com/us/album/five-on-em/1784687303?i=1784687307' },
  { title: 'Show Me Dat Print (feat. Solufelo)', who: 'Corey Montana', role: 'Producer, featured artist', year: 2024, href: 'https://music.apple.com/us/album/show-me-dat-print-feat-solufelo/1757376462?i=1757376464' },
  { title: 'transcend', who: 'Own release (EP)', role: 'Writer and artist', year: 2024, href: 'https://tidal.com/browse/album/394235037' },
  { title: 'try harder', who: 'Own release', role: 'Writer, artist and engineer', year: 2024, href: 'https://tidal.com/browse/album/405896662' },
  { title: 'I’m An Artist', who: 'TGK', role: 'Songwriter', year: 2023, href: 'https://music.apple.com/ca/album/im-an-artist/1709425850?i=1709425851' },
  { title: 'Leben wie ein Rockstar', who: 'Young Sun', role: 'Producer', year: 2022, href: 'https://www.youtube.com/watch?v=SRHzAW96NLE' },
  { title: 'Break Her Heart', who: 'Smoke Scar', role: 'Producer', year: 2022, href: 'https://music.apple.com/us/album/break-her-heart/1618839616?i=1618839617' },
  { title: 'bye lol (feat. Webstaw & Solufelo)', who: 'FujiWill', role: 'Featured artist, songwriter', year: 2021, href: 'https://tidal.com/browse/track/193335893' },
  { title: 'Five On Em (El Gallo Negro Intro)', who: 'MurchMan', role: 'Producer', year: 2021, href: 'https://music.apple.com/us/album/five-on-em-el-gallo-negro-intro/1573172124?i=1573172133' },
  { title: 'Rhinestone Ray', who: 'Adam Bowerman', role: 'Co-producer', year: 2020, href: 'https://music.apple.com/us/album/rhinestone-ray/1530778756?i=1530778761' },
  { title: 'Outro (I Gotta)', who: 'JSlime', role: 'Producer', year: 2020, href: 'https://tidal.com/browse/track/136418215' },
  { title: 'Find Yourself', who: 'AGM 2k', role: 'Co-producer', year: 2020, href: 'https://music.apple.com/us/album/find-yourself/1499071182?i=1499071184' },
  { title: 'Self Made', who: 'Rolla Spliff', role: 'Producer', year: 2019, href: 'https://music.apple.com/us/album/self-made/1482065914?i=1482065915' },
]

/** His beat and loop channels, with their public numbers as of the date given. */
export const channels = {
  asOf: 'October 2026',
  items: [
    { name: 'Beats on YouTube', stat: '868,000+ views across 334 uploads', href: 'https://www.youtube.com/@solufeloBEATS' },
    { name: 'Loops on Looperman', stat: '77,000+ downloads of 24 loops', href: 'https://www.looperman.com/users/profile/2820784' },
  ],
}

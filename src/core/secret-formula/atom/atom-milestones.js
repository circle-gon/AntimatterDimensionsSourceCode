export const atomMilestones = {
  am1: {
    collapses: 1,
    reward: () => `Start with the START perk, the Nameless Ones' storing
    time mechanic unlocked, Automator speed maxed,
    passive IP & EP generation (works while Doomed), and Reality Upgrades 'Existentially Prolong', 
    'The Telemechanical Process', and 'Effortless Existence'.
    Storing real time is now 100% efficent, unlock real time discharge, Eternity Challenges are 
    auto-completed ${formatX(40, 0)} faster, the Galaxy Generator production & animations 
    and Rift draining speed are ${formatX(2, 0)} faster, and skip the credits.`,
  },
  am2: {
    collapses: 2,
    reward: () => `Start with all one-time Doom upgrades, the rebuyable Reality Upgrade and
    Black Hole autobuyers, Reality Upgrade 'Parity of Singularity', Imaginary Upgrade
    'Vacuum Acceleration', and both black holes start unlocked and pernamently active. 
    Reality Upgrade 'The Knowing Existance' no longer fails if you have EC1 completions. The 
    Galaxy Generator production, animations and Rift draining speed are ${formatX(2, 0)} faster.`,
  },
  am3: {
    collapses: 3,
    reward: () => `Start with all perks, Teresa's Reality Machine drainer completely filled, 
    the perk shop maxed before Ra's perk shop expansion upgrade,  
    and all Dark Matter Dimension automation 
    (auto-Ascension, auto-DMD-upgrades, auto-Singularity, and auto-Annihilation),
    which also starts out maxed. Unlock Ra pets' Autobuyers, one more Rift can
    be filled simultaneously. The Galaxy Generator 
    production, animations, and Rift draining speed are ${formatX(2, 0)} faster.`,
  },
  am4: {
    collapses: 4,
    reward: `Start with Effarig and The Nameless Ones' upgrades and Reality completed
    and V's normal achievements at tier 2, and V is always unlocked. Unlock an Autobuyer 
    which produces Glyph Sacrifice passively through buying and selling Music Glyphs, 
    and more Automator commands & constants. The Galaxy Generator animation speed is now instant, 
    and the Momentum & Reality Upgrade 'Replicative Rapidity' effects are always maxed.
    Auto-unlock Time Dilation and Time Dimensions 5 through 8 while Doomed.`,
  },
  am5: {
    collapses: 5,
    reward: `Ra's pets now start at Level 5, V's normal achievements at tier 4 and hard
    achievements at tier 2, Laitela's Reality is destabilized once, keep the Dilation Upgrade
    autobuyers while Doomed, one more Rift can be filled simultaneously, and Infinity is broken,
    all pre-break Infinity upgrades are bought, the Big Crunch autobuyer is maxed 
    while Doomed, and unlock more Automator commands & constants. Start every Reality and Collapse with all 
    Eternity Challenges completed.` ,
  },
  am6: {
    time: TimeSpan.fromHours(10).totalMilliseconds,
    reward: `Ra's pets now start at Level 10, Laitela's Reality is destabilized three times,
    all Glyph Alchemy resources start at 5000, and unlock an Autobuyer for rebuyable Pelle Upgrades. 
    Start with Imaginary Upgrade 'Deterministic Radiation', two more post-Reality achievements
    (excluding Doomed Reality achievements) for every Collapse done, start with all Dilation and
    Eternity upgrades bought, and max the perk shop after Ra's perk shop expansion upgrade. Glyph 
    rarity is always at least 100%.`,
  },
  am7: {
    time: TimeSpan.fromHours(5).totalMilliseconds,
    reward: `Laitela's Reality is destabilized five times, all Glyph Alchemy resources start
    at 10000, unlock the Tesseract autobuyer, passively gain Remnants while Doomed, skip the
    Galaxy Generator animations, one more Rift can be filled simultaneously and all Rifts start
    out active, and auto-gain Tachyon Particles and auto-buy Time Theorems while Doomed. Glyphs
    always have all effects.`,
  },
  am8: {
    time: TimeSpan.fromHours(2).totalMilliseconds,
    reward: `Laitela's Reality is now fully destabilized, all Glyph Alchemy resources start
    at 15000, all V achievements start at tier 4 (including Hard), Ra's pets now start at Level 15,
    unlock an autobuyer for non-rebuyable Reality and Imaginary upgrades, they start out unlocked,
    and all Break Infinity upgrades bought & Replicanti unlocked while Doomed. Start every Armageddon
    with all Eternity Challenges completed.`,
  },
  am9: {
    time: TimeSpan.fromMinutes(40).totalMilliseconds,
    reward: `All Glyph Alchemy resources start at 20000, Ra's pets start at Level 20, 
    all V achievements start at tier 5 (including Hard), and all Infinity Challenges start out 
    completed and start with 100 Eternities while Doomed.`,
  },
  am10: {
    time: TimeSpan.fromMinutes(20).totalMilliseconds,
    reward: `All Glyph Alchemy resources start at 25000, Ra's pets start at Level 25, 
    V normal achievements start at tier 6, all Infinity upgrades are charged, and start with one
    level 25000 Reality Glyph.`,
  },
};

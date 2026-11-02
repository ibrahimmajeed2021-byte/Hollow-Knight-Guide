// Boss data adapted from the Hollow Knight Wiki (https://hollowknight.wiki), CC BY-SA.
export const silksongBosses = [
  {
    name: "Bell Beast",
    image: "BellBeast",
    act: 1,
    description:
      "This one has allied themself with me, either as thanks for their saving or respect for one judged as equal. Whichever the reason, their fellowship is welcome.",
    health: "150",
    locations: [{ name: "The Marrow" }],
    reward: "Silk Heart; fast travel via Bellways",
  },
  {
    name: "Fourth Chorus",
    image: "FourthChorus",
    act: 1,
    description:
      "A terrifying achievement of Pharloom, to build a construct so large and yet so nimble.",
    health: "500",
    locations: [{ name: "Far Fields" }],
    reward: "None",
  },
  {
    name: "Great Conchflies",
    image: "GreatConchflies",
    act: 1,
    description:
      "To pair with another is a base instinct, and one that brings some bugs great joy. I once sought similar union, but of my own mates none could match my lifespan.",
    health: "400 (shared)",
    locations: [{ name: "Blasted Steps" }],
    reward: "Access to Pinstress and Sands of Karak",
  },
  {
    name: "Lace (Deep Docks)",
    image: "LaceDeepDocks",
    act: 1,
    description:
      "A bug born entirely of thread. Much Silk would have been needed to see her sustained. A fragile form of life, but life nonetheless.",
    health: "250",
    locations: [{ name: "Deep Docks" }],
    reward: "Bellshrine",
  },
  {
    name: "Last Judge",
    image: "LastJudge",
    act: 1,
    description:
      "The huge Judge likely stood through countless generations, never defeated, never wavering in their charge.",
    health: "720",
    locations: [{ name: "Blasted Steps" }],
    reward: "Access to The Citadel",
  },
  {
    name: "Moorwing",
    image: "Moorwing",
    act: 1,
    description:
      "With its wranglers long dead, the Moorwing stalked the towers of Greymoor, feasting on passing pilgrims and tenders alike.",
    health: "600 / 1200",
    locations: [{ name: "Greymoor" }],
    reward: "Access to Bellhart",
  },
  {
    name: "Moss Mother (Ruined Chapel)",
    image: "MossMotherRuinedChapel",
    act: 1,
    description:
      "Motherhood is an instinct that can push creatures beyond what seems their natural limits. It turns even weaker beasts like these into formidable foes.",
    health: "120",
    locations: [{ name: "Ruined Chapel" }],
    reward: "Access to Bone Bottom",
  },
  {
    name: "Moss Mother (Weavenest Atla)",
    image: "MossMotherWeavenestAtla",
    act: 1,
    description:
      "Motherhood is an instinct that can push creatures beyond what seems their natural limits. It turns even weaker beasts like these into formidable foes.",
    health: "350 / 700",
    locations: [{ name: "Weavenest Atla" }],
    reward: "Weavelight",
  },
  {
    name: "Phantom",
    image: "Phantom",
    act: 1,
    description:
      "Though grey with age, their frayed form suggested a being strung from Silk, one who welcomed a decisive end in combat over a slow decline.",
    health: "650",
    locations: [{ name: "Exhaust Organ" }],
    reward: "Cross Stitch; access to The Citadel",
  },
  {
    name: "Savage Beastfly (Chapel of the Beast)",
    image: "SavageBeastflyChapeloftheBeast",
    act: 1,
    description:
      "The Savage Beastfly is a boss in Hollow Knight: Silksong. It is an angered adult Beastfly with a weighted body and hardshell mask. It is first encountered in the Chapel of the Beast blocking the Beast Crest. A second one can be found in Far Fields during the Savage Beastfly wish.",
    health: "550 / 1100",
    locations: [{ name: "Chapel of the Beast" }],
    reward: "Beast Crest",
  },
  {
    name: "Sister Splinter",
    image: "SisterSplinter",
    act: 1,
    description:
      "This one lived long and fed much. The wood will be much safer for their slaying.",
    health: "310",
    locations: [{ name: "Shellwood" }],
    reward: "Access to Cling Grip",
  },
  {
    name: "Skull Tyrant (The Marrow & Bone Bottom)",
    image: "SkullTyrantTheMarrowBoneBottom",
    act: 1,
    description:
      "The Skull Tyrant is a boss in Hollow Knight: Silksong. It is a rare, giant Skull Scuttler and the largest predator of the Marrow. It can first be found as the objective of The Terrible Tyrant wish. Completing this wish creates a chance for a second Skull Tyrant to rampage through Bone Bottom's settlement.",
    health: "450 / 900",
    locations: [{ name: "The Marrow" }, { name: "Bone Bottom" }],
    reward: "Crown Fragment",
  },
  {
    name: "Widow",
    image: "Widow",
    act: 1,
    description:
      "Her body seemed a Weaver's, but her mask had been forcibly removed, and her own Silk was bound useless by heavy pins lodged through her spine.",
    health: "360",
    locations: [{ name: "Bellhart" }],
    reward: "Needolin; breaks the curse ensnaring Bellhart",
  },
  {
    name: "Broodmother",
    image: "Broodmother",
    act: 2,
    description:
      "With this one vanquished, I hope to have sped the end for that jail and its distasteful order.",
    health: "700",
    locations: [{ name: "The Slab" }],
    reward: "Broodmother's Eye",
  },
  {
    name: "Cogwork Dancers",
    image: "CogworkDancers",
    act: 2,
    description:
      "Two cogwork bugs, and yet the soul seemed singular? A sad, yet masterful imitation of life, imbued inside shells of iron.",
    health: "630 each (phases 1-3), 180 (phase 4)",
    locations: [{ name: "Cogwork Core" }],
    reward: "Access to the rest of Cogwork Core",
  },
  {
    name: "Disgraced Chef Lugoli",
    image: "DisgracedChefLugoli",
    act: 2,
    description:
      "Returned to their home caves, this chef continued to devise delicacies too repulsive for any bug still sane.",
    health: "600 / 1200",
    locations: [{ name: "Sinner's Road" }],
    reward: "Pickled Muckmaggot",
  },
  {
    name: "Father of the Flame",
    image: "FatheroftheFlame",
    act: 2,
    description:
      "The remains of an aged bug were housed at the pyre's heart. The structure suggested they wished for immolation. If so, I have seen their wish granted.",
    health: "650 total",
    locations: [{ name: "Wisp Thicket" }],
    reward: "Wispfire Lantern",
  },
  {
    name: "First Sinner",
    image: "FirstSinner",
    act: 2,
    description:
      "This one's husk held a masterful talent, to weave Silk into blazing runes. Throughout my life, I have seen runes woven for many tasks. Was she the first to hone such skills?",
    health: "1300",
    locations: [{ name: "The Slab" }],
    reward: "Rune Rage",
  },
  {
    name: "Forebrothers Signis & Gron",
    image: "ForebrothersSignisGron",
    act: 2,
    description:
      "Forebrothers Signis & Gron are a dual main boss in Hollow Knight: Silksong. They are the elder overseers of the Deep Docks and its workers. They block the path to the Diving Bell required for the SEEK: The Dark Below objectives.",
    health: "720 (Signis), 520 (Gron)",
    locations: [{ name: "Deep Docks" }],
    reward: "Access to the Diving Bell",
  },
  {
    name: "Garmond and Zaza",
    image: "GarmondandZaza",
    act: 2,
    description:
      "They too seek the spectre at the Haunting's heart, though I fear that foe would pose a challenge beyond their mortal limits.",
    health: "460",
    locations: [{ name: "Whispering Vaults" }],
    reward: "Ability to help in the High Halls gauntlet",
  },
  {
    name: "Grand Mother Silk",
    image: "GrandMotherSilk",
    act: 2,
    description:
      "Heart of the Haunting, long lulled to slumber and desperate to wake. The higher being's threads stretched throughout Pharloom, snaring its bugs and driving them to madness and discord.",
    health: "1224 total",
    locations: [{ name: "The Cradle" }],
    reward: "Ending (Weaver Queen / Snared Silk / Twisted Child)",
  },
  {
    name: "Groal the Great",
    image: "GroaltheGreat",
    act: 2,
    description:
      "This one's strength was much enhanced by stolen soul. They are not the first who tried to hoard it, or to mould it towards such violent ends.",
    health: "650",
    locations: [{ name: "Bilewater" }],
    reward: "A Bench; Seeker's Soul",
  },
  {
    name: "Lace (The Cradle)",
    image: "LaceTheCradle",
    act: 2,
    description:
      "A bug born entirely of thread. Much Silk would have been needed to see her sustained. A fragile form of life, but life nonetheless.",
    health: "800",
    locations: [{ name: "The Cradle" }],
    reward: "Silk Heart",
  },
  {
    name: "Raging Conchfly",
    image: "RagingConchfly",
    act: 2,
    description:
      "To pair with another is a base instinct, and one that brings some bugs great joy. I once sought similar union, but of my own mates none could match my lifespan.",
    health: "820",
    locations: [{ name: "Sands of Karak" }],
    reward: "Access to Coral Tower and Conchcutter",
  },
  {
    name: "Savage Beastfly (Far Fields)",
    image: "SavageBeastflyFarFields",
    act: 2,
    description:
      "The Savage Beastfly is a boss in Hollow Knight: Silksong. It is an angered adult Beastfly with a weighted body and hardshell mask. It is first encountered in the Chapel of the Beast blocking the Beast Crest. A second one can be found in Far Fields during the Savage Beastfly wish.",
    health: "650 / 1300",
    locations: [{ name: "Far Fields" }],
    reward: "Horn Fragment",
  },
  {
    name: "Second Sentinel",
    image: "SecondSentinel",
    act: 2,
    description:
      "The Second Sentinel is an NPC and quest boss in Hollow Knight: Silksong. An automaton once tasked with defending the pilgrims of the Citadel, it can be reawakened after assembling the Cogheart. Its defeat is the objective of the Final Audience wish which grants the Reserve Bind.",
    health: "800",
    locations: [{ name: "High Halls" }],
    reward: "Reserve Bind",
  },
  {
    name: "Shakra",
    image: "Shakra",
    act: 2,
    description:
      "She has lived a mere fraction of my lifetime and yet her rings prove a ferocious match. As gifted a warrior as I have ever encountered, and one I am fortunate to call a friend.",
    health: "600",
    locations: [{ name: "Greymoor" }],
    reward: "None",
  },
  {
    name: "Summoned Saviour",
    image: "SummonedSaviour",
    act: 2,
    description:
      "A creature born of a bug's desperate hope for strength. Few possess the skill to call the void, and of those that can, none possess the means to tame it.",
    health: "500",
    locations: [{ name: "Bonegrave" }],
    reward: "None",
  },
  {
    name: "The Unravelled",
    image: "TheUnravelled",
    act: 2,
    description:
      "The Unravelled is a boss in Hollow Knight: Silksong. It is a mass of the tormented will of countless husks, manifested in a pit of Silk dregs deep within the Whiteward. Defeating it summons a Silk Heart and opens a passageway between the Whiteward and the Underworks.",
    health: "1000",
    locations: [{ name: "Whiteward" }],
    reward: "Silk Heart; Psalm Cylinder",
  },
  {
    name: "Trobbio",
    image: "Trobbio",
    act: 2,
    description:
      "His desire to see Pharloom saved may have been well intentioned, but he seemed quite happy for others to die upon the stage in pursuit of his goal.",
    health: "700",
    locations: [{ name: "The Stage" }],
    reward: "Claw Mirror; access to the Vaultkeeper's Melody",
  },
  {
    name: "Voltvyrm",
    image: "Voltvyrm",
    act: 2,
    description:
      "Barely a bug, and possessing only basic thought, yet instinct alone proved enough to turn it deadly.",
    health: "550",
    locations: [{ name: "Voltnest" }],
    reward: "Volt Filament",
  },
  {
    name: "Bell Eater",
    image: "BellEater",
    act: 3,
    description:
      "A monster in the classic form of tales from youth. Its slaying was done as much by my fierce travelling companion as by myself.",
    health: "800",
    locations: [{ name: "Bellways" }],
    reward: "Travel via Bellways; Beastling Call",
  },
  {
    name: "Clover Dancers",
    image: "CloverDancers",
    act: 3,
    description:
      "For one to love another so similar to themselves, is that selfless or vain?",
    health: "1160",
    locations: [{ name: "Lost Verdania" }],
    reward: "Conjoined Heart",
  },
  {
    name: "Crawfather",
    image: "Crawfather",
    act: 3,
    description:
      "Did he recognise my part played in this land's void-strung state? If so, perhaps his judgment was not unfair. To these bugs I have brought much destruction.",
    health: "1300",
    locations: [{ name: "Craw Lake" }],
    reward: "Craw Memento; Crawbell",
  },
  {
    name: "Crust King Khann",
    image: "CrustKingKhann",
    act: 3,
    description:
      "For his stern stewardship his legions seemed utterly loyal. For less combative bugs his would have been a hard rule.",
    health: "1650",
    locations: [{ name: "Coral Tower" }],
    reward: "Encrusted Heart",
  },
  {
    name: "Gurr the Outcast",
    image: "GurrtheOutcast",
    act: 3,
    description:
      "His tracks and traps... It should have been obvious from the start, this old hunter sought to draw me in. But what reason drove him to test himself so brutally? That answer I suspect I shall never know.",
    health: "1000",
    locations: [{ name: "Far Fields" }],
    reward: "Grass Doll",
  },
  {
    name: "Lost Garmond",
    image: "LostGarmond",
    act: 3,
    description:
      "A tragic fate for a once honourable bug. Those void soaked threads... Their physical might is nothing compared to the corruption they wreak upon a soul.",
    health: "900",
    locations: [{ name: "Blasted Steps" }],
    reward: "Hero's Memento",
  },
  {
    name: "Lost Lace",
    image: "LostLace",
    act: 3,
    description:
      "To quell the mother's rage, and see this kingdom saved, I will claim her back. This one... the dark shall not take.",
    health: "1800",
    locations: [{ name: "The Abyss" }],
    reward: "Sister of the Void ending",
  },
  {
    name: "Nyleth",
    image: "Nyleth",
    act: 3,
    description:
      "Her presence would once have maintained the wood's fragile order, allowing the safe passage of bugs across its branches.",
    health: "1250",
    locations: [{ name: "Grand Gate" }],
    reward: "Pollen Heart",
  },
  {
    name: "Palestag",
    image: "Palestag",
    act: 3,
    description:
      "Myth made real in memory. The creature seemed completely at one with the flora around it. Did it ever truly exist as I have seen it?",
    health: "480",
    locations: [{ name: "Lost Verdania" }],
    reward: "5 memory orbs",
  },
  {
    name: "Pinstress",
    image: "Pinstress",
    act: 3,
    description:
      "I like her. For her willingness to teach and her spirit still strong, despite a long age spent solitary... she has my respect.",
    health: "910",
    locations: [{ name: "Mount Fay" }],
    reward: "Pin Badge",
  },
  {
    name: "Plasmified Zango",
    image: "PlasmifiedZango",
    act: 3,
    description:
      "He carelessly seeded these caves with that cursed substance... His final fate seems fair reward for those efforts, yet I feel some sympathy. It is an alluring power.",
    health: "1000",
    locations: [{ name: "Wormways" }],
    reward: "None",
  },
  {
    name: "Shrine Guardian Seth",
    image: "ShrineGuardianSeth",
    act: 3,
    description:
      "He offered fair warning and challenge, a duel in the purest sense. I admire his honour, and his skill.",
    health: "1185",
    locations: [{ name: "Grand Gate" }],
    reward: "Access to Nyleth's Shrine",
  },
  {
    name: "Skarrsinger Karmelita",
    image: "SkarrsingerKarmelita",
    act: 3,
    description:
      "This graceful ruler once possessed skill to rival my own. At her youthful peak, her voice united all Skarr in her service.",
    health: "1500",
    locations: [{ name: "Far Fields" }],
    reward: "Hunter's Heart",
  },
  {
    name: "Tormented Trobbio",
    image: "TormentedTrobbio",
    act: 3,
    description:
      "This one chose to embrace the doom to come. I shall not share such easy surrender.",
    health: "950",
    locations: [{ name: "The Stage" }],
    reward: "Dark Mirror",
  },
  {
    name: "Watcher at the Edge",
    image: "WatcherattheEdge",
    act: 3,
    description:
      "They held long at their vigil, far beyond the age of their brethren, yet still when roused they swung their blade with remarkable ease.",
    health: "900",
    locations: [{ name: "Sands of Karak" }],
    reward: "Grey Memento",
  },
];

export const INITIAL_FASHION_PRODUCTS = [
  // --- WOMEN'S COUTURE & ATELIER ---
  {
    _id: "prod_w01",
    name: "The Deepika Aurelia Silk Draped Gown",
    price: 6499,
    category: "Evening Gowns",
    gender: "Women",
    stock: 14,
    isNew: true,
    isBestseller: true,
    edition: "MUSE: DEEPIKA PADUKONE / CANNES ARCHIVE",
    celebrity: "Deepika Padukone",
    material: "100% Heavyweight Mulberry Silk (28 Momme)",
    madeIn: "Como & Mumbai Atelier",
    fit: "Fluid bias cut, falls effortlessly to floor length with a sweeping train",
    colors: [
      { name: "Obsidian Black", hex: "#111111" },
      { name: "Champagne Pearl", hex: "#E8DEC8" },
      { name: "Cypress Green", hex: "#2E3D30" }
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85",
    hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85",
    description: "Floor-length pure silk gown featuring an architectural cowl neckline, precision bias drape, and a sculptured low back designed for Deepika Padukone's international red carpet appearances."
  },
  {
    _id: "prod_w02",
    name: "The Kareena Sartorial Double-Breasted Blazer Dress",
    price: 5999,
    category: "Blazer Dresses",
    gender: "Women",
    stock: 18,
    isNew: true,
    edition: "MUSE: KAREENA KAPOOR KHAN / ROYAL SARTORIAL",
    celebrity: "Kareena Kapoor Khan",
    material: "Super 120s Italian Virgin Wool & Duchesse Satin Lapel",
    madeIn: "Biella & Bandra Atelier",
    fit: "Sculpted hour-glass power silhouette with defined royal shoulder pads",
    colors: [
      { name: "Raw Umber", hex: "#2B2623" },
      { name: "Chalk White", hex: "#F2EFE9" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
    hoverImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85",
    description: "Tailored with bespoke Italian craftsmanship and Indian regal precision, featuring structured architectural shoulders, satin peak lapels, and horn buttons."
  },
  {
    _id: "prod_w03",
    name: "The Sobhita Nocturne Plush Velvet Draped Mini",
    price: 5299,
    category: "Cocktail Dresses",
    gender: "Women",
    stock: 12,
    isBestseller: true,
    edition: "MUSE: SOBHITA DHULIPALA / SOIREE NOIR",
    celebrity: "Sobhita Dhulipala",
    material: "Silk-Blend High-Lustre Velvet & Crepe Silk",
    madeIn: "Lyon & Mumbai Studio",
    fit: "Form-fitting bodice with cascading side drape and fluid asymmetry",
    colors: [
      { name: "Deep Obsidian", hex: "#0D0D0E" },
      { name: "Midnight Bordeaux", hex: "#381119" }
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1200&q=85",
    hoverImage: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1200&q=85",
    description: "Sultry plush velvet silhouette cut with asymmetric draping across the bodice, handcrafted for Sobhita Dhulipala's premiere nights and cinema soirees."
  },
  {
    _id: "prod_w04",
    name: "The Kiara Elysian Pleated Organza Maxi",
    price: 7899,
    category: "Evening Gowns",
    gender: "Women",
    stock: 9,
    edition: "MUSE: KIARA ADVANI / CEREMONIAL DREAMS",
    celebrity: "Kiara Advani",
    material: "Silk Organza & Tonal Chiffon Underlay",
    madeIn: "Florence & Jaipur Atelier",
    fit: "Airy architectural volume with cinched grosgrain waist",
    colors: [
      { name: "Ecrù Alabaster", hex: "#EDE8DD" },
      { name: "Slate Mist", hex: "#9BA2A2" }
    ],
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=1200&q=85",
    hoverImage: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85",
    description: "Sculptural evening statement showcasing micro-accordion pleated organza that catches light with every measured movement, beloved by Kiara Advani."
  },
  {
    _id: "prod_w05",
    name: "The Samantha Ischia Tiered Muslin Sundress",
    price: 3899,
    category: "Summer Dresses",
    gender: "Women",
    stock: 25,
    edition: "MUSE: SAMANTHA RUTH PRABHU / RESORT EDITION",
    celebrity: "Samantha Ruth Prabhu",
    material: "100% GOTS Certified Organic Cotton & Handloom Linen",
    madeIn: "Goa & Varanasi Loom",
    fit: "Relaxed fluid tiered body with adjustable silk ribbon ties",
    colors: [
      { name: "Natural Ecru", hex: "#F3EDE2" },
      { name: "Sun Bleached Terracotta", hex: "#C77B61" }
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85",
    hoverImage: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=85",
    description: "Breezy bohemian refinement made for Mediterranean sun-drenched retreats and effortless coastal living, styled by Samantha Ruth Prabhu."
  },
  {
    _id: "prod_w06",
    name: "The Priyanka Verona Minimalist Silk Slip",
    price: 4699,
    category: "Evening Gowns",
    gender: "Women",
    stock: 16,
    edition: "MUSE: PRIYANKA CHOPRA JONAS / MET GALA ARCHIVE",
    celebrity: "Priyanka Chopra Jonas",
    material: "100% Sandwashed Silk Crepe de Chine",
    madeIn: "Como & Bandra Atelier",
    fit: "Clean 90s minimalist silhouette with subtle scoop neckline",
    colors: [
      { name: "Pure Sand", hex: "#DFD9CE" },
      { name: "Raven Black", hex: "#1A1A1A" }
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=85",
    hoverImage: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=85",
    description: "An understated study in proportion and tactile softness, tailored to be worn alone or layered under sartorial outerwear."
  },

  // --- MEN'S SARTORIAL & BESPOKE ---
  {
    _id: "prod_m01",
    name: "The Ranveer Milano Double-Breasted Wool Suit",
    price: 9999,
    category: "Suits & Tailoring",
    gender: "Men",
    stock: 10,
    isNew: true,
    isBestseller: true,
    edition: "MUSE: RANVEER SINGH / SARTORIAL BESPOKE",
    celebrity: "Ranveer Singh",
    material: "Super 130s Extra-Fine Italian Wool by Loro Piana Mill",
    madeIn: "Naples & Bandra Bespoke Room",
    fit: "Neapolitan natural shoulder (spalla camicia) with gently tapered trousers",
    colors: [
      { name: "Charcoal Mélange", hex: "#2C2D30" },
      { name: "Midnight Navy", hex: "#18202F" },
      { name: "Camel", hex: "#B89B72" }
    ],
    sizes: ["38R", "40R", "42R", "44R"],
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85",
    hoverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
    description: "Unstructured Neapolitan tailoring with hand-stitched pick lapels, double back vents, and natural horn buttons created for Ranveer Singh's iconic award moments."
  },
  {
    _id: "prod_m02",
    name: "The Ranbir Kensington Pure Cashmere Overcoat",
    price: 8999,
    category: "Outerwear & Coats",
    gender: "Men",
    stock: 8,
    edition: "MUSE: RANBIR KAPOOR / ARCHIVAL HEIRLOOM",
    celebrity: "Ranbir Kapoor",
    material: "90% Mongolian Cashmere, 10% Virgin Wool",
    madeIn: "London & Kashmir Atelier",
    fit: "Relaxed tailored drape over tailoring, hits below the knee",
    colors: [
      { name: "Camel Tan", hex: "#B78A5B" },
      { name: "Charcoal Flannel", hex: "#323338" }
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=85",
    hoverImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
    description: "An heirloom outer layer designed with substantial weight, cupro silk-feel lining, deep storm welt pockets, and a timeless collar as worn by Ranbir Kapoor."
  },
  {
    _id: "prod_m03",
    name: "The Shah Rukh Khan Savile Row Grosgrain Tuxedo",
    price: 11499,
    category: "Suits & Tailoring",
    gender: "Men",
    stock: 6,
    isBestseller: true,
    edition: "MUSE: SHAH RUKH KHAN / BLACK TIE CEREMONIAL",
    celebrity: "Shah Rukh Khan",
    material: "Super 150s Wool with Pure Silk Grosgrain Shawl Facings",
    madeIn: "London & Mannat Studio Fitting",
    fit: "Structured slim ceremonial silhouette, kingly proportions",
    colors: [
      { name: "Midnight Obsidian", hex: "#0E1118" }
    ],
    sizes: ["38R", "40R", "42R", "44R"],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
    hoverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85",
    description: "The pinnacle of formalwear: silk grosgrain shawl lapel, jetted hip pockets, and trousers with silk side-braid stripe designed exclusively for King Khan."
  },
  {
    _id: "prod_m04",
    name: "The Siddhant Riviera Pure Flax Overshirt",
    price: 3499,
    category: "Linen & Shirts",
    gender: "Men",
    stock: 22,
    isNew: true,
    edition: "MUSE: SIDDHANT CHATURVEDI / STREET SARTORIAL",
    celebrity: "Siddhant Chaturvedi",
    material: "100% French Normandy Long-Staple Flax Linen",
    madeIn: "Normandy & Juhu Atelier",
    fit: "Relaxed boxy cut with dropped shoulders and mother-of-pearl buttons",
    colors: [
      { name: "Chalk Off-White", hex: "#ECE8DD" },
      { name: "Raw Sage", hex: "#7E8879" },
      { name: "Washed Navy", hex: "#2A374A" }
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85",
    hoverImage: "https://images.unsplash.com/photo-1620012253295-c15c429fccf8?auto=format&fit=crop&w=1200&q=85",
    description: "Garment-washed French flax linen that develops a softer hand and refined drape with every wear. Favored by Siddhant Chaturvedi for effortless coastal styling."
  },
  {
    _id: "prod_m05",
    name: "The Hrithik Tuscan Nappa Leather Blouson",
    price: 8499,
    category: "Blazers & Jackets",
    gender: "Men",
    stock: 11,
    edition: "MUSE: HRITHIK ROSHAN / ACTION COUTURE",
    celebrity: "Hrithik Roshan",
    material: "100% Full-Grain Tuscan Nappa Lambskin",
    madeIn: "Florence & Mumbai Workshop",
    fit: "Clean tailored blouson with brushed nickel hardware and silk lining",
    colors: [
      { name: "Matte Black", hex: "#161616" },
      { name: "Espresso Brown", hex: "#2B1E17" }
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=85",
    hoverImage: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85",
    description: "Exceptional butter-soft Italian lambskin with a minimal stand collar, Swiss Raccagni two-way zip, and silk-lined interior pockets tailored for Hrithik Roshan."
  },
  {
    _id: "prod_m06",
    name: "The Vicky Kaushal Extrafine Merino Waffle Knit",
    price: 3699,
    category: "Knitwear",
    gender: "Men",
    stock: 19,
    edition: "MUSE: VICKY KAUSHAL / WINTER ARCHIVE",
    celebrity: "Vicky Kaushal",
    material: "100% Australian 19.5-Micron Merino Wool",
    madeIn: "Biella & Punjab Weaving Room",
    fit: "Subtly relaxed silhouette with dense thermal knit structure",
    colors: [
      { name: "Oatmeal Heather", hex: "#DCD5C9" },
      { name: "Deep Charcoal", hex: "#222326" }
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85",
    hoverImage: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1200&q=85",
    description: "Knitted from resilient, breathable merino yarn with a dimensional micro-waffle structure that provides lightweight warmth across all seasons."
  }
];

export const CAMPAIGN_LOOKS = [
  {
    id: "look_01",
    title: "DEEPIKA — CANNES SILK ARCHIVE",
    subtitle: "A deliberate exercise in restraint, pure 28 momme silk, and architectural drape.",
    celebrity: "Deepika Padukone",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85",
    tag: "LOOK 01 / RED CARPET",
    link: "/products?gender=Women"
  },
  {
    id: "look_02",
    title: "RANVEER — BESPOKE SARTORIAL",
    subtitle: "Unstructured Neapolitan shoulders, hand-picked lapels, and Loro Piana wool.",
    celebrity: "Ranveer Singh",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85",
    tag: "LOOK 02 / SARTORIAL",
    link: "/products?gender=Men"
  },
  {
    id: "look_03",
    title: "SHAH RUKH KHAN — BLACK TIE NOCTURNE",
    subtitle: "Midnight grosgrain shawl lapel tuxedo cut to monarchial proportions.",
    celebrity: "Shah Rukh Khan",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
    tag: "LOOK 03 / CEREMONIAL",
    link: "/products?gender=Men"
  },
  {
    id: "look_04",
    title: "SOBHITA — VENICE BIAS CUT",
    subtitle: "Fluid drape, natural sandwashed silk, and 90s cinema minimalism.",
    celebrity: "Sobhita Dhulipala",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
    tag: "LOOK 04 / EDITORIAL",
    link: "/products?gender=Women"
  }
];

export const EDITORIAL_STORIES = [
  {
    id: "story_01",
    quote: "True luxury is not loud. When I step onto the red carpet in Cannes or Venice, it is the weight of the silk and the quiet hand-stitched tailoring that gives me poise.",
    author: "Deepika Padukone",
    role: "Global Actor & Atelier Patron",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
    step: "01 / RED CARPET POISE"
  },
  {
    id: "story_02",
    quote: "Every suit I wear must tell a story of unyielding character. The double-breasted Neapolitan cut by this atelier is my second skin.",
    author: "Ranveer Singh",
    role: "Actor & Sartorial Icon",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
    step: "02 / BESPOKE TAILORING"
  },
  {
    id: "story_03",
    quote: "A gentleman requires only a midnight black tuxedo cut flawlessly from Super 150s wool. Simplicity and timeless grace will always outshine passing fads.",
    author: "Shah Rukh Khan",
    role: "Actor & Cultural Ambassador",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85",
    step: "03 / TIMELESS GRACE"
  }
];

export const GENDERS = ["All", "Women", "Men"];

export const WOMEN_CATEGORIES = [
  "All",
  "Evening Gowns",
  "Blazer Dresses",
  "Cocktail Dresses",
  "Summer Dresses"
];

export const MEN_CATEGORIES = [
  "All",
  "Suits & Tailoring",
  "Outerwear & Coats",
  "Blazers & Jackets",
  "Linen & Shirts",
  "Knitwear"
];

export const ALL_CATEGORIES = [
  "All",
  "Evening Gowns",
  "Suits & Tailoring",
  "Outerwear & Coats",
  "Blazers & Jackets",
  "Cocktail Dresses",
  "Blazer Dresses",
  "Linen & Shirts",
  "Summer Dresses",
  "Knitwear"
];

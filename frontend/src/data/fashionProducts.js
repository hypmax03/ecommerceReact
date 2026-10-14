export const INITIAL_FASHION_PRODUCTS = [];

export const CAMPAIGN_LOOKS = [
  {
    id: "look_01",
    title: "CHAPTER 01 — THE SILK ARCHIVE",
    subtitle: "A study in proportion, 28 momme mulberry silk, and fluid architectural drape.",
    celebrity: "Atelier Series",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85",
    tag: "LOOK 01 / OCCASIONWEAR",
    link: "/products?gender=Women"
  },
  {
    id: "look_02",
    title: "CHAPTER 02 — BESPOKE SARTORIAL",
    subtitle: "Unstructured Neapolitan shoulders, hand-picked lapels, and Super 130s wool.",
    celebrity: "Atelier Series",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85",
    tag: "LOOK 02 / SARTORIAL",
    link: "/products?gender=Men"
  },
  {
    id: "look_03",
    title: "CHAPTER 03 — BLACK TIE NOCTURNE",
    subtitle: "Midnight grosgrain shawl lapel tuxedo cut to timeless proportions.",
    celebrity: "Atelier Series",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
    tag: "LOOK 03 / FORMALWEAR",
    link: "/products?gender=Men"
  },
  {
    id: "look_04",
    title: "CHAPTER 04 — SUMMER LINEN & SILK",
    subtitle: "Fluid drape, natural sandwashed silk, and understated everyday elegance.",
    celebrity: "Atelier Series",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
    tag: "LOOK 04 / ESSENTIALS",
    link: "/products?gender=Women"
  }
];

export const EDITORIAL_STORIES = [
  {
    id: "story_01",
    quote: "True luxury is quiet. It is defined by the integrity of the weave, the balance of the cut, and how naturally a garment moves with you.",
    author: "Elena Rostova",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
    step: "01 / CONSIDERED DESIGN"
  },
  {
    id: "story_02",
    quote: "Every garment must possess architectural balance. When tailoring a suit, the natural shoulder and hand-finished lapel make it feel effortless.",
    author: "Marco Bellini",
    role: "Master Tailor",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
    step: "02 / BESPOKE CRAFT"
  },
  {
    id: "story_03",
    quote: "We design pieces meant to be worn for decades, not discarded after a season. Simplicity and noble fibers always outlast passing trends.",
    author: "Julian Vance",
    role: "Textile Curator",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85",
    step: "03 / TIMELESS ENDURANCE"
  }
];

export const GENDERS = ["All", "Women", "Men", "Unisex"];

export const WOMEN_CATEGORIES = [
  "All",
  "Bags & Leather Goods",
  "Evening Gowns",
  "Blazer Dresses",
  "Cocktail Dresses",
  "Summer Dresses"
];

export const MEN_CATEGORIES = [
  "All",
  "Bags & Leather Goods",
  "Suits & Tailoring",
  "Outerwear & Coats",
  "Blazers & Jackets",
  "Linen & Shirts",
  "Knitwear"
];

export const ALL_CATEGORIES = [
  "All",
  "Bags & Leather Goods",
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

export const ATELIER_BAGS = [
  {
    _id: "bag_01",
    name: "The Minimalist Box Crossbody",
    price: 7899,
    category: "Bags & Leather Goods",
    silhouette: "Crossbody & Shoulder",
    gender: "Women",
    material: "Full-Grain Italian Box Calfskin & Brushed Solid Brass",
    description: "An architectural box crossbody meticulously sculpted from rigid box calfskin that patinas beautifully over years of wear. Features a concealed magnetic flap with custom brushed brass turn-lock, edge-painted margins, and an adjustable shoulder strap.",
    dimensions: "22cm (W) × 15cm (H) × 7cm (D)",
    strapDrop: "48cm – 56cm (Adjustable)",
    hardware: "Solid Antiqued Brass",
    lining: "Sand-Washed Suede Interior with Zip Docket",
    stock: 12,
    colors: [
      {
        name: "Obsidian Box Calf",
        hex: "#1A1918",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85",
      },
      {
        name: "Cognac Saddle",
        hex: "#8C4A2F",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
      },
      {
        name: "Ivory Grain",
        hex: "#ECE5D8",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85",
      },
    ],
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
    ],
    details: [
      "Vegetable-tanned Tuscan leather with hand-burnished edges",
      "Concealed magnetic frame with turn-lock closure",
      "Divided dual compartment with debossed leather card slot",
      "Complimentary blind debossed monogramming available",
    ],
  },
  {
    _id: "bag_02",
    name: "The Oversized Tuscan Saddle Tote",
    price: 11499,
    category: "Bags & Leather Goods",
    silhouette: "Totes & Shoppers",
    gender: "Unisex",
    material: "Hand-Waxed Tuscan Vachetta Leather",
    description: "An unlined everyday tote cut from supple 2.2mm vegetable-tanned vachetta leather. Carries work folios, notebooks, and up to a 15-inch laptop with effortless sartorial ease. Detailed with saddle-stitched rolled leather handles and a detachable interior zip pouch.",
    dimensions: "40cm (W) × 32cm (H) × 16cm (D)",
    strapDrop: "26cm (Shoulder Clearance)",
    hardware: "Hand-Hammered Raw Brass Rivets",
    lining: "Raw Natural Leather Backing with Tethered Pouch",
    stock: 8,
    colors: [
      {
        name: "Cognac Saddle",
        hex: "#8C4A2F",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
      },
      {
        name: "Matte Black",
        hex: "#1A1918",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85",
      },
    ],
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
    ],
    details: [
      "Reinforced double-layered bottom with protective brass studs",
      "Accommodates up to 15.6” laptops & folio folders",
      "Hand-finished beeswax burnishing along exterior perimeter",
    ],
  },
  {
    _id: "bag_03",
    name: "The Pleated Silk Evening Minaudière",
    price: 6499,
    category: "Bags & Leather Goods",
    silhouette: "Evening Clutches",
    gender: "Women",
    material: "Pure Heavyweight Mulberry Silk & Sculpted Brass Frame",
    description: "Designed for nocturnal celebrations and black-tie galas. Constructed with accordion accordion-pleated silk satin stretched over a sculpted brass clasp frame. Comes with a removable fine cable-link brass chain to effortlessly switch from handheld clutch to shoulder drape.",
    dimensions: "20cm (W) × 12cm (H) × 5cm (D)",
    strapDrop: "52cm (Removable Chain)",
    hardware: "Sculpted Polished Brass Clasp",
    lining: "Black Grosgrain Silk Ribbon Lining",
    stock: 15,
    colors: [
      {
        name: "Noir Satin & Brass",
        hex: "#141312",
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85",
      },
      {
        name: "Ivory Organza",
        hex: "#F4EFE6",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85",
      },
    ],
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85",
    ],
    details: [
      "30 momme pure mulberry silk exterior with accordion pleats",
      "Handcrafted kiss-lock brass closure",
      "Detachable jewelers-grade brass crossbody chain",
    ],
  },
  {
    _id: "bag_04",
    name: "The Slouchy Suede Crescent Hobo",
    price: 8999,
    category: "Bags & Leather Goods",
    silhouette: "Crossbody & Shoulder",
    gender: "Women",
    material: "Velvety Italian Calf Suede & Nappa Trim",
    description: "A fluid, crescent-shaped shoulder bag crafted from tactile Italian suede with a buttery nappa leather shoulder cushion. Molds comfortably beneath the arm, holding everyday essentials with relaxed, nonchalant elegance.",
    dimensions: "34cm (W) × 24cm (H) × 10cm (D)",
    strapDrop: "28cm (Integrated Shoulder Drop)",
    hardware: "Matte Gunmetal Magnetic Clasp",
    lining: "Natural Unbleached Linen Twill",
    stock: 9,
    colors: [
      {
        name: "Olive Suede",
        hex: "#4E4B38",
        image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=85",
      },
      {
        name: "Saddle Suede",
        hex: "#784A28",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
      },
    ],
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=85",
    ],
    details: [
      "Water-resistant Scotchgard treated calf suede",
      "Concealed central magnetic closure with internal zip security pocket",
      "Sculptural silhouette designed to drape with body movement",
    ],
  },
  {
    _id: "bag_05",
    name: "The Architectural Weekender Duffel",
    price: 14999,
    category: "Bags & Leather Goods",
    silhouette: "Travel & Weekend",
    gender: "Unisex",
    material: "Heavy Oil-Waxed Pull-Up Leather & Waterproof Canvas",
    description: "A generational travel companion tailored for weekend getaways and sartorial transit. Crafted from pull-up cowhide leather that records your journey through rich marbling. Features two exterior ticket slips, a padded shoulder sling, and an interior shoe docket.",
    dimensions: "52cm (W) × 30cm (H) × 24cm (D)",
    strapDrop: "Removable 45cm – 65cm Webbing & Leather Sling",
    hardware: "Solid Antiqued Cast Brass Buckles & Feet",
    lining: "Heavyweight Water-Repellent Military Twill",
    stock: 7,
    colors: [
      {
        name: "Espresso Oil Leather",
        hex: "#2B1E17",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
      },
      {
        name: "Saddle Tan",
        hex: "#8C4A2F",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
      },
    ],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
    ],
    details: [
      "Approved airline cabin carry-on sizing",
      "Reinforced base with 6 solid brass ground studs",
      "Two-way YKK Excella heavyweight metal zippers with lock tabs",
    ],
  },
  {
    _id: "bag_06",
    name: "The Accordion Flap Shoulder Bag",
    price: 9299,
    category: "Bags & Leather Goods",
    silhouette: "Crossbody & Shoulder",
    gender: "Women",
    material: "Pebbled Calf Leather & Nappa Gussets",
    description: "A three-compartment accordion shoulder bag tailored with clean geometrical lines. The soft pebble-grained calf leather resists scuffs while retaining an exquisite tactile finish. Fastened with our signature hand-cast atelier brass bar pin.",
    dimensions: "26cm (W) × 18cm (H) × 9cm (D)",
    strapDrop: "32cm (Doubled) / 54cm (Extended Crossbody)",
    hardware: "Hand-Cast Atelier Brass Pin Clasp",
    lining: "Burgundy Nappa Leather Lined Flap & Suede Pockets",
    stock: 11,
    colors: [
      {
        name: "Ivory Pebble",
        hex: "#ECE5D8",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85",
      },
      {
        name: "Noir Box Calf",
        hex: "#1A1918",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85",
      },
    ],
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85",
    ],
    details: [
      "Three expandable interior gussets for seamless organization",
      "Dual-wear convertible strap converts from shoulder to crossbody",
      "Concealed back phone compartment for quick accessibility",
    ],
  },
];

/**
 * DEMO MENU: sample items and prices for the presentation.
 * These are not KwaFikie's confirmed offerings. Replace with the real menu.
 * Prices are in USD; other currencies are converted from site.currency.
 */

export type MenuCategoryId = 'braai' | 'meals' | 'sides' | 'drinks'

export interface MenuCategory {
  id: MenuCategoryId
  name: string
  blurb: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  priceUsd: number
  category: MenuCategoryId
  image: string
  featured?: boolean
  tag?: string
}

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`

export const images = {
  hero: img('photo-1555939594-58d7cb561ad1', 2000),
  grillFlames: img('photo-1558030137-a56c1b004fa3', 2000),
  platter: img('photo-1555939594-58d7cb561ad1'),
  chicken: img('photo-1598103442097-8b74394b95c6'),
  ribs: img('photo-1529193591184-b1d58069ecdd'),
  sausage: img('photo-1544025162-d76694265947'),
  steak: img('photo-1600891964092-4316c288032e'),
  stew: img('photo-1585937421612-70a008356fbe'),
  burger: img('photo-1568901346375-23c9450c58cd'),
  fries: img('photo-1573080496219-bb080dd4f877'),
  salad: img('photo-1512621776951-a57141f2eefd'),
  corn: img('photo-1551754655-cd27e38d2076'),
  fish: img('photo-1519708227418-c8fd9a32b7a2'),
  drinks: img('photo-1514362545857-3bc16c4c7d1b'),
  beer: img('photo-1535958636474-b021ee887b13'),
  juice: img('photo-1600271886742-f049cd451bba'),
  soda: img('photo-1581636625402-29b2a704ef13'),
  water: img('photo-1548839140-29a749e1cf4d'),
  crowd: img('photo-1470229722913-7c0e2dbbafd3', 2000),
  dining: img('photo-1414235077428-338989a2e8c0', 1400),
  friends: img('photo-1528605248644-14dd04022da1', 1400),
  interior: img('photo-1517248135467-4c7edcad34c4', 1400),
}

export const menuCategories: MenuCategory[] = [
  { id: 'braai', name: 'Braai', blurb: 'Straight off the fire.' },
  { id: 'meals', name: 'Meals', blurb: 'Plates that fill you up.' },
  { id: 'sides', name: 'Sides', blurb: 'Everything that goes with it.' },
  { id: 'drinks', name: 'Drinks', blurb: 'Cold, fresh and poured right.' },
]

export const menuItems: MenuItem[] = [
  // Braai
  {
    id: 'braai-platter',
    name: 'Braai Platter',
    description: 'Beef, chicken and boerewors grilled over open flame, served with sadza or chips. Serves two.',
    priceUsd: 22,
    category: 'braai',
    image: images.platter,
    featured: true,
    tag: 'For sharing',
  },
  {
    id: 'grilled-chicken',
    name: 'Grilled Chicken',
    description: 'Half chicken, marinated and flame-grilled until smoky and golden.',
    priceUsd: 8.5,
    category: 'braai',
    image: images.chicken,
    featured: true,
  },
  {
    id: 'beef-ribs',
    name: 'Beef Ribs',
    description: 'Slow-basted beef ribs finished on the grill with a sticky house glaze.',
    priceUsd: 12,
    category: 'braai',
    image: images.ribs,
    featured: true,
    tag: 'Popular',
  },
  {
    id: 'sausage-combo',
    name: 'Sausage Combo',
    description: 'Boerewors and spicy sausage off the coals with chips and tomato relish.',
    priceUsd: 7,
    category: 'braai',
    image: images.sausage,
    featured: true,
  },
  {
    id: 't-bone',
    name: 'T-Bone Steak',
    description: '350 g T-bone, salted and grilled to your liking, with a side of your choice.',
    priceUsd: 14,
    category: 'braai',
    image: images.steak,
  },
  // Meals
  {
    id: 'sadza-meat',
    name: 'Sadza and Meat',
    description: 'Soft white sadza with slow-cooked beef stew and a side of greens.',
    priceUsd: 6,
    category: 'meals',
    image: images.stew,
    featured: true,
    tag: 'Local favourite',
  },
  {
    id: 'sadza-chicken',
    name: 'Sadza and Road Runner',
    description: 'Free-range chicken stewed with tomato and onion, with sadza and covo.',
    priceUsd: 7.5,
    category: 'meals',
    image: images.stew,
  },
  {
    id: 'grilled-bream',
    name: 'Grilled Bream',
    description: 'Whole bream grilled with lemon and garlic, served with chips or sadza.',
    priceUsd: 9,
    category: 'meals',
    image: images.fish,
  },
  {
    id: 'braai-burger',
    name: 'Flame Burger',
    description: 'Flame-grilled beef patty, cheese, onion and house sauce, with chips.',
    priceUsd: 6.5,
    category: 'meals',
    image: images.burger,
  },
  // Sides
  {
    id: 'chips',
    name: 'Chips',
    description: 'Thick-cut and crispy, salted the moment they leave the fryer.',
    priceUsd: 2.5,
    category: 'sides',
    image: images.fries,
    featured: true,
  },
  {
    id: 'grilled-corn',
    name: 'Grilled Mealies',
    description: 'Corn on the cob charred on the braai and brushed with butter.',
    priceUsd: 2,
    category: 'sides',
    image: images.corn,
  },
  {
    id: 'garden-salad',
    name: 'Garden Salad',
    description: 'Fresh greens, tomato, cucumber and onion with a light dressing.',
    priceUsd: 3,
    category: 'sides',
    image: images.salad,
  },
  {
    id: 'extra-sadza',
    name: 'Extra Sadza',
    description: 'An extra portion of sadza for the hungry.',
    priceUsd: 1,
    category: 'sides',
    image: images.stew,
  },
  // Drinks
  {
    id: 'cold-lager',
    name: 'Cold Lager',
    description: 'Local lager, served ice cold. Over 18s only.',
    priceUsd: 2.5,
    category: 'drinks',
    image: images.beer,
  },
  {
    id: 'signature-cocktail',
    name: 'Flame Cocktail',
    description: 'House cocktail of the week. Ask about the non-alcoholic version.',
    priceUsd: 5,
    category: 'drinks',
    image: images.drinks,
    tag: 'Fridays',
  },
  {
    id: 'fresh-juice',
    name: 'Fresh Juice',
    description: 'Freshly squeezed seasonal fruit juice.',
    priceUsd: 3,
    category: 'drinks',
    image: images.juice,
  },
  {
    id: 'soft-drink',
    name: 'Soft Drink',
    description: 'Assorted fizzy drinks, 330 ml can or 500 ml bottle.',
    priceUsd: 1.5,
    category: 'drinks',
    image: images.soda,
  },
  {
    id: 'water',
    name: 'Still Water',
    description: '500 ml bottled water.',
    priceUsd: 1,
    category: 'drinks',
    image: images.water,
  },
]

export const menuById = new Map(menuItems.map((item) => [item.id, item]))

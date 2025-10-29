export const templatesData = [
  {
    id: '1',
    name: 'Classic T-Shirt',
    category: 'shirts',
    description: 'A timeless crew neck t-shirt design perfect for casual wear',
    icon: 'tshirt-crew',
    colors: ['#6C63FF', '#4ECDC4'],
    layers: 3,
    features: [
      'Customizable neckline',
      'Adjustable sleeve length',
      'Multiple fabric options',
      'Size range XS-XXL',
    ],
    tags: ['casual', 'basic', 'everyday', 'unisex'],
    popularity: 95,
    createdAt: '2024-01-15',
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Summer Dress',
    category: 'dresses',
    description: 'Flowing A-line dress perfect for warm weather',
    icon: 'human-female-dance',
    colors: ['#FF6B6B', '#FFD93D'],
    layers: 5,
    features: [
      'Adjustable hemline',
      'Multiple strap options',
      'Built-in pockets',
      'Waist definition options',
    ],
    tags: ['summer', 'feminine', 'elegant', 'versatile'],
    popularity: 88,
    createdAt: '2024-01-20',
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Business Blazer',
    category: 'jackets',
    description: 'Professional blazer with modern tailoring',
    icon: 'tie',
    colors: ['#2C3E50', '#34495E'],
    layers: 7,
    features: [
      'Structured shoulders',
      'Multiple button options',
      'Interior pockets',
      'Lining customization',
    ],
    tags: ['formal', 'business', 'professional', 'structured'],
    popularity: 82,
    createdAt: '2024-01-18',
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Denim Jeans',
    category: 'pants',
    description: 'Classic five-pocket denim design',
    icon: 'human-male',
    colors: ['#4169E1', '#191970'],
    layers: 4,
    features: [
      'Multiple fits available',
      'Customizable wash',
      'Pocket placement options',
      'Hem finishing choices',
    ],
    tags: ['denim', 'casual', 'classic', 'versatile'],
    popularity: 92,
    createdAt: '2024-01-10',
    isFavorite: false,
  },
  {
    id: '5',
    name: 'Evening Gown',
    category: 'dresses',
    description: 'Elegant floor-length gown for special occasions',
    icon: 'star',
    colors: ['#8B008B', '#4B0082'],
    layers: 8,
    features: [
      'Multiple neckline options',
      'Train length customization',
      'Embellishment placement',
      'Built-in corset option',
    ],
    tags: ['formal', 'elegant', 'evening', 'special'],
    popularity: 78,
    createdAt: '2024-01-25',
    isFavorite: true,
  },
  {
    id: '6',
    name: 'Hoodie',
    category: 'shirts',
    description: 'Comfortable pullover hoodie with kangaroo pocket',
    icon: 'hoodie',
    colors: ['#A8E6CF', '#98D6BF'],
    layers: 4,
    features: [
      'Hood size adjustment',
      'Pocket styles',
      'Drawstring options',
      'Ribbed cuffs and hem',
    ],
    tags: ['casual', 'comfort', 'streetwear', 'unisex'],
    popularity: 90,
    createdAt: '2024-01-12',
    isFavorite: false,
  },
  {
    id: '7',
    name: 'Pencil Skirt',
    category: 'skirts',
    description: 'Classic knee-length pencil skirt',
    icon: 'skirt',
    colors: ['#C7CEEA', '#B7BEDA'],
    layers: 3,
    features: [
      'Length customization',
      'Waistband options',
      'Slit placement',
      'Zipper positioning',
    ],
    tags: ['professional', 'classic', 'feminine', 'versatile'],
    popularity: 75,
    createdAt: '2024-01-22',
    isFavorite: false,
  },
  {
    id: '8',
    name: 'Bomber Jacket',
    category: 'jackets',
    description: 'Sporty bomber jacket with ribbed trim',
    icon: 'coat-rack',
    colors: ['#FF8B94', '#FFD3B6'],
    layers: 6,
    features: [
      'Zipper styles',
      'Pocket configurations',
      'Lining options',
      'Collar variations',
    ],
    tags: ['streetwear', 'casual', 'sporty', 'trendy'],
    popularity: 85,
    createdAt: '2024-01-14',
    isFavorite: false,
  },
  {
    id: '9',
    name: 'Maxi Dress',
    category: 'dresses',
    description: 'Flowing full-length dress with empire waist',
    icon: 'human-female-dance',
    colors: ['#FFD93D', '#FFC93D'],
    layers: 4,
    features: [
      'Multiple sleeve options',
      'Waist placement',
      'Hem patterns',
      'Neckline variations',
    ],
    tags: ['bohemian', 'summer', 'comfortable', 'flowing'],
    popularity: 80,
    createdAt: '2024-01-16',
    isFavorite: false,
  },
  {
    id: '10',
    name: 'Cargo Pants',
    category: 'pants',
    description: 'Utility pants with multiple pockets',
    icon: 'bag-personal',
    colors: ['#556B2F', '#6B8E23'],
    layers: 5,
    features: [
      'Pocket placement',
      'Adjustable waist',
      'Leg tapering options',
      'Reinforced knees option',
    ],
    tags: ['utility', 'casual', 'functional', 'streetwear'],
    popularity: 72,
    createdAt: '2024-01-19',
    isFavorite: false,
  },
];

export const getTemplatesByCategory = (category) => {
  if (category === 'all' || !category) {
    return templatesData;
  }
  return templatesData.filter(template => template.category === category);
};

export const getFavoriteTemplates = () => {
  return templatesData.filter(template => template.isFavorite);
};

export const getPopularTemplates = (limit = 5) => {
  return [...templatesData]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};

export const searchTemplates = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return templatesData.filter(template =>
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

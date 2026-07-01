export const homepageCategories = [
  { id: 1, name: 'Barn Weddings', slug: 'barn-weddings', type: 'venue' },
  { id: 2, name: 'Wedding Venues', slug: 'wedding-venues', type: 'venue' },
  { id: 3, name: 'Hotels', slug: 'hotels', type: 'venue' },
  { id: 4, name: 'Photography', slug: 'photography', type: 'supplier' },
  { id: 5, name: 'Florist', slug: 'florist', type: 'supplier' },
  { id: 6, name: 'Music', slug: 'music', type: 'supplier' },
  { id: 7, name: 'Dressing', slug: 'dressing', type: 'supplier' },
  { id: 8, name: 'Catering', slug: 'catering', type: 'supplier' },
  { id: 9, name: 'Wedding Cars', slug: 'wedding-cars', type: 'supplier' },
  { id: 10, name: 'Hair and Makeup', slug: 'hair-and-makeup', type: 'supplier' },
];

export const homepageAppState = {
  apiURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  serverPath: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/',
  isLoggedIn: false,
  profile: {},
  categories: homepageCategories,
  notifications: [],
  isLoading: false,
};

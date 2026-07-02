export const coupleProfile = {
  fullName: 'Kajee Kj',
  partnerName: 'Partner Name',
  weddingDate: '24th of March, 2027',
  weddingLocation: 'London, United Kingdom',
  themeColor: 'rgb(211, 223, 158)',
};

export const coupleStats = [
  { href: '/couple/vendors', value: '4 / 32', label: 'Suppliers Hired' },
  { href: '/couple/check-list', value: '18 / 72', label: 'Tasks Completed' },
  { href: '/couple/guest-list', value: '96 / 150', label: 'Guests Attending' },
  { href: '/couple/seating-chart', value: '48 / 150', label: 'Guests Seated' },
];

export const coupleLinks = [
  { href: '/couple', icon: 'tamilweddingbook_heart_ring', name: 'Dashboard' },
  { href: '/couple/check-list', icon: 'tamilweddingbook_checklist', name: 'Checklist' },
  { href: '/couple/vendors', icon: 'tamilweddingbook_vendor_manager', name: 'Vendors' },
  { href: '/couple/guest-list', icon: 'tamilweddingbook_guestlist', name: 'Guest List' },
  { href: '/couple/seating-chart', icon: 'tamilweddingbook_seating_chart', name: 'Seating Chart' },
  { href: '/couple/budget-planner', icon: 'tamilweddingbook_budget', name: 'Budget' },
  { href: '/couple/dresses', icon: 'tamilweddingbook_fashion', name: 'Dresses' },
  { href: '/couple/wedding-website', icon: 'tamilweddingbook_websote_demo', name: 'Website' },
  { href: '/couple/web-shoots', icon: 'tamilweddingbook_camera', name: 'WedShoots' },
];

export const checklistItems = [
  { id: 'budget', title: 'Set your wedding budget', description: '', checklistCategory: { name: 'Planning' }, checklistFilter: { name: 'From 10 to 12 months' }, completed: true, cost: '£0' },
  { id: 'guest-list', title: 'Create your guest list', description: '', checklistCategory: { name: 'Guests' }, checklistFilter: { name: 'From 10 to 12 months' }, completed: false, cost: '£0' },
  { id: 'venue', title: 'Book your venue', description: '', checklistCategory: { name: 'Venue' }, checklistFilter: { name: 'From 7 to 9 months' }, completed: false, cost: '£2,500' },
  { id: 'suppliers', title: 'Choose wedding suppliers', description: '', checklistCategory: { name: 'Suppliers' }, checklistFilter: { name: 'From 4 to 6 months' }, completed: false, cost: '£1,200' },
];

export const guestListFallbackData = {
  inviteByLinkUrl: 'https://twb.local/guest-invitation/example',
  weddingEvents: [
    {
      id: 1,
      name: 'Wedding',
      image: 'event.png',
      displayOrder: 1,
      coupleWeddingEventGroups: [
        { id: 1, name: 'Family' },
        { id: 2, name: 'Friends' },
      ],
      coupleWeddingEventMenus: [
        { id: 1, name: 'Vegetarian' },
        { id: 2, name: 'Non Vegetarian' },
      ],
      coupleWeddingEventLists: [
        { id: 1, name: 'Bride' },
        { id: 2, name: 'Groom' },
      ],
      coupleWeddingEventTables: [
        { id: 1, name: 'Table 1', chairs: 8 },
        { id: 2, name: 'Table 2', chairs: 8 },
      ],
      guests: [
        { id: 1, fullName: 'Arun Kumar', email: 'arun@example.com', mobile: '+44 7000 000001', address: 'London', groupId: 1, menuId: 1, listId: 1, tableId: 1, status: 'confirmed' },
        { id: 2, fullName: 'Priya S', email: 'priya@example.com', mobile: '+44 7000 000002', address: 'London', groupId: 2, menuId: 2, listId: 2, tableId: 2, status: 'pending' },
        { id: 3, fullName: 'Meera Raj', email: 'meera@example.com', mobile: '+44 7000 000003', address: 'London', groupId: 1, menuId: 1, listId: 1, tableId: 1, status: 'declined' },
      ],
    },
    {
      id: 2,
      name: 'Reception',
      image: 'guest-list.png',
      displayOrder: 2,
      coupleWeddingEventGroups: [
        { id: 1, name: 'Family' },
        { id: 2, name: 'Friends' },
      ],
      coupleWeddingEventMenus: [
        { id: 1, name: 'Vegetarian' },
        { id: 2, name: 'Non Vegetarian' },
      ],
      coupleWeddingEventLists: [
        { id: 1, name: 'Bride' },
        { id: 2, name: 'Groom' },
      ],
      coupleWeddingEventTables: [
        { id: 1, name: 'Table 1', chairs: 10 },
        { id: 2, name: 'Table 2', chairs: 10 },
      ],
      guests: [
        { id: 4, fullName: 'Kavin Thiru', email: 'kavin@example.com', mobile: '+44 7000 000004', address: 'London', groupId: 2, menuId: 2, listId: 2, tableId: 1, status: 'confirmed' },
        { id: 5, fullName: 'Nila Raj', email: 'nila@example.com', mobile: '+44 7000 000005', address: 'London', groupId: 1, menuId: 1, listId: 1, tableId: 2, status: 'pending' },
      ],
    },
  ],
};

export const vendorRows = [
  { name: 'Grand Tamil Wedding Venue', category: 'Venue', status: 'Selected' },
  { name: 'Tamil Wedding Photography', category: 'Photography', status: 'Shortlisted' },
  { name: 'Elegant Florist Studio', category: 'Florist', status: 'Pending' },
];

export const budgetPlannerFallbackData = {
  id: 1,
  budgetPlannerCategories: [
    {
      id: 1,
      name: 'Venue',
      icon: 'bi bi-bank',
      categoryExpenses: [
        { id: 1, name: 'Venue deposit', estimatedCost: 6000, finalCost: 5500, note: 'Initial venue booking', payments: [{ id: 1, amount: 2500, paid: true, paymentDate: '2026-07-01', dueDate: '2026-07-01', paidBy: 'Kajee', paymentMethod: 'Card' }, { id: 2, amount: 3000, paid: false, paymentDate: '', dueDate: '2026-10-01', paidBy: '', paymentMethod: '' }] },
        { id: 2, name: 'Catering', estimatedCost: 3500, finalCost: 3800, note: '', payments: [{ id: 3, amount: 1000, paid: true, paymentDate: '2026-07-01', dueDate: '2026-07-01', paidBy: 'Partner', paymentMethod: 'Bank transfer' }] },
      ],
    },
    {
      id: 2,
      name: 'Photo & Video',
      icon: 'bi bi-camera',
      categoryExpenses: [
        { id: 3, name: 'Photography package', estimatedCost: 2500, finalCost: 2400, note: 'Includes engagement shoot', payments: [{ id: 4, amount: 800, paid: true, paymentDate: '2026-07-01', dueDate: '2026-07-01', paidBy: 'Kajee', paymentMethod: 'Card' }] },
      ],
    },
    {
      id: 3,
      name: 'Decor',
      icon: 'bi bi-flower1',
      categoryExpenses: [
        { id: 4, name: 'Flowers', estimatedCost: 1500, finalCost: 1200, note: '', payments: [{ id: 5, amount: 300, paid: false, paymentDate: '', dueDate: '2026-09-01', paidBy: '', paymentMethod: '' }] },
      ],
    },
  ],
};

export const notifications = [
  'Your checklist has pending tasks.',
  'You have vendors waiting to be shortlisted.',
  'Complete your wedding website details.',
];

export const seatingChartFallbackData = {
  weddingEvents: [
    {
      id: 1,
      name: 'Wedding',
      seatingChartWindowHeight: 650,
      eventGuests: [
        { id: 1, fullName: 'Arun Kumar' },
        { id: 2, fullName: 'Priya S' },
        { id: 3, fullName: 'Meera Raj' },
        { id: 4, fullName: 'Kavin Thiru' },
        { id: 5, fullName: 'Nila Raj' },
        { id: 6, fullName: 'Anjali Kumar' },
        { id: 7, fullName: 'Suren Nadarajah' },
        { id: 8, fullName: 'Divya Selvan' },
      ],
      eventTables: [
        {
          id: 1,
          name: 'Table 1',
          type: 'sc-rounded-table',
          width: 110,
          height: 110,
          positionX: 240,
          positionY: 190,
          chairs: [
            { id: '1-chair-1', guestId: 1 },
            { id: '1-chair-2', guestId: 2 },
            { id: '1-chair-3', guestId: null },
            { id: '1-chair-4', guestId: null },
            { id: '1-chair-5', guestId: null },
            { id: '1-chair-6', guestId: null },
          ],
        },
        {
          id: 2,
          name: 'Table 2',
          type: 'sc-two-sided-table',
          width: 180,
          height: 70,
          positionX: 520,
          positionY: 260,
          chairs: [
            { id: '2-chair-1', guestId: 3 },
            { id: '2-chair-2', guestId: null },
            { id: '2-chair-3', guestId: null },
            { id: '2-chair-4', guestId: null },
            { id: '2-chair-5', guestId: null },
            { id: '2-chair-6', guestId: null },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Reception',
      seatingChartWindowHeight: 650,
      eventGuests: [
        { id: 11, fullName: 'Maya Chandran' },
        { id: 12, fullName: 'Ravi Siva' },
        { id: 13, fullName: 'Leela Nathan' },
        { id: 14, fullName: 'Vikram Raj' },
      ],
      eventTables: [
        {
          id: 3,
          name: 'Table 3',
          type: 'sc-four-sided-table',
          width: 160,
          height: 70,
          positionX: 310,
          positionY: 230,
          chairs: [
            { id: '3-chair-1', guestId: 11 },
            { id: '3-chair-2', guestId: null },
            { id: '3-chair-3', guestId: null },
            { id: '3-chair-4', guestId: null },
            { id: '3-chair-5', guestId: null },
            { id: '3-chair-6', guestId: null },
            { id: '3-chair-7', guestId: null },
            { id: '3-chair-8', guestId: null },
          ],
        },
      ],
    },
  ],
};

export const coupleVendorFallbackData = {
  categories: [
    { name: 'Wedding Venues', slug: 'venue', type: 'venue', icon: 'bi bi-house' },
    { name: 'Photography', slug: 'photography', type: 'supplier', icon: 'bi bi-camera' },
    { name: 'Catering', slug: 'catering', type: 'supplier', icon: 'bi bi-cup-hot' },
    { name: 'Decor', slug: 'decor', type: 'supplier', icon: 'bi bi-flower1' },
    { name: 'Music', slug: 'music', type: 'supplier', icon: 'bi bi-music-note-beamed' },
    { name: 'Makeup', slug: 'makeup', type: 'supplier', icon: 'bi bi-brush' },
  ],
  suppliers: [
    { id: 1, status: 'Hired', note: 'Confirmed deposit and menu tasting.', activeTab: '', coupleVendor: { id: 101, rating: 4.8, reviews: 24, category: { name: 'Wedding Venues', slug: 'venue', type: 'venue' }, user: { fullName: 'Grand Tamil Wedding Venue', address: 'London, United Kingdom', photo: '/assets/images/placeholder.png', mobile: '+44 7000 100001', email: 'venue@example.com' } } },
    { id: 2, status: 'Preselection', note: '', activeTab: '', coupleVendor: { id: 102, rating: 4.6, reviews: 18, category: { name: 'Photography', slug: 'photography', type: 'supplier' }, user: { fullName: 'Tamil Wedding Photography', address: 'Harrow, United Kingdom', photo: '/assets/images/placeholder.png', mobile: '+44 7000 100002', email: 'photo@example.com' } } },
    { id: 3, status: 'Negotiation', note: '', activeTab: '', coupleVendor: { id: 103, rating: 4.7, reviews: 31, category: { name: 'Decor', slug: 'decor', type: 'supplier' }, user: { fullName: 'Elegant Florist Studio', address: 'Ilford, United Kingdom', photo: '/assets/images/placeholder.png', mobile: '+44 7000 100003', email: 'decor@example.com' } } },
    { id: 4, status: 'Evaluating', note: '', activeTab: '', coupleVendor: { id: 104, rating: 4.5, reviews: 12, category: { name: 'Catering', slug: 'catering', type: 'supplier' }, user: { fullName: 'South Indian Catering Co', address: 'Croydon, United Kingdom', photo: '/assets/images/placeholder.png', mobile: '+44 7000 100004', email: 'catering@example.com' } } },
  ],
  availableVendors: [
    { fullName: 'Grand Tamil Wedding Venue', address: 'London, United Kingdom', photo: '/assets/images/placeholder.png', mobile: '+44 7000 100001', email: 'venue@example.com', rating: 4.8, reviews: 24, category: { name: 'Wedding Venues', slug: 'venue', type: 'venue' }, vendor: { id: 101 } },
    { fullName: 'Tamil Wedding Photography', address: 'Harrow, United Kingdom', photo: '/assets/images/placeholder.png', mobile: '+44 7000 100002', email: 'photo@example.com', rating: 4.6, reviews: 18, category: { name: 'Photography', slug: 'photography', type: 'supplier' }, vendor: { id: 102 } },
    { fullName: 'Elegant Florist Studio', address: 'Ilford, United Kingdom', photo: '/assets/images/placeholder.png', mobile: '+44 7000 100003', email: 'decor@example.com', rating: 4.7, reviews: 31, category: { name: 'Decor', slug: 'decor', type: 'supplier' }, vendor: { id: 103 } },
    { fullName: 'South Indian Catering Co', address: 'Croydon, United Kingdom', photo: '/assets/images/placeholder.png', mobile: '+44 7000 100004', email: 'catering@example.com', rating: 4.5, reviews: 12, category: { name: 'Catering', slug: 'catering', type: 'supplier' }, vendor: { id: 104 } },
    { fullName: 'DJ Tamil Beats', address: 'Wembley, United Kingdom', photo: '/assets/images/placeholder.png', mobile: '+44 7000 100005', email: 'dj@example.com', rating: 4.4, reviews: 9, category: { name: 'Music', slug: 'music', type: 'supplier' }, vendor: { id: 105 } },
    { fullName: 'Bridal Makeup by Nila', address: 'London, United Kingdom', photo: '/assets/images/placeholder.png', mobile: '+44 7000 100006', email: 'makeup@example.com', rating: 4.9, reviews: 16, category: { name: 'Makeup', slug: 'makeup', type: 'supplier' }, vendor: { id: 106 } },
  ],
};

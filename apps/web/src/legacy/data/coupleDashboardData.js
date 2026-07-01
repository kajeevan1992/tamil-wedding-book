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

export const budgetCategories = [
  { id: 'venue', name: 'Venue', estimated: '£6,000', spent: '£2,500' },
  { id: 'photo-video', name: 'Photo & Video', estimated: '£2,500', spent: '£800' },
  { id: 'decor', name: 'Decor', estimated: '£1,500', spent: '£300' },
];

export const notifications = [
  'Your checklist has pending tasks.',
  'You have vendors waiting to be shortlisted.',
  'Complete your wedding website details.',
];

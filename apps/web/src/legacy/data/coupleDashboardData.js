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
  { id: 'budget', category: '12+ months', title: 'Set your wedding budget', due: 'Before 12+ months', cost: '£0', status: 'Done' },
  { id: 'guest-list', category: '10-12 months', title: 'Create your guest list', due: 'Before 10-12 months', cost: '£0', status: 'Pending' },
  { id: 'venue', category: '8-10 months', title: 'Book your venue', due: 'Before 8-10 months', cost: '£2,500', status: 'Pending' },
  { id: 'suppliers', category: '6-8 months', title: 'Choose wedding suppliers', due: 'Before 6-8 months', cost: '£1,200', status: 'Pending' },
];

export const guestRows = [
  { name: 'Arun Kumar', group: 'Family', events: 'Wedding, Reception', status: 'Attending' },
  { name: 'Priya S', group: 'Friends', events: 'Reception', status: 'Pending' },
  { name: 'Meera Raj', group: 'Family', events: 'Wedding', status: 'Attending' },
];

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

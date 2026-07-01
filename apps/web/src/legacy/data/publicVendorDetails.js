export const publicVendorDetails = {
  1: {
    id: 1,
    fullName: 'Grand Tamil Wedding Venue',
    address: 'London, United Kingdom',
    photo: '/assets/images/about/pexels-luis-quintero-1560303.jpg',
    vendor: {
      id: 101,
      category: { name: 'Venue Category' },
      aboutStoreFront:
        '<p>Grand Tamil Wedding Venue offers elegant event spaces for traditional Tamil weddings, receptions and family celebrations. This temporary profile mirrors the public detail page structure while the migrated API is prepared.</p><p>Packages can include venue hire, catering coordination, stage setup support and supplier recommendations.</p>',
      faqs: {
        faqsList: [
          { status: 'done', type: 'textarea', question: 'What services do you offer?', value: 'Venue hire, wedding reception space, supplier coordination and event support.' },
          { status: 'done', type: 'radio', question: 'Do you host large weddings?', options: [{ name: 'Yes', checked: true }, { name: 'No', checked: false }] },
          { status: 'done', type: 'range', question: 'Guest capacity', value: 'Up to 500 guests' },
        ],
      },
    },
  },
  2: {
    id: 2,
    fullName: 'Royal Wedding Hall',
    address: 'Harrow, London',
    photo: '/assets/images/about/pexels-dimitri-kuliuk-949223.jpg',
    vendor: {
      id: 102,
      category: { name: 'Venue Category' },
      aboutStoreFront:
        '<p>Royal Wedding Hall is a public listing detail fallback for the venue profile view. Live venue copy, gallery and enquiries will be supplied by the existing TWB API in a later backend milestone.</p>',
      faqs: { faqsList: [] },
    },
  },
  3: {
    id: 3,
    fullName: 'Tamil Wedding Photography',
    address: 'Ilford, London',
    photo: '/assets/images/about/pexels-dimitri-kuliuk-1488315.jpg',
    vendor: {
      id: 103,
      category: { name: 'Photography' },
      aboutStoreFront:
        '<p>Tamil Wedding Photography captures ceremonies, receptions and couple portraits. This profile preserves the legacy public detail layout with temporary data until live API integration is migrated.</p>',
      faqs: { faqsList: [] },
    },
  },
  4: {
    id: 4,
    fullName: 'Elegant Florist Studio',
    address: 'Croydon, London',
    photo: '/assets/images/about/pexels-krishna-studio-2293102.jpg',
    vendor: {
      id: 104,
      category: { name: 'Florist' },
      aboutStoreFront: '<p>Elegant Florist Studio provides wedding florals, mandap decoration and reception styling.</p>',
      faqs: { faqsList: [] },
    },
  },
  5: {
    id: 5,
    fullName: 'Wedding Music Collective',
    address: 'Wembley, London',
    photo: '/assets/images/about/pexels-trung-nguyen-1751682.jpg',
    vendor: {
      id: 105,
      category: { name: 'Music' },
      aboutStoreFront: '<p>Wedding Music Collective supports ceremony music, DJ services and reception entertainment.</p>',
      faqs: { faqsList: [] },
    },
  },
};

export const publicVendorDetailGallery = [
  { id: 1, name: 'Venue gallery image', path: '/assets/images/about/pexels-luis-quintero-1560303.jpg' },
  { id: 2, name: 'Wedding setup image', path: '/assets/images/about/pexels-dimitri-kuliuk-949223.jpg' },
  { id: 3, name: 'Couple detail image', path: '/assets/images/about/pexels-dimitri-kuliuk-1488315.jpg' },
  { id: 4, name: 'Floral detail image', path: '/assets/images/about/pexels-krishna-studio-2293102.jpg' },
];

export const publicVendorDetailReviews = [
  {
    id: 1,
    user: { fullName: 'Tamil Wedding Book Couple', photo: '' },
    reviewText: 'A helpful vendor profile preview while live reviews are pending API migration.',
    qualityOfService: 5,
    professionalism: 5,
    flexibility: 5,
    valueForMoney: 5,
    responseTime: 5,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
];

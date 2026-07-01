import { NavLink } from '../components/NextNavLink';

export const encryptAsUrl = (data) => btoa(JSON.stringify(data));
export const decryptUrl = (data) => JSON.parse(atob(data));

const PlanningToolsRightContent = () => (
  <>
    <div className="own-lg-column p-3 d-flex align-items-center">
      <div className="row">
        <div className="col-lg-9">
          <h6 className="fs-12px">Download the Tamilwedding App</h6>
          <p className="own-paragraph-1 text-wrap mb-0">Get the Tamilwedding App. Dream it. Plan it. Book it. wherever you are.</p>
        </div>
        <div className="col-lg-3 d-flex align-items-center ">
          <img src="/assets/images/small-logo.png" alt="download" className="mb-0" style={{ width: '48px', height: '48px' }} />
        </div>
      </div>
    </div>
    <div className="mt-3 own-lg-column p-3 d-flex align-items-center">
      <div className="row">
        <div className="col-lg-9">
          <h6 className="fs-12px">Wedshoots</h6>
          <p className="own-paragraph-1 text-wrap mb-0">Share with your guests to easily collect all your wedding photos.</p>
        </div>
        <div className="col-lg-3 d-flex align-items-center">
          <img src="/assets/images/ico_wedshoots.svg" alt="" className="mb-0" style={{ width: '48px', height: '48px' }} />
        </div>
      </div>
    </div>
  </>
);

const VenuesRightContent = () => (
  <div className="own-lg-column p-3 d-flex align-items-center">
    <div className="row p-3">
      <div className="col-lg-9 d-flex flex-column justify-content-center ">
        <h6>Destination Weddings</h6>
        <p className=" text-wrap fs-12px mb-0">Plan your wedding abroad.</p>
      </div>
      <div className="col-lg-3 d-flex align-items-center justify-content-center ">
        <img src="/assets/images/about/plane_destination.svg" alt="" />
      </div>
    </div>
  </div>
);

const DressesRightContent = () => (
  <div className="own-lg-column p-3 d-flex align-items-center">
    <div className="row">
      <div className="col-lg-4 d-flex align-items-center "><img src="/assets/images/ideas-tip/dress-1.png" alt="download" className="mb-0 w-100" /></div>
      <div className="col-lg-4 d-flex align-items-center "><img src="/assets/images/ideas-tip/dress-1.png" alt="download" className="mb-0 w-100" /></div>
      <div className="col-lg-4 d-flex align-items-center "><img src="/assets/images/ideas-tip/dress-1.png" alt="download" className="mb-0 w-100" /></div>
    </div>
  </div>
);

const IdeasRightContent = () => (
  <div className="own-lg-column p-3 d-flex align-items-center">
    <div className="row">
      <div className="col-lg-5"><img src="/assets/images/about/image_2025Z.png" alt="" className="border-top-radius h-100 " /></div>
      <div className="col-lg-7 mt-3"><h4 className="mt-1">Real Weddings</h4><p className="own-paragraph mt-1 text-wrap  fs-12px">Find weddings inspiration that fits your style with photos from real couples.</p></div>
    </div>
  </div>
);

const ForumsRightContent = () => {
  const forumLinks = [
    { label: 'Discussions', path: '/forums/discussions' },
    { label: 'Photos', path: '/forums/photos' },
    { label: 'Videos', path: '/forums/videos' },
    { label: 'Members', path: '/forums/members' },
  ];
  return (
    <div className="own-lg-column p-3 d-flex align-items-center">
      <div className="row">
        <div className="col-12"><h4 className="own-title-2 text-uppercase pt-3">Check out The Latest</h4></div>
        {forumLinks.map((link, index) => <div key={index} className="col-lg-12 mt-1"><NavLink to={link.path} className="own-card own-family p-0 border-bottom-0"><p className="own-card-3 text-wrap">{link.label}</p></NavLink></div>)}
      </div>
    </div>
  );
};

export const navigations = (role, categories) => [
  { name: 'PLANNING TOOLS', href: `/${role && role === 'couple' ? 'couple/' : ''}checklist`, subMenuHeading: 'Plan your unique wedding', subMenu: [
    { name: 'Checklist', href: `/${role && role === 'couple' ? 'couple/' : ''}check-list`, icon: 'tamilweddingbook_checklist' },
    { name: 'Guestlist', href: `/${role && role === 'couple' ? 'couple/' : ''}guest-list`, icon: 'tamilweddingbook_guest_member' },
    { name: 'Seating Chart', href: `/${role && role === 'couple' ? 'couple/' : ''}seating-chart`, icon: 'tamilweddingbook_seating_chart' },
    { name: 'Budget Planner', href: `/${role && role === 'couple' ? 'couple/' : ''}budget-planner`, icon: 'tamilweddingbook_budget' },
    { name: 'Wedding Suppliers', href: `/${role && role === 'couple' ? 'couple/' : ''}vendors`, icon: 'tamilweddingbook_vendor_manager' },
    { name: 'Wedding Dresses', href: `/${role && role === 'couple' ? 'couple/' : ''}dresses`, icon: 'tamilweddingbook_fashion' },
    { name: 'Wedding Website', href: `/${role && role === 'couple' ? 'couple/' : ''}wedding-website`, icon: 'tamilweddingbook_websote_demo' },
    { name: 'Wedding Shoots', href: `/${role && role === 'couple' ? 'couple/' : ''}wedding-shoots`, icon: 'tamilweddingbook_camera_alt' },
  ], rightSideContent: PlanningToolsRightContent },
  { name: 'VENUES', href: '/checklist', subMenuHeading: "Let's Find Your Wedding Venue", subMenu: categories?.filter((category) => category.type === 'venue').map((category) => ({ ...category, href: `/venues/${category.slug}` })), rightSideContent: VenuesRightContent },
  { name: 'SUPPLIERS', href: '/checklist', subMenuHeading: "Let's Find Your Wedding Venue", subMenu: categories?.filter((category) => category.type === 'supplier').map((category) => ({ ...category, href: `/suppliers/${category.slug}` })), rightSideContent: VenuesRightContent },
  { name: 'DRESSES', href: '/dresses', subMenuHeading: 'Attire for the entire wedding party', subMenu: [
    { name: 'Bride', href: '/dresses/bride', icon: 'tamilweddingbook_heart_hand' }, { name: 'Jewellery', href: '/dresses/jewellery', icon: 'bi bi-suit-diamond' }, { name: 'Rings', href: '/dresses/rings', icon: 'bi bi-box2-heart' }, { name: 'Groom', href: '/dresses/groom', icon: 'bi bi-person-workspace' }, { name: 'Shoes', href: '/dresses/shoes', icon: 'tamilweddingbook_bell' }, { name: 'Underwear', href: '/dresses/underwear', icon: 'tamilweddingbook_fashion' }, { name: 'Bridesmaids', href: '/dresses/bridesmaids', icon: 'bi bi-camera' }, { name: 'Cufflinks', href: '/dresses/cufflinks', icon: 'tamilweddingbook_fashion' }, { name: 'Mother of the Bride', href: '/dresses/mother-of-the-bride', icon: 'bi bi-camera' },
  ], rightSideContent: DressesRightContent },
  { name: 'IDEAS', href: '/ideas', subMenuHeading: 'Wedding Inspiration and Ideas', subMenu: ['Real Weddings','Ceremony and Reception','Photography','News','Planning Essentials','Entertainment','Beauty and Wellbeing','Promotionals','Honeymoons','Wedding Fashion','Wedding DIY','Wedding Songs','Budget','Flowers','Stationery and Wording Ideas','Stag and Hen','Cakes','Wedding Speeches'].map((name) => ({ name, href: `/ideas/${name.toLowerCase().replaceAll(' ', '-')}`, icon: null })), rightSideContent: IdeasRightContent },
  { name: 'FORUMS', href: '/forums', subMenuHeading: 'Forums', subMenu: ['Wedding Attire','Beauty and Wellbeing','Etiquette and Advice','Off Topic Posts','Feedback to Tamilwedding','Wanted','Planning','Just Married','For Sale'].map((name) => ({ name, href: `/forums/${name.toLowerCase().replaceAll(' ', '-')}`, icon: null })), rightSideContent: ForumsRightContent },
  { name: 'GIFT LIST', href: 'gift list', subMenuHeading: '', subMenu: [], rightSideContent: null },
  { name: 'INVITATIONS', href: 'invitations', subMenuHeading: '', subMenu: [], rightSideContent: null },
  { name: 'SHOP', href: 'shop', subMenuHeading: '', subMenu: [], rightSideContent: null },
];

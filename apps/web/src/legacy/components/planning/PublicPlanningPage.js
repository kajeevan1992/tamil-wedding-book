'use client';

import PlanningHeader from './PlanningHeader';
import {
  dressImages,
  planningPages,
  planningSideSections,
  planningTools,
  seatingTableImages,
} from '../../data/publicPlanningPages';

function ToolCard({ tool }) {
  return (
    <div className="col-lg-4 col-xl-4 text-center col-12">
      <div className="why-choose-icons">
        <div className="icon-big-cirlce mx-auto text-theme-1"><i className={tool.icon}></i></div>
        <h5>{tool.title}</h5>
        <p className="own-family">{tool.text}</p>
        <a href="#" className="text-theme">Track your progress</a>
      </div>
    </div>
  );
}

function IntroTools() {
  return (
    <section className="wide-tb-50">
      <div className="container">
        <div className="card-shadow pos-rel">
          <div className="card-shadow-body">
            <h3 className="text-center">Stay ahead of every to-do with the TamilWeddingBook Checklist</h3>
            <p className="text-center">Tell us a little about your wedding and we'll create customizable tasks for every stage of your planning journey</p>
            <div className="row mt-5">{planningTools.map((tool) => <ToolCard key={tool.title} tool={tool} />)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SideSections() {
  return (
    <section className="callout-main bg-white">
      <div className="container mt-5">
        <h2 className="text-center">Don't miss a thing</h2>
        <p className="text-center"> We'll help make sure you have everything you need to do organized in a manageable and easily digestible format. That way, you won't get overwhelmed and you'll know what's coming next! </p>
        <div className="row mt-5">
          {planningSideSections.map((section, index) => (
            <div className="row w-100" key={`${section.title}-${index}`}>
              {index % 2 === 0 && <div className="col-md-6 col-lg-5 col-6"><img src={section.image} alt="" /></div>}
              <div className="col-md-6 col-lg-7 col-6"><div className="own-side-sec"><h2>{section.title}</h2><p>{section.text} </p><a href="" className="text-theme">Go to first task</a></div></div>
              {index % 2 === 1 && <div className="col-md-6 col-lg-5 col-6"><img src={section.image} alt="" /></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetStarted() {
  return (
    <section className="wide-tb-50">
      <h2 className="text-center">Let's get started</h2>
      <p className="text-center ">We've got all you need to get it done, and enjoy the journey.</p>
      <div className="container mt-5"><div className="row">{planningTools.map((tool) => <ToolCard key={tool.title} tool={tool} />)}{planningTools.slice(1).map((tool) => <ToolCard key={`${tool.title}-repeat`} tool={tool} />)}</div></div>
    </section>
  );
}

function WebsiteCallouts() {
  return (
    <>
      <section className="callout-main bg-theme bg-theme">
        <div className="container-fluid pl-0"><div className="row"><div className="col-md-7 col-lg-7 text-white"><div className="callout-text" style={{ padding: '3rem 3rem 3rem 24rem' }}><h3 className="text-white">Get started</h3><p className="lead own-font-size-2">One of the first steps in the wedding planning process is building a free Wedding Website on TamilWeddingBook. We make it easy to include all your wedding information, and our designs are also customizable.</p><h3 className="text-white">Design your website</h3><p className="lead own-font-size-2">You can build a Wedding Website that reflects your personality. Choose options based on color palette, style and invitation design, and create a custom backdrop with an engagement photo, personal artwork or photos and more. These personal touches will bring your Wedding Website to life.</p><h3 className="text-white">Lets us handle RSVPs</h3><p className="lead own-font-size-2">One of the best features of our free Wedding Website is that guests can RSVP directly on your website. No need to send out mail in cards or record your RSVPs by hand-we'll keep track of who will be at the big event for you.</p><h3 className="text-white">Lets us handle RSVPs</h3><p className="lead own-font-size-2">One of the best features of our free Wedding Website is that guests can RSVP directly on your website. No need to send out mail in cards or record your RSVPs by hand-we'll keep track of who will be at the big event for you.</p></div></div><div className="col-lg-5" style={{ background: 'url(/assets/images/callout_img.jpg) center center no-repeat', backgroundSize: 'cover' }}><img src="/assets/images/callout_img.jpg" className="d-lg-none invisible" alt="" /></div></div></div>
      </section>
      <section className="callout-main " style={{ backgroundColor: '#B4AB9F' }}>
        <div className="container-fluid pl-0"><div className="row"><div className="col-md-12 col-lg-6" style={{ background: 'url(/assets/images/categories/image33.png) center center no-repeat', backgroundSize: 'cover' }}><img src="/assets/images/categories/image33.png" className="d-lg-none invisible" alt="" /></div><div className="col-md-6 col-lg-6"><div className="callout-text" style={{ padding: '7rem 7rem 6rem 2rem' }}><div className="section-title"><h3 className="text-white">Plan on the go with <br /> TamilWeddingBook app</h3></div><p className="lead text-white own-font-size-2">Download the TamilWeddingBook App to Plan Anytime, Anywhere</p><div className="row"><div className="col col-md-3" style={{ paddingRight: '3px' }}><img src="/assets/images/about/app-store.png" alt="" /></div><div className="col col-md-3" style={{ paddingRight: '3px' }}><img src="/assets/images/about/google-play.png" alt="" /></div></div></div></div></div></div>
      </section>
    </>
  );
}

function DressesSection() {
  return (
    <section className="wide-tb-50">
      <div className="container"><div className="row">{dressImages.map((image) => <div className="col-md-4 mb-4" key={image}><div className="card"><div className="card-body p-1"><img src={`/assets/images/categories/${image}`} alt="" /></div></div></div>)}</div></div>
    </section>
  );
}

function SeatingChartSection() {
  return (
    <section className="wide-tb-50">
      <div className="container"><div className="row">{seatingTableImages.map((image) => <div className="col-md-3 col-6 text-center" key={image}><div className="why-choose-icons"><img src={`/assets/images/seating-charts/${image}`} alt="" /><h5 className="mt-3">Seating Chart</h5><p className="own-family">Drag and drop from your list to assign each wedding guest a seat</p></div></div>)}</div></div>
    </section>
  );
}

function WeddingShootsSection() {
  return (
    <section className="wide-tb-50"><div className="container"><div className="card-shadow pos-rel"><div className="card-shadow-body"><h3 className="text-center">Wedding Shoots</h3><p className="text-center">Capture your wedding story and keep every planning detail together with TamilWeddingBook.</p><div className="text-center mt-4"><img src="/assets/images/ico_wedshoots.svg" alt="" style={{ maxWidth: '120px' }} /></div></div></div></div></section>
  );
}

export function BarnWeddingsPage() {
  return (
    <section className="wide-tb-50"><div className="container"><h3>Barn Weddings</h3><p>Barn Weddings are a type of wedding that is held in a barn. They are a popular choice for weddings because they are a unique and romantic venue. They are also a great way to celebrate a wedding in a natural setting.</p></div></section>
  );
}

export default function PublicPlanningPage({ page }) {
  if (page === 'barnWeddings') return <BarnWeddingsPage />;
  const config = planningPages[page] || planningPages.checklist;
  return (
    <>
      <PlanningHeader {...config} />
      <IntroTools />
      {page === 'dresses' && <DressesSection />}
      {page === 'seatingChart' && <SeatingChartSection />}
      {page === 'weddingShoots' && <WeddingShootsSection />}
      <SideSections />
      <GetStarted />
      <WebsiteCallouts />
    </>
  );
}

'use client';

import { useMemo, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  publicVendorDetailGallery,
  publicVendorDetailReviews,
  publicVendorDetails,
} from '../../data/publicVendorDetails';

const tabs = [
  { label: 'About', value: 'about', icon: 'bi bi-info-circle' },
  { label: 'FAQs', value: 'faqs', icon: 'bi bi-question-circle' },
  { label: 'Reviews', value: 'reviews', icon: 'bi bi-star' },
  { label: 'Gallery', value: 'gallery', icon: 'bi bi-images' },
  { label: 'Videos', value: 'videos', icon: 'bi bi-camera-reels' },
  { label: 'Location', value: 'location', icon: 'bi bi-geo-alt' },
];

function calculateAverageRating(reviews) {
  if (!reviews.length) {
    return {
      qualityOfService: 0,
      professionalism: 0,
      flexibility: 0,
      valueForMoney: 0,
      responseTime: 0,
      averageRating: 0,
    };
  }

  const totals = reviews.reduce(
    (total, review) => ({
      qualityOfService: total.qualityOfService + review.qualityOfService,
      professionalism: total.professionalism + review.professionalism,
      flexibility: total.flexibility + review.flexibility,
      valueForMoney: total.valueForMoney + review.valueForMoney,
      responseTime: total.responseTime + review.responseTime,
    }),
    { qualityOfService: 0, professionalism: 0, flexibility: 0, valueForMoney: 0, responseTime: 0 },
  );

  const qualityOfService = totals.qualityOfService / reviews.length;
  const professionalism = totals.professionalism / reviews.length;
  const flexibility = totals.flexibility / reviews.length;
  const valueForMoney = totals.valueForMoney / reviews.length;
  const responseTime = totals.responseTime / reviews.length;

  return {
    qualityOfService,
    professionalism,
    flexibility,
    valueForMoney,
    responseTime,
    averageRating: (qualityOfService + professionalism + flexibility + valueForMoney + responseTime) / 5,
  };
}

function RatingStars({ value, size = 18 }) {
  return (
    <span aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`bi ${value >= star ? 'bi-star-fill' : 'bi-star'} text-warning`}
          style={{ fontSize: size }}
        />
      ))}
    </span>
  );
}

function RequestPricingModal({ vendor, open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal fade show d-block" id="RequestPricingModal" tabIndex="-1" aria-labelledby="importClientLabel" aria-modal="true" role="dialog">
      <div className="modal-dialog modal-lg couple-dashboard-step-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Request Pricing</h5>
            <i className="bi bi-x-lg float-right cross-icon" onClick={onClose}></i>
          </div>
          <div className="modal-body p-4">
            <div className="alert alert-light border mb-4">
              Pricing requests will submit to the existing <code>/api/user/vendors/pricing-request</code> endpoint after backend migration.
            </div>
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label">Full Name</label>
                <div className="input-group"><span className="input-group-text"><i className="bi bi-person"></i></span><input className="form-control" placeholder="Enter your full name" /></div>
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label">Email</label>
                <div className="input-group"><span className="input-group-text"><i className="bi bi-envelope"></i></span><input className="form-control" type="email" placeholder="Enter your email" /></div>
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label">Phone Number</label>
                <div className="input-group"><span className="input-group-text"><i className="bi bi-telephone"></i></span><input className="form-control" placeholder="Enter your phone number" /></div>
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label">Event Date</label>
                <input className="form-control" type="date" />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label">Approximate Guests Count <small className="text-muted">(10-1000)</small></label>
                <div className="input-group"><span className="input-group-text"><i className="bi bi-people"></i></span><input className="form-control" type="number" placeholder="Enter the number of guests" /></div>
              </div>
              <div className="col-md-12 mb-4">
                <label className="form-label">Message <small className="text-muted">(0/250)</small></label>
                <textarea className="form-control" rows="5" defaultValue="Hey there! We are interested in your services. Could you send through information on your packages? Thanks!" />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>Submit Request</button> &nbsp;&nbsp;
                <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  );
}

function ReviewsPanel({ averageRatings, reviews, router }) {
  return (
    <div className="row">
      <div className="col-md-2">
        <div className="card">
          <div className="card-body text-center">
            <h1 className="text-theme">{averageRatings.averageRating.toFixed(1)}</h1>
            <p>out of 5.0</p>
            <RatingStars value={averageRatings.averageRating} />
          </div>
        </div>
      </div>
      <div className="col-md-10">
        <div className="card">
          <div className="card-body">
            <div className="row">
              {[
                ['bi bi-patch-check text-success', 'Quality of the service', averageRatings.qualityOfService],
                ['bi bi-briefcase text-info', 'Professionalism', averageRatings.professionalism],
                ['bi bi-list-nested text-warning', 'Flexibility', averageRatings.flexibility],
                ['bi bi-coin text-danger', 'Value for money', averageRatings.valueForMoney],
                ['bi bi-clock-history text-primary', 'Response time', averageRatings.responseTime],
              ].map(([icon, label, value]) => (
                <div className="col-md-4 mb-3" key={label}>
                  <div className="d-flex align-items-center">
                    <div className="ml-2 relative">
                      <div className="d-flex align-items-center gap-3"><span className={icon}></span><p className="m-0">{label}</p></div>
                      <RatingStars value={Number(value)} size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <hr />
        <div className="row mb-3 align-items-center">
          <div className="col-md-8"><h5>People who viewed this vendor</h5></div>
          <div className="col-md-4 text-right"><button type="button" className="btn btn-primary btn-sm" onClick={() => router.push('/login')}>Login to write a review</button></div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="vendor-review-list">
              <ul className="list-unstyled">
                {reviews.map((review) => (
                  <li key={review.id}>
                    <div className="d-flex">
                      <div className="left"><span><img src="/assets/images/placeholder.png" className="profile-pict-img img-fluid" alt="" /></span></div>
                      <div className="right">
                        <div className="d-flex align-items-center gap-10px"><h4>{review.user?.fullName || 'Anonymous'}</h4><div className="d-flex align-items-center gap-5px"><span className="bi bi-star-fill text-warning fs-18px"></span><small className="fw-bold">(5.0)</small></div></div>
                        <div className="review-description"><p>{review.reviewText}</p></div>
                        <span className="publish py-3 d-inline-block w-100">Published recently</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VendorDetail({ app }) {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('writeReview') === 'true' ? 'reviews' : 'about';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isPricingOpen, setPricingOpen] = useState(false);
  const requestPricingModal = useRef(null);
  const user = publicVendorDetails[params.vendorId] || publicVendorDetails[1];
  const reviews = publicVendorDetailReviews;
  const gallery = publicVendorDetailGallery;
  const averageRatings = useMemo(() => calculateAverageRating(reviews), [reviews]);

  return (
    <>
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-md-3 col-6">
                  <div className="card"><div className="card-body p-2"><img src={user.photo || '/assets/images/placeholder.png'} alt={user.fullName} className="card-image" /></div></div>
                </div>
                <div className="col-md-9 col-6">
                  <h3 className="fs-28px fw-500 mt-3">{user.fullName}</h3>
                  <span className="bg-secondary text-white px-1">{user?.vendor?.category?.name}</span><br /><br />
                  <span><i className="bi bi-geo-alt-fill text-info"></i>&nbsp;<span className="text-muted">{user?.address}</span></span>{' '}&nbsp;
                  <span><i className="bi bi-star-fill text-warning"></i> {averageRatings.averageRating.toFixed(1)}&nbsp;<span className="text-muted">{reviews.length} Reviews</span></span>
                  <hr />
                  <button className="btn btn-primary btn-sm" ref={requestPricingModal} onClick={() => setPricingOpen(true)}>Request Pricing</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="my-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {user.id && (
                <ul className="list-unstyled d-flex align-items-center gap-10 mt-3">
                  {tabs.map((tab, tabIndex) => (
                    <li key={`${tabIndex}-${tab.value}`}>
                      <button className={`btn btn-outline-primary own-style-button-5 btn-sm ${activeTab === tab.value ? 'active-theme-button' : ''}`} onClick={() => setActiveTab(tab.value)}>
                        <i className={tab.icon}></i>&nbsp;<span>{tab.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <hr />
            </div>
            <div className="col-lg-12 mt-3">
              {activeTab === 'about' && <div dangerouslySetInnerHTML={{ __html: user?.vendor?.aboutStoreFront }}></div>}
              {activeTab === 'faqs' && user?.vendor?.faqs?.faqsList?.map((faq, faqIndex) => (
                <div key={faqIndex}>
                  {faq?.status === 'done' && <><h5>{faq.question}</h5>{faq.type === 'textarea' && <p>{faq.value}</p>}{faq.type === 'range' && <p>{faq.value}</p>}{faq.type === 'radio' && <p>{faq.options.filter((option) => option.checked).map((option) => option.name).join(', ')}</p>}</>}
                </div>
              ))}
              {activeTab === 'reviews' && <ReviewsPanel averageRatings={averageRatings} reviews={reviews} router={router} />}
              {activeTab === 'gallery' && <div className="row">{gallery.map((image) => <div className="col-md-4 mb-4" key={image.id}><div className="card"><div className="card-body p-1"><img src={image.path} alt={image.name} /></div></div></div>)}</div>}
              {activeTab === 'videos' && <div><h5>Videos</h5><p>Have to discuss with kajee either we upload to external storage or we use our own storage</p></div>}
              {activeTab === 'location' && <div><h5>Location</h5><p>Have to use google map after buying the package</p></div>}
            </div>
          </div>
        </div>
      </section>

      <RequestPricingModal vendor={user} open={isPricingOpen} onClose={() => setPricingOpen(false)} app={app} />
    </>
  );
}

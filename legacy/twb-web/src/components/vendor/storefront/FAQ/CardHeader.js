import React from 'react'

export default function CardHeader({ title, no, formStatus }) {
  return (
    <div className="card-header header-bg d-flex align-items-center justify-content-between" style={{ minHeight: '3.5rem' }}>
      <strong className="card-title mb-0"><span className='text-theme'>{no}. </span>{title}</strong>
      <h6 className="text-uppercase text-theme mb-0">{formStatus === 'done' ? <i className="bi bi-check2" style={{ fontSize: '1.5rem' }}></i> : formStatus}</h6>
    </div>
  )
}

import React, { useState } from 'react'
import CardHeader from './CardHeader'

export default function CheckboxForm({ question, onChange, indexKey, formStatus }) {

  return (
    <div className="card mt-4" key={indexKey}>
      <CardHeader title={question.question} no={question.no} formStatus={formStatus} />
      <div className="card-body">
        <div className="row">
          {question.options.map((option, checkBoxIndex) => <React.Fragment key={checkBoxIndex}>
            <div className="col-md-4">
              <div className="form-group">
                <div className="form-check" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    value={option.name}
                    checked={option.checked}
                    name={`checkbox-options-${question.no}`}
                    id={`checkbox-options-${option.name}-${question.no}`}
                    onChange={(e) => onChange(e.target.value, question.no)}
                    className="form-check-input w-h-17px theme-color-bg cursor-pointer"
                  />
                  <label
                    className="form-check-label fw-normal m-2-7-0 cursor-pointer"
                    htmlFor={`checkbox-options-${option.name}-${question.no}`}
                  >
                    {option.name}
                  </label>
                </div>
              </div>
            </div>
            {option.value !== undefined && option.checked && <div className="mt-1 col-md-12" >
              <textarea
                maxLength={200}
                name=""
                id=""
                rows="3"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid rgba(0, 0, 0, 0.125)",
                  borderRadius: "0.25rem",
                  width: '100%'
                  // resize: 'none'
                }}
                value={option.value}
                onChange={(e) => onChange(option.name, question.no, e.target.value)}
              />
              <p className='mb-0 text-muted ' style={{ fontSize: '0.7rem' }} >{`${option.value.length}/200`}</p>
            </div>}
          </React.Fragment>)}
        </div>

      </div>
    </div>
  )
}

import React from 'react'
import CardHeader from './CardHeader'
import InputField from '../../../shared/InputField'
import * as validateUtil from '@utilities/ValidateUtil';

export default function RangeForm({ onChange, question, selector = "", errors, indexKey, formStatus }) {
  return (
    <div className="card mt-4" key={indexKey}>
      <CardHeader title={question.question} no={question.no} formStatus={formStatus} />
      <div className="card-body">
        <div className="row pt-1" style={{ minHeight: '5rem' }}>
          <div className="col-lg-8 pt-3">
            <input
              type="range"
              min={question.min}
              max={question.max}
              value={question.value}
              onChange={(e) => onChange(e.target.value, question.no)}
              step={question.step}
              className="w-100  text-theme border border-danger "
            />
            <div className="d-flex  justify-content-between ">
              <span>£ {question.min}</span> <span>£ {question.max}</span>
            </div>
          </div>

          {question.value && question.value !== "" && <div className="col-lg-3 offset-lg-1 d-flex  align-items-center ">
            <div className="" style={{ width: '40%' }}>
              <InputField
                label=""
                labelClassName="mb-0"
                type="text"
                selector={selector}
                value={question.value}
                placeholder="£"
                onHandleChange={(e) => onChange(e.target.value, question.no)}
                errors={errors}
                allBorders={true}

              />
            </div>
            <div className="card p-2 ml-2 mb-4" style={{ height: 'max-content', cursor: 'pointer' }} onClick={() => onChange('', question.no)}>
              <i className="bi bi-trash3" style={{ fontSize: '1.9rem' }}></i>
            </div>
          </div>}
        </div>

      </div>
    </div>
  )
}

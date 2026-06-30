import React from 'react'
import CardHeader from './CardHeader'

export default function RadioForm({ question, onChange, indexKey, formStatus }) {
  return (
    <div className="card mt-4" key={indexKey}>
      <CardHeader title={question.question} no={question.no} formStatus={formStatus} />
      <div className="card-body">
        <div className="row">
          {question?.options?.map((option, index) => <div className='col-md-4 ' key={index}>
            <div className="d-flex gap-5px align-items-center">
              <input type="radio" name={`options-${question.no}`} id={`${option.name}-${question.no}`} value={option.name} onChange={(e) => onChange(e.target.value, question.no)} checked={option.checked}
              />
              <label htmlFor={`${option.name}-${question.no}`} className="cursor-pointer m-0">
                {option.name}
              </label>
            </div>
          </div>)}
        </div>
      </div>


    </div>

  )
}

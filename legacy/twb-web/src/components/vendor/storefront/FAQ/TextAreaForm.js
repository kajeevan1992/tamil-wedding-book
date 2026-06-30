import React from 'react'
import CardHeader from './CardHeader'
import * as validateUtil from '@utilities/ValidateUtil';
export default function TextAreaForm({ question, onChange, indexKey, formStatus }) {
  return (
    <div className="card mt-4" key={indexKey}>
      <CardHeader title={question.question} no={question.no} formStatus={formStatus} />
      <div className="card-body">
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
          value={question.value}
          // defaultValue={question.value}
          onChange={(e) => onChange(e.target.value, question.no)}
        />
        <p className='mb-0 text-muted ' style={{ fontSize: '0.7rem' }} >{`${question.value.length}/200`}</p>
      </div>
    </div>
  )
}

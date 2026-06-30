import React, { useState, useEffect, useReducer } from "react";
import InputField from "@components/shared/InputField";
import CardHeader from "./CardHeader";
import { toast } from 'react-hot-toast';
import * as validateUtil from '@utilities/ValidateUtil';
import RangeForm from "./RangeForm";
import TextAreaForm from "./TextAreaForm";
import RadioForm from "./RadioForm";
import CheckboxForm from "./CheckboxForm";
export default function FAQ({ app, onSubmit, errors }) {
  const [showGuestForm, setshowGuestForm] = useState(true)
  const initialState = {
    price: undefined,
    minGuests: undefined,
    maxGuests: undefined,
    faqsList: [],
    role: undefined,
    lowestPrice: undefined,
    highestPrice: undefined,

  }
  const reducer = (prevState, updatedProperty) => ({ ...prevState, ...updatedProperty })
  const [state, setState] = useReducer(reducer, initialState)
  useEffect(() => {
    // let faqsObj = app?.profile?.role === 'venue' ? app?.profile?.vendor?.faqs?.barn_weddings : app?.profile?.vendor?.faqs?.accessories

    let faqsObj = app?.profile?.vendor?.faqs
    setState({
      role: app?.profile?.role,
      price: faqsObj?.price,
      minGuests: faqsObj?.minGuests,
      maxGuests: faqsObj?.maxGuests,
      faqsList: faqsObj?.faqsList,
      lowestPrice: faqsObj?.lowestPrice,
      highestPrice: faqsObj?.highestPrice,
    });
  }, []);



  const onChange = (value, qNo, text) => {
    let tempArray = state.faqsList.map((question) => {
      if (question.no === qNo) {
        if (question.type === 'checkbox') {
          // Checkbox: toggle checked on click, update value on text input
          let newQOptions = question.options.map((option) => {
            if (option.name === value) {
              if (option.value !== undefined) {
                if (text !== undefined) {
                  // Only update value, do not toggle checked
                  return { ...option, value: text, checked: true };
                } else {
                  // Toggle checked, clear value
                  return { ...option, checked: !option.checked, value: !option.checked ? option.value : '' };
                }
              } else {
                // No value field, just toggle checked
                return { ...option, checked: !option.checked };
              }
            } else {
              return option;
            }
          });
          return { ...question, options: newQOptions };
        } else if (question.type === 'radio') {
          // Radio: only one can be checked, update value if text provided
          let newQOptions = question.options.map((option) => {
            if (option.name === value) {
              if (option.value !== undefined && text !== undefined) {
                return { ...option, checked: true, value: text };
              } else {
                return { ...option, checked: true };
              }
            } else {
              // Uncheck all others
              return { ...option, checked: false };
            }
          });
          return { ...question, options: newQOptions };
        } else {
          // For range, textarea, etc.
          return { ...question, value };
        }
      } else {
        return question;
      }
    });
    setState({ faqsList: tempArray });
  }

  const getFormStatus = (question) => {
    if (question.type === 'radio' || question.type === 'checkbox') {
      return Array.isArray(question.options) && question.options.some(option => option.checked) ? 'done' : 'pending';
    } else if (question.type === 'range') {
      return question.value !== undefined && question.value !== '' ? 'done' : 'pending';
    } else if (question.type === 'textarea') {
      return typeof question.value === 'string' && question.value.trim().length > 0 ? 'done' : 'pending';
    } else {
      return question.value !== undefined && question.value !== '' ? 'done' : 'pending';
    }
  };

  return (
    <section className="col-md-12">
      <h1 className="prepareTextTitle">
        FAQs
      </h1>
      <div className="card mt-2">
        <div className="card-body d-flex align-items-center grey-bg">
          <i className="bi bi-journal-text fs-3rem mr-3"></i>
          <div>
            <strong>Please provide details about your services.</strong>
            <p className="mb-0">Add answers to frequently asked questions about your business to give couples a better understanding of your offering before deciding whether to contact you.</p>
          </div>
        </div>
      </div>
      {/* {state?.faqsList?.length > 0 && <div className="card mt-4">
        <div className="card-body header-bg">
          <strong>{`You have to answer ${state?.faqsList[state.faqsList?.length - 1]?.no} more questions`}</strong>
          <p className="mb-0">
            We recommend you answer all the questions, as it's very useful information for couples.
          </p>
        </div>
      </div>} */}
      {state.price !== undefined && <div className="card mt-4">
        <CardHeader title={showGuestForm ? 'From which price can I hire my menu?' : 'From which price can I hire the space?'} no={1} formStatus={validateUtil.isEmpty(state.price) ? 'pending' : 'done'} />
        <div className="card-body">
          <p className="card-text">Enter your average pricing for your storefront to appear in results when couples search by price</p>
          {showGuestForm ? <React.Fragment>
            <p className="card-text">Minimum price per guest</p>
            <div style={{ width: '40%' }}>
              <InputField
                label="Includes menu and venue"
                labelClassName="mb-0"
                type="text"
                selector="price"
                value={state.price}
                placeholder="price (£)"
                onHandleChange={(e) => { setState({ price: e.target.value }) }}
                errors={errors}
              />
              <p className="card-text hover-class text-theme" onClick={() => setshowGuestForm(false)}>Room hire only</p>
            </div>
          </React.Fragment> : <React.Fragment>
            <p className="card-text">Minimum price for room hire</p>
            <div style={{ width: '40%' }}>
              <InputField
                label="Total price per day"
                labelClassName="mb-0"
                type="text"
                selector="price"
                value={state.price}
                placeholder="price (£)"
                onHandleChange={(e) => { setState({ price: e.target.value }) }}
                errors={errors}
              />
              <p className="card-text hover-class text-theme" onClick={() => setshowGuestForm(true)}>Price per menu and venue</p>
            </div>
          </React.Fragment>}
        </div>
      </div>}

      {state.lowestPrice !== undefined && <div className="card mt-4">
        <CardHeader title={'What is the starting price for your services?'} no={1} formStatus={validateUtil.isEmpty(state.lowestPrice) || validateUtil.isEmpty(state.highestPrice) ? 'pending' : 'done'} />
        <div className="card-body">
          <p className="card-text">Enter your average pricing for your storefront to appear in results when couples search by price</p>
          <div className="row">
            <div className="col-md-4">
              <InputField
                label="Lowest price"
                labelClassName="mb-0"
                type="text"
                selector="lowestPrice"
                value={state.lowestPrice}
                placeholder="0"
                onHandleChange={(e) => { setState({ lowestPrice: e.target.value }) }}
                errors={errors}
              />
            </div>
            {state.highestPrice !== undefined && <div className="col-md-4 offset-1">
              <InputField
                label="Highest price"
                labelClassName="mb-0"
                type="text"
                selector="highestPrice"
                value={state.highestPrice}
                placeholder="0"
                onHandleChange={(e) => { setState({ highestPrice: e.target.value }) }}
                errors={errors}
              />
            </div>}
          </div>
        </div>
      </div>}


      {state.minGuests !== undefined && <div className="card mt-4">
        <CardHeader title={'How many guests can you accommodate?'} no={2} formStatus={validateUtil.isEmpty(state.minGuests) || validateUtil.isEmpty(state.maxGuests) ? 'pending' : 'done'} />
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <InputField
                label="Minimum number of guests"
                labelClassName="mb-0"
                type="text"
                selector="minGuests"
                value={state.minGuests}
                placeholder="0"
                onHandleChange={(e) => { setState({ minGuests: e.target.value }) }}
                errors={errors}
              />
            </div>
            <div className="col-md-4 offset-1">
              <InputField
                label="Maximum number of guests"
                labelClassName="mb-0"
                type="text"
                selector="maxGuests"
                value={state.maxGuests}
                placeholder="0"
                onHandleChange={(e) => { setState({ maxGuests: e.target.value }) }}
                errors={errors}
              />
            </div>
          </div>
        </div>
      </div>}
      {state.faqsList?.map((question, index) =>
        question.type === 'checkbox' ?
          <CheckboxForm question={question} onChange={onChange} indexKey={index} key={index + 1} formStatus={getFormStatus(question)} /> : question.type === 'radio' ? <RadioForm question={question} onChange={onChange} indexKey={index} key={index + 1} formStatus={getFormStatus(question)} /> : question.type === 'range' ? <RangeForm question={question} onChange={onChange} errors={errors} indexKey={index} key={index + 1} formStatus={getFormStatus(question)} /> : <TextAreaForm question={question} onChange={onChange} indexKey={index} key={index + 1} formStatus={getFormStatus(question)} />)}


      <div className="row">
        <div className="col-md-12 mt-4">
          <button className="btn bt-sm btn-primary" onClick={() => { onSubmit(state) }}>Save</button>
        </div>

      </div>

    </section>
  )
}


import React, { useState } from "react";
import FAQ from "@components/vendor/storefront/FAQ";
import { useDispatch, useSelector } from "react-redux";
import * as validateUtil from '@utilities/ValidateUtil';
import * as vendorService from "@services/VendorService";
import { authenticate, toggleLoading, updateProfileFaqs } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import { statusMessages } from "@utilities/CommonUtil";

export default function FAQs() {
  const app = useSelector(state => state.app);

  const [state, setState] = useState({
    errors: {}
  });

  const onSubmit = async (faqsObject) => {
    let errors = {};
    let validationFlag = true;
    let tempObject = {};

    const allFormsChecked = faqsObject.faqsList.every(question => {
      if (question.type === 'radio') {
        // At least one radio option checked
        return Array.isArray(question.options) && question.options.some(option => option.checked);
      } else if (question.type === 'checkbox') {
        // At least one checkbox option checked
        return Array.isArray(question.options) && question.options.some(option => option.checked);
      } else if (question.type === 'range') {
        // Must have a value (and optionally check min/max)
        return question.value !== undefined && question.value !== '';
      } else if (question.type === 'textarea') {
        // Must have at least 1 non-whitespace character
        return typeof question.value === 'string' && question.value.trim().length > 0;
      } else {
        // Fallback for other types
        return question.value !== undefined && question.value !== '';
      }
    });
    if (!allFormsChecked) {
      toast.error('Please answer all of the questions');
      validationFlag = false;
    } else {
      tempObject = { ...tempObject, faqsList: faqsObject.faqsList }
    }
    if (faqsObject.price !== undefined) {
      if (validateUtil.isEmpty(faqsObject.price)) {
        validationFlag = false;
        errors.price = ['Price is required'];
      } else {
        tempObject = { ...tempObject, price: faqsObject.price }
      }
    }
    if (faqsObject.lowestPrice !== undefined) {
      if (validateUtil.isEmpty(faqsObject.lowestPrice)) {
        validationFlag = false;
        errors.price = ['Lowest price is required'];
      } else {
        tempObject = { ...tempObject, lowestPrice: faqsObject.lowestPrice }
      }
    }
    if (faqsObject.highestPrice !== undefined) {
      if (validateUtil.isEmpty(faqsObject.highestPrice)) {
        validationFlag = false;
        errors.price = ['Highest price is required'];
      } else {
        tempObject = { ...tempObject, highestPrice: faqsObject.highestPrice }
      }
    }
    if (faqsObject.minGuests !== undefined) {
      if (validateUtil.isEmpty(faqsObject.minGuests)) {
        validationFlag = false;
        errors.minGuests = ['No of minimum guests is required'];
      } else {
        tempObject = { ...tempObject, minGuests: faqsObject.minGuests }
      }
      if (validateUtil.isEmpty(faqsObject.maxGuests)) {
        validationFlag = false;
        errors.maxGuests = ['No of maximum guests is required'];
      } else {
        tempObject = { ...tempObject, maxGuests: faqsObject.maxGuests }
      }
    }
    if (!validationFlag) {
      setState((currentState) => ({
        ...currentState,
        errors: errors
      }));
    } else {
      setState((currentState) => ({
        ...currentState,
        errors: {}
      }));
      submit(tempObject);
    }
  }

  const dispatch = useDispatch();

  async function submit(faqsObject) {
    try {
      setState((currentState) => ({
        ...currentState,
        errors: {}
      }));

      dispatch(toggleLoading(true));
      let newfaqsList = faqsObject.faqsList.map((faqForm) => {
        if (faqForm.options && faqForm.options.find(option => option.checked)) {
          return { ...faqForm, status: 'done' }
        } else if (!faqForm.options && faqForm.value && faqForm.value !== "") {
          return { ...faqForm, status: 'done' }
        } else {
          return { ...faqForm, status: 'pending' }
        }
      })
      let newFaqsObject = { ...faqsObject, faqsList: newfaqsList }

      const response = await vendorService.updateFaqs({ faqs: newFaqsObject });

      dispatch(updateProfileFaqs(response.data.faqs));
      dispatch(toggleLoading(false));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error)
      dispatch(toggleLoading(false));
      if (statusMessages(error) === 'validation-errors') {
        setState((currentState) => ({
          ...currentState,
          errors: error.response.data.errors
        }));
      }
    }
  }

  return (
    <React.Fragment>
      {app?.profile?.id && <FAQ app={app} onSubmit={onSubmit} errors={state.errors} />}
    </React.Fragment>
  );
}

const dotenv = require("dotenv");
dotenv.config();
const Validator = require('validatorjs');

async function validateStoreFrontStep1(body) {
  return new Promise(function (resolve, reject) {
    let validationErrors = {};
    let vendor = JSON.parse(body.vendor);

    let validationAccount = new Validator(body, {
      'username': 'required|min:5|max:191',
    });

    if (validationAccount.fails()) {
      const { errors } = validationAccount.errors;
      Object.assign(validationErrors, errors);
    }

    let validationStoreFront = new Validator(vendor, {
      'aboutStoreFront': 'required|min:200',
    });

    if (validationStoreFront.fails()) {
      const { errors } = validationStoreFront.errors;
      Object.assign(validationErrors, errors);
    }

    let validationContactPerson = new Validator(vendor.contactPerson, {
      'fullName': 'required|min:3|max:150',
      'email': 'required|email',
      'telephone': 'required|max:50',
    });

    if (validationContactPerson.fails()) {
      const { errors } = validationContactPerson.errors;
      Object.assign(validationErrors, errors);
    }

    if (body.changePasswordCheck === 'true' || body.changePasswordCheck === true) {
      let validationPassword = new Validator(body, {
        'currentPassword': 'required',
        'newPassword': 'required|min:8|max:100|confirmed',
      });

      if (validationPassword.fails()) {
        const { errors } = validationPassword.errors;
        Object.assign(validationErrors, errors);
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      reject({
        type: 'validations',
        message: 'Invalid data format!',
        errors: validationErrors
      });
    } else {
      resolve();
    }
  });
}

async function validateStoreFrontStep2(body) {
  return new Promise(function (resolve, reject) {
    let validationErrors = {};

    let validationAddress = new Validator(body, {
      'address': 'required|max:255'
    });

    if (validationAddress.fails()) {
      const { errors } = validationAddress.errors;
      Object.assign(validationErrors, errors);
    }

    if (Object.keys(validationErrors).length > 0) {
      reject({
        type: 'validations',
        message: 'Invalid data format!',
        errors: validationErrors
      });
    } else {
      resolve();
    }
  });
}

async function validateStoreFrontStep3(body) {
  return new Promise(function (resolve, reject) {
    let validationErrors = {};
    let vendor = JSON.parse(body.vendor);
    // let mainExists = vendor.vendorStoreFiles.find(vendorFile => vendorFile.main === true);
    // if (!mainExists) {
    //   validationFlag = false;
    //   validationErrors.images = ['Any one image should be selected as main'];
    // } else {
    let emptyDescription = vendor.vendorStoreFiles.find(vendorFile => vendorFile.description === '');
    if (emptyDescription) {
      validationFlag = false;
      validationErrors.images = ['Every image description must contain a minimum of five characters.'];
    }
    // }

    if (Object.keys(validationErrors).length > 0) {
      reject({
        type: 'validations',
        message: 'Invalid data format!',
        errors: validationErrors
      });
    } else {
      resolve();
    }
  });
}

const validateStoreFrontSteps = async (body) => {
  try {
    let response;

    if (body.action === 'step1') {
      response = await validateStoreFrontStep1(body);
    } else if (body.action === 'step2') {
      response = await validateStoreFrontStep2(body);
    } else if (body.action === 'step3') {
      response = await validateStoreFrontStep3(body);
    }

    return true;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  validateStoreFrontSteps
}

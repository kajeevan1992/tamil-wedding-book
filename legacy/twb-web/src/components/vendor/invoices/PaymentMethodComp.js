export default function PaymentMethod({ app }) {
  return (
    <div className="row">
      <section className="col-md-12">
        <h1 className="prepareTextTitle">Payments methods</h1>
        <div className="card mt-2">
          <div className="card-body d-flex grey-bg">
            <i className="bi bi-pencil-square fs-3rem mr-3"></i>
            <div>
              <p>
                At Tamilweddingbook we use an advanced technology to keep a high
                security level of our online platform. Our secure socket layer
                (SSL) encrypt all personal information you provide us with.
              </p>
            </div>
          </div>
        </div>
        <div className="card mt-4">
          <div className="card-body d-flex grey-bg">
            <div>
              <strong>
                Add your preferred payment method to automate your monthly
                Tamilweddingbook payments
              </strong>
              <p className="mt-2 mb-0">
                Systems used are 100% secure and make the payment process
                easier.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 ">
          Complete the following form and enter the credit card you want to use
          to make the payments of your services. We will automatically make the
          charge on this credit card according to the dates indicated in the
          contract.
        </p>
      </section>
      <section className="col-md-12">
        <div className="card border-bottom-0">
          <div className="card-body d-flex align-items-center grey-bg">
            <i className="bi bi-credit-card fs-5 mr-2 "></i>
            <h5 className="mb-0 ">Credit</h5>
          </div>
        </div>
        <div className="card bt-0 border-top-0">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8">
                <article className="card ">
                  <div className="card-body">
                    <p>
                      {" "}
                      <img src="https://bootstrap-ecommerce.com/bootstrap5-ecommerce/images/misc/payments.webp" />
                    </p>

                    <form role="form">
                      <div className="form-group">
                        <label for="username">Full name (on the card)</label>
                        <div className="input-group input-card">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fa fa-user"></i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control mt-0"
                            name="username"
                            placeholder=""
                            required=""
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label for="cardNumber">Card number</label>
                        <div className="input-group input-card">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fa fa-credit-card"></i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control mt-0"
                            name="cardNumber"
                            placeholder=""
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-8">
                          <div className="form-group">
                            <label>
                              <span className="hidden-xs">Expiration</span>
                            </label>
                            <div className="d-flex align-items-center">
                              <select
                                className="form-control"
                                style={{ width: "45%" }}
                              >
                                <option>MM</option>
                                <option>01 - Janiary</option>
                                <option>02 - February</option>
                                <option>03 - February</option>
                              </select>
                              <span
                                style={{
                                  width: "10%",
                                  textAlign: "center",
                                }}
                              ></span>
                              <select
                                className="form-control"
                                style={{ width: "45%" }}
                              >
                                <option>YY</option>
                                <option>2018</option>
                                <option>2019</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label
                              data-toggle="tooltip"
                              title=""
                              data-original-title="3 digits code on back side of the card"
                            >
                              CVC<i className="fa fa-question-circle"></i>
                            </label>
                            <input
                              className="form-control input-card mt-0"
                              required=""
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        className="subscribe btn btn-primary btn-block"
                        type="button"
                      >
                        {" "}
                        Add Payment Method{" "}
                      </button>
                    </form>
                  </div>
                </article>
              </div>
              <div className="col-lg-4">
                <div className="card mt-2">
                  <div className="card-body  grey-bg">
                    <b>What is CVC?</b>
                    <br />
                    <p className="mb-0">
                      Three-digit security code printed on the back side of the
                      card. It is used to help validate your card during the
                      transaction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

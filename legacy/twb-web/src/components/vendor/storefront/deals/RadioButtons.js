import { useState } from "react"

function RadioButtons() {
  const [topping, setTopping] = useState("3%")

  const onOptionChange = e => {
    setTopping(e.target.value)
  }

  return (
    <div className="App">
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <label className="btn bg-secondary mr-5   active" htmlFor="3%">
          <input type="radio" name="options" id="3%" value={'3%'} autocomplete="off" checked={topping === "3%"}
            onChange={onOptionChange} /> 3%
        </label>
        <label className="btn btn-warning" htmlFor="5%">
          <input type="radio" name="options" id="5%" value={'5%'} autocomplete="off" checked={topping === "5%"}
            onChange={onOptionChange} /> 5%
        </label>
        <label className="btn btn-warning" htmlFor="10%">
          <input type="radio" name="options" id="10%" value={'10%'} autocomplete="off" checked={topping === "10%"}
            onChange={onOptionChange} /> 10%
        </label>
        <label className="btn btn-warning" htmlFor="15%">
          <input type="radio" name="options" id="15%" value={'15%'} autocomplete="off" checked={topping === "15%"}
            onChange={onOptionChange} /> 15%
        </label>
        <label className="btn btn-warning" htmlFor="20%">
          <input type="radio" name="options" id="20%" value={'20%'} autocomplete="off" checked={topping === "20%"}
            onChange={onOptionChange} /> 20%
        </label>
        <label className="btn btn-warning" htmlFor="30%">
          <input type="radio" name="options" id="30%" value={'30%'} autocomplete="off" checked={topping === "30%"}
            onChange={onOptionChange} /> 20%
        </label>
        <input
          type="radio"
          name="options"
          value="not"
          id="not"
          checked={topping == "not"}
          onChange={onOptionChange}
        />
        <label htmlFor="not">Not offering any discounts currently.</label>
      </div>
      {/* <input
        type="radio"
        name="topping"
        value="Regular"
        id="regular"
        checked={topping === "Regular"}
        onChange={onOptionChange}
      />
      <label htmlFor="regular">Regular</label>

      <input
        type="radio"
        name="topping"
        value="Medium"
        id="medium"
        checked={topping === "Medium"}
        onChange={onOptionChange}
      />
      <label htmlFor="medium">Medium</label>

      <input
        type="radio"
        name="topping"
        value="Large"
        id="large"
        checked={topping === "Large"}
        onChange={onOptionChange}
      />
  <label htmlFor="large">Large</label>*/}

      <p>
        Select topping <strong>{topping}</strong>
      </p>
    </div>
  )
}

export default RadioButtons
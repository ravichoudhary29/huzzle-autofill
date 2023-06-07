import './Popup.css'

const App = () => {
  return (
    <div className="popup-container">
      <h2 className="title-text">Huzzle Autofill</h2>
      <div className="top-buttons">
        <button className="btn1">Autofill</button>
        <button className="btn2">Reset</button>
        <button className="btn3">Save</button>
        <button className="btn4">Load</button>
      </div>
      <div className="input-container">
        <div>
          <span>Name</span>
          <input></input>
        </div>
        <div>
          <span>Email</span>
          <input></input>
        </div>
        <div>
          <span>Telephone Number</span>
          <input></input>
        </div>
        <div>
          <span>Address</span>
          <input></input>
        </div>
        <div>
          <span>City</span>
          <input></input>
        </div>
        <div>
          <span>Postcode</span>
          <input></input>
        </div>
        <div>
          <span>Card Number</span>
          <input></input>
        </div>
        <div>
          <span>Expiry Month</span>
          <input></input>
        </div>
        <div>
          <span>Expiry Year</span>
          <input></input>
        </div>
        <div>
          <span>CVV</span>
          <input></input>
        </div>
      </div>
    </div>
  )
}

export default App

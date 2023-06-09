import './Popup.css'

const App = () => {
  return (
    <div className="popup-container">
      <h2 className="title-text">Huzzle Autofill</h2>
      <div className="top-buttons">
        <button className="btn">Autofill</button>
        <button className="btn">Reset</button>
        <button className="btn">Save</button>
        <button className="btn">Load</button>
      </div>
      <div className="input-container">
        <div className="input-field">
          <label>Name</label>
          <input></input>
        </div>
        <div className="input-field">
          <label>Email</label>
          <input></input>
        </div>
        <div className="input-field">
          <label>Telephone Number</label>
          <input></input>
        </div>
        <div className="input-field">
          <label>Address</label>
          <input></input>
        </div>
        <div className="input-field">
          <label>City</label>
          <input></input>
        </div>
        <div className="input-field">
          <label>Postcode</label>
          <input></input>
        </div>
        <div className="input-field">
          <label>Card Number</label>
          <input></input>
        </div>
        <div className="input-field">
          <label>Expiry Month</label>
          <input></input>
        </div>
        <div className="input-field">
          <label>Expiry Year</label>
          <input></input>
        </div>
        <div className="input-field">
          <label>CVV</label>
          <input></input>
        </div>
      </div>
    </div>
  )
}

export default App

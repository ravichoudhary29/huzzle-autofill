import React, { useState } from 'react'
import axios from 'axios'
import './Options.css'

export default function Options() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [userData, setUserData] = useState({})

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value)
  const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => setOtp(event.target.value)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = {
      user: {
        email: email,
        userable_type: 'Candidate',
        userable_source: 'website',
      },
    }
    axios
      .post('https://api.huzzle.app/api/v1/candidate/login', data)
      .then((response) => {
        console.log(response.data) // Display the response from your API
      })
      .catch((error) => {
        console.error('An error occurred:', error)
      })
  }

  const verifyOTP = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    axios
      .post('https://api.huzzle.app/api/v1/login', {
        user: {
          email: email,
          otp: otp,
        },
      })
      .then((response) => {
        console.log(response.data) // Display the response from your API
        setUserData(response.data) // Update state with user data
      })
      .catch((error) => {
        console.error('An error occurred:', error)
      })
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2>Huzzle SignIn</h2>
        <form onSubmit={handleSubmit} className="left-form">
          <label>
            Email:
            <input type="email" value={email} onChange={handleEmailChange} required />
          </label>
          <button type="submit">Send OTP</button>
        </form>

        <form onSubmit={verifyOTP} className="left-form">
          <label>
            OTP:
            <input type="text" value={otp} onChange={handleOTPChange} required />
          </label>
          <button type="submit">Sign In</button>
        </form>
      </div>

      <div className="form-container">
        {userData && Object.keys(userData).length > 0 && (
          <div className="right-form">
            {Object.keys(userData).map((key) => (
              <p key={key}>
                {key}: {userData[key]}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

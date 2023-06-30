import React, { useState } from 'react'
import axios from 'axios'
import './Options.css'

export default function Options() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value)
  const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => setOtp(event.target.value)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = {
      user: {
        email: 'ravi@huzzle.app',
        userable_type: 'Candidate',
        userable_source: 'website',
      },
    }
    // Call your API to send the OTP
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
    // Verify the OTP using your API
    axios
      .post('https://api.huzzle.app/api/v1/login', {
        user: {
          email: email,
          otp: otp,
        },
      })
      .then((response) => {
        console.log(response.data) // Display the response from your API
      })
      .catch((error) => {
        console.error('An error occurred:', error)
      })
  }

  return (
    <div className="container">
      <h2>Huzzle SignIn</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} required />
        </label>
        <button type="submit">Send OTP</button>
      </form>

      <form onSubmit={verifyOTP}>
        <label>
          OTP:
          <input type="text" value={otp} onChange={handleOTPChange} required />
        </label>
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}

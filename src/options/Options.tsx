import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Options.css'

interface UserData {
  [key: string]: any
}

export default function Options() {
  const [email, setEmail] = useState<string>('')
  const [otp, setOtp] = useState<string>('')
  const [userData, setUserData] = useState<UserData>({})

  const keysOfInterest = [
    'avatar_url',
    'bio',
    'date_of_birth',
    'email',
    'first_name',
    'last_name',
    'linkedin_url',
    'name',
    'remote_opportunity',
    'resume_url',
  ]

  useEffect(() => {
    chrome.storage.local.get(['userData'], function (result) {
      if (result.userData) {
        setUserData(result.userData)
      }
    })
  }, [])

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
      .then((response) => console.log(response.data))
      .catch((error) => console.error('An error occurred:', error))
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
        console.log(response.data)
        setUserData(response.data.data.attributes)
        chrome.storage.local.set({ userData: response.data.data.attributes }, function () {
          console.log('User data is stored in local storage.')
        })
      })
      .catch((error) => console.error('An error occurred:', error))
  }

  return (
    <div className="container">
      <div className="form-container-left">
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

      <div className="form-container-right">
        {userData && Object.keys(userData).length > 0 && (
          <div className="right-form">
            {keysOfInterest.map((key) =>
              userData[key] ? (
                <p key={key}>
                  {' '}
                  {key}: {JSON.stringify(userData[key])}
                </p>
              ) : null,
            )}
            {userData.degree && userData.degree.data && userData.degree.data.attributes && (
              <p>degree.name: {userData.degree.data.attributes.name}</p>
            )}
            {userData.subject && userData.subject.data && userData.subject.data.attributes && (
              <p>subject.name: {userData.subject.data.attributes.name}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

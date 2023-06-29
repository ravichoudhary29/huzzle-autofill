import React, { useState, useEffect } from 'react'
import './Options.css'

interface IUserData {
  firstName: string
  lastName: string
  email: string
  phone: string
  githubId: string
  linkedInId: string
  portfolioUrl: string
}

const initialUserData: IUserData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  githubId: '',
  linkedInId: '',
  portfolioUrl: '',
}

function App() {
  const [userData, setUserData] = useState<IUserData>(initialUserData)
  const [savedUserData, setSavedUserData] = useState<IUserData>(initialUserData)

  useEffect(() => {
    chrome.storage.local.get('userData', (data) => {
      const retrievedData = data.userData || initialUserData
      setUserData(retrievedData)
      setSavedUserData(retrievedData)
    })
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    chrome.storage.local.set({ userData }, () => {
      setSavedUserData(userData)
    })
  }

  return (
    <main className="main-container">
      <h3>User Data</h3>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            className="form-input"
            name="firstName"
            type="text"
            value={userData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            className="form-input"
            name="lastName"
            type="text"
            value={userData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            className="form-input"
            name="email"
            type="text"
            value={userData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            className="form-input"
            name="phone"
            type="text"
            value={userData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Github ID:</label>
          <input
            className="form-input"
            name="githubId"
            type="text"
            value={userData.githubId}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>LinkedIn ID:</label>
          <input
            className="form-input"
            name="linkedInId"
            type="text"
            value={userData.linkedInId}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Portfolio URL:</label>
          <input
            className="form-input"
            name="portfolioUrl"
            type="text"
            value={userData.portfolioUrl}
            onChange={handleChange}
          />
        </div>
        <button className="save-button" type="submit">
          Save
        </button>
      </form>

      <div className="saved-data">
        <h3>Saved User Data</h3>
        <p>First Name: {savedUserData.firstName}</p>
        <p>Last Name: {savedUserData.lastName}</p>
        <p>Email: {savedUserData.email}</p>
        <p>Phone: {savedUserData.phone}</p>
        <p>Github ID: {savedUserData.githubId}</p>
        <p>LinkedIn ID: {savedUserData.linkedInId}</p>
        <p>Portfolio URL: {savedUserData.portfolioUrl}</p>
      </div>
    </main>
  )
}

export default App

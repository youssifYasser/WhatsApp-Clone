import { Box, CircularProgress, TextField } from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { MuiTelInput } from 'mui-tel-input'
import { phone } from 'phone'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { auth, db, storage } from '../firebase'
import Image from 'next/image'

const SignInWithPhone = ({ setSignPhone, setLoadApp }) => {
  const [userData, setUserData] = useState({})
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneInfo, setPhoneInfo] = useState(null)
  const [OTP, setOTP] = useState('')
  const [nameInput, setNameInput] = useState('')

  const filePickerRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const [registerSteps, setRegisterSteps] = useState('phone') //phone - data (name, image) - otp
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const addImageRegisteration = (e) => {
    const reader = new FileReader()
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }
    reader.onload = (readerEvent) => {
      setSelectedImage(readerEvent.target.result)
    }
  }

  const handlePhoneNumberChange = (phonNum, info) => {
    setPhoneNumber(phonNum)
    setPhoneInfo(info)
  }

  const signInWithPhone = () => {
    signInWithPhoneNumber(auth, phoneInfo.numberValue, window.recaptchaVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult
      })
      .catch(alert)
  }

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-verifier',
      {
        size: 'invisible',
        callback: (response) => {},
      },
      auth
    )
  }

  const verifyPhoneNumber = async () => {
    let user
    if (phone(phoneInfo.numberValue).isValid) {
      await getDocs(
        query(
          collection(db, 'users'),
          where('phoneNumber', '==', phoneInfo.numberValue)
        )
      ).then((snapshot) => {
        user = snapshot.docs[0]
      })
      // console.log(user.docs[0].data())
    } else {
      setError(true)
    }
    return { id: user?.id, data: user?.data() }
  }

  const verifyUser = async (userDocs) => {
    if (userDocs?.data) {
      signInWithPhone()
      setUserData({
        ...userData,
        name: userDocs?.data.name,
        phone: userDocs?.data.phoneNumber,
        userImg: userDocs?.data.userImg,
      })
      setRegisterSteps('otp')
    } else {
      setUserData({ ...userData, phone: phoneInfo.numberValue })
      setRegisterSteps('data')
    }
  }

  const handleRegisteration = async (e) => {
    e.preventDefault()
    setError(false)

    if (registerSteps === 'phone') {
      let userDocs = await verifyPhoneNumber()

      generateRecaptcha()
      verifyUser(userDocs)
    }

    if (registerSteps === 'data') {
      let name = nameInput.trim()
      if (name !== '') {
        setUserData({ ...userData, name: name })
        setRegisterSteps('otp')
        signInWithPhone()
      } else {
        setError(true)
      }
    }

    if (registerSteps === 'otp') {
      if (OTP.length === 6) {
        let confirmationResult = window.confirmationResult
        confirmationResult
          .confirm(OTP)
          .then(async (result) => {
            await setDoc(
              doc(db, 'users', result.user.uid),
              {
                lastSeen: serverTimestamp(),
                name: userData.name,
                phoneNumber: userData.phone,
              },
              { merge: true }
            ).then(async (document) => {
              if (selectedImage) {
                setLoading(true)
                const imageRef = ref(storage, `users/${result.user.uid}/image`)
                await uploadString(imageRef, selectedImage, 'data_url').then(
                  async (snapshot) => {
                    const downloadUrl = await getDownloadURL(imageRef)
                    await updateDoc(doc(db, 'users', result.user.uid), {
                      userImg: downloadUrl,
                    })
                    // setUserData({ ...userData, userImg: downloadUrl })
                  }
                )
                setLoading(false)
              }
              // auth.currentUser.displayName = userData.name
              // auth.currentUser.photoURL = userData.userImg
              //   ? userData.userImg
              //   : undefined
              setLoadApp(true)
            })
          })
          .catch(alert)
      } else {
        setError(true)
      }
    }
  }

  return (
    <Container>
      <h3 style={{ marginBottom: '15px' }}>Sign in with phone number</h3>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': {
            m: 1,
          },
        }}
        noValidate
        autoComplete='off'
      >
        <div>
          {/* phone number */}
          <MuiTelInput
            required
            disabled={registerSteps !== 'phone'}
            error={registerSteps === 'phone' && error}
            label='Phone number'
            placeholder='enter phone number'
            defaultCountry='EG'
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />

          {/* if the user is not already registered */}
          {/* name and profile picture */}
          {registerSteps === 'data' && (
            <>
              {/* name */}
              <TextField
                label='Name'
                required
                disabled={registerSteps !== 'data'}
                error={registerSteps === 'data' && error}
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value)
                }}
              />
              {!selectedImage ? (
                <>
                  {/* upload profile picture  */}
                  <div
                    className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer'
                    onClick={() => filePickerRef.current.click()}
                  >
                    <CameraAltIcon
                      className='h-6 w-6 text-red-600'
                      aria-hidden='true'
                    />
                  </div>
                  <div>
                    <input
                      type='file'
                      accept='image/*'
                      ref={filePickerRef}
                      onChange={addImageRegisteration}
                      hidden
                    />
                  </div>
                </>
              ) : (
                // user uploaded profile picture
                <div className='filter hover:brightness-90 transition-all duration-150'>
                  <Image
                    src={selectedImage}
                    alt='profile image'
                    width={200}
                    height={200}
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />
                  {!loading && (
                    <p
                      onClick={() => setSelectedImage(null)}
                      className='text-red-600 font-medium cursor-pointer '
                    >
                      Remove
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* after entering phone number*, name*, profile picture  */}
          {/* confirming the sent OTP  */}
          {registerSteps === 'otp' && (
            <TextField
              label='OTP'
              type='number'
              error={registerSteps === 'otp' && error}
              value={OTP}
              onChange={(e) => {
                setOTP(e.target.value)
              }}
              required
            />
          )}
        </div>

        {/* Button */}

        {!loading ? (
          <button
            type='submit'
            style={{ cursor: 'pointer' }}
            onClick={handleRegisteration}
          >
            {registerSteps === 'phone' && 'Sign In'}
            {registerSteps === 'data' && 'Request OTP'}
            {registerSteps === 'otp' && 'Register'}
          </button>
        ) : (
          <CircularProgress color='success' />
        )}

        <div id='recaptcha-verifier'></div>
      </Box>
    </Container>
  )
}

export default SignInWithPhone

const Container = styled.form`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  display: block;
  margin-bottom: 1.25rem /* 20px */;
`
const Span = styled.span`
  color: rgb(55 65 81);
`
const Input = styled.input`
  display: block;
  width: 100%;
  border: 1px solid gray;
  padding-top: 0.5rem /* 8px */;
  padding-bottom: 0.5rem /* 8px */;
  margin-top: 0.25rem /* 4px */;
  border-radius: 0.25rem /* 4px */;
`

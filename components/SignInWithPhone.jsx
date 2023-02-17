import {
  Box,
  CircularProgress,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  ArrowBack,
  DeleteForever,
  CameraAltOutlined,
} from '@mui/icons-material'
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
        if (confirmationResult) {
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
                  const imageRef = ref(
                    storage,
                    `users/${result.user.uid}/image`
                  )
                  await uploadString(imageRef, selectedImage, 'data_url').then(
                    async (snapshot) => {
                      await getDownloadURL(imageRef).then(async (imgUrl) => {
                        imgUrl = imgUrl.replace(
                          'https://firebasestorage.googleapis.com/v0/b/whatsapp-clone-3dabe.appspot.com',
                          'https://ik.imagekit.io/whatsappClone'
                        )

                        await updateDoc(doc(db, 'users', result.user.uid), {
                          userImg: imgUrl,
                        })
                      })
                    }
                  )
                  setLoading(false)
                }
                setLoadApp(true)
              })
            })
            .catch(alert)
        } else {
          setError(true)
        }
      }
    }
  }

  return (
    <Container>
      <BackContainer>
        <Tooltip title='Go to main Login menu' placement='top' arrow>
          <Back onClick={() => setSignPhone(false)} />
        </Tooltip>
        <Typography variant='h6' component='h2'>
          Sign in with phone number
        </Typography>
      </BackContainer>

      <Box
        component='div'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          '& .MuiTextField-root': {
            m: 1,
          },
        }}
        noValidate
        autoComplete='off'
      >
        <div>
          {/* phone number */}
          <TelInput
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
          <DataContainer>
            {registerSteps === 'data' && (
              <>
                {/* name */}
                <InfoTextField
                  label='Name'
                  required
                  disabled={registerSteps !== 'data'}
                  error={registerSteps === 'data' && error}
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value)
                  }}
                />
                <ProfileContainer>
                  <ProfileWrapper>
                    {!selectedImage ? (
                      <>
                        {/* upload profile picture  */}
                        <UploadProfileContainer
                          onClick={() => filePickerRef.current.click()}
                        >
                          <CameraIcon
                            className='h-6 w-6 text-red-600'
                            aria-hidden='true'
                          />

                          <div>
                            <input
                              type='file'
                              accept='image/*'
                              ref={filePickerRef}
                              onChange={addImageRegisteration}
                              hidden
                            />
                          </div>
                        </UploadProfileContainer>
                      </>
                    ) : (
                      // user uploaded profile picture
                      <ProfileImage
                        src={selectedImage}
                        alt='profile image'
                        width={200}
                        height={200}
                      />
                    )}
                  </ProfileWrapper>
                  {!loading && selectedImage && (
                    <RemoveProfileBtn onClick={() => setSelectedImage(null)}>
                      <DeleteForever />
                    </RemoveProfileBtn>
                  )}
                </ProfileContainer>
              </>
            )}

            {/* after entering phone number*, name*, profile picture  */}
            {/* confirming the sent OTP  */}
            {registerSteps === 'otp' && (
              <InfoTextField
                label='OTP'
                type='number'
                disabled={loading}
                error={registerSteps === 'otp' && error}
                value={OTP}
                onChange={(e) => {
                  setOTP(e.target.value)
                }}
                required
              />
            )}
          </DataContainer>
        </div>

        {/* Button */}

        {!loading ? (
          <RegisterBtn type='submit' onClick={handleRegisteration}>
            {registerSteps === 'phone' && 'Sign In'}
            {registerSteps === 'data' && 'Request OTP'}
            {registerSteps === 'otp' && 'Register'}
          </RegisterBtn>
        ) : (
          <CircularProgress style={{ alignSelf: 'center' }} color='success' />
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
  .MuiFormControl-root {
    margin-left: auto;
    margin-right: auto;
  }
  .MuiFormLabel-root {
    color: #96a0a5dd;
  }

  .Mui-focused {
    color: #c4d0d7;
  }
  .MuiInputBase-root {
    color: #c4d0d7;
    background-color: #2a3942;
    border-radius: 8px;
  }
`

const BackContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

const Back = styled(ArrowBack)`
  margin-right: 5px;
  font-size: 20px;
  color: #aebac1;
  :active {
    transform: scale(0.9);
  }
  /* @media (min-width: 640px) {
    display: none;
  } */
`

const TelInput = styled(MuiTelInput)`
  margin-top: 12px;
  width: 100%;
`

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`

const ProfileWrapper = styled.div`
  background-color: black;
  height: 100px;
  width: 100px;
  border-radius: 100%;
`
const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`

const UploadProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border-radius: 100%;
  background-color: #4f5a61;
  cursor: pointer;
  transition: background-color 0.2s ease-out;
  :hover {
    background-color: #313b42;
  }
`

const ProfileImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 100%;
`

const RemoveProfileBtn = styled.p`
  color: #dc2626;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease-out;

  :hover {
    transform: scale(1.1);
  }
  :active {
    transform: scale(0.9);
  }
`

const CameraIcon = styled(CameraAltOutlined)`
  color: #c4d0d7;
  font-size: 40px;
`

const InfoTextField = styled(TextField)`
  width: 100%;
`

const RegisterBtn = styled.button`
  padding: 8px;
  background-color: #2a3942;
  border: 2px solid #2a3942;
  cursor: pointer;
  margin-top: 20px;
  color: #c4d0d7;
  border-radius: 2px;
  align-self: flex-end;
  /* border: none; */
  transition: background-color 0.2s ease-out;
  :hover {
    background-color: #4a616f;
  }
  :active {
    background-color: transparent;
  }
`

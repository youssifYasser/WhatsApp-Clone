import Sidebar from '../components/Sidebar'
import styled from 'styled-components'
import Landing from '../components/Landing'
import { useState } from 'react'
import Chat from '../components/Chat'
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore'
import { useMediaQuery } from '@mui/material'
import { app, db } from '../firebase'
import { getAuth } from 'firebase/auth'

export default function Home() {
  const [userID, setUserID] = useState('')
  const [toggleSideChat, setToggleSideChat] = useState(false)
  const [chat, setChat] = useState(null)
  const mobileView = useMediaQuery('(max-width:640px)')

  const toggleView = () => {
    if (mobileView) {
      setToggleSideChat(!toggleSideChat)
    }
  }

  return (
    <Container>
      <Sidebar
        toggleSideChat={toggleSideChat}
        toggleView={toggleView}
        setUserID={setUserID}
        setChat={setChat}
      />
      {userID ? (
        <ChatContainer toggleSideChat={toggleSideChat} mobileView={mobileView}>
          <Chat
            userID={userID}
            toggleView={toggleView}
            chat={chat}
            // messages={messages}
            // recipientS={recipient}
          />
        </ChatContainer>
      ) : (
        <LandingContainer>
          <Landing />
        </LandingContainer>
      )}
    </Container>
  )
}

export const getServerSideProps = async (context) => {
  const auth = getAuth(app)
  console.log('auth=> ', auth.currentUser)

  return {
    props: {},
  }
}

const Container = styled.div`
  display: flex;
`
const ChatContainer = styled.div`
  display: ${(props) =>
    props.mobileView ? (props.toggleSideChat ? 'block' : 'none') : 'block'};
  @media (min-width: 640px) {
    display: block;
  }
  flex: 1;
  height: 100vh;
  overflow: auto;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const LandingContainer = styled.div`
  display: none;
  @media (min-width: 640px) {
    display: grid;
    flex: 1;
    height: 100vh;
    overflow: auto;
  }

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

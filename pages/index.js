import Sidebar from '../components/Sidebar'
import styled from 'styled-components'
import Landing from '../components/Landing'
import { useEffect, useState } from 'react'
import Chat from '../components/Chat'
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore'
import { useMediaQuery } from '@mui/material'
import { db } from '../firebase'

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

  // const getChat = async () => {
  //   const chat = await getDoc(doc(db, 'chats', userID))
  //   setChat({ id: chat.id, ...chat.data() })
  // }
  // useEffect(() => {
  //   if (userID) {
  //     getChat()
  //   }
  // }, [userID])
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

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
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

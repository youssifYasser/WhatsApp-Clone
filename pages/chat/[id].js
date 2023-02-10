import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore'
import { db } from '../../firebase'
import { useState } from 'react'
import styled from 'styled-components'
import Chat from '../../components/Chat'
import Sidebar from '../../components/Sidebar'
import useMediaQuery from '@mui/material/useMediaQuery'

const ChatPage = ({ chat, messages }) => {
  const [toggleSideChat, setToggleSideChat] = useState(false)
  const mobileView = useMediaQuery('(max-width:640px)')

  const toggleView = () => {
    if (mobileView) {
      setToggleSideChat(!toggleSideChat)
    }
  }

  return (
    <Container>
      <Sidebar toggleSideChat={toggleSideChat} toggleView={toggleView} />
      <ChatContainer toggleSideChat={toggleSideChat} mobileView={mobileView}>
        <Chat
          toggleView={toggleView}
          chat={chat}
          messages={messages}
          // recipientS={recipient}
        />
      </ChatContainer>
    </Container>
  )
}

export default ChatPage

export const getServerSideProps = async (context) => {
  const chatsRef = doc(db, 'chats', context.query.id)

  const messagesRes = await getDocs(
    query(
      collection(db, 'chats', context.query.id, 'messages'),
      orderBy('timestamp', 'asc')
    )
  )
  const messages = messagesRes.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate().getTime(),
  }))

  const chatRes = await getDoc(chatsRef)
  const chat = { id: chatRes.id, ...chatRes.data() }

  // const recipientData = await getDocs(
  //   query(
  //     collection(db, 'users'),
  //     where('email', '==', getRecipientEmail(chat.users, chat.users[0]))
  //   )
  // )
  // const recipient = recipientData.docs.map((rec) => ({
  //   id: rec.id,
  //   ...rec.data(),
  //   lastSeen: rec.data().lastSeen.toDate().getTime(),
  // }))

  return {
    props: {
      chat,
      messages: messages,
      // recipient: recipient.length && recipient[0],
    },
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

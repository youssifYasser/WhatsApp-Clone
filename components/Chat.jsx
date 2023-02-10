import { Avatar, IconButton } from '@mui/material'
import TimeAgo from 'timeago-react'
import {
  MoreVert,
  AttachFile,
  InsertEmoticon,
  Mic,
  ArrowBack,
} from '@mui/icons-material'

import styled from 'styled-components'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { useRouter } from 'next/router'
import { useCollection } from 'react-firebase-hooks/firestore'
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import Message from './Message'
import { useRef, useState } from 'react'
import getRecipientEmail from '../utils/getRecipientEmail'

const Chat = ({ chat, messages, toggleView }) => {
  const [inputMessage, setInputMessage] = useState('')
  const endOfMessageRef = useRef(null)
  const [user] = useAuthState(auth)
  const router = useRouter()
  const [messagesSnapshot] = useCollection(
    query(
      collection(db, 'chats', router.query.id, 'messages'),
      orderBy('timestamp', 'asc')
    )
  )
  const [recipientSnapshot] = useCollection(
    query(
      collection(db, 'users'),
      where('email', '==', getRecipientEmail(chat.users, user.email))
    )
  )

  const sendMessage = async (e) => {
    e.preventDefault()

    //update user last seen
    await updateDoc(doc(db, 'users', user.uid), { lastSeen: serverTimestamp() })

    //add message
    const messageToSend = inputMessage.trim()
    if (messageToSend !== '') {
      await addDoc(collection(db, 'chats', router.query.id, 'messages'), {
        message: messageToSend,
        user: user.email,
        userImg: user.photoURL,
        timestamp: serverTimestamp(),
      })
      setInputMessage('')
      scrollToBottom()
    }
  }

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ))
    } else {
      return messages?.map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ))
    }
  }

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const recipientEmail = getRecipientEmail(chat.users, user.email)
  const recipient = recipientSnapshot?.docs[0]?.data()

  return (
    <Container>
      <Header>
        {recipient ? (
          <>
            <BackContainer onClick={toggleView}>
              <Back />
              <Avatar src={recipient.userImg} />
            </BackContainer>
            <HeaderInfo>
              <h3>{recipient.name}</h3>
              <p>
                Last active:{' '}
                {recipient?.lastSeen?.toDate() ? (
                  <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                ) : (
                  'Loading...'
                )}
              </p>
            </HeaderInfo>
          </>
        ) : (
          <>
            <BackContainer onClick={toggleView}>
              <Back />
              <Avatar>{recipientEmail[0]}</Avatar>
            </BackContainer>
            <HeaderInfo>
              <h3>{recipientEmail}</h3>
              <p>Last active: Unavailable</p>
            </HeaderInfo>
          </>
        )}
        <HeaderIcons>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessagesContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessagesContainer>

      <InputContainer>
        <InsertEmoticon />
        <MessageInput
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          type='submit'
          onClick={sendMessage}
          disabled={!inputMessage}
          hidden
        >
          send Message
        </button>
        <Mic />
      </InputContainer>
    </Container>
  )
}

export default Chat

const Container = styled.div``
const Header = styled.section`
  background-color: white;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 12px 10px;
  border-bottom: 1px solid whitesmoke;
`
const BackContainer = styled.div`
  @media (max-width: 640px) {
    cursor: pointer;
    display: flex;
    align-items: center;
    :active {
      transform: scale(0.9);
    }
  }
`
const Back = styled(ArrowBack)`
  margin-right: 5px;
  font-size: 20px;
  color: #424242;
  @media (min-width: 640px) {
    display: none;
  }
`
const HeaderInfo = styled.div`
  flex: 1;
  margin-left: 0.8rem;
  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`
const HeaderIcons = styled.div``

const MessagesContainer = styled.section`
  padding: 20px 15px;
  min-height: 90vh;
  background-color: #e5ded8;
  /* @media (min-width: 640px) {
    padding: 25px;
  } */
`
const EndOfMessage = styled.div``

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  position: sticky;
  bottom: 0;
  z-index: 10;
`
const MessageInput = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 20px;
  padding: 15px;
  background-color: #e7e5e5;
  margin: 0 15px 0 15px;
`

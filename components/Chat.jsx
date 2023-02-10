import { Avatar, IconButton } from '@mui/material'
import TimeAgo from 'timeago-react'
import EmojiContainer from './EmojiContainer'
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

const Chat = ({ chat, toggleView, userID }) => {
  const [inputMessage, setInputMessage] = useState('')
  const [emojiPicker, setEmojiPicker] = useState(false)

  const endOfMessageRef = useRef(null)
  const [user] = useAuthState(auth)
  const [messagesSnapshot] = useCollection(
    query(
      collection(db, 'chats', userID, 'messages'),
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
    setInputMessage('')
    if (messageToSend !== '') {
      await addDoc(collection(db, 'chats', userID, 'messages'), {
        message: messageToSend,
        user: user.email,
        userImg: user.photoURL,
        timestamp: serverTimestamp(),
      })
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
    }
  }

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const handleEmojiClick = (emojiData, event) => {
    setInputMessage((message) => message + emojiData.emoji)
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

      {emojiPicker && (
        <Emojie>
          <EmojieWrapper>
            <EmojiContainer handleEmojiClick={handleEmojiClick} />
          </EmojieWrapper>
        </Emojie>
      )}
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

const Container = styled.div`
  max-height: 100vh;
`
const Header = styled.section`
  background-color: white;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 20;
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
  @media (min-width: 640px) {
    padding: 25px;
  }
`
const EndOfMessage = styled.div``

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  position: sticky;
  bottom: 0;
  z-index: 20;
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
const Emojie = styled.div`
  width: 100%;
  position: fixed;
  bottom: 60px;
  z-index: 50;
`
const EmojieWrapper = styled.div`
  position: absolute;
  z-index: 50;
  width: 60%;
  left: 8px;
  bottom: 8px;
  @media (min-width: 640px) {
    width: 40%;
  }
`

const Emoticon = styled(InsertEmoticon)`
  cursor: pointer;
`

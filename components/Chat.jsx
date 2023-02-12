import { Avatar, IconButton } from '@mui/material'
import TimeAgo from 'timeago-react'
import EmojiContainer from './EmojiContainer'
import {
  MoreVert,
  AttachFile,
  InsertEmoticon,
  Mic,
  ArrowBack,
  Send,
} from '@mui/icons-material'

import styled from 'styled-components'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import Message from './Message'
import { useEffect, useRef, useState } from 'react'
import getRecipientEmail from '../utils/getRecipientEmail'
import Messages from './Messages'

const Chat = ({ chat, toggleView, userID }) => {
  const [inputMessage, setInputMessage] = useState('')
  const inputMessageRef = useRef(null)
  const [emojiPicker, setEmojiPicker] = useState(false)
  const endOfMessageRef = useRef(null)
  const [user] = useAuthState(auth)
  const [messages, setMessages] = useState([])
  const [recipient, setRecipient] = useState([])

  const sendMessage = async (e) => {
    e.preventDefault()

    //update user last seen
    await updateDoc(doc(db, 'users', user.uid), { lastSeen: serverTimestamp() })

    //add message

    const messageToSend = inputMessage.trim()
    if (messageToSend !== '') {
      await addDoc(collection(db, 'chats', userID, 'messages'), {
        message: messageToSend,
        user: user.email,
        userImg: user.photoURL,
        timestamp: serverTimestamp(),
      })
      setInputMessage('')
      scrollToBottom()
    }
  }

  //get messages
  useEffect(() => {
    inputMessageRef.current.focus()
    setInputMessage('')
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'chats', userID, 'messages'),
        orderBy('timestamp', 'asc')
      ),
      (snapshot) => setMessages(snapshot.docs)
    )

    return () => {
      unsubscribe()
    }
  }, [db, userID])

  //get recipient
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'users'),
        where('email', '==', getRecipientEmail(chat.users, user.email))
      ),
      (snapshot) => setRecipient(snapshot.docs[0]?.data())
    )

    return () => {
      unsubscribe()
    }
  }, [db, userID])

  const showMessages = () => {
    if (messages) {
      return messages.map((message) => (
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
            <AttachFileIcn />
          </IconButton>
          <IconButton>
            <MoreVertIcn />
          </IconButton>
        </HeaderIcons>
      </Header>

      <Messages showMessages={showMessages} endOfMessageRef={endOfMessageRef} />

      {emojiPicker && (
        <Emojie>
          <EmojieWrapper>
            <EmojiContainer handleEmojiClick={handleEmojiClick} />
          </EmojieWrapper>
        </Emojie>
      )}
      <InputContainer>
        <Emoticon onClick={() => setEmojiPicker(!emojiPicker)} />
        <MessageInput
          placeholder='Type a message'
          ref={inputMessageRef}
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
        {inputMessage ? <SendBtn onClick={sendMessage} /> : <MicIcn />}
      </InputContainer>
    </Container>
  )
}

export default Chat

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`
const Header = styled.section`
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 12px 10px;
  border-bottom: 1px solid #1c262c;
  height: 65px;
  background-color: #202c33;
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
  color: #aebac1;
  @media (min-width: 640px) {
    display: none;
  }
`
const HeaderInfo = styled.div`
  flex: 1;
  margin-left: 0.8rem;
  > h3 {
    color: white;
    text-align: left;
    margin-bottom: 4px;
    font-weight: 500;
  }
  > p {
    font-size: 13px;
    color: #a6a6a6;
  }
`
const HeaderIcons = styled.div``

const AttachFileIcn = styled(AttachFile)`
  color: #8696a0;
`
const MoreVertIcn = styled(MoreVert)`
  color: #8696a0;
`

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #202c33;
  position: sticky;
  bottom: 0;
  z-index: 20;
  max-height: fit-content;
`
const MessageInput = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-size: 100%;
  background-color: #2a3942;
  color: #aebac1;
  margin: 0 15px 0 15px;
`

const SendBtn = styled(Send)`
  cursor: pointer;
  color: #8696a0;
  :active {
    transform: scale(0.9);
  }
`

const MicIcn = styled(Mic)`
  color: #8696a0;
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
  color: #aebac1;
`

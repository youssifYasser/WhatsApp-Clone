import { Avatar, Tooltip, useMediaQuery } from '@mui/material'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth, db } from '../firebase'
import getRecipientEmail from '../utils/getRecipientEmail'

const ChatRow = ({ id, users, toggleView, setUserID, setChat }) => {
  const [user] = useAuthState(auth)
  const mobileView = useMediaQuery('(max-width:640px)')
  const [recipient, setRecipient] = useState([])

  //get recipient
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'users'),
        where('email', '==', getRecipientEmail(users, user.email))
      ),
      (snapshot) => setRecipient(snapshot.docs[0]?.data())
    )

    return () => {
      unsubscribe()
    }
  }, [db])

  const enterChat = async () => {
    const chat = await getDoc(doc(db, 'chats', id))
    setChat({ id: chat.id, ...chat.data() })
    setUserID(id)
    // router.replace(`/chat/${id}`)

    if (mobileView) {
      toggleView()
    }
  }

  const recipientEmail = getRecipientEmail(users, user.email)
  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <>
          <UserAvatar src={recipient?.userImg} />
          <Tooltip title={recipientEmail} placement='top-end' arrow>
            <UserEmail>{recipient?.name}</UserEmail>
          </Tooltip>
        </>
      ) : (
        <>
          <UserAvatar>{recipientEmail[0]}</UserAvatar>
          <UserEmail>{recipientEmail}</UserEmail>
        </>
      )}
    </Container>
  )
}

export default ChatRow

const Container = styled.div`
  padding: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  color: #aebac1;
  :hover {
    background-color: #202c33;
    color: #d1dee6;
  }
`
const UserAvatar = styled(Avatar)``

const UserEmail = styled.p`
  font-size: 1rem;
  line-height: 1.5rem;
  word-break: break-all;
  :active {
    pointer-events: none;
  }
`

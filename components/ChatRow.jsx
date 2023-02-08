import { Avatar, Tooltip } from '@mui/material'
import { collection, query, where } from 'firebase/firestore'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import styled from 'styled-components'
import { auth, db } from '../firebase'
import getRecipientEmail from '../utils/getRecipientEmail'
import { useRouter } from 'next/router'

const ChatRow = ({ id, users }) => {
  const router = useRouter()
  const [user] = useAuthState(auth)
  const [recipientSnapshot] = useCollection(
    query(
      collection(db, 'users'),
      where('email', '==', getRecipientEmail(users, user.email))
    )
  )

  const enterChat = () => {
    router.replace(`/chat/${id}`)
  }

  const recipient = recipientSnapshot?.docs[0]?.data()
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
  color: rgb(55 65 81);
  :hover {
    background-color: rgb(229 231 235);
    color: rgb(17 24 39);
  }
`
const UserAvatar = styled(Avatar)``

const UserEmail = styled.p`
  font-size: 1rem;
  line-height: 1.5rem;
  word-break: break-all;
`
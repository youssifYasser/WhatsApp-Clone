import {
  Avatar,
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { MoreVert, Chat, Search } from '@mui/icons-material'
import styled from 'styled-components'
import * as EmailValidator from 'email-validator'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import ChatRow from './ChatRow'
import { useEffect, useRef, useState } from 'react'

const Sidebar = ({ toggleSideChat, toggleView, setUserID, setChat }) => {
  const [user] = useAuthState(auth)
  const mobileView = useMediaQuery('(max-width:640px)')
  const [chats, setChats] = useState([])
  const [open, setOpen] = useState(false)
  const inputEmailRef = useRef(null)

  //get user chats
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'chats'),
        where('users', 'array-contains', user.email)
      ),
      (snapshot) => setChats(snapshot.docs)
    )

    return () => {
      unsubscribe()
    }
  }, [db])

  const createChat = (e) => {
    e.preventDefault()
    setOpen(false)
    const input = inputEmailRef.current.value
    console.log(input)

    if (!input) return

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      addDoc(collection(db, 'chats'), { users: [user.email, input] })
    }
  }

  const chatAlreadyExists = (recipientEmail) => {
    return !!chats?.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    )
  }

  return (
    <Container toggleSideChat={toggleSideChat} mobileView={mobileView}>
      {/* header */}
      <HeaderSection>
        <UserAvatar src={user.photoURL} onClick={() => signOut(auth)} />
        <HeaderIcons>
          <IconButton>
            <ChatIcn />
          </IconButton>
          <IconButton>
            <MoreVertIcn />
          </IconButton>
        </HeaderIcons>
      </HeaderSection>

      {/* search */}
      <SearchSection>
        <SearchIcon>
          <SearchIcn />
        </SearchIcon>
        <SearchInput type='text' placeholder='Search in chats' />
      </SearchSection>

      {/* start chat button */}
      <SidebarBtn onClick={() => setOpen(true)}>start a new chat</SidebarBtn>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <BoxDiv>
          <Typography id='transition-modal-title' variant='h6' component='h2'>
            Please enter email to chat with
          </Typography>
          <InputForm>
            <InputEmail type='email' ref={inputEmailRef} placeholder='email' />
            <CreateBtn type='submit' onClick={createChat}>
              Create
            </CreateBtn>
          </InputForm>
        </BoxDiv>
      </Modal>

      {/* chats */}
      <ChatsContainer>
        {chats?.map((chat, index) => (
          <>
            <ChatRow
              key={chat.id}
              setChat={setChat}
              setUserID={setUserID}
              toggleView={toggleView}
              id={chat.id}
              users={chat.data().users}
            />
            {index !== chats.length - 1 && <Border />}
          </>
        ))}
      </ChatsContainer>
    </Container>
  )
}

export default Sidebar

const Container = styled.div`
  display: ${(props) =>
    props.mobileView ? (props.toggleSideChat ? 'none' : 'flex') : 'flex'};
  width: 100%;
  flex-direction: column;
  gap: 10px;
  height: 100vh;
  overflow-y: auto;
  background-color: #111b21;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (min-width: 640px) {
    //sm screen
    flex: 0.45;
    border-right: 1px solid #3d5260;
    min-width: 250px;
  }
  @media (min-width: 1024px) {
    //lg screen
    max-width: 350px;
  }
  @media (min-width: 1280px) {
    //xl screen
    max-width: 400px;
  }
`

const HeaderSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #202c33;
  top: 0;
  height: 65px;
  position: sticky;
  z-index: 10;
`
const UserAvatar = styled(Avatar)`
  cursor: pointer;
`
const HeaderIcons = styled.div`
  display: flex;
  gap: 8px;
`

const ChatIcn = styled(Chat)`
  color: #8696a0;
`
const MoreVertIcn = styled(MoreVert)`
  color: #8696a0;
`

const SearchSection = styled.section`
  position: relative;
  padding: 15px;
  background-color: #2a3942;
  width: 90%;
  border-radius: 8px;
  align-self: center;
`
const SearchIcon = styled.div`
  position: absolute;
  inset: 0;
  padding-left: 16px;
  display: flex;
  align-items: center;
  pointer-events: none;
`
const SearchIcn = styled(Search)`
  color: #aebac1;
`
const SearchInput = styled.input`
  padding-left: 32px;
  display: block;
  width: 100%;
  font-size: 16px;
  line-height: 24px;
  outline: none;
  border: none;
  background-color: transparent;
  color: #aebac1;

  @media (min-width: 640px) {
    padding-left: 40px;
  }
`
const SidebarBtn = styled(Button)`
  color: #aebac1;
`

const ChatsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Border = styled.div`
  background-color: #8696a026;
  margin: 0px 20px 0px 20px;

  height: 1px;
`

const BoxDiv = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  background-color: #111b21;
  color: #c4d0d7;
  border: none;
  padding: 20px;
  @media (min-width: 640px) {
    width: 60%;
  }
  @media (min-width: 1024px) {
    width: 50%;
  }
  @media (min-width: 1280px) {
    width: 35%;
  }
`
const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const InputEmail = styled.input`
  width: 100%;
  margin-top: 10px;
  background-color: #2a3942;
  border-radius: 8px;
  padding: 15px 10px;
  outline: none;
  font-size: 16px;
  border: 1px solid #2a3942;
`
const CreateBtn = styled.button`
  padding: 8px;
  background-color: #2a3942;
  border: 2px solid #2a3942;
  cursor: pointer;
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

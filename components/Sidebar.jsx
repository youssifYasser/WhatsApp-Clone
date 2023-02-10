import { Avatar, Button, IconButton, useMediaQuery } from '@mui/material'
import { MoreVert, Chat, Search } from '@mui/icons-material'
import styled from 'styled-components'
import * as EmailValidator from 'email-validator'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { addDoc, collection, query, where } from 'firebase/firestore'
import ChatRow from './ChatRow'

const Sidebar = ({ toggleSideChat, toggleView }) => {
  const [user] = useAuthState(auth)
  const mobileView = useMediaQuery('(max-width:640px)')
  const userChatRef = query(
    collection(db, 'chats'),
    where('users', 'array-contains', user.email)
  )
  const [chatsSnapshot] = useCollection(userChatRef)

  const createChat = () => {
    const input = prompt('Please enter email to chat with')

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
    return !!chatsSnapshot?.docs.find(
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
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </HeaderIcons>
      </HeaderSection>

      {/* search */}
      <SearchSection>
        <SearchIcon>
          <Search />
        </SearchIcon>
        <SearchInput type='text' placeholder='Search in chats' />
      </SearchSection>

      {/* start chat button */}
      <SidebarBtn onClick={createChat}>start a new chat</SidebarBtn>

      {/* chats */}
      <ChatsContainer>
        {chatsSnapshot?.docs.map((chat) => (
          <ChatRow
            key={chat.id}
            toggleView={toggleView}
            id={chat.id}
            users={chat.data().users}
          />
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
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (min-width: 640px) {
    //sm screen
    flex: 0.45;
    border-right: 1px solid whitesmoke;
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
  background-color: white;
  top: 0;
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

const SearchSection = styled.section`
  position: relative;
  border-radius: 2px;
  padding: 20px;
`
const SearchIcon = styled.div`
  position: absolute;
  inset: 0;
  padding-left: 16px;
  display: flex;
  align-items: center;
  pointer-events: none;
`
const SearchInput = styled.input`
  padding-left: 32px;
  display: block;
  width: 100%;
  font-size: 16px;
  line-height: 24px;
  border-radius: 6px;
  outline: none;
  @media (min-width: 640px) {
    padding-left: 40px;
  }
`
const SidebarBtn = styled(Button)`
  color: #737272;
`

const ChatsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import styled from 'styled-components'
import Chat from '../../components/Chat'
import Sidebar from '../../components/Sidebar'
import { db } from '../../firebase'
import getRecipientEmail from '../../utils/getRecipientEmail'

const ChatPage = ({ chat, messages }) => {
  return (
    <Container>
      <Sidebar />
      <ChatContainer>
        <Chat
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
  flex: 1;
  height: 100vh;
  overflow: auto;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

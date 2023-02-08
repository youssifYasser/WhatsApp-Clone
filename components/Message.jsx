import moment from 'moment/moment'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth } from '../firebase'

const Message = ({ user, message }) => {
  const [userLoggedIn] = useAuthState(auth)

  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever

  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  )
}

export default Message

const Container = styled.div``

const MessageElement = styled.p`
  width: fit-content;
  min-width: 60px;
  padding: 15px 15px 26px 15px;
  border-radius: 8px;
  margin: 10px;
  position: relative;
  text-align: right;
`

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #c6f7a2;
  box-shadow: -3px 4px 10px -3px #a8aea8;
`

const Reciever = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
  box-shadow: 3px 4px 10px -3px #a8aea8;
`

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  text-align: right;
  bottom: 0;
  right: 0;
`

import moment from 'moment/moment'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth } from '../firebase'

const Message = ({ user, message }) => {
  const [userLoggedIn] = useAuthState(auth)
  const [showMessage, setShowMessage] = useState(false)

  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever

  return (
    <Container>
      <TypeOfMessage>
        {showMessage ? message.message : message.message.slice(0, 200)}
        {showMessage || (message.message.slice(200).length > 0 && '...')}
        {message.message.slice(200).length > 0 && (
          <More showMessage={showMessage} onClick={() => setShowMessage(true)}>
            more
          </More>
        )}
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
  max-width: 80%;
  padding: 15px 15px 26px 15px;
  border-radius: 8px;
  margin: 10px;
  position: relative;
  text-align: right;
  font-size: 13px;
  word-break: break-word;
  text-align: left;
  color: #e9edef;
  @media (min-width: 768px) {
    font-size: initial;
    max-width: 85%;
  }
  @media (min-width: 1024px) {
    max-width: 70%;
  }
`

const More = styled.span`
  text-decoration-line: underline;
  cursor: pointer;
  margin-left: 4px;
  color: #cbcfd2;
  display: ${(props) => (props.showMessage === true ? 'none' : 'inline')};
`

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #005c4b;
  /* box-shadow: -3px 4px 10px -3px #a8aea8; */
`

const Reciever = styled(MessageElement)`
  background-color: #202c33;
  /* box-shadow: 2px 2.5px 6px -4px #293841; */
`

const Timestamp = styled.span`
  color: #e9edef;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  text-align: right;
  bottom: 0;
  right: 0;
`

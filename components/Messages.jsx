import styled from 'styled-components'

const Messages = ({ showMessages, endOfMessageRef }) => {
  return (
    <MessagesContainer>
      {showMessages()}
      <EndOfMessage ref={endOfMessageRef} />
    </MessagesContainer>
  )
}

export default Messages

const MessagesContainer = styled.section`
  padding: 20px 15px;
  flex: 1;
  background: url('/background.webp') no-repeat;
  background-size: cover;

  overflow-y: auto;
  @media (min-width: 640px) {
    padding: 25px;
  }
  ::-webkit-scrollbar {
    width: 6px !important;
    height: 6px !important;
  }
  ::-webkit-scrollbar-thumb {
    background-color: gray;
  }

  /* -ms-overflow-style: none;
  scrollbar-width: none; */
`
const EndOfMessage = styled.div``

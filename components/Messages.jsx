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
  padding: 1.25rem 0.938rem;
  flex: 1;
  background: url('/background.webp') no-repeat;
  background-size: cover;

  overflow-y: auto;
  @media (min-width: 640px) {
    padding: 1.563rem;
  }
  ::-webkit-scrollbar {
    width: 0.375rem !important;
    height: 0.375rem !important;
  }
  ::-webkit-scrollbar-thumb {
    background-color: gray;
  }

  /* -ms-overflow-style: none;
  scrollbar-width: none; */
`
const EndOfMessage = styled.div``

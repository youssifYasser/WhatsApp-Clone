import Sidebar from '../components/Sidebar'
import styled from 'styled-components'
import Landing from '../components/Landing'

export default function Home() {
  return (
    <Container>
      <Sidebar />
      <LandingContainer>
        <Landing />
      </LandingContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
`

const LandingContainer = styled.div`
  display: none;
  @media (min-width: 640px) {
    display: grid;
    flex: 1;
    height: 100vh;
    overflow: auto;
  }

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

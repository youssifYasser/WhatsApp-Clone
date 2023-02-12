import styled from 'styled-components'
import LockIcon from '@mui/icons-material/Lock'
import Image from 'next/image'

const Landing = () => {
  return (
    <Container>
      <Logo width={200} height={200} loading='eager' src='/logo.webp' />
      <Title>WhatsApp</Title>
      <DescContaiener>
        <Lock />
        <Desc>End-to-end encrypted</Desc>
      </DescContaiener>
    </Container>
  )
}

export default Landing

const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url('/background.webp') no-repeat;
`

const Logo = styled(Image)`
  object-fit: cover;
  margin-bottom: 30px;
  margin-top: -40px;
  width: 170px;
  height: 170px;
  @media (min-width: 1024px) {
    width: 200px;
    height: 200px;
  }
`

const Title = styled.h1`
  font-weight: 400;
  color: #aebac1;

  letter-spacing: 0.025em;
  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`

const DescContaiener = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  color: #aebac1;

  bottom: 40px;
  gap: 5px;
`
const Lock = styled(LockIcon)`
  font-size: 15px;
`

const Desc = styled.span`
  font-size: 15px;
`

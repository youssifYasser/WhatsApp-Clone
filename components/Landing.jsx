import styled from 'styled-components'
import LockIcon from '@mui/icons-material/Lock'

const Landing = () => {
  return (
    <Container>
      <Logo src='https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png' />
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
  background-color: whitesmoke;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Logo = styled.img`
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
  font-size: 2.7rem /* 48px */;
  line-height: 1;
  font-weight: 500;
  letter-spacing: 0.025em;
  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`

const DescContaiener = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  color: #666565;
  bottom: 40px;
  gap: 5px;
`
const Lock = styled(LockIcon)`
  font-size: 15px;
`

const Desc = styled.span`
  font-size: 15px;
`

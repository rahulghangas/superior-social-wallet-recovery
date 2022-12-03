import styled from '@emotion/styled'
import { Paper } from '@mui/material'

export const Wrapper = styled.div`
  width: 480px;
  background-color: #191824;
  border-radius: 12px;
  position: relative;
  padding: 12px;
`

export const HeaderText = styled.div`
  color: #C0BAF6;
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 12px;
`

export const Label = styled.div`
  color: #C0BAF6;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
`

export const IconWrapper = styled.div`
  margin-bottom: 6px;
`

export const StyledPaper = styled(Paper)`
  height: 100%;
  background: #1D202F;
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

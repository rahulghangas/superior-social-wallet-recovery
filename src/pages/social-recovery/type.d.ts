import { NetworkDetails, Token } from 'const'
import { Token } from 'constants/types'

export interface ChainSelectorProps {
  label: string
  onSelect: Function
  value: NetworkDetails
}


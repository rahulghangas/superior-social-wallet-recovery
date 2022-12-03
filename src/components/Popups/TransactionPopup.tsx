import React, { useContext } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import { ExternalLink } from '../../theme/components'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
  margin-right: 16px;
`

export default function TransactionPopup({
  hash,
  success,
  summary
}: {
  hash?: string
  success?: boolean
  summary?: string
}) {
  const theme = useContext(ThemeContext)

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? <CheckCircle color={theme.green1} size={24} /> : <AlertCircle color={theme.red1} size={24} />}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500} overflow={'scroll'}>{hash ?? 'Hash: ' + hash}</TYPE.body>
        {/* {chainId && (
          <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>View on block explorer</ExternalLink>
        )} */}
        <TYPE.body fontWeight={500} color={theme.red1} overflow={'scroll'}>{summary ?? 'Tx Summary:' + summary}</TYPE.body>
      </AutoColumn>
    </RowNoFlex>
  )
}
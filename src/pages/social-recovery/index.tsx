import React, { useContext, useEffect, useState } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonDark, ButtonPrimary, ButtonWhite } from '../../components/Button'
import Card from '../../components/Card'
import Column, { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import AppBody from '../AppBody'
import useInterval from "../../hooks/useInterval"
import { Wrapper } from './styled'
import { ChainId, ChainList, ChainNetworkDetails, NetworkDetails } from 'const'
import { IconWrapper, Label, StyledPaper } from './style'
import { ChainSelectorProps } from './type'
import {
  TextField,
  Button,
  Grid,
  InputAdornment,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { PopperMenu } from 'components'
import { InputError } from 'const/error'
import BigNumber from 'bignumber.js'
import { ZERO_BIGNUM } from 'const/number'
import { useAddPopup } from 'state/application/hooks'
import { Spinner } from "../../components/Polling";
import MnemonicInputPanel from 'components/MnemonicInputPanel'
import Wallets from 'utils/wallet'
import { createProof, executeShareEncryption } from 'utils/shares/shares'
import PubkeyInputPanel from 'components/PubkeyInputPanel'
import SchemaInputPanel from 'components/SchemaInputPanel'

const RotatedRepeat = styled(Repeat)`
  transform: rotate(90deg);
  width: 14px;
`

const SwitchIconContainer = styled.div`
  height: 0;
  position: relative;
  width: 100%;
`

const PaddedRowBetween = styled(RowBetween)`
  padding: 0 8px;
`

const PaddedCard = styled(Card)`
  padding: 0 8px;
`

export const ClickableText = styled(TYPE.body)`
  cursor: pointer;
`

const ChainSelectorBody =  styled.div`
  position: relative;
  max-width: 420px;
  width: 100%;
  padding-bottom: 12px;
`

const ChainSelector: React.FC<ChainSelectorProps> = (props) => {
  const { label, onSelect, value } = props
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement>()
  const [selectedChain, setSelectedChain] = useState<NetworkDetails>(value);

  useEffect(() => {
    setSelectedChain(value)
  }, [value])

  const handleClose = () => setOpen(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(!open)
    setAnchorEl(event.currentTarget)
  }

  const handleChainSelection = (event, index: number) => {
    setSelectedChain(ChainNetworkDetails[ChainList[index]])
    setOpen(false)
    onSelect(ChainNetworkDetails[ChainList[index]])
  }

  return (
    <StyledPaper elevation={3}>
      <IconWrapper>
        <div style={{textAlign: "center"}}>
          <img
            loading='lazy'
            height={24}
            src={selectedChain.icon}
            alt={selectedChain.label}
          />
        </div>
      </IconWrapper>

      <div style={{textAlign: "center"}}>
        <Label>{label}</Label>
      </div>

      <Button
        variant="text"
        style={{ color: '#FFF', padding: '0px' }}
        onClick={handleClick}
      >
        <div style={{width: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
          {selectedChain.label}
        </div>

        {open
          ? <ArrowDropUpIcon style={{ color: '#FFF' }} />
          : <ArrowDropDownIcon style={{ color: '#FFF' }} />
        }
      </Button>
      <PopperMenu
        open={open}
        anchorEl={anchorEl}
        style={{ zIndex: 10 }}
        items={Object.values(ChainNetworkDetails)}
        onClick={handleChainSelection}
        onClose={handleClose}
      />
    </StyledPaper>
  )
}


const SocialRecoveryApp: React.FC = () => {
  const appTheme = useContext(ThemeContext)
  const [walletConnected, updateWalletConnected] = useState(false);
  const [mnemonic, updateMnemonic] = useState('');
  const [pubkey1, updatePubkey1] = useState('');
  const [pubkey2, updatePubkey2] = useState('');
  const [balance, updateBalance] = useState(ZERO_BIGNUM);
  const [currentNetwork, updateCurrentNetwork] = useState('');
  const [schema, updateSchema] = useState('');

  const [mnemonicError, setMnemonicError] = useState(false);
  const [pubkey1Error, setpubkey1Error] = useState(false);
  const [pubkey2Error, setpubkey2Error] = useState(false);
  const [schemaError, setSchemaError] = useState(false);

  const [sourceChain, setSourceChain] = useState<NetworkDetails>(ChainNetworkDetails[ChainList[0]]);

  const [txProcessing, setTxProcessing] = useState(false);

  useInterval(async () => {
    if (await Wallets[sourceChain.id].isConnected()) {
      updateWalletConnected(true);
      try {
        const balance = await Wallets[sourceChain.id].getBalance();
        updateBalance(balance.amount);
      } catch(e) {
        updateBalance(ZERO_BIGNUM);
      }

      try {
        const network = await Wallets[sourceChain.id].getNetworkId();
        updateCurrentNetwork(network);
      } catch(e) {
        updateCurrentNetwork('');
      }
    } else {
      console.log('wallet was not conncted for id', sourceChain.id);
      updateWalletConnected(false);
      updateBalance(ZERO_BIGNUM);
    }
  }, 500);

  const handleSourceChain = (value: NetworkDetails) => {
    updateWalletConnected(false);
    setSourceChain(value)
  };

  const addPopup = useAddPopup();

  return (
    <>
      <ChainSelectorBody>
            <ChainSelector
              label='Chain'
              onSelect={handleSourceChain}
              value={sourceChain}
            />
      </ChainSelectorBody>

      <Grid container style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AppBody>
          <Wrapper id="main-panel">
            <AutoColumn gap="12px">
              <AutoColumn gap="3px">
                <MnemonicInputPanel
                  id="mnemonic-input-panel"
                  value={mnemonic}
                  onChange={(value: string, hasError: boolean) => {
                    updateMnemonic(value);
                    setMnemonicError(hasError);
                  }}
                  setMnemonicError={setMnemonicError}
                />
                <PubkeyInputPanel
                  id="pubkey-input-panel-1"
                  index={1}
                  value={pubkey1}
                  onChange={(value: string, hasError: boolean) => {
                    updatePubkey1(value);
                    setpubkey1Error(hasError);
                  }}
                  setMnemonicError={setpubkey1Error}
                />
                <PubkeyInputPanel
                  id="pubkey-input-panel-2"
                  index={2}
                  value={pubkey2}
                  onChange={(value: string, hasError: boolean) => {
                    updatePubkey2(value);
                    setpubkey2Error(hasError);
                  }}
                  setMnemonicError={setpubkey2Error}
                />
              </AutoColumn>
              <AutoColumn gap="8px">
                <PaddedCard py="0px" px="8px">
                  <RowBetween alignItems="center">
                    <TYPE.body fontSize="15px" lineHeight="15px" fontWeight="500">
                      Balance: <span style={{ color: 'white', fontWeight: 700 }}>{balance ? balance.toString() : '0'}</span>
                    </TYPE.body>
                    {/* <QuestionHelper text="No fees to cover cross chain transactions are collected on testnet/devnet" /> */}
                  </RowBetween>
                </PaddedCard>
              </AutoColumn>
              <div>
                {txProcessing? (
                  <ButtonPrimary disabled>
                    <Spinner /> Processing Txn  
                  </ButtonPrimary>
                ): !walletConnected ? (
                  <ButtonPrimary onClick={() => {
                    try {
                      Wallets[sourceChain.id]?.connect();
                    } catch(e) {}
                  }}>Connect Wallet</ButtonPrimary>
                ): mnemonicError ? (
                  <ButtonPrimary style={{ textAlign: 'center', background: 'red' }} disabled>
                    {InputError.MNEMONICERROR}
                  </ButtonPrimary>
                ): pubkey1Error ? (
                  <ButtonPrimary style={{ textAlign: 'center', background: 'red' }} disabled>
                    {InputError.PUBKEY1ERROR}
                  </ButtonPrimary>
                ): pubkey2Error ? (
                  <ButtonPrimary style={{ textAlign: 'center', background: 'red' }} disabled>
                    {InputError.PUBKEY2ERROR}
                  </ButtonPrimary>
                // ): pubkey1 && pubkey2 && utils.computeAddress(pubkey1) === utils.computeAddress(pubkey2) ? (
                //   <ButtonPrimary style={{ textAlign: 'center', background: 'red' }} disabled>
                //     {InputError.DUPLICATECONFIDANTERROR}
                //   </ButtonPrimary>
                ): schemaError ? (
                  <ButtonPrimary style={{ textAlign: 'center', background: 'red' }} disabled>
                    Invalid Schema
                  </ButtonPrimary>
                ): sourceChain.id.toString() !== currentNetwork ? (
                  <ButtonPrimary style={{ textAlign: 'center', background: 'red' }} disabled>
                    Incorrect Network
                  </ButtonPrimary>
                ): !mnemonicError && !pubkey1Error && !pubkey2Error && !schemaError && sourceChain.id.toString() === currentNetwork ? (
                  <ButtonPrimary disabled={false} onClick={() => {
                    setTxProcessing(true);
                    addPopup({
                      txn: {
                        success: true,
                        summary: 'Shares created succesfully'
                      } 
                    });
                    executeShareEncryption(mnemonic, pubkey1, pubkey2, schema, sourceChain)
                      .then((shares : { encryptedShares: number[][]; networkShare: Buffer; }) => {
                        console.log("Shares created successfully");
                        addPopup({
                          txn: {
                            success: true,
                            summary: 'Shares created succesfully'
                          } 
                        });

                        createProof(schema).then((value: {proof: any, publicSignals: number[]}) => {
                          console.log('proof', value.proof);
                          console.log('publicSignals', value.publicSignals);

                          addPopup({
                            txn: {
                              success: true,
                              summary: 'Proof created succesfully'
                            } 
                          });
                        }).catch(e => {
                          console.log("Proof creation failed");
                          addPopup({
                            txn: {
                              success: false,
                              summary: JSON.stringify(e.message),
                            }
                          })
                        })
                      })
                      .catch(e => {
                        console.log("Share created fasuccesfully");
                        addPopup({
                          txn: {
                            success: true,
                            summary: 'Shares created succesfully'
                          } 
                        });
                      })
                      .finally(() => {
                        setTxProcessing(false)
                      });
                  }}>
                    Generate and encrypt shares
                  </ButtonPrimary>
                ) : (
                  <ButtonPrimary
                    onClick={() => {}}
                    id="swap-button"
                    disabled={false}
                  >
                    <Text>
                      Unexpected State
                    </Text>
                  </ButtonPrimary>
                )}
                {true && (
                  <Column style={{ marginTop: '1rem' }}>
                  </Column>
                )}
              </div>
            </AutoColumn>
          </Wrapper>
        </AppBody>

        <Grid item xs={5} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AppBody>
            <Column style={{height: document.getElementById('main-panel')?.clientHeight , width: document.getElementById('main-panel')?.clientWidth}}>
              <SchemaInputPanel
                id="schema-input-panel"
                value={schema}
                onChange={(value: string, hasError: boolean) => {
                  updateSchema(value);
                  setSchemaError(hasError);
                }}
                setSchemaError={setSchemaError}
              />
              
            </Column>
          </AppBody>
        </Grid>
      </Grid>
    </>
  )
}

export default SocialRecoveryApp;
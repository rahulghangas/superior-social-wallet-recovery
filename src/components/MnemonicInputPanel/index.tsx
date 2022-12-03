import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { utils } from 'ethers'

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 1;
  width: 100%;
`

const ContainerRow = styled.div<{ error: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.25rem;
  border: 1px solid ${({ error, theme }) => (error ? theme.red1 : theme.bg2)};
  transition: border-color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')},
    color 500ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  background-color: ${({ theme }) => theme.bg1};
`

const InputContainer = styled.div`
  flex: 1;
  padding: 1rem;
`

const Input = styled.input<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.red1 : theme.white)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  margin-bottom: 8px;
`

const UppercaseHelper = styled.span`
  text-transform: uppercase;
`

export default function MnemonicInputPanel({
  id,
  value,
  onChange,
  setMnemonicError
}: {
  id?: string
  // the typed string value
  value: string

  // triggers whenever the typed value changes
  onChange: (value: string, hasError: boolean) => void
  setMnemonicError: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const theme = useContext(ThemeContext);

  const [error, setError] = useState(false);
  const [currentInput, setCurrentInput] = useState(value);

  const validateMnemonic = async () => {
    const isValid = await utils.isValidMnemonic(currentInput.trim());
    setError(!isValid);
    setMnemonicError(!isValid);
  };

  const handleInput = useCallback(
    event => {
      const input = event.target.value
      onChange(input, error);
      setCurrentInput(input);
    },
    [onChange]
  );

  useEffect(() => {
    validateMnemonic();
  }, [currentInput]);

  return (
    <InputPanel id={id}>
      <ContainerRow error={error}>
        <InputContainer>
          <AutoColumn gap="md">
            <RowBetween>
              <LabelRow>
                <RowBetween>
                  <TYPE.black color={theme.text2} fontWeight={500} fontSize={14}>
                    Mnemonic
                  </TYPE.black>
                </RowBetween>
              </LabelRow>
            </RowBetween>
            <Input
              className="mnemonic-input"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Add Mnemonic"
              error={error}
              onChange={handleInput}
              value={value}
            />
          </AutoColumn>
        </InputContainer>
      </ContainerRow>
    </InputPanel>
  )
}

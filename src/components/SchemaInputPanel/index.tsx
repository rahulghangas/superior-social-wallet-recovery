import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import Column from '../Column'
import { RowBetween } from '../Row'
import { ChainId } from '../../const'
import { escapeRegExp } from '../../utils/escaperegex'
import AddressValidators from 'utils/address'

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 1;
  width: 100%;
  height: 100%;
`

const InputContainer = styled.div`
  flex: 1;
  padding: 1rem;
`

const Input = styled.textarea<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  resize: none;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.red1 : theme.white)};
  overflow: scroll;
  overflowWrap: "break-word";
  font-weight: 500;
  width: 100%;
  height: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  padding: 0px;
  -webkit-appearance: textarea;

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
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  margin-bottom: 8px;
`

export default function SchemaInputPanel({
  id,
  value,
  onChange,
  setSchemaError
}: {
  id?: string
  value: string

  onChange: (value: string, hasError: boolean) => void
  setSchemaError: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const theme = useContext(ThemeContext);

  const [error, setError] = useState(false);
  const [currentInput, setCurrentInput] = useState(value);

  let isValid = false;
  const validateShema = async () => {
    try {
      JSON.parse(currentInput);
      isValid = true;
    } catch(e) {}
    setError(!isValid);
    setSchemaError(!isValid);
  };

  const handleInput = useCallback(
    event => {
      const input = event.target.value;
      onChange(input, error);
      setCurrentInput(input);
    },
    [onChange]
  );

  const handleTab = (e) => {

    let content = e.target.value;
    let caret   = e.target.selectionStart;

    if(e.key === 'Tab'){

      e.preventDefault();

      let newText = content.substring(0, caret) + ' '.repeat(2) + content.substring(caret);

      onChange(newText, error);
      setCurrentInput(newText);

    }
  }

  useEffect(() => {
    validateShema();
  }, [currentInput]);

  return (
    <InputPanel id={id}>
        <InputContainer>
          <Column style={{height: '100%'}}>
            <RowBetween>
              <LabelRow>
                <RowBetween>
                  <TYPE.black color={theme.text2} fontWeight={500} fontSize={20}>
                    Schema
                  </TYPE.black>
                </RowBetween>
              </LabelRow>
            </RowBetween>
            <Input
              className="schema-input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="{}"
              error={error}
              onChange={handleInput}
              value={value}
              onKeyDown = {handleTab}
            />
          </Column>
        </InputContainer>
    </InputPanel>
  )
}

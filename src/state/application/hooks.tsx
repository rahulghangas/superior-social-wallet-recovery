import PopupItem from "components/Popups/PopupItem";
import { useCallback, useContext } from "react"
import { PopupContent } from "./actions";
import { toast } from 'react-toastify';
import { ThemeContext } from "styled-components";

export function useAddPopup(): (content: PopupContent, autoClose?: number | false) => void {
  return useCallback((content: PopupContent, autoClose: number | false = 15000) => {
    toast.dark(<PopupItem content={content} />, { autoClose, closeOnClick: false, closeButton: true})
  }, [])
}
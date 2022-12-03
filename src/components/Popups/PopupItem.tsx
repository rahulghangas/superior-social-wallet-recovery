import { PopupContent } from '../../state/application/actions'
import TransactionPopup from './TransactionPopup'

export default function PopupItem({ content }: { content: PopupContent }) {
  return <>{<TransactionPopup {...content.txn} />}</>
}

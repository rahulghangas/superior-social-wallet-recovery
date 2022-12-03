export interface PopperMenuItem {
  id: number | string;
  label: string,
  icon?: string
}

export interface PopperMenuProps {
  items: Array<PopperMenuItem>
  onClick: Function
  anchorEl: HTMLElement | undefined
  open: boolean
  style?: Object
  onClose: (event: MouseEvent | TouchEvent) => void
}
import React from 'react'
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem
} from '@mui/material'

import { PopperMenuProps, PopperMenuItem } from './types.ds'

const PopperMenu: React.FC<PopperMenuProps> = (props) => {
  const {open, anchorEl, items, onClick, onClose} = props
  
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      role={undefined}
      placement="bottom-start"
      transition
      style={{ zIndex: 10 }}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === 'bottom-start' ? 'left top' : 'left bottom',
            backgroundColor: '#191a24',
            border: '1px solid #2A2F42',
            color: '#FFF',
            fontWeight: 600
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={onClose}>
              <MenuList
                autoFocusItem={open}
              >
              {items.map((item: PopperMenuItem, index: number) => (
                <MenuItem
                  key={item.id}
                  onClick={(event) => onClick(event, index)}
                >
                  {item.icon && (
                    <img
                      height={16}
                      src={item.icon}
                      alt={item.label}
                      style={{ marginRight: '12px' }}
                    />)
                  }
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>
                    {item.label.toUpperCase()}
                  </div>
                </MenuItem>
                )
              )}
            </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  )
}

PopperMenu.defaultProps = {
  items: []
}

export default PopperMenu
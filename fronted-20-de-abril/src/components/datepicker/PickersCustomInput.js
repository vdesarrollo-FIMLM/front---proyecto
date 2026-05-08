// ** React Imports
import { forwardRef } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'

const PickersComponent = forwardRef(({ ...props }, ref) => {
  // ** Props
  const { readOnly } = props

  return <TextField inputRef={ref} {...props} {...(readOnly && { inputProps: { readOnly: true } })} fullWidth={true} />
})

export default PickersComponent

import { useEffect, useState } from 'react'

import PropTypes from 'prop-types'

import { FormControl, FormHelperText, InputAdornment, TextField } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { useTranslation } from 'react-i18next'

const FormTextField = ({
  formik,
  nameFieldFormik,
  label,
  placeholder,
  onChange,
  onKeyDown,
  onBlur,
  formikTouch,
  formikError,
  value,
  formikValidation,
  disabled,
  rows,
  icon,
  multiline,
  onlyNumbers,
  endAdornment
}) => {
  const { t } = useTranslation()

  const [valueData, setValueData] = useState('')

  const formikTouchValidation = formikValidation ? formikTouch || formik.touched[nameFieldFormik] : false
  const formikErrorValidation = formikValidation ? formikError || formik.errors[nameFieldFormik] : false

  useEffect(() => {
    setValueData(value)
  }, [value])

  const handleKeyDown = e => {
    if (onlyNumbers) {
      if (
        !(
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight' ||
          e.key === 'Backspace' ||
          e.key === 'Delete' ||
          e.key === 'Home' ||
          e.key === 'End' ||
          (e.ctrlKey && e.key === 'a') ||
          (e.ctrlKey && e.key === 'c') ||
          (e.ctrlKey && e.key === 'x') ||
          (e.ctrlKey && e.key === 'v')
        ) &&
        isNaN(Number(e.key))
      ) {
        e.preventDefault()
      }
    }
  }

  const renderIcon = (icon, position) => {
    if (icon !== '') {
      return (
        <InputAdornment position={position}>
          <Icon icon={icon} />
        </InputAdornment>
      )
    } else {
      return null
    }
  }

  const handleOnChange = e => {
    if (onlyNumbers) {
      if (isNaN(Number(e.target.value))) {
        return
      }
    }

    setValueData(e.target.value)
    onChange(e)
  }

  return (
    <FormControl fullWidth>
      {!multiline ? (
        <TextField
          label={t(label)}
          value={valueData}
          placeholder={placeholder}
          sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
          error={formikTouchValidation && Boolean(formikErrorValidation)}
          disabled={disabled}
          name={nameFieldFormik}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: renderIcon(icon, 'start'),
            endAdornment: endAdornment
          }}
          onBlur={onBlur}
        />
      ) : (
        <TextField
          label={t(label)}
          value={valueData}
          placeholder={placeholder}
          sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
          error={formikTouchValidation && Boolean(formikErrorValidation)}
          disabled={disabled}
          name={nameFieldFormik}
          onChange={handleOnChange}
          onBlur={onBlur}
          multiline={true}
          minRows={rows}
          InputProps={{
            startAdornment: renderIcon('mdi:file-document-edit', 'start')
          }}
        />
      )}

      {formikTouchValidation && Boolean(formikErrorValidation) ? (
        <FormHelperText error>{t(formikErrorValidation)}</FormHelperText>
      ) : null}
    </FormControl>
  )
}

FormTextField.propTypes = {
  formik: PropTypes.object,
  nameFieldFormik: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.any,
  formikValidation: PropTypes.bool,
  formikTouch: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  formikError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  onlyNumbers: PropTypes.bool,
  endAdornment: PropTypes.any
}

FormTextField.defaultProps = {
  nameFieldFormik: '',
  label: '',
  placeholder: '',
  value: '',
  icon: '',
  onChange: () => null,
  onKeyDown: () => null,
  onBlur: () => null,
  formikValidation: true,
  disabled: false,
  multiline: false,
  rows: 1,
  onlyNumbers: false,
  endAdornment: null
}

export default FormTextField

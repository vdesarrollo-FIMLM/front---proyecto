import { FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Select } from '@mui/material'

import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import Icon from 'src/@core/components/icon'

import { useTranslation } from 'react-i18next'
import { primeraMayuscula } from 'src/utils/utilidades'

const FormSelectBasico = ({
  formik,
  nameFieldFormik,
  label,
  onChange,
  options,
  formikTouch,
  formikError,
  value,
  formikValidation,
  disabled,
  icon
}) => {
  const { t } = useTranslation()

  const [listOption, setListOption] = useState([])
  const [valueData, setValueData] = useState('')

  useEffect(() => {
    if (options.length === 0) {
      setListOption([])
      return
    }

    if (options[0].value !== undefined && options[0].label !== undefined) {
      setListOption(options)
    } else {
      setListOption(options.map(e => ({ label: e, value: e })))
    }
  }, [options])

  useEffect(() => {
    setValueData(value)
  }, [value])

  const formikTouchValidation = formikValidation ? formikTouch || formik.touched[nameFieldFormik] : false
  const formikErrorValidation = formikValidation ? formikError || formik.errors[nameFieldFormik] : false

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
    setValueData(e.target.value)
    onChange(e)
  }

  return (
    <FormControl fullWidth>
      <InputLabel id={`label_${nameFieldFormik}`}>{t(label)}</InputLabel>
      <Select
        label={t(label)}
        labelId={`label_${nameFieldFormik}`}
        name={nameFieldFormik}
        value={valueData}
        error={formikTouchValidation && Boolean(formikErrorValidation)}
        onChange={handleOnChange}
        disabled={disabled}
        startAdornment={renderIcon(icon, 'start')}
      >
        {listOption.map((e, index) => (
          <MenuItem key={index + 1} value={e.value} disabled={e.disabled || false}>
            {primeraMayuscula(e.label)}
          </MenuItem>
        ))}
      </Select>
      {formikTouchValidation && Boolean(formikErrorValidation) ? (
        <FormHelperText error>{t(formikErrorValidation)}</FormHelperText>
      ) : null}
    </FormControl>
  )
}

FormSelectBasico.propTypes = {
  formik: PropTypes.object,
  nameFieldFormik: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.any,
  formikValidation: PropTypes.bool,
  formikTouch: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  formikError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  disabled: PropTypes.bool
}

FormSelectBasico.defaultProps = {
  nameFieldFormik: '',
  label: '',
  value: '',
  icon: '',
  onChange: () => {},
  options: [],
  formikValidation: true,
  disabled: false
}

export default FormSelectBasico

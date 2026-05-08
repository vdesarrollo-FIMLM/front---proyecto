import { useEffect, useState } from 'react'

import { FormHelperText, InputAdornment, TextField } from '@mui/material'

import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

import PropTypes from 'prop-types'

import Icon from 'src/@core/components/icon'

import { useTranslation } from 'react-i18next'

const FormInputTipoMoneda = ({
  formik,
  nameFieldFormik,
  label,
  icon,
  onChange,
  formikTouch,
  formikError,
  value,
  formikValidation,
  disabled,
  variant,
  size,
  onClick
}) => {
  const { t } = useTranslation()

  const [valueData, setValueData] = useState('')

  const formikTouchValidation = formikValidation ? formikTouch || formik.touched[nameFieldFormik] : false
  const formikErrorValidation = formikValidation ? formikError || formik.errors[nameFieldFormik] : false

  useEffect(() => {
    setValueData(value)
  }, [value])

  return (
    <>
      <TextField
        id='outlined-basic2'
        variant={variant}
        label={t(label)}
        size={size}
        name={nameFieldFormik}
        error={formikTouchValidation && Boolean(formikErrorValidation)}
        sx={{ width: '100%' }}
        onChange={e => {
          e.preventDefault()
        }}
        disabled={disabled}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position='start'>
              <Icon icon={icon} />
            </InputAdornment>
          )
        }}
      />
      <CleaveWrapper>
        <Cleave
          disabled={disabled}
          style={{
            paddingLeft: '35px',
            position: 'absolute',
            top: '16px',
            left: '50px',
            border: 'none',
            padding: '10px',
            width: '80%',
            textAlign: 'right'
          }}
          onClick={onClick}
          value={valueData}
          options={{
            numeral: true,
            numeralThousandsGroupStyle: 'thousand',
            numeralPositiveOnly: true
          }}
          name={nameFieldFormik}
          onChange={onChange}
          autoComplete='off'
        />
      </CleaveWrapper>
      {formikTouchValidation && Boolean(formikErrorValidation) ? (
        <FormHelperText sx={{ ml: 3 }} error>
          {t(formikErrorValidation)}
        </FormHelperText>
      ) : null}
    </>
  )
}

FormInputTipoMoneda.propTypes = {
  formik: PropTypes.object,
  value: PropTypes.any,
  nameFieldFormik: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  formikValidation: PropTypes.bool,
  formikTouch: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  formikError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  disabled: PropTypes.bool,
  variant: PropTypes.string,
  size: PropTypes.string
}

FormInputTipoMoneda.defaultProps = {
  nameFieldFormik: '',
  label: '',
  icon: 'mdi:dollar',
  onChange: () => {},
  onClick: () => {},
  formikValidation: true,
  disabled: false,
  variant: 'outlined',
  size: 'normal'
}

export default FormInputTipoMoneda

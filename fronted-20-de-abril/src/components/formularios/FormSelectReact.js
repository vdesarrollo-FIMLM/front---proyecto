import { useEffect, useState } from 'react'

import { FormControl, FormHelperText } from '@mui/material'
import { useTranslation } from 'react-i18next'

import PropTypes from 'prop-types'

import SelectReact from 'react-select'

const FormSelectReact = ({
  formik,
  nameFieldFormik,
  label,
  placeholder,
  options,
  onChange,
  formikTouch,
  formikError,
  value,
  formikValidation,
  isClearable,
  disabled
}) => {
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

  const { t } = useTranslation()

  const formikTouchValidation = formikValidation ? formikTouch || formik.touched[nameFieldFormik] : false
  const formikErrorValidation = formikValidation ? formikError || formik.errors[nameFieldFormik] : false

  return (
    <FormControl fullWidth>
      <SelectReact
        options={listOption}
        className='basic-multi-select'
        classNamePrefix='select'
        placeholder={t(placeholder)}
        noOptionsMessage={() => t('No hay opciones')}
        styles={{
          control: styles => ({
            ...styles,
            backgroundColor: 'white',
            minHeight: '55px',
            borderRadius: '7px',
            borderColor: formikTouchValidation && Boolean(formikErrorValidation) ? 'red' : '#d7d8dd'
          }),
          menu: provided => ({
            ...provided,
            zIndex: '99999',
            position: 'absolute'
          })
        }}
        isClearable={isClearable}
        isDisabled={disabled}
        value={valueData}
        name={nameFieldFormik}
        onChange={onChange}
      />
      {formikTouchValidation && Boolean(formikErrorValidation) ? (
        <FormHelperText error>{t(formikErrorValidation)}</FormHelperText>
      ) : null}
    </FormControl>
  )
}

FormSelectReact.propTypes = {
  formik: PropTypes.object,
  value: PropTypes.any,
  options: PropTypes.array,
  nameFieldFormik: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  formikValidation: PropTypes.bool,
  formikTouch: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  formikError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  disabled: PropTypes.bool,
  isClearable: PropTypes.bool
}

FormSelectReact.defaultProps = {
  nameFieldFormik: '',
  label: '',
  placeholder: '',
  options: [],
  onChange: () => {},
  formikValidation: true,
  disabled: false,
  isClearable: false
}

export default FormSelectReact

import { FormControl, FormHelperText, InputAdornment } from '@mui/material'

import PropTypes from 'prop-types'

import Icon from 'src/@core/components/icon'

import { useTranslation } from 'react-i18next'

import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/components/datepicker/date-picker'
import CustomInput from 'src/components/datepicker/PickersCustomInput'
import { es } from 'date-fns/locale'
import { useEffect, useState } from 'react'

const FormFecha = ({
  formik,
  placeholderText,
  nameFieldFormik,
  label,
  onChange,
  formikTouch,
  formikError,
  value,
  formikValidation,
  minDate,
  maxDate,
  disabled,
  isClearable
}) => {
  const { t } = useTranslation()

  const [valueData, setValueData] = useState('')

  const formikTouchValidation = formikValidation ? formikTouch || formik.touched[nameFieldFormik] : false
  const formikErrorValidation = formikValidation ? formikError || formik.errors[nameFieldFormik] : false

  useEffect(() => {
    setValueData(value)
  }, [value])

  const handleOnChange = date => {
    setValueData(date)
    onChange(date)
  }

  return (
    <FormControl fullWidth>
      <DatePickerWrapper>
        <DatePicker
          showYearDropdown
          showMonthDropdown
          selected={valueData}
          id='basic-input'
          autoComplete='off'
          popperPlacement={'bottom-start'}
          onChange={handleOnChange}
          placeholderText={t(placeholderText)}
          dateFormat='dd-MM-yyyy'
          disabled={disabled}
          minDate={minDate}
          isClearable={isClearable}
          maxDate={maxDate}
          locale={es}
          customInput={
            <CustomInput
              label={t(label)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='bx:calendar' />
                  </InputAdornment>
                )
              }}
              error={formikTouchValidation && Boolean(formikErrorValidation)}
            />
          }
        />
        {formikTouchValidation && Boolean(formikErrorValidation) ? (
          <FormHelperText error>{t(formikErrorValidation)}</FormHelperText>
        ) : null}
      </DatePickerWrapper>
    </FormControl>
  )
}

FormFecha.propTypes = {
  formik: PropTypes.object,
  value: PropTypes.any,
  placeholderText: PropTypes.string,
  nameFieldFormik: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  formikValidation: PropTypes.bool,
  formikTouch: PropTypes.any,
  formikError: PropTypes.any,
  disabled: PropTypes.bool,
  isClearable: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date)
}

FormFecha.defaultProps = {
  placeholderText: 'Seleccione una fecha',
  nameFieldFormik: 'fecha',
  label: 'Fecha',
  value: '',
  onChange: () => {},
  formikValidation: true,
  disabled: false,
  isClearable: false
}

export default FormFecha

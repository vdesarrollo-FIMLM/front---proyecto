import { useEffect, useState } from 'react'

import { Box, FormControl, FormHelperText, FormLabel, ToggleButton, ToggleButtonGroup } from '@mui/material'

import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'

const FormToggle = ({
  formik,
  nameFieldFormik,
  label,
  LabelValue1,
  colorLabelValue1,
  LabelValue2,
  colorLabelValue2,
  onChange,
  formikTouch,
  formikError,
  value,
  formikValidation,
  disabled
}) => {
  const { t } = useTranslation()

  const [valueData, setValueData] = useState('')

  useEffect(() => {
    setValueData(value)
  }, [value])

  const formikTouchValidation = formikValidation ? formikTouch || formik.touched[nameFieldFormik] : false
  const formikErrorValidation = formikValidation ? formikError || formik.errors[nameFieldFormik] : false

  return (
    <FormControl fullWidth>
      <Box mb={3}>
        <Box mb={3}>
          <FormLabel
            id='common-area-radio'
            sx={{
              fontWeight: 500,
              lineHeight: '21px',
              letterSpacing: '0.1px'
            }}
          >
            {t(label)}
          </FormLabel>
        </Box>

        <ToggleButtonGroup
          id={nameFieldFormik}
          name={nameFieldFormik}
          exclusive
          color='primary'
          value={valueData}
          disabled={disabled}
          onChange={onChange}
        >
          <ToggleButton name={nameFieldFormik} value={true} sx={{ px: 10 }} color={colorLabelValue1}>
            {t(LabelValue1)}
          </ToggleButton>
          <ToggleButton name={nameFieldFormik} value={false} sx={{ px: 10 }} color={colorLabelValue2}>
            {t(LabelValue2)}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {formikTouchValidation && Boolean(formikErrorValidation) ? (
        <FormHelperText error>{t(formikErrorValidation)}</FormHelperText>
      ) : null}
    </FormControl>
  )
}

FormToggle.propTypes = {
  formik: PropTypes.object,
  LabelValue1: PropTypes.string,
  colorLabelValue1: PropTypes.string,
  LabelValue2: PropTypes.string,
  colorLabelValue2: PropTypes.string,
  value: PropTypes.any,
  nameFieldFormik: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  formikValidation: PropTypes.bool,
  formikTouch: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  formikError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  disabled: PropTypes.bool
}

FormToggle.defaultProps = {
  label: '',
  onChange: () => {},
  disabled: false,
  formikValidation: true,
  LabelValue1: 'Si',
  colorLabelValue1: 'info',
  LabelValue2: 'No',
  colorLabelValue2: 'error'
}

export default FormToggle

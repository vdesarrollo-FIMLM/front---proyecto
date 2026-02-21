export const FormatDate = language => {
  if (language === 'en') {
    return 'MMMM dd yyyy'
  } else if (language === 'es') {
    return 'dd MMMM yyyy'
  } else if (language === 'fr') {
    return 'dd MMMM yyyy'
  } else {
    return 'dd MMMM yyyy'
  }
}

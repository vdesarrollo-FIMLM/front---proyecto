import { useState, useEffect } from 'react'

import { DataGrid } from '@mui/x-data-grid'
import QuickSearchToolbar from './QuickSearchToolbar'

import { useTranslation } from 'react-i18next'

const TablaMobile = ({ columns, rows, pageSize, textSearch }) => {
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [pageSizes, setPageSizes] = useState(pageSize)

  const { t } = useTranslation()

  useEffect(() => {
    setSearchText('')
    handleSearch('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSearch])

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')

    const filteredRows = rows.filter(row => {
      return Object.keys(row).some(field => {
        if (field != '_id' && field != 'link_foto') {
          if (row[field] != undefined) {
            if (row[field] !== null) {
              return searchRegex.test(row[field].toString())
            } else {
              return null
            }
          }
        }
      })
    })
    if (searchValue.length) {
      setFilteredData(filteredRows)
    } else {
      setFilteredData([])
    }
  }

  const escapeRegExp = value => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  }

  return (
    <DataGrid
      autoHeight
      getRowHeight={() => 'auto'}
      rows={searchText.length > 0 ? filteredData : rows}
      columns={columns}
      pageSize={pageSizes}
      onPageSizeChange={newPageSize => {
        setPageSizes(newPageSize)
      }}
      disableSelectionOnClick
      rowsPerPageOptions={[10, 25, 50]}
      components={{ Toolbar: QuickSearchToolbar }}
      componentsProps={{
        baseButton: {
          variant: 'outlined'
        },
        toolbar: {
          value: searchText,
          clearSearch: () => handleSearch(''),
          onChange: event => handleSearch(event.target.value)
        },
        pagination: {
          labelRowsPerPage: t('Filas por pagina')
        }
      }}
      sx={{
        '& .MuiDataGrid-cell': {
          paddingX: '3px !important'
        }
      }}
    />
  )
}

TablaMobile.defaultProps = {
  textSearch: '',
  title: ''
}

export default TablaMobile

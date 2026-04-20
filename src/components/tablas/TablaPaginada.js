import { useEffect, useState } from 'react'

import { DataGrid } from '@mui/x-data-grid'
import QuickSearchToolbar from './QuickSearchToolbar'
import { useTranslation } from 'react-i18next'

const TablaPaginada = ({
  page,
  pageSize,
  rows,
  rowCount,
  columns,
  textSearch,
  title,
  paginationServer,
  onChangePage,
  onChangePageSize,
  mostrarBuscador = true,
  getRowClassName = () => null
}) => {
  const [searchText, setSearchText] = useState('')
  const [pageSizes, setPageSizes] = useState(pageSize)
  const [pages, setPages] = useState(page)
  const [rowsCount, setRowsCount] = useState(rowCount)
  const [filteredData, setFilteredData] = useState([])
  const { t } = useTranslation()
  const [columnsTable, setColumnsTable] = useState([])

  useEffect(() => {
    setSearchText('')
    handleSearch('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSearch])

  useEffect(() => {
    handleSearch(searchText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows])

  useEffect(() => {
    setColumnsTable(
      columns.map(item => {
        return { ...item, sortable: false }
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const changePage = newPage => {
    setPages(newPage)
    onChangePage(newPage)
  }

  const changePageSize = newPageSize => {
    setPageSizes(newPageSize)
    onChangePageSize(newPageSize)
  }

  return (
    <>
      {paginationServer ? (
        <DataGrid
          autoHeight
          pagination
          paginationMode='server'
          getRowHeight={() => 'auto'}
          rows={searchText.length > 0 ? filteredData : rows}
          columns={columnsTable}
          pageSize={pageSizes}
          onPageSizeChange={newPageSize => {
            changePageSize(newPageSize)
          }}
          rowCount={rowsCount}
          page={pages}
          onPageChange={page => changePage(page)}
          disableSelectionOnClick
          disableColumnFilter
          disableColumnMenu
          rowsPerPageOptions={[10, 25, 50]}
          getRowClassName={getRowClassName}
          componentsProps={{
            baseButton: {
              variant: 'outlined'
            },
            pagination: {
              labelRowsPerPage: t('Filas por pagina')
            }
          }}
        />
      ) : (
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
          components={{ Toolbar: mostrarBuscador ? QuickSearchToolbar : null }}
          getRowClassName={getRowClassName}
          componentsProps={{
            baseButton: {
              variant: 'outlined'
            },
            toolbar: {
              value: searchText,
              title: title,
              clearSearch: () => handleSearch(''),
              onChange: event => handleSearch(event.target.value)
            },
            pagination: {
              labelRowsPerPage: t('Filas por pagina')
            }
          }}
        />
      )}
    </>
  )
}

TablaPaginada.defaultProps = {
  textSearch: '',
  title: '',
  paginationServer: false
}

export default TablaPaginada

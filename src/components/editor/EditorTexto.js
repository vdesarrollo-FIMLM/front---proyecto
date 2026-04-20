// ** React Imports
import { useEffect, useState } from 'react'

// ** Styles
import { Button, FormHelperText } from '@mui/material'

//Coverters

// let htmlToDraft = null
// if (typeof window === 'object') {
//   try {
//     htmlToDraft = require('html-to-draftjs').default
//   } catch (error) {
//     console.log('🚀 ~ error importanto htmlToDraft', error)
//   }
// }

const EditorTexto = ({
  htmlValue,
  onChange,
  toolbarHidden = true,
  height = '190px',
  readOnly = false,
  error,
  errorMessage = ''
}) => {
  const setTexto = texto => {
    if (texto !== '') {
      const contentBlock = htmlToDraft(texto)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)

      return editorState
    } else {
      return EditorState.createEmpty()
    }
  }
  const [value, setValue] = useState(setTexto(htmlValue))

  useEffect(() => {
    if (readOnly) {
      setValue(setTexto(htmlValue))
    }
  }, [htmlValue])

  const handleOnChange = data => {
    //covertir a html
    const content = data.getCurrentContent()
    const textoHTML = stateToHTML(content)
    const textoPlano = content.getPlainText()

    if (textoPlano === '') {
      onChange('')
    } else {
      onChange(textoHTML)
    }
  }

  if (htmlToDraft !== null) return <></>
}

export default EditorTexto

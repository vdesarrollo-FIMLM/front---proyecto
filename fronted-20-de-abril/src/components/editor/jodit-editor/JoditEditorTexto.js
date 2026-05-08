import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

const JoditEditorTexto = props => {
  const { t } = useTranslation()
  const {
    value,
    onChange = () => {},
    initialConfig,
    toolbar = true,
    width = '100%',
    height = 'auto',
    maxHeight = 'auto',
    minHeight = 'auto',
    placeholder = 'Escriba aquí',
    readonly = false
  } = props
  const editor = useRef(null)

  const [content, setContent] = useState('')

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    setContent(value)
  }, [value])

  const config = useMemo(
    () => ({
      ...initialConfig,
      readonly: readonly,
      enableDragAndDropFileToEditor: false,
      toolbar: toolbar,
      toolbarStickyOffset: 70,
      placeholder: `${t(placeholder)}`,
      language: 'es',
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      width: width,
      height: height,
      maxHeight: maxHeight,
      minHeight: minHeight,
      spellcheck: true,
      saveModeInStorage: true,
      imageDefaultWidth: '100%',
      imageDefaultAlign: 'center',
      style: {
        font: '16px Arial',
        borderRadius: '30px'
      },
      disablePlugins: [
        'about',
        'ai-assistant',
        'backspace',
        'class-span',
        'copyformat',
        'speech-recognize',
        'hotkeys',
        'addNewLine'
      ],
      extraCSS: `
      /* Asegúrate de incluir esta regla si persiste algún botón remanente */
      .jodit-ui-button_add-new-line,
      .jodit-ui-button__addNewLine,
      .jodit-ui-popup__content {
        display: none !important;
      }
    `
    }),
    ['Type here']
  )

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      onBlur={newContent => {
        setContent(newContent)
        onChange(newContent)
      }}
    />
  )
}

export default JoditEditorTexto

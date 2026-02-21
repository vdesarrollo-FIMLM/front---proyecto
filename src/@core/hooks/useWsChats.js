import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'

const WsBaseUrl = process.env.NEXT_PUBLIC_WS_BASE_URL

const useWsChats = handleGetMensajes => {
  const [message, setMessage] = useState(null)
  const [idConversacion, setIdConversacion] = useState(null)

  const { user } = useAuth()

  useEffect(() => {
    if (idConversacion != null) {
      const ws = new WebSocket(WsBaseUrl + 'mensajes/ws/' + idConversacion)

      // mensajes/ws/

      ws.onopen = () => {
        // console.log('Conectado a WebSocket')
      }

      ws.onmessage = e => {
        const message = e.data
        setMessage(JSON.parse(message))
      }

      ws.onerror = error => {
        console.error(`WebSocket error: ${JSON.stringify(error)}`)
      }

      ws.onclose = () => {
        // console.log('WebSocket connection closed')
      }

      // Se cierra la conexión cuando el componente se desmonta
      return () => {
        ws.close()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idConversacion])

  useEffect(() => {
    if (message != null && user.id_persona != message.id_persona_autor) {
      handleGetMensajes(message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message])

  return {
    message,
    setIdConversacion
  }
}

export { useWsChats }

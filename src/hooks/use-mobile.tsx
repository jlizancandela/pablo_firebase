
import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Hook que detecta si el dispositivo actual es móvil basándose en el ancho de la pantalla.
 * @returns {boolean} `true` si el ancho de la pantalla es menor que `MOBILE_BREAKPOINT`, `false` en caso contrario.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    /**
     * Callback que se ejecuta cuando cambia el tamaño de la pantalla para actualizar el estado.
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener("change", onChange)
    // Establecer el estado inicial
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

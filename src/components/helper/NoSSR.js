import React from "react"
import PropTypes from "prop-types"

const useEnhancedEffect =
  typeof window !== "undefined" && process.env.NODE_ENV !== "test"
    ? React.useLayoutEffect
    : React.useEffect

/**
 * NoSsr purposely removes components from the subject of Server Side Rendering (SSR).
 *
 * This component can be useful in a variety of situations:
 * - Escape hatch for broken dependencies not supporting SSR.
 * - Improve the time-to-first paint on the client by only rendering above the fold.
 * - Reduce the rendering time on the server.
 * - Under too heavy server load, you can turn on service degradation.
 */
function NoSSR(props) {
  const { children, defer = false, fallback = null } = props
  const [mountedState, setMountedState] = React.useState(false)

  useEnhancedEffect(() => {
    if (!defer) {
      setMountedState(true)
    }
  }, [defer])

  React.useEffect(() => {
    if (defer) {
      setMountedState(true)
    }
  }, [defer])

  // We need the Fragment here to force react-docgen to recognise NoSsr as a component.
  return <React.Fragment>{mountedState ? children : fallback}</React.Fragment>
}

NoSSR.propTypes = {
  /**
   * You can wrap a node.
   */
  children: PropTypes.node.isRequired,
  /**
   * If `true`, the component will not only prevent server-side rendering.
   * It will also defer the rendering of the children into a different screen frame.
   */
  defer: PropTypes.bool,
  /**
   * The fallback content to display.
   */
  fallback: PropTypes.node,
}

export default NoSSR

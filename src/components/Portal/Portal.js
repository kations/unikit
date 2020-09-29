import * as React from 'react';
import PortalConsumer from './PortalConsumer';
import PortalHost, { PortalContext } from './PortalHost';

class Portal extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <PortalContext.Consumer>
        {(manager) => (
          <PortalConsumer manager={manager}>{children}</PortalConsumer>
        )}
      </PortalContext.Consumer>
    );
  }
}

Portal.Host = PortalHost;

export default Portal;

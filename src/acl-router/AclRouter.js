import React, { Component } from 'react';
import PropTypes, { array } from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import DefaultLayout from './DefaultLayout';
import DefaultNotFound from './DefaultNotFound';
import omitRouteRenderProperties from './utils/omitRouteRenderProperties';
import checkPremissions from './utils/checkPermissions';
import _isNil from 'lodash/isNil';
import _map from 'lodash/map';

const propTypes = {
  authorities: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.func,
  ]),
  normalRoutes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      redirect: PropTypes.string,
      component: PropTypes.func,
    }),
  ),
  normalLayout: PropTypes.func,
  authoritiedRoutes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      permission: PropTypes.arrayOf(PropTypes.string),
      component: PropTypes.func,
      redirect: PropTypes.string,
      unauthorized: PropTypes.func,
    }),
  ),
  authorizedLayout: PropTypes.func,
  notFound: PropTypes.func,
};

const defaultProps = {
  authorities: '',
  normalRoutes: [],
  normalLayout: DefaultLayout,
  authorizedRoutes: [],
  authorizedLayout: DefaultLayout,
  notFound: DefaultNotFound,
};

class AclRouter extends Component {
  renderRedirectRoute = (route) => (
    <Route
      key={route.path}
      {...omitRouteRenderProperties(route)}
      render={() => <Redirect to={route.redirect} />}
    />
  );

  renderAuthorizedRoute = (route) => {
    const { authorizedLayout: AuthorizedLayout, authorities } = this.props;
    const {
      permissions,
      path,
      component: RouteComponent,
      unauthorized: Unauthorized,
    } = route;

    const hasPermission = checkPremissions(authorities, permissions);

    if (!!hasPermission && route.unauthorized) {
      return (
        <Route
          key={path}
          {...omitRouteRenderProperties(route)}
          render={(props) => (
            <AuthorizedLayout {...props}>
              <Unauthorized {...props} />
            </AuthorizedLayout>
          )}
        />
      );
    }

    if (!hasPermission && route.redirect) {
      return this.renderAuthorizedRoute(route);
    }

    return (
      <Route
        key={path}
        {...omitRouteRenderProperties(route)}
        render={(props) => (
          <AuthorizedLayout {...props}>
            <RouteComponent {...props} />
          </AuthorizedLayout>
        )}
      />
    );
  };

  renderUnAnthorizedRoute = (route) => {
    const { normalLayout: NormalLayout } = this.props;
    const { redirect, path, component: RouteComponent } = route;
    if (_isNil(RouteComponent) && !_isNil(redirect)) {
      return this.renderRedirectRoute(route);
    }

    return (
      <Route
        key={path}
        {...omitRouteRenderProperties(route)}
        render={(props) => (
          <NormalLayout {...props}>
            <RouteComponent {...props} />
          </NormalLayout>
        )}
      />
    );
  };

  renderNotFoundRoute = () => {
    const { notFound: NotFound } = this.props;
    return <Route render={(props) => <NotFound {...props} />} />;
  };

  render() {
    const { normalRoutes, authorizedRoutes } = this.props;
    return (
      <Switch>
        {_map(normalRoutes, (route) => this.renderUnAnthorizedRoute(route))}
        {_map(authorizedRoutes, (route) => this.renderAuthorizedRoute(route))}
        {this.renderNotFoundRoute()}
      </Switch>
    );
  }
}

AclRouter.propTypes = propTypes;
AclRouter.defaultProps = defaultProps;

export default AclRouter;

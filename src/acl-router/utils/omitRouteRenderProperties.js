import omit from 'lodash/omit';
import _omit from 'lodash/omit';

const OMIT_ROUTE_RENDER_PROPERTIES = ['render', 'component'];

const omitRouteRenderProperties = (route) =>
  _omit(route, OMIT_ROUTE_RENDER_PROPERTIES);

export default omitRouteRenderProperties;

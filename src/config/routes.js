import Home from '../pages/Home'
import Contacts from '../pages/Contacts'
import Deals from '../pages/Deals'
import Activities from '../pages/Activities'
import NotFound from '../pages/NotFound'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'BarChart3',
    component: Home,
    path: '/'
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    icon: 'Users',
    component: Contacts,
    path: '/contacts'
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    icon: 'TrendingUp',
    component: Deals,
    path: '/deals'
  },
  activities: {
    id: 'activities',
    label: 'Activities',
    icon: 'Calendar',
    component: Activities,
    path: '/activities'
  }
}

export const routeArray = Object.values(routes)
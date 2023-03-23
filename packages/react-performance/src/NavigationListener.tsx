import type {NavigationListener as NavigationlistenerType} from './navigation-listener';
import {useNavigationListener} from './navigation-listener';

export function NavigationListener({
  onNavigation,
}: {
  onNavigation: NavigationlistenerType;
}) {
  useNavigationListener(onNavigation);

  return null;
}

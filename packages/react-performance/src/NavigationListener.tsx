import {
  useNavigationListener,
  NavigationListener as NavigationlistenerType,
} from './navigation-listener';

export function NavigationListener({
  onNavigation,
}: {
  onNavigation: NavigationlistenerType;
}) {
  useNavigationListener(onNavigation);

  return null;
}

import { assertNonNull } from '@js-camp/core/utils/assertNonNull';

import { Url } from '../scripts/constants';
import { isAuthenticated } from '../scripts/functions';

import { Helpers } from '../scripts/helpers';
import { navigate } from '../scripts/navigation';
import { AuthService } from '../services/authService';

window.addEventListener('load', () => {
  if (!isAuthenticated()) {
    navigate(Url.Login);
  }
  AuthService.getUser();
});

const logoutButton = document.querySelector('.logout-btn');
assertNonNull(logoutButton);
logoutButton.addEventListener('click', () => {
  Helpers.clearToken();
  navigate(Url.Login);
});

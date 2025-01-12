import { UserData } from '../../types';
import { name, internet } from 'faker';

export function getFakeUserData() : UserData {
  const fakeUserData = {
    name: name.findName(),
    avatarUrl: internet.url(),
    isPro: false,
    email: internet.email(),
    token: internet.password()
  };

  return fakeUserData;
}

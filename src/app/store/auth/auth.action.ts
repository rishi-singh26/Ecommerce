import { createAction, props } from '@ngrx/store';
import * as ActionTypes from './auth.actiontypes';
import { LoginData } from './auth.model';

export const saveIdToken = createAction(ActionTypes.SAVE_ID_TOKEN, (idToken: string) => ({ idToken }));

export const saveLoginData = createAction(
    ActionTypes.SAVE_LOGIN_DATA,
    props<{ loginData: LoginData }>()
);

/** Delete data action */
export const clearAuthData = createAction(ActionTypes.DELETE_AUTH_DATA);

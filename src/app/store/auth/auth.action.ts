import { createAction, props } from '@ngrx/store';
import * as ActionTypes from './auth.actiontypes';
import { LoginResponse } from './auth.model';

export const saveIdToken = createAction(ActionTypes.SAVE_ID_TOKEN, (idToken: string) => ({ idToken }));

export const saveLoginData = createAction(
    ActionTypes.SAVE_LOGIN_DATA,
    props<{ loginData: LoginResponse }>()
);

/** Delete data action */
export const clearAuthData = createAction(ActionTypes.DELETE_AUTH_DATA);

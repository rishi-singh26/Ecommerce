import { Injectable } from '@angular/core';

export interface StorageManager {
    get: () => string | null | undefined;
    set: (value: string) => void;
    remove: () => void;
}

export class StorageProvider {
    static get KAuthState(): string {
        return "Auth_State";
    }

    static AuthState = StorageProvider.LocalManager(StorageProvider.KAuthState);

    static SessionManager(sessionKey: string): StorageManager {
        return {
            get: (): string | null => {
                return sessionStorage.getItem(sessionKey);
            },
            set: (value: string): void => {
                sessionStorage.setItem(sessionKey, value);
            },
            remove: (): void => {
                sessionStorage.removeItem(sessionKey);
            }
        }
    }

    static LocalManager(sessionKey: string): StorageManager {
        return {
            get: (): string | null => {
                return localStorage.getItem(sessionKey);
            },
            set: (value: string): void => {
                localStorage.setItem(sessionKey, value);
            },
            remove: (): void => {
                localStorage.removeItem(sessionKey);
            }
        }
    }
}
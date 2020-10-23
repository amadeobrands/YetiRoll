import { createDomain, restore } from 'effector';
import repository from '@app/repository';

const domain = createDomain('auth')

if (process.env.NODE_ENV === 'development') {
    import('effector-logger/attach').then((module) => module.attachLogger(domain));
}

export interface AuthUser {
    id: number,
    name: string,
    email: string
}

export interface AuthTokenData {
    access_token: string
}

export const setAuthUser = domain.createEvent<AuthUser>()
export const $user = restore<AuthUser>(setAuthUser, {
    id: 0, name: "", email: ""
})

export const fetchAuthUser = domain.createEffect<void, AuthUser|null>({
    async handler() {
        const authData: AuthTokenData | null = JSON.parse(localStorage.getItem("auth"))
        if (authData === null) {
            console.log('No auth token present')
            return null;
        }

        repository.setAuthAccessToken(authData.access_token, 'Bearer');
        try {
            const user = await repository.me().get()
            const authUser = {id: user.id, name: user.name, email: user.email};
            setAuthUser(authUser);
            return authUser;
        } catch (e) {
            console.log(e)
            return null
        }
    }
})


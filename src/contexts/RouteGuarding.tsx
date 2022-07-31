import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";

export { RouteGuard };

// https://jasonwatmore.com/post/2021/08/30/next-js-redirect-to-login-page-if-unauthenticated
function RouteGuard({ children }: any) {

    const [user, loading, error] = useAuthState(auth)
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // on initial load - run auth check
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, user]);

    function authCheck(url: string) {
        // redirect to login page if accessing a private page and not logged in
        const publicPaths = ['/signin'];
        const path = url.split('?')[0];
        if (!loading) {
            if (typeof user?.uid ==='undefined' && !publicPaths.includes(path)) {
                setAuthorized(false);
                router.push({
                    pathname: '/signin',
                    query: { returnUrl: router.asPath }
                });
            } else {
                setAuthorized(true);
            }
        }
    }

    return (authorized && children);
}

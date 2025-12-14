import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { routesMap } from '../utils/routesMap';

const ScreenWrapper = ({ Component, ...props }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const navigation = {
        navigate: (path, state) => {
            // Handle React Native style params: navigate('Screen', { param: value })
            // React Router: navigate('Screen', { state: { param: value } })

            if (typeof path === 'number') {
                navigate(path);
                return;
            }

            if (routesMap[path]) {
                navigate(routesMap[path], { state: state });
                return;
            }

            // Heuristic: If path is not absolute (doesn't start with /)
            // and doesn't contain /, assume it's a Screen Name.
            if (!path.startsWith('/') && !path.includes('/')) {
                const currentRoot = location.pathname.split('/')[1]; // e.g. 'listing'
                let newPath = path;
                if (currentRoot) {
                    newPath = `/${currentRoot}/${path}`;
                } else {
                    newPath = `/${path}`;
                }
                navigate(newPath, { state: state });
            } else {
                navigate(path, { state: state });
            }
        },
        goBack: () => navigate(-1),
        push: (path, state) => {
            if (routesMap[path]) {
                navigate(routesMap[path], { state: state });
                return;
            }
            navigate(path, { state: state });
        },
        replace: (path, state) => {
            if (routesMap[path]) {
                navigate(routesMap[path], { replace: true, state: state });
                return;
            }
            navigate(path, { replace: true, state: state });
        },
        pop: () => navigate(-1),
        addListener: () => { return () => { } }, // Mock returning unsubscribe function
        setOptions: () => { }, // Mock
        dispatch: () => { }, // Mock
        isFocused: () => true, // Mock
    };

    const route = {
        params: {
            ...params,
            ...(location.state || {})
        },
        name: location.pathname,
        key: location.key,
    };

    return <Component {...props} navigation={navigation} route={route} />;
};

export default ScreenWrapper;

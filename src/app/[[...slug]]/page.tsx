import AppNavigator from '../../navigation/main/AppNavigator';

export function generateStaticParams() {
    return [{ slug: [] }];
}

export default function Page() {
    return <AppNavigator />;
}

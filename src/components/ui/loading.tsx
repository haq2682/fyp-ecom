import { dotSpinner } from 'ldrs';
import { useTheme } from 'next-themes';

dotSpinner.register();
export default function Loading() {
    const { theme } = useTheme();
    return (
        <>
            <l-dot-spinner
                size="40"
                speed="0.9"
                color={theme === 'light' ? 'black' : 'white'}
            ></l-dot-spinner>
        </>
    )
}
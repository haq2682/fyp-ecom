import { dotSpinner } from 'ldrs';
import { useTheme } from 'next-themes';

dotSpinner.register();
export default function Loading({ propColor, propSize = 40 }: {propColor?: string, propSize?: number}) {
    const { theme } = useTheme();
    return (
        <>
            <l-dot-spinner
                size={propSize}
                speed="0.9"
                color={propColor ? propColor : (theme === 'light' ? 'black' : 'white')}
            ></l-dot-spinner>
        </>
    )
}
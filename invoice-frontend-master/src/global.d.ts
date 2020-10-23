import { theme } from '@app/shared/style/theme';
import { DefaultTheme } from 'styled-components';

type ThemeInterface = typeof theme

declare module 'styled-components' {
    interface AppTheme extends ThemeInterface {
        colors: typeof theme.colors;
    }

    interface DefaultTheme extends AppTheme {
        [key: string]: any;
    }
}

declare global {
    // @ts-ignore
    declare module '*.css' {
        const content: string;
        export default content;
    }

    // @ts-ignore
    declare module '*.json' {
        const content: Record<string, string>;
        export default content;
    }
}

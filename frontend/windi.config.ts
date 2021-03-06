import { defineConfig, transform } from 'windicss/helpers'
import colors from 'windicss/colors'

export default defineConfig({
    theme: {
        extend: {
            colors: {
                primary: colors.sky
            },
            fontFamily: {
                mont: "'Montserrat', 'sans-serif'"
            }
        }
    },
    plugins: [transform('daisyui')]
})

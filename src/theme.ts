import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'pink.800',
          _hover: {
            bg: 'pink.700',
          },
        },
      },
    },
    Link: {
      baseStyle: {
        textColor: 'pink.500',
        _hover: {
          textColor: 'pink.300',
        },
      },
    },
  },
  global: {
    a: {
      textColor: 'pink.500',
      _hover: {
        textColor: 'pink.300',
      },
    },
    // body: {
    //   overflow: 'hidden',
    // },
  },
});

export default theme;

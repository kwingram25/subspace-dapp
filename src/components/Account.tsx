import { Box, Flex } from '@chakra-ui/react';
import Identicon from '@polkadot/react-identicon';

import { useApi } from '../contexts';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  name?: React.ReactNode;
  value: string;
}

export function Account({ name: propsName, value }: Props) {
  const { accounts } = useApi();

  const account = accounts?.find((a) => a.address === value.toString());
  const name = propsName || account?.meta.name;

  if (!value) {
    return null;
  }

  return (
    <Flex
      alignItems="center"
      overflowX="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
    >
      <Identicon
        size={32}
        style={{ backgroundColor: 'white', borderRadius: '32px' }}
        value={value}
      />
      <Box ml={2} overflowX="hidden" textOverflow="ellipsis">
        <Box fontSize="sm">{name}</Box>
        <Box
          fontFamily="monospace"
          fontSize="xs"
          overflowX="hidden"
          textColor="gray.500"
          textOverflow="ellipsis"
        >
          {value}
        </Box>
      </Box>
    </Flex>
  );
}

Account.defaultProps = {
  name: null,
};

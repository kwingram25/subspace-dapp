import { Box, BoxProps, Text } from '@chakra-ui/react';

import { useFeeds } from '../../contexts';
import { useApi } from '../../contexts/ApiContext';
import { AccountSelect } from '../AccountSelect';

import { ConnectionStatus } from './ConnectionStatus';

function MenuModule({ children, ...props }: BoxProps) {
  return (
    <Box boxShadow="2xl" m={4} rounded="md" {...props}>
      <Box w="100%">{children}</Box>
    </Box>
  );
}

export function MainMenu() {
  const { isReady, latestBlock } = useApi();
  const { accountId, setAccountId } = useFeeds();

  return (
    <Box>
      <Text
        as="h1"
        fontFamily="monospace"
        fontSize="xl"
        pb={2}
        pt={4}
        textAlign="center"
        textColor="pink.400"
      >
        Subspace Feed Manager
      </Text>
      <MenuModule>
        <ConnectionStatus />
      </MenuModule>
      {isReady && latestBlock !== 0 && (
        <MenuModule mt="4">
          <AccountSelect
            data-cy="account-select"
            label="Select an account to manage"
            value={accountId}
            onChange={setAccountId}
          />
        </MenuModule>
      )}
    </Box>
  );
}

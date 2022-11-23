import { useMemo } from 'react';

import { Box, chakra, CircularProgress, Flex } from '@chakra-ui/react';

import { WS_RPC_URL } from '../../constants';
import { useApi } from '../../contexts';

export function ConnectionStatus() {
  const { error, isReady, isConnected, latestBlock } = useApi();

  const [statusIndicator, statusText] = useMemo(() => {
    if (error) {
      return [
        <Box bg="red.500" height={2} rounded="md" width={2} />,
        'Error connecting',
      ];
    }

    if (!isConnected || !isReady || latestBlock === 0) {
      return [
        <CircularProgress
          color="yellow.500"
          isIndeterminate
          p={0}
          size="10px"
          trackColor="transparent"
        />,
        'Connecting...',
      ];
    }

    return [
      <Box bg="green.500" height={2} rounded="md" width={2} />,
      'Connected',
    ];
  }, [isConnected, isReady, latestBlock, error]);

  return (
    <Box
      alignItems="center"
      bg="gray.700"
      data-cy="connection-status"
      fontWeight={500}
      justifyContent="flex-start"
      m={0}
      p={0}
      rounded="md"
      w="100%"
    >
      <Flex
        alignItems="center"
        maxWidth="100%"
        overflowX="hidden"
        p="2"
        textOverflow="ellipsis"
      >
        <Box mr="2" w={2}>
          {statusIndicator}
        </Box>
        <Box flexGrow={1} fontSize="sm" overflowX="hidden" textAlign="left">
          {statusText}
          {isReady && latestBlock > 0 && (
            <chakra.span
              data-cy="latest-block"
              data-value={latestBlock}
              float="right"
              fontFamily="monospace"
              fontSize="xs"
            >
              #{latestBlock.toLocaleString()}
            </chakra.span>
          )}
          <Box
            color="gray.300"
            fontFamily="monospace"
            fontSize="10px"
            overflowX="hidden"
            textOverflow="ellipsis"
          >
            {WS_RPC_URL}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

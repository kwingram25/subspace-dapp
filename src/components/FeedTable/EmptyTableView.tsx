import { useMemo } from 'react';

import { WarningIcon } from '@chakra-ui/icons';
import { CircularProgress, Flex, Text } from '@chakra-ui/react';

import { useApi, useFeeds } from '../../contexts';

function LoadingSpinner() {
  return (
    <CircularProgress
      color="pink.500"
      isIndeterminate
      mb={4}
      size="70px"
      trackColor="transparent"
    />
  );
}

export function EmptyTableView() {
  const { error, isReady, latestBlock } = useApi();
  const { isFetching } = useFeeds();

  const [icon, headline, subtitle] = useMemo(() => {
    if (error) {
      return [
        <WarningIcon color="red.500" h={70} mb={4} w={70} />,
        'Unable to connect',
        'Ensure you are running a Subspace node and farmer in development mode',
      ];
    }

    if (!isReady || latestBlock === 0) {
      return [<LoadingSpinner />, 'Connecting to chain...'];
    }

    if (isFetching) {
      return [<LoadingSpinner />, 'Fetching feeds...'];
    }

    return [
      <Text fontSize="5xl" textColor="pink.500">
        ¯\_(ツ)_/¯
      </Text>,
      'No feeds owned by this account',
    ];
  }, [error, isFetching, isReady, latestBlock]);

  return (
    <Flex bgColor="gray.900" justifyContent="center" w="100%">
      <Flex
        alignItems="center"
        bgColor="gray.900"
        flex="1"
        flexDirection="column"
        flexGrow="1"
        justifyContent="center"
        maxW="60%"
        minH="300px"
        textAlign="center"
      >
        <Flex
          alignItems="center"
          h="7rem"
          justifyContent="center"
          mb={2}
          w="20rem"
        >
          {icon}
        </Flex>
        <Text fontFamily="monospace" fontSize="lg" mb={2} textColor="white">
          {headline}
        </Text>
        <Text fontFamily="monospace" fontSize="sm" textColor="gray.300">
          {subtitle}
        </Text>
      </Flex>
    </Flex>
  );
}

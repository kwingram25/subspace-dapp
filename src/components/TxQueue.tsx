import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, CircularProgress, Flex } from '@chakra-ui/react';

import { useFeeds } from '../contexts';
import { TxStatus, TxType } from '../types';

export function TxQueue() {
  const { txQueue } = useFeeds();

  return (
    <Box bottom={3} data-cy="tx-queue" position="fixed" right={3}>
      {Object.values(txQueue).map(({ feedId, type, status }, i) => {
        let text: string;
        let bgColor: string;
        let icon: React.ReactNode;

        switch (status) {
          case TxStatus.Success:
            text = 'Success!';
            bgColor = 'green.500';
            icon = <CheckCircleIcon />;
            break;

          case TxStatus.Error:
            text = 'Transaction error';
            bgColor = 'red.500';
            icon = <CloseIcon />;
            break;

          default: {
            bgColor = 'pink.500';
            icon = (
              <CircularProgress
                color="white"
                isIndeterminate
                p={0}
                size="16px"
                trackColor="transparent"
              />
            );

            switch (type) {
              case TxType.PutObject:
                text = `Adding data to feed ${feedId}...`;
                break;

              case TxType.TransferFeed:
                text = `Transferring feed ${feedId}...`;
                break;

              case TxType.CloseFeed:
                text = `Closing feed ${feedId}...`;
                break;

              default:
                text = 'Creating a new feed...';
                break;
            }
            break;
          }
        }

        return (
          <Flex
            alignItems="center"
            bg={bgColor}
            minW="300px"
            mt={i > 0 ? 2 : 0}
            p={3}
            rounded="md"
            transition="0.2s"
          >
            <Flex
              alignItems="center"
              h={4}
              justifyContent="center"
              mr={2}
              w={4}
            >
              {icon}
            </Flex>
            {text}
          </Flex>
        );
      })}
    </Box>
  );
}

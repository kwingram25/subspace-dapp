import prettyBytes from 'pretty-bytes';
import { isMobile as isMobileDevice } from 'react-device-detect';

import { AddIcon, DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';
// import { TriangleDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  IconButton,
  TableCellProps,
  Td,
  Tooltip,
} from '@chakra-ui/react';
import { CellContext } from '@tanstack/react-table';

import { useFeeds } from '../../contexts';
import { FeedReport, VoidFn } from '../../types';

export type ActionsCellProps = CellContext<FeedReport, unknown> & {
  onPut: VoidFn;
  onTransferFeed: VoidFn;
  onCloseFeed: VoidFn;
};

function BaseCell({
  children,
  ...props
}: { row: CellContext<FeedReport, unknown>['row'] } & TableCellProps) {
  return (
    <Td borderBottomWidth="1px" px={4} py={2} valign="middle" {...props}>
      {children}
    </Td>
  );
}

export function ActionsCellBase({
  row,
  onPut,
  onTransferFeed,
  onCloseFeed,
}: ActionsCellProps) {
  return (
    <BaseCell row={row}>
      <Flex className="actions" opacity={isMobileDevice ? '1' : '0.3'}>
        <Tooltip label={!row.original.isActive ? 'Closed' : 'Add Object'}>
          <span>
            <IconButton
              aria-label="Add Object"
              bg="transparent"
              color={!row.original.isActive ? 'red.400' : undefined}
              data-cy="add-data"
              h={8}
              icon={<AddIcon />}
              isDisabled={!row.original.isActive}
              minW={8}
              mr={1}
              onClick={onPut}
            />
          </span>
        </Tooltip>
        <Tooltip label={!row.original.isActive ? 'Closed' : 'Close Feed'}>
          <span>
            <IconButton
              aria-label="Destroy Feed"
              bg="transparent"
              color={!row.original.isActive ? 'red.400' : undefined}
              data-cy="close-feed"
              h={8}
              icon={<DeleteIcon />}
              isDisabled={!row.original.isActive}
              minW={8}
              mr={1}
              onClick={onCloseFeed}
            />
          </span>
        </Tooltip>
        <Tooltip label="Transfer Feed">
          <span>
            <IconButton
              aria-label="Transfer Feed"
              bg="transparent"
              data-cy="transfer-feed"
              h={8}
              icon={<ExternalLinkIcon />}
              minW={8}
              onClick={onTransferFeed}
            />
          </span>
        </Tooltip>
      </Flex>
    </BaseCell>
  );
}

export function FeedIdCell(cell: CellContext<FeedReport, number>) {
  const { getValue, row } = cell;

  return (
    <BaseCell row={row}>
      <Box fontFamily="monospace" fontSize="md" textColor="pink.300">
        {getValue()}
      </Box>
    </BaseCell>
  );
}

export function CountCell(cell: CellContext<FeedReport, number>) {
  const { getValue, row } = cell;

  return (
    <BaseCell row={row}>
      <Box fontFamily="monospace" fontSize="md">
        {getValue()}
      </Box>
    </BaseCell>
  );
}

export function SizeCell({ getValue, row }: CellContext<FeedReport, number>) {
  const { maxSize } = useFeeds();

  const value = getValue();

  return (
    <BaseCell row={row}>
      <Flex alignItems="center" fontFamily="monospace" fontSize="md">
        <Box fontSize="sm" mr={4} textAlign="right" w="4rem">
          {prettyBytes(getValue())}
        </Box>
        <Box bg="gray.900" flex={1} flexGrow={1} h="12px">
          <Box
            bg="pink.400"
            h="100%"
            transition="0.2s width"
            w={`${Math.min(1, value / maxSize) * 100}%`}
          />
        </Box>
      </Flex>
    </BaseCell>
  );
}

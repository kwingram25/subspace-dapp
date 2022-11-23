import React, { useMemo, useState } from 'react';

import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  chakra,
  Flex,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { isNull } from '@polkadot/util';
import {
  CellContext,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { useApi, useFeeds } from '../../contexts';
import type { FeedReport } from '../../types';

import { ActionsCellBase, CountCell, FeedIdCell, SizeCell } from './cells';
import { CloseFeed } from './CloseFeed';
import { CreateFeed } from './CreateFeed';
import { EmptyTableView } from './EmptyTableView';
import { TransferFeed } from './TransferFeed';

const widths = {
  feedId: '0.5rem',
  count: '0.5rem',
  actions: '10rem',
};

export function FeedTable() {
  const { isReady, latestBlock } = useApi();
  const { isFetching, onPut, feedReports } = useFeeds();

  const [transferId, setTransferId] = useState<number | null>(null);
  const [closeId, setCloseId] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([
    { desc: false, id: 'feedId' },
  ]);

  const columns: ColumnDef<FeedReport>[] = useMemo(
    () => [
      {
        accessorFn: (info) => info.id,
        id: 'feedId',
        header: 'ID',
        cell: FeedIdCell,
      },
      {
        accessorFn: (info) => info.count,
        id: 'count',
        header: 'Count',
        cell: CountCell,
      },
      {
        accessorFn: (info) => info.size,
        id: 'size',
        cell: SizeCell,
      },
      {
        id: 'actions',
        header: () => null,
        // eslint-disable-next-line
        cell: (props: CellContext<FeedReport, unknown>) => {
          const feedId: number = props.row.getValue('feedId');

          return (
            <ActionsCellBase
              {...props}
              onCloseFeed={() => setCloseId(feedId)}
              onPut={() => onPut(feedId)}
              onTransferFeed={() => setTransferId(feedId)}
            />
          );
        },
      },
    ],
    [onPut]
  );

  const table = useReactTable({
    columns,
    data: feedReports,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Flex
        alignItems="center"
        data-cy="table-container"
        flexDirection="column"
        height="100%"
        position="relative"
      >
        <Table maxWidth="100%" position="relative" sx={{}}>
          <Thead zIndex="200">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr bg="gray.900" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    _hover={{
                      textColor: 'white',
                    }}
                    bg="gray.900"
                    cursor="pointer"
                    display={{
                      base: header.id === 'data' ? 'none' : 'table-cell',
                      lg: 'table-cell',
                    }}
                    key={header.id}
                    minW={widths[header.id]}
                    position="sticky"
                    px={4}
                    top={0}
                    transition="0.2s color"
                    w={widths[header.id]}
                    whiteSpace="nowrap"
                    zIndex={2}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Box zIndex={300}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <chakra.span pl="2">
                        {{
                          asc: <TriangleUpIcon aria-label="sorted ascending" />,
                          desc: (
                            <TriangleDownIcon aria-label="sorted descending" />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </chakra.span>
                    </Box>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr
                _hover={{
                  bgColor: 'pink.900',
                }}
                css={`
                  &:hover .actions {
                    opacity: 1;
                  }
                `}
                data-cy={`feed-row-${row.original.id}`}
                key={row.original.id}
                transition="0.2s background-color"
              >
                {row.getVisibleCells().map((cell) => (
                  <React.Fragment key={`cell-${cell.id}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </React.Fragment>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
        {table.getRowModel().rows.length === 0 && <EmptyTableView />}
        {isReady && !isFetching && latestBlock > 0 && <CreateFeed />}
      </Flex>
      <TransferFeed
        feedId={transferId}
        isOpen={!isNull(transferId)}
        onClose={() => setTransferId(null)}
      />
      <CloseFeed
        feedId={closeId}
        isOpen={!isNull(closeId)}
        onClose={() => setCloseId(null)}
      />
    </>
  );
}

import { useEffect, useState } from 'react';

import {
  Button,
  chakra,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';

import { useApi, useFeeds } from '../../contexts';
import { AccountSelect } from '../AccountSelect';

interface Props {
  feedId: number;
  isOpen: ModalProps['isOpen'];
  onClose: ModalProps['onClose'];
}

export function TransferFeed({ feedId, isOpen, onClose }: Props) {
  const { accounts } = useApi();
  const { accountId, onTransferFeed } = useFeeds();

  const [newOwner, setNewOwner] = useState<string | null>(null);

  useEffect(() => {
    if (!newOwner && accounts && accounts.length > 0) {
      setNewOwner(
        accounts?.find((a) => a.address !== accountId).address || null
      );
    }
  }, [accountId, accounts, newOwner]);

  const isValid = !accountId || newOwner !== accountId;

  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        as={chakra.form}
        bgColor="gray.900"
        data-cy="transfer-feed-modal"
        onSubmit={(e) => {
          e.preventDefault();

          onClose();
          onTransferFeed(feedId, newOwner);
        }}
      >
        <ModalHeader>Transfer Feed</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AccountSelect
            id="new-owner"
            label={
              <chakra.span fontSize="md">
                Transfer feed with id <b>{feedId}</b> to:
              </chakra.span>
            }
            value={newOwner}
            onChange={setNewOwner}
          />
          <Button
            _hover={{
              bg: 'pink.700',
            }}
            bg="pink.800"
            data-cy="transfer-feed-confirm"
            isDisabled={!isValid}
            mt={6}
            type="submit"
            variant="solid"
            w="100%"
          >
            Confirm
          </Button>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

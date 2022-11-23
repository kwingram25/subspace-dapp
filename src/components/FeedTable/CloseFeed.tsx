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
  Text,
} from '@chakra-ui/react';

import { useFeeds } from '../../contexts';

interface Props {
  feedId: number;
  isOpen: ModalProps['isOpen'];
  onClose: ModalProps['onClose'];
}

export function CloseFeed({ feedId, isOpen, onClose }: Props) {
  const { onCloseFeed } = useFeeds();

  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        as={chakra.form}
        bgColor="gray.900"
        data-cy="close-feed-modal"
        onSubmit={(e) => {
          e.preventDefault();

          onClose();
          onCloseFeed(feedId);
        }}
      >
        <ModalHeader>Close Feed</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text variant="p">
            Close feed with id <b>{feedId}</b>?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            _hover={{
              bg: 'red.700',
            }}
            bg="red.800"
            data-cy="close-feed-confirm"
            mt={6}
            type="submit"
            variant="solid"
            w="100%"
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

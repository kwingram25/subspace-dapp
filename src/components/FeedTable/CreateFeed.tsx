import { Button } from '@chakra-ui/react';

import { useFeeds } from '../../contexts';

export function CreateFeed() {
  const { onCreateFeed } = useFeeds();

  return (
    <Button
      data-cy="create-feed"
      loadingText="Creating..."
      mt={6}
      variant="solid"
      onClick={onCreateFeed}
    >
      Create A New Feed
    </Button>
  );
}

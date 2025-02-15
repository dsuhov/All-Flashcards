import { Navigate, useParams } from 'react-router';

import { LearnContainer } from '@/Components/LearnContainer';

export const LearnPage = () => {
  const { deckLink } = useParams();

  if (!deckLink) {
    return <Navigate to="/" />;
  }

  return <LearnContainer deckLinkName={deckLink} />;
};

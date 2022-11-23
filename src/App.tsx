import { Layout } from './components/Layout';
import { ApiContextProvider } from './contexts/ApiContext';
import { FeedsContextProvider } from './contexts/FeedsContezt';

export default function App(): JSX.Element {
  return (
    <ApiContextProvider>
      <FeedsContextProvider>
        <Layout />
      </FeedsContextProvider>
    </ApiContextProvider>
  );
}

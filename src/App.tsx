import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './app/providers';
import { router } from './app/router';
import { AppWrapper } from '@/components/layout/AppWrapper';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';

function App() {
  return (
    <AppProviders>
      <AppWrapper>
        <RouterProvider router={router} />
        <OnboardingModal />
      </AppWrapper>
    </AppProviders>
  );
}

export default App;

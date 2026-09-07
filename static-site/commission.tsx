import { createRoot, hydrateRoot } from 'react-dom/client';

import '@/app/globals.css';
import { CommissionPageContent } from '@/components/commission-page-content';

const params = new URLSearchParams(window.location.search);
const initialType =
  params.get('type') === 'makers-choice' ? 'makers-choice' : 'guided';

const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');
const page = <CommissionPageContent initialType={initialType} />;

if (initialType === 'guided') hydrateRoot(root, page);
else {
  root.replaceChildren();
  createRoot(root).render(page);
}

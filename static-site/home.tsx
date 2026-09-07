import { hydrateRoot } from 'react-dom/client';

import '@/app/globals.css';
import { PremiumHome } from '@/components/premium-home';

const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');
hydrateRoot(root, <PremiumHome />);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AOS from 'aos';


Aos.init();
import { RouterProvider } from "react-router";
import { router } from './router/router.jsx';
import Aos from 'aos';
createRoot(document.getElementById('root')).render(
  <StrictMode>
<div className='font-urbanist max-w-7xl mx-auto'>
     <RouterProvider router={router} />
</div>
  
  </StrictMode>,
)

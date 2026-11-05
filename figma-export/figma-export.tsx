import React from 'react';
import {createRoot} from 'react-dom/client';
import {AppProvider, AppContext, useApp} from './context/AppContext';
import {AppContent} from './App';
import {INITIAL_USERS} from './data/mockData';
import './index.css';
import {exportScreen} from './figma-exporter';
const q=new URLSearchParams(location.search), role=q.get('role')||'admin', route=q.get('route')||'/dashboard';
function Screen(){const app=useApp();return <AppContext.Provider value={{...app,activeRole:role as any,currentUser:INITIAL_USERS.find(u=>u.role===role)!,currentRoute:route,isDarkMode:false,isMaintenanceMode:q.has('maintenance'),isSessionTimeoutWarning:false}}><AppContent/></AppContext.Provider>}
createRoot(document.getElementById('root')!).render(<AppProvider><Screen/></AppProvider>);
const style=document.createElement('style');style.textContent='*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}html{color-scheme:light}';document.head.appendChild(style);
async function run(){await document.fonts.ready;await new Promise(r=>setTimeout(r,2000)); await Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(r=>{img.onload=r;img.onerror=r;setTimeout(r,6000)})));await exportScreen(q.get('id')||'screen');}
run().catch(e=>{document.body.insertAdjacentHTML('afterbegin','<pre>'+String(e)+'</pre>')});

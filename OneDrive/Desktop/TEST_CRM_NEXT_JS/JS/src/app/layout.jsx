// import logoDark from '@/assets/images/logo-dark.png';
// import AppProvidersWrapper from '@/components/wrappers/AppProvidersWrapper';
// import { Play } from 'next/font/google';
// import Image from 'next/image';
// import NextTopLoader from 'nextjs-toploader';
// import '@/assets/scss/app.scss';
// import { DEFAULT_PAGE_TITLE } from '@/context/constants';
// const play = Play({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   display: 'swap'
// });
// export const metadata = {
//   title: {
//     template: '%s | Larkon Nextjs - Responsive Admin Dashboard Template',
//     default: DEFAULT_PAGE_TITLE
//   },
//   description: 'Bootstrap 5 based  Responsive Admin Dashboard Template'
// };
// const splashScreenStyles = `
// #splash-screen {
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   background: white;
//   display: flex;
//   height: 100%;
//   width: 100%;
//   transform: translate(-50%, -50%);
//   align-items: center;
//   justify-content: center;
//   z-index: 9999;
//   opacity: 1;
//   transition: all 15s linear;
//   overflow: hidden;
// }

// #splash-screen.remove {
//   animation: fadeout 0.7s forwards;
//   z-index: 0;
// }

// @keyframes fadeout {
//   to {
//     opacity: 0;
//     visibility: hidden;
//   }
// }
// `;
// export default function RootLayout({
//   children
// }) {
//   return <html lang="en">
//       <head>
//         <style suppressHydrationWarning>{splashScreenStyles}</style>
//       </head>
//       <body className={play.className}>
//         <div id="splash-screen">
//           <Image alt="Logo" width={112} height={24} src={logoDark} style={{
//           height: '7%',
//           width: 'auto'
//         }} priority />
//         </div>
//         <NextTopLoader color="#ff6c2f" showSpinner={false} />
//         <div id="__next_splash">
//           <AppProvidersWrapper>{children}</AppProvidersWrapper>
//         </div>
//       </body>
//     </html>;
// }


import logoDark from '@/assets/images/logo-dark.png';
import AppProvidersWrapper from '@/components/wrappers/AppProvidersWrapper';
import { Play } from 'next/font/google';
import Image from 'next/image';
import NextTopLoader from 'nextjs-toploader';
import '@/assets/scss/app.scss';
import { DEFAULT_PAGE_TITLE } from '@/context/constants';

const play = Play({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
});

export const metadata = {
  title: {
    template: '%s | Larkon Nextjs - Responsive Admin Dashboard Template',
    default: DEFAULT_PAGE_TITLE
  },
  description: 'Bootstrap 5 based  Responsive Admin Dashboard Template'
};

/* Improved splash CSS: covers full viewport reliably and fades out */
const splashScreenStyles = `
#splash-screen {
  position: fixed;
  inset: 0; /* top:0; right:0; bottom:0; left:0 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 99999;
  opacity: 1;
  transition: opacity 0.7s ease, visibility 0.7s ease;
  visibility: visible;
  overflow: hidden;
}

#splash-screen.remove {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* optional: make the inner logo not scale weirdly */
#splash-screen .splash-logo {
  display: inline-block;
  max-width: 45%;
  width: auto;
  height: auto;
}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* inject splash CSS - suppress hydration warning to avoid server/client mismatch logging */}
        <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: splashScreenStyles }} />
        {/* small inline script to remove splash-screen after page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              // Remove splash after window load, with graceful fade
              function removeSplash() {
                try {
                  var s = document.getElementById('splash-screen');
                  if (!s) return;
                  s.classList.add('remove');
                  // remove node after animation finishes to keep DOM clean
                  setTimeout(function(){ s.parentNode && s.parentNode.removeChild(s); }, 900);
                } catch (e) { console.error('splash remove error', e); }
              }
              if (document.readyState === 'complete') {
                removeSplash();
              } else {
                window.addEventListener('load', removeSplash, { once: true });
                // fallback: remove after 6s in case load never fires
                setTimeout(removeSplash, 6000);
              }
            })();
            `
          }}
        />
      </head>

      <body className={play.className}>
        {/* Splash screen element (full viewport). It will fade then be removed by the script above. */}
        <div id="splash-screen" aria-hidden="true">
          <div className="splash-logo" role="img" aria-label="App logo">
            <Image
              alt="Logo"
              width={112}
              height={24}
              src={logoDark}
              style={{ height: 'auto', width: 'auto', maxWidth: '220px' }}
              priority
            />
          </div>
        </div>

        <NextTopLoader color="#ff6c2f" showSpinner={false} />
        <div id="__next_splash">
          <AppProvidersWrapper>{children}</AppProvidersWrapper>
        </div>
      </body>
    </html>
  );
}

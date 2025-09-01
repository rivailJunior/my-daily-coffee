import Image from 'next/image';
import Link from 'next/link';

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  pageTitle: string;
  pageDescription: string;
  showFooterLink?: boolean;
  footerLinkText?: string;
  footerLinkHref?: string;
  footerLinkLabel?: string;
}

export function AuthLayout({
  title,
  description,
  children,
  pageTitle,
  pageDescription,
  showFooterLink = false,
  footerLinkText,
  footerLinkHref,
  footerLinkLabel,
}: AuthLayoutProps) {
  return (
    <main className='min-h-screen bg-white'>
      {/* Mobile Header with Image */}
      <div className='lg:hidden w-full h-48 sm:h-64 relative'>
        <div className='absolute inset-0 bg-black/30 z-10' />
        <Image
          src='/images/coffee-beans-bg.jpg'
          alt='Coffee beans background'
          fill
          className='object-cover'
          priority
        />
        <div className='relative z-20 p-6 h-full flex flex-col justify-end'>
          <Link href='/' className='text-xl font-bold text-white mb-2'>
            My Daily Coffee
          </Link>
          <h1 className='text-2xl font-bold text-white'>{title}</h1>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row min-h-0 lg:min-h-screen'>
        {/* Desktop Left side with background image - Hidden on mobile */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-gray-50 relative '>
          <div className='absolute inset-0 bg-black/30 z-10' />
          <Image
            src='/images/coffee-beans-bg.jpg'
            alt='Coffee beans background'
            fill
            className='object-cover'
            priority
          />
          <div className='relative z-20 flex flex-col justify-between p-12 w-full'>
            <Link href='/' className='text-2xl font-bold text-white'>
              My Daily Coffee
            </Link>
            <div className='text-white'>
              <h1 className='text-4xl font-bold mb-4'>{title}</h1>
              <p className='text-gray-200 max-w-md'>{description}</p>
            </div>
          </div>
        </div>

        {/* Right side with form */}
        <div className='w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 dark:bg-coffee-navy'>
          <div className='w-full max-w-md'>
            {/* Mobile header */}
            <div className='lg:hidden mb-8 text-center'>
              <h1 className='text-2xl font-bold text-white mb-2'>
                {pageTitle}
              </h1>
              <p className='text-white text-sm'>{pageDescription}</p>
            </div>

            {/* Form Content */}
            <div>
              {children}

              {showFooterLink &&
                footerLinkText &&
                footerLinkHref &&
                footerLinkLabel && (
                  <div className='mt-6 text-center text-sm text-black dark:text-white'>
                    <p>
                      {footerLinkText}{' '}
                      <Link
                        href={footerLinkHref}
                        className='font-medium text-blue-400 hover:text-blue-500'
                      >
                        {footerLinkLabel}
                      </Link>
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

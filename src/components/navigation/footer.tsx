'use client';
import { Github, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function Footer() {
  return (
    <footer className='bg-white dark:bg-coffee-navy relative'>
      <div className='mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8'>
        <div className='md:flex md:justify-between'>
          <div className='mb-6 md:mb-0'>
            <Link href='https://flowbite.com/' className='flex items-center'>
              {/* <img
                src='https://flowbite.com/docs/images/logo.svg'
                className='h-8 me-3'
                alt='FlowBite Logo'
              /> */}
              <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
                My Daily Coffee
              </span>
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3'>
            <div>
              <h2 className='mb-6 text-sm font-medium text-gray-900 uppercase dark:text-white'>
                Resources
              </h2>
              <ul className='text-gray-500 dark:text-gray-400 font-light'>
                <li className='mb-4'>
                  <Link href='/' className='hover:underline'>
                    Home
                  </Link>
                </li>
                <li className='mb-4'>
                  <Link
                    href='/brewing-assistant/recipes'
                    className='hover:underline'
                  >
                    Recipes
                  </Link>
                </li>
                <li className='mb-4'>
                  <Link href='/grinders' className='hover:underline'>
                    Grinders
                  </Link>
                </li>
                <li className='mb-4'>
                  <Link
                    href='/manual-brewing-methods'
                    className='hover:underline'
                  >
                    Manual Brewing Methods
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className='mb-6 text-sm font-medium text-gray-900 uppercase dark:text-white'>
                Follow us
              </h2>
              <ul className='text-gray-500 dark:text-gray-400 font-light'>
                <li className='mb-4'>
                  <Link
                    href='https://github.com/rivailJunior'
                    className='hover:underline '
                  >
                    Github
                  </Link>
                </li>
                <li className='mb-4'>
                  <Link
                    href='https://www.instagram.com/rivailpinto/'
                    className='hover:underline '
                  >
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className='mb-6 text-sm font-medium text-gray-900 uppercase dark:text-white'>
                Legal
              </h2>
              <ul className='text-gray-500 dark:text-gray-400 font-light'>
                <li className='mb-4'>
                  <Link href='#' className='hover:underline'>
                    Privacy Policy
                  </Link>
                </li>
                <li className='mb-4'>
                  <Link href='#' className='hover:underline'>
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className='my-6 border-gray-200 sm:mx-auto dark:border-gray-800 lg:my-8' />
        <div className='sm:flex sm:items-center sm:justify-between'>
          <span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
            © 2025{' '}
            <Link
              href='https://mydailycoffee.rivailjunior.com/'
              className='hover:underline'
            >
              MyDailyCoffee
            </Link>
            . All Rights Reserved.
          </span>
          <div className='flex mt-4 sm:justify-center sm:mt-0'>
            <Link
              href='https://x.com/rivaildossantos'
              className='text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5'
            >
              <Twitter />
              <span className='sr-only'>X page</span>
            </Link>
            <Link
              href='https://github.com/rivailJunior'
              className='text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5'
            >
              <Github />
              <span className='sr-only'>GitHub account</span>
            </Link>

            <Link
              href='https://www.instagram.com/rivailpinto/'
              className='text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5'
            >
              <Instagram />
              <span className='sr-only'>Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

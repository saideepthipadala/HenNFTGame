import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Home', href: '/', current: true },
    { name: 'HenTrade', href: '/market', current: false },
    { name: 'BreedOn', href: '/henBreeding', current: false },
    { name: 'Races', href: '/henRacing', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'rounded-md px-3 py-2 text-sm font-medium'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <button
                                    type="button"
                                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                </button>

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" id="account" className="h-7 w-7 rounded-full">
                                                <path
                                                    d="M25 1C11.767 1 1 11.767 1 25c0 7.091 3.094 13.472 8 17.869v.017l.348.3c.061.053.128.097.19.149a24.496 24.496 0 0 0 3.189 2.279c.085.051.172.099.257.148.557.324 1.126.629 1.71.908l.018.008a23.838 23.838 0 0 0 3.915 1.456l.075.021c.641.175 1.293.322 1.954.443l.185.033a24.17 24.17 0 0 0 1.939.262c.075.007.15.011.224.017.659.055 1.323.09 1.996.09s1.337-.035 1.996-.09c.075-.006.15-.01.224-.017.655-.06 1.301-.15 1.939-.262l.185-.033a23.451 23.451 0 0 0 1.954-.443l.075-.021a23.838 23.838 0 0 0 3.915-1.456l.018-.008a24.261 24.261 0 0 0 1.71-.908c.086-.05.172-.097.257-.148a24.123 24.123 0 0 0 1.487-.968c.124-.087.248-.174.371-.264.456-.334.9-.683 1.331-1.047.062-.052.129-.096.19-.149l.348-.3v-.017c4.906-4.398 8-10.778 8-17.869C49 11.767 38.233 1 25 1zm0 24c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm3 2c6.065 0 11 4.935 11 11v3.958c-.042.035-.086.067-.128.102-.395.321-.8.626-1.214.918-.092.065-.182.132-.274.195-.447.305-.906.591-1.373.862l-.257.148a21.799 21.799 0 0 1-6.871 2.468l-.171.031a22.27 22.27 0 0 1-1.715.225c-.079.007-.159.012-.239.018-.583.045-1.169.075-1.758.075s-1.175-.03-1.758-.077l-.239-.018a21.789 21.789 0 0 1-1.886-.256 22.013 22.013 0 0 1-5.212-1.626l-.161-.073a21.799 21.799 0 0 1-1.755-.917c-.467-.27-.926-.557-1.373-.862-.093-.063-.183-.13-.274-.195a21.826 21.826 0 0 1-1.214-.918c-.042-.034-.086-.067-.128-.102V38c0-6.065 4.935-11 11-11h6zm13 13.076V38c0-6.271-4.464-11.519-10.38-12.735A9.996 9.996 0 0 0 35 17c0-5.514-4.486-10-10-10s-10 4.486-10 10a9.996 9.996 0 0 0 4.38 8.265C13.464 26.481 9 31.729 9 38v2.076C5.284 36.135 3 30.831 3 25 3 12.869 12.869 3 25 3s22 9.869 22 22c0 5.831-2.284 11.135-6 15.076z"
                                                    fill="#fff"  // Add this line to set the fill color to white
                                                ></path>
                                            </svg>
                                        </Menu.Button>

                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="/profile"
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Your Profile
                                                    </a>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="#"
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Settings
                                                    </a>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="#"
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Sign out
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

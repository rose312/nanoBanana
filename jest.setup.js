// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock framer-motion for tests
jest.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: {
      div: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref })),
      button: React.forwardRef((props, ref) => React.createElement('button', { ...props, ref })),
      section: React.forwardRef((props, ref) => React.createElement('section', { ...props, ref })),
      span: React.forwardRef((props, ref) => React.createElement('span', { ...props, ref })),
      a: React.forwardRef((props, ref) => React.createElement('a', { ...props, ref })),
    },
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => false,
  }
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

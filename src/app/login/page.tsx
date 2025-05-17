import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Login - My Daily Coffee',
  description: 'Sign in to your My Daily Coffee account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-block p-2 rounded-full bg-primary/10 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary h-10 w-10"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Daily Coffee</h1>
          <p className="text-muted-foreground">
            Your personal coffee brewing assistant
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

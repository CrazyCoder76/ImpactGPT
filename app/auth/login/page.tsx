import LoginForm from '@/components/auth/login-form'
import { auth, signIn } from '@/auth';
import LoginWithGoogle from '@/components/auth/login-google-button';
import LoginWithAzureAD from '@/components/auth/login-google-azure-ad';
// import { auth } from '@/auth'
// import { Session } from '@/lib/types'
// import { redirect } from 'next/navigation'

export default async function LoginPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = await auth();
  const { error } = searchParams;

  return (
    <main className="flex flex-col p-4 h-screen justify-center items-center gap-2 space-y-3">
      {
        error === "AuthorizedCallbackError" &&
        <div className="w-full md:w-96 bg-red-100 border border-red-500 text-red-500 p-3 px-4 rounded-lg">You are not a member of this team</div>
      }
      <div className="w-full rounded-lg border bg-white px-6 pb-4 pt-8 shadow-md md:w-96 dark:bg-zinc-950">
        <h1 className="mb-6 text-2xl font-bold text-center">Login to ImpactGPT</h1>

        <form
          action={async () => {
            'use server';
            await signIn('google', { redirect: true });
          }}
        >
          <LoginWithGoogle />
        </form>
        {/* <form
          className='mt-2'
          action={async () => {
            'use server';
            await signIn('google', { redirect: true });
          }}
        >
          <LoginWithAzureAD />
        </form> */}

        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200">
            </div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400">
              Or
            </span>
          </div>
        </div>

        <LoginForm userId={session?.user?.id} />

      </div>
    </main>
  )
}

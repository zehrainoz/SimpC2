import RegisterForm from "@/components/register-form"

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="mt-2 text-gray-600">Sign up to get started</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  )
}

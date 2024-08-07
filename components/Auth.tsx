import AuthForm from './AuthForm'

export default function Auth() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-orange-700 text-center">Friendly Chat</h1>
        <AuthForm />
      </div>
    </div>
  )
}

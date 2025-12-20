import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useRoutes } from "react-router-dom"
import { Toaster } from "sonner"
import routes from "~react-pages"
import Middleware_All from "./components/meta/Middleware-All"

function ErrorFallback({ error, resetErrorBoundary }) {
  return <>
    <div>
      <h1>Something went wrong!</h1>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  </>
}

export default function AppRoot() {
  return <>
    <Toaster richColors/>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<></>}>
        <Middleware_All>
          {useRoutes(routes)}
        </Middleware_All>
      </Suspense>
    </ErrorBoundary>
  </>
}

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useRoutes } from "react-router-dom"
import { Toaster } from "sonner"
import routes from "~react-pages"
import Middleware_All from "./components/meta/Middleware-All"
import SideClientIssue from "./components/layout/SideClientIssue"
import LoadingMiddleware from "./components/layout/LoadingMiddlware"

export default function AppRoot() {
  return <>
    <Toaster richColors position="top-center"/>
    <ErrorBoundary FallbackComponent={SideClientIssue}>
      <Suspense fallback={<LoadingMiddleware />}>
        <Middleware_All>
          {useRoutes(routes)}
        </Middleware_All>
      </Suspense>
    </ErrorBoundary>
  </>
}

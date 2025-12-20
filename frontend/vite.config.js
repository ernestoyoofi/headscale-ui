import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import vitePage from "vite-plugin-pages"
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vitePage({
      extensions: ["js","ts","jsx","tsx"],
      importMode: "async",
      dirs: [
        {
          dir: "src/page",
          baseRoute: ""
        },
      ],
      exclude: [
        "**/!(page).js",
        "**/!(page).ts",
        "**/!(page).jsx",
        "**/!(page).tsx",
      ],
      onRoutesGenerated: (routes) => {
        const fixRoutes = (list) => {
          return list.map((route) => {
            if(route.path === "page") {
              route.path = ""
            }
            else if(route.path.endsWith("/page")) {
              route.path = route.path.replace(/\/page$/, "")
            }
            if(route.children) {
              route.children = fixRoutes(route.children)
            }
            return route
          })
        }
        return fixRoutes(routes)
      },
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3050"
    }
  }
})

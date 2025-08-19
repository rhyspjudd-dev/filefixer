// Import from nextAuthConfig which handles both real OAuth and mock fallback
import { handlers } from "@/lib/nextAuthConfig"

export const { GET, POST } = handlers

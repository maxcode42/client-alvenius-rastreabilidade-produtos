import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "./auth-context";

export default function withAuth(Page) {
  return function ProtectedPage(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) return;

      if (process.env.NEXT_PUBLIC_APP_ENVIRONMENT.toLowerCase() === "true") {
        router.replace("/maintenance");
        return;
      }

      if (!user) {
        router.replace("/login");
      }
    }, [loading, user, router]);

    if (loading || !user) {
      return null;
    }

    return <Page {...props} />;
  };
}

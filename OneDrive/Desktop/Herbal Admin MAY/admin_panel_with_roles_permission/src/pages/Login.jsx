import { useAppSettings } from "../context/AppSettingsContext";
import ThemeToggle from "../components/shell/ThemeToggle";
import Login1 from "./Login1";

export default function Login() {
  const { loading } = useAppSettings();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-neutral-950">
        <p className="text-sm text-gray-500 dark:text-neutral-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[400] md:bottom-8 md:right-8">
        <ThemeToggle />
      </div>
      <Login1 />
    </>
  );
}

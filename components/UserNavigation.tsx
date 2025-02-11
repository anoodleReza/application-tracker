import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserCircle } from "lucide-react"
import { useAuth } from "@/utils/auth"
import { useRouter } from "next/navigation"

export default function UserNav() {
  const { email, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear the cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  if (loading) {
    return <div className="h-8 w-8 animate-pulse bg-gray-200 rounded" />;
  }

  // Display first part of email as name
  const displayName = email ? email.split('@')[0] : 'User';

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 flex items-center space-x-2 hover:bg-slate-100">
            <UserCircle className="h-6 w-6" />
            <span className="text-sm font-medium">{displayName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem className="flex flex-col items-start">
            <div className="text-sm font-medium">{displayName}</div>
            <div className="text-xs text-slate-500">{email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}
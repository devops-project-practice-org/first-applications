import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import LanguageToggle from "@/components/language-toggle";
import { Menu, User, Heart, Settings, LogOut, Home, Search, PlusCircle } from "lucide-react";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const logout = useLogout();
  const { language, changeLanguage } = useLanguage();

  const navItems = [
    { href: "/", label: "Buy", active: location === "/" },
    { href: "/properties", label: "Properties", active: location === "/properties" },
    { href: "/properties?listingType=rent", label: "Rent", active: false },
  ];

  const handleLogout = () => {
    logout.mutate();
    setLocation("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer">PropertyHub</h1>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        item.active
                          ? "text-primary"
                          : "text-neutral-500 hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
                {user?.role === "agent" && (
                  <Link href="/dashboard">
                    <span className="text-neutral-500 hover:text-primary px-3 py-2 text-sm font-medium transition-colors cursor-pointer">
                      Dashboard
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle currentLang={language} onLanguageChange={changeLanguage} />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage || ""} alt={user.firstName} />
                      <AvatarFallback>
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => setLocation("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/dashboard?tab=saved")}>
                    <Heart className="mr-2 h-4 w-4" />
                    Saved Properties
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/dashboard?tab=settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" className="text-neutral-500 hover:text-primary">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth?mode=register">
                  <Button className="bg-primary text-white hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {user && (
                    <div className="flex items-center space-x-3 pb-4 border-b">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.profileImage || ""} alt={user.firstName} />
                        <AvatarFallback>
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Link href="/">
                      <Button variant="ghost" className="w-full justify-start">
                        <Home className="mr-2 h-4 w-4" />
                        Home
                      </Button>
                    </Link>
                    <Link href="/properties">
                      <Button variant="ghost" className="w-full justify-start">
                        <Search className="mr-2 h-4 w-4" />
                        Properties
                      </Button>
                    </Link>
                    {user && (
                      <>
                        <Link href="/dashboard">
                          <Button variant="ghost" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Button>
                        </Link>
                        <Link href="/dashboard?tab=saved">
                          <Button variant="ghost" className="w-full justify-start">
                            <Heart className="mr-2 h-4 w-4" />
                            Saved Properties
                          </Button>
                        </Link>
                        {user.role === "agent" && (
                          <Button variant="ghost" className="w-full justify-start">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Property
                          </Button>
                        )}
                      </>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    {user ? (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Link href="/auth">
                          <Button variant="outline" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/auth?mode=register">
                          <Button className="w-full bg-primary hover:bg-blue-700">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, useLogin, useRegister } from "@/hooks/use-auth";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";

const registerFormSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Auth() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const login = useLogin();
  const register = useRegister();
  
  // Parse mode from URL params
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  const [mode, setMode] = useState<"login" | "register">(
    urlParams.get("mode") === "register" ? "register" : "login"
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  // Update URL when mode changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (mode === "register") {
      params.set("mode", "register");
    }
    const newUrl = params.toString() ? `/auth?${params.toString()}` : "/auth";
    if (location !== newUrl) {
      window.history.replaceState({}, "", newUrl);
    }
  }, [mode, location]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "user",
      phone: "",
      agreeToTerms: false,
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    const { confirmPassword, agreeToTerms, ...userData } = data;
    register.mutate(userData);
  };

  if (user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <section className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-neutral-800 mb-2">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <p className="text-neutral-600">
                {mode === "login" 
                  ? "Sign in to your PropertyHub account" 
                  : "Join PropertyHub and find your dream home"
                }
              </p>
            </CardHeader>
            
            <CardContent>
              {mode === "login" ? (
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...loginForm.register("email")}
                      className="mt-2"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...loginForm.register("password")}
                      className="mt-2"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm text-neutral-600">
                        Remember me
                      </Label>
                    </div>
                    <Button variant="link" className="p-0 h-auto text-sm text-primary hover:text-blue-700">
                      Forgot password?
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={login.isPending}
                  >
                    {login.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        {...registerForm.register("firstName")}
                        className="mt-2"
                      />
                      {registerForm.formState.errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">
                          {registerForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        {...registerForm.register("lastName")}
                        className="mt-2"
                      />
                      {registerForm.formState.errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">
                          {registerForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="registerEmail">Email Address</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="Enter your email"
                      {...registerForm.register("email")}
                      className="mt-2"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      {...registerForm.register("phone")}
                      className="mt-2"
                    />
                    {registerForm.formState.errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="registerPassword">Password</Label>
                    <Input
                      id="registerPassword"
                      type="password"
                      placeholder="Create a password"
                      {...registerForm.register("password")}
                      className="mt-2"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      {...registerForm.register("confirmPassword")}
                      className="mt-2"
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Account Type</Label>
                    <Select
                      value={registerForm.watch("role")}
                      onValueChange={(value) => registerForm.setValue("role", value as "user" | "agent")}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Home Buyer/Renter</SelectItem>
                        <SelectItem value="agent">Real Estate Agent</SelectItem>
                      </SelectContent>
                    </Select>
                    {registerForm.formState.errors.role && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.role.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={registerForm.watch("agreeToTerms")}
                      onCheckedChange={(checked) => 
                        registerForm.setValue("agreeToTerms", checked as boolean)
                      }
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm text-neutral-600">
                      I agree to the{" "}
                      <Button variant="link" className="p-0 h-auto text-primary hover:text-blue-700">
                        Terms of Service
                      </Button>
                      {" "}and{" "}
                      <Button variant="link" className="p-0 h-auto text-primary hover:text-blue-700">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>
                  {registerForm.formState.errors.agreeToTerms && (
                    <p className="text-sm text-red-600">
                      {registerForm.formState.errors.agreeToTerms.message}
                    </p>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={register.isPending}
                  >
                    {register.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              )}
              
              <div className="mt-6 text-center">
                <p className="text-neutral-600">
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary hover:text-blue-700 font-medium"
                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                  >
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

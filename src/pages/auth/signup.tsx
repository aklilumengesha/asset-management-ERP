import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout } from "@/route/AuthLayout";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { authService } from '@/services/auth';
import { useInvitations } from '@/hooks/useInvitations';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [invitationData, setInvitationData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getInvitationByToken, acceptInvitation } = useInvitations();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setInvitationToken(token);
      loadInvitation(token);
    }
  }, [searchParams]);

  const loadInvitation = async (token: string) => {
    try {
      const { data, error } = await getInvitationByToken(token);
      
      if (error || !data) {
        toast({
          title: "Invalid Invitation",
          description: "This invitation link is invalid or has expired.",
          variant: "destructive",
        });
        return;
      }
      
      setInvitationData(data);
      setEmail(data.email);
      
      toast({
        title: "Invitation Found",
        description: `You've been invited as ${data.role?.display_name}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error loading invitation:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!email || email.trim() === '') {
      toast({
        title: "Email Required",
        description: "Please provide a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.signup({
        first_name: firstName,
        last_name: lastName,
        email: email.trim(),
        password,
      }, invitationToken, invitationData);

      // Mark invitation as accepted if signup was via invitation
      if (invitationToken && result.access_token) {
        await acceptInvitation(invitationToken);
      }

      if (result.requiresEmailConfirmation) {
        toast({
          title: "Check your email!",
          description: result.message || "Please check your email to confirm your account before logging in.",
          variant: "default",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const title = result.isFirstUser ? "Super Admin Account Created!" : invitationData ? "Account created with invited role!" : "Account created!";
        const description = result.isFirstUser 
          ? "You are now the Super Admin with full system access."
          : invitationData 
            ? `Your account has been created as ${invitationData.role?.display_name}.`
            : "Your account has been successfully created.";
        
        toast({
          title,
          description,
          variant: "default",
        });
        navigate("/login");
      }
    } catch (error: any) {
      let errorMessage = error.response?.data?.detail || "Failed to create account. Please try again.";
      let errorTitle = "Signup Failed";
      
      // Handle specific error cases
      if (errorMessage.includes('rate limit')) {
        errorTitle = "Rate Limit Reached";
        errorMessage = "Too many signup attempts from your network. Please wait 1 hour, or go to your Supabase dashboard → Authentication → Rate Limits to increase the limit for development.";
      } else if (errorMessage.includes('already registered') || errorMessage.includes('already been registered')) {
        errorTitle = "Email Already Registered";
        errorMessage = "This email is already registered. Please try logging in instead.";
      } else if (errorMessage.includes('Invalid email')) {
        errorTitle = "Invalid Email";
        errorMessage = "Please enter a valid email address.";
      } else if (errorMessage.includes('Password')) {
        errorTitle = "Weak Password";
        errorMessage = "Password must be at least 6 characters long.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        duration: 8000, // Show for 8 seconds so user can read the full message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Enter your information to get started"
    >
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="fullName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John Doe"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="John Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`h-12 ${invitationToken ? 'bg-muted cursor-not-allowed' : ''}`}
            readOnly={!!invitationToken}
          />
          {invitationData && (
            <p className="text-xs text-muted-foreground">
              Invited as {invitationData.role?.display_name}
              {invitationData.department && ` in ${invitationData.department.name}`}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 pr-10"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters long
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-2 py-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => {
              setAcceptTerms(checked as boolean);
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the Terms of Service and Privacy Policy
            </label>
            <p className="text-sm text-muted-foreground">
              By creating an account, you agree to our terms and conditions.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-md font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
              Creating account...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Create account
            </div>
          )}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-12"
          type="button"
          onClick={() => navigate("/login")}
        >
          Sign in instead
        </Button>
      </motion.form>
    </AuthLayout>
  );
};

export default Signup;

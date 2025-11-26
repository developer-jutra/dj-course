
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50"
      >
        <source src="/deliveroo-background.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 flex min-h-screen items-center justify-center bg-black/20 p-4">
        <div className="w-full max-w-xl">
          <Card className="shadow-2xl rounded-2xl border-white/20 bg-white/10 backdrop-blur-lg">
            <CardHeader className="text-center">
              <div className="text-center">
                <img src="/deliveroo-logo.png" alt="Deliveroo Logo" className="w-48 mx-auto" />
              </div>
              <CardTitle className="text-3xl font-semibold text-white">Transportation Management System</CardTitle>
              <CardDescription className="pt-2 text-gray-300">
                Sign in to access your logistics dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-lg border-white/30 bg-white/20 text-white placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-lg border-white/30 bg-white/20 text-white placeholder:text-gray-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 w-full rounded-lg bg-blue-600 text-lg hover:bg-blue-700"
                  disabled={isLogging}
                >
                  {isLogging ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-gray-300">
                <p>Demo: Use any email and password to login</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;

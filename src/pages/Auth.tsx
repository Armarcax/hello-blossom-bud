import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Սխալ էլ․ հասցե կամ գաղտնաբառ');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Բարի գալուստ!');
          navigate('/');
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Այս էլ․ հասցեն արդեն գրանցված է');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Գրանցումը հաջողված է! Խնդրում ենք մուտք գործել');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast.error('Սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[var(--gradient-background)] pointer-events-none" />
      <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
      
      <Card className="w-full max-w-md mx-4 relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--armenia-red))] via-[hsl(var(--armenia-blue))] to-[hsl(var(--armenia-orange))]">
            {isLogin ? 'Մուտք' : 'Գրանցում'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? 'Մուտք գործեք ձեր հաշիվ' : 'Ստեղծեք նոր հաշիվ'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Անուն Ազգանուն</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Անուն Ազգանուն"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Էլ․ հասցե</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Գաղտնաբառ</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Խնդրում ենք սպասել...' : isLogin ? 'Մուտք' : 'Գրանցվել'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              type="button"
            >
              {isLogin ? 'Չունե՞ք հաշիվ: Գրանցվեք' : 'Արդեն ունե՞ք հաշիվ: Մուտք գործեք'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

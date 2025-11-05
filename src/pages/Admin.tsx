import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  roles: string[];
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Դուք չունեք ադմինիստրատորի իրավունքներ');
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: roles?.filter(r => r.user_id === profile.id).map(r => r.role) || [],
      })) || [];

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast.error('Սխալ օգտատերերի բեռնման ժամանակ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (error) throw error;

      toast.success('Օգտատերը դարձավ ադմինիստրատոր');
      fetchUsers();
    } catch (error: any) {
      toast.error('Սխալ: ' + error.message);
    }
  };

  if (authLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--gradient-background)] pointer-events-none" />
      <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--armenia-red))] via-[hsl(var(--armenia-blue))] to-[hsl(var(--armenia-orange))]">
              Ադմինիստրատորի Վահանակ
            </h1>
            <Button onClick={() => navigate('/')} variant="outline">
              Գլխավոր էջ
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Օգտատերեր</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Բեռնվում է...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Էլ․ հասցե</TableHead>
                      <TableHead>Անուն</TableHead>
                      <TableHead>Ռոլեր</TableHead>
                      <TableHead>Գրանցված</TableHead>
                      <TableHead>Գործողություններ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.full_name || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.roles.map(role => (
                              <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'}>
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('hy-AM')}
                        </TableCell>
                        <TableCell>
                          {!user.roles.includes('admin') && (
                            <Button
                              size="sm"
                              onClick={() => makeAdmin(user.id)}
                            >
                              Դարձնել ադմին
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

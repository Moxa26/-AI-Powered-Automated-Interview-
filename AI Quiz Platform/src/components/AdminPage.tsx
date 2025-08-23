import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Stack,
  Pagination,
  InputAdornment,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search, UserPlus, Edit, Trash2 } from 'lucide-react';

interface AdminUser {
  id: string;
  username: string;
  password: string;
}

export const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
  });

  // Sample data for demonstration
  useEffect(() => {
    const sampleUsers: AdminUser[] = [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
      },
      {
        id: '2',
        username: 'Jeminee',
        password: 'Admin@123',
      },
      {
        id: '3',
        username: 'john_doe',
        password: 'password123',
      },
      {
        id: '4',
        username: 'jane_smith',
        password: 'mypassword',
      },
      {
        id: '5',
        username: 'bob_wilson',
        password: 'securepass',
      },
      {
        id: '6',
        username: 'alice_brown',
        password: 'alicepass',
      },
      {
        id: '7',
        username: 'charlie_davis',
        password: 'charlie2024',
      },
      {
        id: '8',
        username: 'diana_clark',
        password: 'diana123',
      },
      {
        id: '9',
        username: 'edward_taylor',
        password: 'edward456',
      },
      {
        id: '10',
        username: 'fiona_white',
        password: 'fiona789',
      },
    ];
    setUsers(sampleUsers);
  }, []);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    
    return users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setNewUser({
      username: '',
      password: '',
    });
    setOpenDialog(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setNewUser({
      username: user.username,
      password: user.password,
    });
    setOpenDialog(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    }
  };

  const handleSaveUser = () => {
    if (!newUser.username || !newUser.password) {
      alert('Username and password are required');
      return;
    }

    if (editingUser) {
      // Update existing user
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === editingUser.id
            ? {
                ...user,
                username: newUser.username,
                password: newUser.password,
              }
            : user
        )
      );
    } else {
      // Add new user
      const newUserData: AdminUser = {
        id: Date.now().toString(),
        username: newUser.username,
        password: newUser.password,
      };
      setUsers(prevUsers => [...prevUsers, newUserData]);
    }

    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  return (
    <Box>
      <Stack spacing={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage users and their permissions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<UserPlus size={20} />}
            onClick={handleAddUser}
            sx={{
              bgcolor: '#2563eb',
              '&:hover': { bgcolor: '#1d4ed8' },
            }}
          >
            Add User
          </Button>
        </Box>

        {/* Search and Stats */}
        <Card sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <TextField
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            <Stack direction="row" spacing={2}>
              <Chip label={`Total: ${users.length}`} variant="outlined" />
            </Stack>
          </Stack>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Password</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {user.username}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {'•'.repeat(user.password.length)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditUser(user)}
                            sx={{ color: '#2563eb' }}
                          >
                            <Edit size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteUser(user.id)}
                            sx={{ color: '#dc2626' }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" p={2}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser}>
            {editingUser ? 'Update' : 'Add'} User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
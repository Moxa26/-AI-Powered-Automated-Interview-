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
  InputAdornment,
  Chip,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Search, Users, BookOpen, Target, UserPlus, Code2 } from 'lucide-react';
import { AuthService } from '../services/authService';
import type { CreateUserRequest } from '../types/auth';
import { SOFTWARE_TOPICS, SoftwareEngineeringTopic } from '../types/quiz';
import { useLanguage } from '../contexts/LanguageContext';
import { EnhancedLoader, StatsSkeletonLoader, TableSkeletonLoader } from './EnhancedLoader';
import { EnhancedPagination } from './EnhancedPagination';

interface QuizData {
  user_id: number;
  username: string;
  quiz_topic: string;
  quiz_difficulty: string;
  quiz_question_type: string;
  number_of_questions: number;
  created_at: string;
}

export const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    username: '',
    password: '',
    topic: [], // Changed to array for multiple selection
    difficulty: '',
    question_type: '',
    number_of_questions: 5
  });

  // Fetch quiz data on component mount
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await AuthService.getQuizByUsers();
        setQuizzes(data);
      } catch (error) {
        console.error('Failed to fetch quiz data:', error);
        setError('Failed to load quiz data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [t]);

  // Filter quizzes based on search query
  const filteredQuizzes = useMemo(() => {
    if (!searchQuery) return quizzes;
    
    return quizzes.filter(quiz =>
      quiz.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.quiz_topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.quiz_difficulty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.quiz_question_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [quizzes, searchQuery]);

  // Paginate filtered quizzes
  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredQuizzes.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredQuizzes, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredQuizzes.length / rowsPerPage);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleAddUser = () => {
    setNewUser({
      username: '',
      password: '',
      topic: [], // Reset as empty array
      difficulty: '',
      question_type: '',
      number_of_questions: 5
    });
    setOpenUserDialog(true);
  };

  const handleCreateUser = async () => {
    const topics = Array.isArray(newUser.topic) ? newUser.topic : [newUser.topic];
    if (!newUser.username || !newUser.password || topics.length === 0 || !newUser.difficulty || !newUser.question_type || !newUser.number_of_questions) {
      setError(t('addUser.allRequired'));
      return;
    }

    try {
      setIsCreatingUser(true);
      setError(null);
      
      // Prepare the user data for API call
      const userData = {
        ...newUser,
        topic: Array.isArray(newUser.topic) 
          ? newUser.topic.join(',') // Convert array to comma-separated string
          : newUser.topic
      };
      
      const response = await AuthService.createUserWithQuizPreferences(userData);
      
      if (response.success) {
        setOpenUserDialog(false);
        // Optionally refresh quiz data to show new user's potential quiz data
        const updatedQuizzes = await AuthService.getQuizByUsers();
        setQuizzes(updatedQuizzes);
        setError(null);
      } else {
        setError(response.message || 'Failed to create user');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create user');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setError(null);
  };

  // Get unique topics for stats
  const uniqueTopics = Array.from(new Set(quizzes.map(quiz => quiz.quiz_topic)));
  const uniqueUsers = Array.from(new Set(quizzes.map(quiz => quiz.username)));

  if (isLoading) {
    return (
      <Box>
        <Stack spacing={3}>
          {/* Header Skeleton */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight={700} color="text.primary">
                {t('admin.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('admin.description')}
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
              {t('admin.addUser')}
            </Button>
          </Box>

          {/* Stats Skeleton */}
          <StatsSkeletonLoader />

          {/* Loading Message */}
          <EnhancedLoader 
            variant="custom" 
            message={t('admin.loadingQuizzes')} 
            size="medium" 
          />

          {/* Table Skeleton */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <TableSkeletonLoader rows={5} columns={5} />
            </CardContent>
          </Card>
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {t('admin.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('admin.description')}
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
            {t('admin.addUser')}
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ p: 1, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                  <BookOpen size={24} color="#1976d2" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {quizzes.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.totalQuizzes')}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ p: 1, bgcolor: '#f3e5f5', borderRadius: 2 }}>
                  <Users size={24} color="#7b1fa2" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {uniqueUsers.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.activeUsers')}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ p: 1, bgcolor: '#e8f5e8', borderRadius: 2 }}>
                  <Target size={24} color="#388e3c" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {uniqueTopics.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.quizTopics')}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

            {/* Search and Filters */}
            <Card sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                <TextField
                  placeholder={t('admin.search')}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 400 }}
                />
                <Stack direction="row" spacing={2}>
                  <Chip label={`${t('admin.showing')}: ${filteredQuizzes.length}`} variant="outlined" />
                </Stack>
              </Stack>
            </Card>

            {/* Quiz Data Table */}
            <Card>
              <CardContent sx={{ p: 0 }}>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 600 }}>{t('admin.user')}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{t('admin.topic')}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{t('admin.difficulty')}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{t('admin.questionType')}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{t('addUser.numberOfQuestions')}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{t('admin.createdAt')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedQuizzes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                              {searchQuery ? t('admin.noResults') : t('admin.noQuizzes')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedQuizzes.map((quiz, index) => (
                          <TableRow key={`${quiz.user_id}-${index}`} hover>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Box>
                                  <Typography variant="body2" fontWeight={500}>
                                    {quiz.username}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    ID: {quiz.user_id}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={quiz.quiz_topic}
                                size="small"
                                variant="outlined"
                                sx={{ bgcolor: '#f5f5f5' }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={quiz.quiz_difficulty}
                                size="small"
                                color={getDifficultyColor(quiz.quiz_difficulty) as any}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {quiz.quiz_question_type}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="primary">
                                {quiz.number_of_questions} Questions
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(quiz.created_at)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Enhanced Pagination */}
                <EnhancedPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredQuizzes.length}
                  itemsPerPage={rowsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleRowsPerPageChange}
                  pageSizeOptions={[5, 10, 25, 50]}
                  showPageSizeSelector={true}
                  showItemCount={true}
                  showFirstLast={true}
                  size="medium"
                />
              </CardContent>
            </Card>
      </Stack>

      {/* Add User Dialog */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {t('addUser.title')}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={t('addUser.username')}
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label={t('addUser.password')}
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                fullWidth
                required
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth required>
                <InputLabel>{t('addUser.topic')}</InputLabel>
                <Select
                  multiple
                  value={Array.isArray(newUser.topic) ? newUser.topic : []}
                  label={t('addUser.topic')}
                  onChange={(e) => {
                    const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                    setNewUser({ ...newUser, topic: value });
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip 
                          key={value} 
                          label={SOFTWARE_TOPICS[value as SoftwareEngineeringTopic]?.name || value}
                          size="small"
                          sx={{ 
                            bgcolor: '#e3f2fd', 
                            color: '#1976d2',
                            '& .MuiChip-deleteIcon': {
                              color: '#1976d2'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {Object.entries(SOFTWARE_TOPICS).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Code2 size={16} />
                        <Box>
                          <Typography variant="body1">{value.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {value.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>{t('addUser.difficulty')}</InputLabel>
                <Select
                  value={newUser.difficulty}
                  label={t('addUser.difficulty')}
                  onChange={(e) => setNewUser({ ...newUser, difficulty: e.target.value })}
                >
                  <MenuItem value="easy">{t('difficulty.easy')}</MenuItem>
                  <MenuItem value="medium">{t('difficulty.medium')}</MenuItem>
                  <MenuItem value="hard">{t('difficulty.hard')}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <FormControl fullWidth required>
              <InputLabel>{t('addUser.questionType')}</InputLabel>
              <Select
                value={newUser.question_type}
                label={t('addUser.questionType')}
                onChange={(e) => setNewUser({ ...newUser, question_type: e.target.value })}
              >
                <MenuItem value="mixed">{t('questionType.mixed')}</MenuItem>
                <MenuItem value="multiple-choice">{t('questionType.multipleChoice')}</MenuItem>
                <MenuItem value="code-input">{t('questionType.codeInput')}</MenuItem>
                <MenuItem value="true-false">{t('questionType.trueFalse')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>{t('addUser.numberOfQuestions')}</InputLabel>
              <Select
                value={newUser.number_of_questions}
                label={t('addUser.numberOfQuestions')}
                onChange={(e) => setNewUser({ ...newUser, number_of_questions: Number(e.target.value) })}
              >
                <MenuItem value={5}>5 Questions</MenuItem>
                <MenuItem value={10}>10 Questions</MenuItem>
                <MenuItem value={15}>15 Questions</MenuItem>
                <MenuItem value={20}>20 Questions</MenuItem>
                <MenuItem value={25}>25 Questions</MenuItem>
                <MenuItem value={30}>30 Questions</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>{t('addUser.cancel')}</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateUser}
            disabled={isCreatingUser}
          >
            {isCreatingUser ? t('addUser.creating') : t('addUser.create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
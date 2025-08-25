import React from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  Stack,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material';
import { Loader2, Database, Users, BookOpen } from 'lucide-react';

interface LoaderProps {
  variant?: 'circular' | 'linear' | 'skeleton' | 'custom';
  size?: 'small' | 'medium' | 'large';
  message?: string;
  showIcon?: boolean;
  fullscreen?: boolean;
  overlay?: boolean;
  progress?: number; // 0-100 for linear progress
}

export const EnhancedLoader: React.FC<LoaderProps> = ({
  variant = 'circular',
  size = 'medium',
  message,
  showIcon = true,
  fullscreen = false,
  overlay = false,
  progress,
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 64;
      default:
        return 40;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const renderLoader = () => {
    switch (variant) {
      case 'linear':
        return (
          <Box width="100%">
            {message && (
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                {showIcon && <Loader2 className="animate-spin" size={getIconSize()} />}
                <Typography variant="body2" color="text.secondary">
                  {message}
                </Typography>
              </Stack>
            )}
            <LinearProgress 
              variant={progress !== undefined ? "determinate" : "indeterminate"}
              value={progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
            {progress !== undefined && (
              <Box mt={1} textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  {Math.round(progress)}%
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 'skeleton':
        return (
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={60} />
            <Stack direction="row" spacing={2}>
              <Skeleton variant="circular" width={40} height={40} />
              <Stack spacing={1} flex={1}>
                <Skeleton variant="text" height={20} width="60%" />
                <Skeleton variant="text" height={16} width="40%" />
              </Stack>
            </Stack>
            <Skeleton variant="rectangular" height={40} />
          </Stack>
        );

      case 'custom':
        return (
          <Card sx={{ maxWidth: 400, mx: 'auto' }}>
            <CardContent>
              <Stack alignItems="center" spacing={3}>
                <Box position="relative">
                  <CircularProgress
                    size={getSizeValue()}
                    thickness={4}
                    sx={{ color: '#2563eb' }}
                  />
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Database size={getIconSize()} color="#2563eb" />
                  </Box>
                </Box>
                <Stack alignItems="center" spacing={1}>
                  <Typography variant="h6" fontWeight={600}>
                    {message || 'Loading...'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Please wait while we fetch your data
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        );

      default: // circular
        return (
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={getSizeValue()} thickness={4} />
            {message && (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {message}
              </Typography>
            )}
          </Stack>
        );
    }
  };

  const loaderContent = renderLoader();

  if (fullscreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={overlay ? 'rgba(255, 255, 255, 0.9)' : 'background.default'}
        zIndex={9999}
      >
        {loaderContent}
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight={variant === 'skeleton' ? 'auto' : '200px'}
      p={2}
    >
      {loaderContent}
    </Box>
  );
};

// Table skeleton loader for data tables
export const TableSkeletonLoader: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 5,
}) => {
  return (
    <Stack spacing={1}>
      {/* Header */}
      <Stack direction="row" spacing={2} p={2} bgcolor="#f8fafc">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} variant="text" height={24} width={`${20 + Math.random() * 30}%`} />
        ))}
      </Stack>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Stack key={`row-${rowIndex}`} direction="row" spacing={2} p={2}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" height={20} width={`${15 + Math.random() * 40}%`} />
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

// Stats skeleton loader for dashboard cards
export const StatsSkeletonLoader: React.FC = () => {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={`stat-${index}`} sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box flex={1}>
                <Skeleton variant="text" height={28} width="60%" />
                <Skeleton variant="text" height={20} width="80%" />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};
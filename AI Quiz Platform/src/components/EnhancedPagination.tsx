import React from 'react';
import {
  Box,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  SelectChangeEvent,
} from '@mui/material';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';

interface EnhancedPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showItemCount?: boolean;
  showFirstLast?: boolean;
  variant?: 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const EnhancedPagination: React.FC<EnhancedPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [5, 10, 25, 50, 100],
  showPageSizeSelector = true,
  showItemCount = true,
  showFirstLast = true,
  variant = 'outlined',
  size = 'medium',
  color = 'primary',
  disabled = false,
}) => {
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newItemsPerPage = event.target.value as number;
    onItemsPerPageChange(newItemsPerPage);
    // Reset to first page when changing page size
    onPageChange(1);
  };

  const goToFirstPage = () => onPageChange(1);
  const goToLastPage = () => onPageChange(totalPages);
  const goToPreviousPage = () => onPageChange(Math.max(1, currentPage - 1));
  const goToNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1));

  if (totalPages <= 1 && !showItemCount && !showPageSizeSelector) {
    return null;
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        p={2}
      >
        {/* Items count and page size selector */}
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          {showItemCount && (
            <Typography variant="body2" color="text.secondary">
              Showing {totalItems === 0 ? 0 : startItem}-{endItem} of {totalItems} items
            </Typography>
          )}
          
          {showPageSizeSelector && totalItems > Math.min(...pageSizeOptions) && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Rows per page:
              </Typography>
              <FormControl size="small" variant="outlined">
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  disabled={disabled}
                  sx={{ minWidth: 70 }}
                >
                  {pageSizeOptions
                    .filter(option => option <= totalItems || option === itemsPerPage)
                    .map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Stack>
          )}
        </Stack>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <Stack direction="row" alignItems="center" spacing={1}>
            {showFirstLast && (
              <Tooltip title="First page">
                <span>
                  <IconButton
                    onClick={goToFirstPage}
                    disabled={disabled || currentPage === 1}
                    size={size}
                  >
                    <ChevronFirst size={size === 'small' ? 16 : 20} />
                  </IconButton>
                </span>
              </Tooltip>
            )}

            <Tooltip title="Previous page">
              <span>
                <IconButton
                  onClick={goToPreviousPage}
                  disabled={disabled || currentPage === 1}
                  size={size}
                >
                  <ChevronLeft size={size === 'small' ? 16 : 20} />
                </IconButton>
              </span>
            </Tooltip>

            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant={variant}
              color={color}
              size={size}
              disabled={disabled}
              showFirstButton={false}
              showLastButton={false}
              siblingCount={1}
              boundaryCount={1}
            />

            <Tooltip title="Next page">
              <span>
                <IconButton
                  onClick={goToNextPage}
                  disabled={disabled || currentPage === totalPages}
                  size={size}
                >
                  <ChevronRight size={size === 'small' ? 16 : 20} />
                </IconButton>
              </span>
            </Tooltip>

            {showFirstLast && (
              <Tooltip title="Last page">
                <span>
                  <IconButton
                    onClick={goToLastPage}
                    disabled={disabled || currentPage === totalPages}
                    size={size}
                  >
                    <ChevronLast size={size === 'small' ? 16 : 20} />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};
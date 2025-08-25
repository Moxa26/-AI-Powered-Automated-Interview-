import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { Globe } from 'lucide-react';
import { useLanguage, SupportedLanguage } from '../contexts/LanguageContext';

interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

interface LanguageSelectorProps {
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  showLabel?: boolean;
  minimal?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'outlined',
  size = 'small',
  showLabel = false,
  minimal = false,
}) => {
  const { currentLanguage, setLanguage, t } = useLanguage();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value as SupportedLanguage);
  };

  const currentOption = LANGUAGE_OPTIONS.find(option => option.code === currentLanguage);

  if (minimal) {
    return (
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        variant={variant}
        size={size}
        sx={{
          minWidth: 120,
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          },
        }}
        renderValue={(value) => {
          const option = LANGUAGE_OPTIONS.find(opt => opt.code === value);
          return (
            <Box display="flex" alignItems="center" gap={1}>
              <span style={{ fontSize: '1.2em' }}>{option?.flag}</span>
              <Typography variant="body2">{option?.code.toUpperCase()}</Typography>
            </Box>
          );
        }}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <MenuItem key={option.code} value={option.code}>
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <span style={{ fontSize: '1.5em' }}>{option.flag}</span>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {option.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.nativeName}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
    );
  }

  return (
    <FormControl variant={variant} size={size} sx={{ minWidth: 150 }}>
      {showLabel && (
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Globe size={16} />
          <Typography variant="caption" color="text.secondary">
            {t('common.language')}
          </Typography>
        </Box>
      )}
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          },
        }}
        renderValue={(value) => (
          <Box display="flex" alignItems="center" gap={1}>
            <span style={{ fontSize: '1.2em' }}>{currentOption?.flag}</span>
            <Typography variant="body2">{currentOption?.name}</Typography>
          </Box>
        )}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <MenuItem key={option.code} value={option.code}>
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <span style={{ fontSize: '1.5em' }}>{option.flag}</span>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {option.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.nativeName}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
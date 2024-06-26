'use client';

import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { buildUrlBookPage } from 'src/utils/url-builder';

import TextMaxLine from 'src/components/text-max-line';

import BookCover from '../book-cover/book-cover';

// ----------------------------------------------------------------------

export default function BookGridItem({ coverUrl, title, slug }) {
  return (
    <Link component={RouterLink} href={buildUrlBookPage(slug)} color="inherit" underline="none">
      <Tooltip title={title}>
        <Stack
          sx={{
            padding: 1,
            borderRadius: 2,
            border: 1,
            borderColor: 'rgba(145, 158, 171, 0.16)',
            bgcolor: 'background.default',
            '&:hover': {
              bgcolor: 'background.neutral',
            },
            alignItems: 'center',
          }}
        >
          <BookCover coverUrl={coverUrl} />
          <TextMaxLine variant="body2" line={1} sx={{ fontWeight: 'fontWeightMedium' }}>
            {title}
          </TextMaxLine>
        </Stack>
      </Tooltip>
    </Link>
  );
}

BookGridItem.propTypes = {
  coverUrl: PropTypes.string,
  title: PropTypes.string,
  slug: PropTypes.string,
};

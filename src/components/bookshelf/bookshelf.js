'use client';

import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useResponsive } from 'src/hooks/use-responsive';

import Carousel, { useCarousel, CarouselDots, CarouselArrows } from 'src/components/carousel';

import BookGridItem from '../book-item/book-grid-item';

// ----------------------------------------------------------------------

const PAGE_SIZES = [6, 3, 2];

// ----------------------------------------------------------------------

export default function Bookshelf({ title, books, excludeBookId }) {
  books = books?.filter((book) => book.id !== excludeBookId);
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const carousel = useCarousel({
    dots: !mdUp,
    slidesToShow: PAGE_SIZES[0],
    slidesToScroll: PAGE_SIZES[0],
    infinite: false,
    ...CarouselDots({
      sx: {
        mt: 8,
      },
    }),
    responsive: [
      {
        // Down md
        breakpoint: theme.breakpoints.values.md,
        settings: { slidesToShow: PAGE_SIZES[1], slidesToScroll: PAGE_SIZES[1] },
      },
      {
        // Down sm
        breakpoint: theme.breakpoints.values.sm,
        settings: { slidesToShow: PAGE_SIZES[2], slidesToScroll: PAGE_SIZES[2] },
      },
    ],
  });

  return !books || books.length === 0 ? (
    <></>
  ) : (
    <Container
      sx={{
        pl: '0px !important',
        pr: '0px !important',
        mt: 7,
        mb: 10,
        '& .slick-track': {
          ...(books?.length <= PAGE_SIZES[0] && {
            transform: 'translate3d(0, 0, 0) !important',
          }),
          minWidth: '100%',
          display: 'flex !important',
          alignItems: 'stretch',
          gap: 2,
          ml: -2,
          mr: -2,
        },
        '& .slick-slide': {
          transition: (th) =>
            th.transitions.create('background-color', {
              easing: th.transitions.easing.easeIn,
              duration: th.transitions.duration.shortest,
            }),
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems="center"
        sx={{
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          {title}
        </Typography>

        {mdUp && books?.length > PAGE_SIZES[0] && (
          <CarouselArrows
            onNext={carousel.onNext}
            onPrev={carousel.onPrev}
            flexGrow={1}
            spacing={2}
            justifyContent="flex-end"
          />
        )}
      </Stack>

      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {books.map((book) => (
          <BookGridItem
            key={book.id}
            slug={book.slug}
            coverUrl={book.coverUrl}
            title={book.title}
          />
        ))}
      </Carousel>
    </Container>
  );
}

Bookshelf.propTypes = {
  title: PropTypes.string,
  books: PropTypes.array,
  excludeBookId: PropTypes.string,
};

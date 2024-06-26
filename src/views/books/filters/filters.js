import PropTypes from 'prop-types';
import { SearchBox, RefinementList } from 'react-instantsearch';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function Filters({ open, onClose, facets }) {
  const mdUp = useResponsive('up', 'md');

  const renderContent = (
    <Stack
      spacing={3}
      alignItems="flex-start"
      sx={{
        flexShrink: 0,
        width: { xs: 1, md: 280 },
        position: 'sticky',
        top: 80,
      }}
    >
      {facets.map((facet) => (
        <Block title={facet.label} key={facet.name}>
          <RefinementList attribute={facet.name} classNames={{ root: 'checkbox-wrapper-13' }} />
        </Block>
      ))}

      <SearchBox
        classNames={{
          root: 'searchbox-root',
          form: 'searchbox-form',
          input: 'searchbox-input',
          submit: 'searchbox-submit',
          reset: 'searchbox-reset',
        }}
      />
    </Stack>
  );

  return (
    <>
      {mdUp ? (
        renderContent
      ) : (
        <Drawer
          anchor="right"
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: {
              pt: 3,
              px: 3,
              width: 280,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}

Filters.propTypes = {
  facets: PropTypes.array,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

// ----------------------------------------------------------------------

function Block({ title, children, ...other }) {
  const contentOpen = useBoolean(true);

  return (
    <Stack alignItems="flex-start" sx={{ width: 1 }} {...other}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={contentOpen.onToggle}
        sx={{ width: 1, cursor: 'pointer' }}
      >
        <Typography variant="h6">{title}</Typography>

        <Iconify
          icon={contentOpen.value ? 'carbon:subtract' : 'carbon:add'}
          sx={{ color: 'text.secondary' }}
        />
      </Stack>

      <Collapse unmountOnExit in={contentOpen.value} sx={{ px: 0.5 }}>
        {children}
      </Collapse>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

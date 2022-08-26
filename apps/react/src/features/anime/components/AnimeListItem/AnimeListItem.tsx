import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider } from '@mui/material';
import React from 'react';
import { FC, memo } from 'react';

const AnimeListItemComponent: FC = () => {
  const test = 1;
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Brunch this weekend?"
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                Ali Connors
              </Typography>
              {' — I\'ll be in your neighborhood doing errands this…'}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

export const AnimeListItem = memo(AnimeListItemComponent);

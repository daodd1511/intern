import { useAppDispatch, useAppSelector } from '@js-camp/react/store';
import { fetchUser } from '@js-camp/react/store/user/dispatchers';
import {
  selectIsUserLoading,
  selectUser,
} from '@js-camp/react/store/user/selectors';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

import { FC, memo, useEffect } from 'react';

const ProfileComponent: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsUserLoading);
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (isLoading || user === null) {
    return <div>Fetching user...</div>;
  }
  return (
    <Card sx={{ maxWidth: 345, mx: 'auto' }}>
      <CardMedia
        component="img"
        image={user.avatar ?? ''}
        alt={`${user.firstName} avatar`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {user.firstName} {user.lastName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const Profile = memo(ProfileComponent);

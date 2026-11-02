import React from 'react';
import { Appbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../stores/themeSlice';

export default function Header({ title }) {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <Appbar.Header elevated>
      <Appbar.Content title={title} />
      <Appbar.Action
        icon={isDarkMode ? 'weather-sunny' : 'weather-night'}
        onPress={() => dispatch(toggleTheme())}
      />
    </Appbar.Header>
  );
}
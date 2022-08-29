import { AnimeSort, AnimeSortDirection, AnimeSortField, AnimeType } from '@js-camp/core/models/anime/anime';
import { Box, Tabs, Tab } from '@mui/material';
import { FC, memo, SyntheticEvent, useState, useEffect } from 'react';

import { Search } from './components/Search/Search';
import { Sort } from './components/Sort/Sort';
import { Type } from './components/Type/Type';
import styles from './AnimeListControl.module.css';

interface TabPanelProps {

  /** Tab children. */
  readonly children?: React.ReactNode;

  /** Tab index. */
  readonly index: number;

  /** Tab value. */
  readonly value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2, display: 'flex' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AnimeListControlComponent: FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [sortValue, setSortValue] = useState<AnimeSort>({
    direction: AnimeSortDirection.Descending,
    field: AnimeSortField.EnglishTitle,
  });
  const [typeFilterValue, setTypeFilterValue] = useState<readonly AnimeType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const handleTabChange = (event: SyntheticEvent, newTabValue: number) => {
    setTabValue(newTabValue);
  };

  useEffect(() => {
    console.log({ sortValue, typeFilterValue, searchValue });
  }, [sortValue, typeFilterValue, searchValue]);

  return (
    <Box className={styles['anime-list-control']}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="anime control tabs" sx={{ width: '100%' }}>
          <Tab label="Sort" sx={{ flex: '1' }}/>
          <Tab label="Type" sx={{ flex: '1' }}/>
          <Tab label="Search" sx={{ flex: '1' }}/>
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Sort sortValue={sortValue} setSortValue={setSortValue}/>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Type typeValue={typeFilterValue} setTypeValue={setTypeFilterValue}/>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Search setSearchValue={setSearchValue}/>
      </TabPanel>
    </Box>
  );
};

export const AnimeListControl = memo(AnimeListControlComponent);

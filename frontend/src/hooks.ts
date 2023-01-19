import { useState } from 'react';
import { QueryParams } from '../../types';

export const useQueryParams = <Type extends QueryParams>() => {
  const [ queryParams, setQueryParams ] = useState<Type>(Object);

  const handleFilterChange = (filter: string, newValue: string) => {
    setQueryParams({ ... queryParams, [filter]: newValue});
  };

  return { queryParams, handleFilterChange };
};
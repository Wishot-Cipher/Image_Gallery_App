import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import {Photo} from './Photo';

export const SortablePhoto = ({url, index, tags}) => {
  const sortable = useSortable({id: url});
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Photo
      ref={setNodeRef}
      style={style}
      url={url} // Pass url to Photo
      index={index} // Pass index to Photo
      tags={tags} // Pass tags to Photo
      {...attributes}
      {...listeners}
    />
  );
};

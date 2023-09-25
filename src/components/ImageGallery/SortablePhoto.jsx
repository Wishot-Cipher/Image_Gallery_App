import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Photo } from "./Photo";

export const SortablePhoto = (props) => {
  const sortable = useSortable({ id: props.id });
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

  const tags = props.tags || [];

  return (
    <Photo
      ref={setNodeRef}
      style={style}
      {...props}
      {...attributes}
      {...listeners}
      tags={tags}
      image={props.image}
      isDragging={isDragging} // Pass the isDragging prop
    />
  );
};

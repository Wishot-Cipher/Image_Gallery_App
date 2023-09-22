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
    transition, // Adjust the timing value (0.2s is the dura
  };

  const tags = props.tags || [];
  console.log(tags);

  // Access the id prop
  //  console.log('ID:', props.id);

  return (
    <Photo
      ref={setNodeRef}
      style={style}
      {...props}
      {...attributes}
      {...listeners}
      tags={tags}
      image={props.image}
    />
  );
};

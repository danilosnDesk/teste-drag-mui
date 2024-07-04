import { useState } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Checkbox, Collapse, FormControlLabel, FormGroup, IconButton, Typography } from '@mui/material';
import { ChevronRight, DragIndicator, KeyboardArrowDown } from '@mui/icons-material';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensors,
  useSensor,
  DragEndEvent
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

type TreeItemProps = {
  id: string;
  name: string;
  children: TreeItemProps[];
  toAssin: boolean,
  is_child?: boolean
};

const SortableTreeItem = ({ id, name, children, toAssin, is_child }: TreeItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const [showChildren, setShowChildren] = useState(false);
  const [_children, setChildren] = useState(children);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: '4px',
    minHeight: '48px',
    position: "relative",
    borderRadius: '4px',
    border: "1px solid lightgray",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const childContainerStyle = {
    paddingLeft: '5px',
  };

  const buttonStyle = {
    background: '#f3f3f3',
    borderRadius: '5px',
    width: '28px',
    height: '39px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    marginRight: '4px',
    cursor: 'grab',
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    console.log({ active: active, over: over })

    if (active.id !== over.id) {
      setChildren((items) => {
        const oldIndex = items.findIndex((child) => child.id === active.id);
        const newIndex = items.findIndex((child) => child.id === over.id);
        const x = arrayMove(items, oldIndex, newIndex);
        
        return x; 
      });
    }
  }

  return (
    <div ref={setNodeRef} style={style} >
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px", gap: '5px' }}
      >

        <Box sx={{ display: "flex", alignItems: "center", gap: '5px' }}>
          {toAssin ?
            <button style={buttonStyle} {...attributes} {...listeners}>
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <DragIndicator sx={{ color: "#737373" }} />
              </div>
            </button>
            :
            <button style={buttonStyle} {...attributes} {...listeners}>
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <DragIndicator sx={{ color: "#737373" }} />
              </div>
            </button>
          }
          {children?.length > 0 &&
            <IconButton
              onClick={() => {
                setShowChildren(prev => !prev);
              }}
              aria-expanded={showChildren ? 'true' : 'false'}
              aria-controls={`children-${id}`}
            >
              {!showChildren ?
                <ChevronRight /> : <KeyboardArrowDown />
              }
            </IconButton>
          }
          <Typography variant="h6" fontSize={16}>{name + ' ' + toAssin}</Typography>
        </Box>
        {
          toAssin && is_child &&
          <FormGroup>
              <FormControlLabel control={<Checkbox style={{ color: "#BF2F38" }} checked={true} size='small' />} label="Visível" />
          </FormGroup>
        }
      </Box>

      <Collapse in={showChildren} timeout="auto" unmountOnExit>
        <DndContext
          collisionDetection={closestCorners}
          sensors={sensors}
          onDragEnd={toAssin ? handleDragEnd : () => {}}
        >
          <SortableContext items={_children} strategy={verticalListSortingStrategy}>
            <div style={childContainerStyle}>
              {_children?.map((child, key) => {
                return (
                  <SortableTreeItem is_child toAssin={toAssin} key={key} id={child.id} name={child.title} children={child.children} />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </Collapse>
    </div>
  );
};



export default SortableTreeItem;

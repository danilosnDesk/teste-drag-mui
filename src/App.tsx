/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid, Paper, Typography } from '@mui/material';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensors,
  useSensor,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import Container from './components/Container';
import { useState } from 'react';
import { assined, toAssin } from './data';
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

function App() {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  type itemProps = {
    id: number;
    title: string;
    children?: itemProps[]
  }
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<{ [key: string]: itemProps[] }>({
    assined: assined,
    toAssin: toAssin,
    voided: []
  });

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  function arrayMove(array, fromIndex, toIndex) {
    const newArray = array.slice();
    const [movedItem] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, movedItem);
    return newArray;
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    const { id } = active;
    const overId = over?.id;

    const activeContainer = findContainer(id);
    let overContainer = overId ? findContainer(overId) : null;

    // caso que um contaciner não tenha nenhum item
    if (!overContainer && overId && items[overId]) {
      overContainer = overId;
    }

    if (!activeContainer || !overContainer) {
      return;
    }

    if (activeContainer === overContainer) {
      setItems((prev) => {
        const activeItems = prev[activeContainer];
        const activeIndex = activeItems.findIndex((item) => item.id === id);
        const overIndex = activeItems.findIndex((item) => item.id === overId);
        const newIndex = overIndex >= 0 ? overIndex : (activeItems.length || 0);

        const updatedActiveItems = arrayMove(activeItems, activeIndex, newIndex);

        return {
          ...prev,
          [activeContainer]: updatedActiveItems,
        };
      });
    } else {
      setItems((prev) => {
        const activeItems = prev[activeContainer];
        const overItems = prev[overContainer];
        const activeIndex = activeItems.findIndex((item) => item.id === id);
        const overIndex = overItems.findIndex((item) => item.id === overId);
        const newIndex = overIndex >= 0 ? overIndex : overItems.length;

        const movedItem = activeItems[activeIndex];
        const updatedActiveItems = activeItems.filter((item) => item.id !== id);
        const updatedOverItems = [
          ...overItems.slice(0, newIndex),
          movedItem,
          ...overItems.slice(newIndex),
        ];

        return {
          ...prev,
          [activeContainer]: updatedActiveItems,
          [overContainer]: updatedOverItems,
        };
      });
    }
  }

  function findContainer(itemId: number | string) {
    for (const [containerId, containerItems] of Object.entries(items)) {
      if (containerItems.some((item) => item.id === itemId)) {
        return containerId;
      }
    }
    return null;
  }



  function handleDragEnd() {
    setActiveId(null);
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container>
        <Typography variant='h6'>SCRIPT</Typography>
      </Grid>
      <Grid container sx={{ minHeight: "80vh" }} marginTop={2} columnSpacing={4}>
        <DndContext
          collisionDetection={closestCorners}
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Container id="assined" toAssin={true} items={items.assined} />
          <Container id="toAssin" toAssin={false} items={items.toAssin} />
          <Container id="voided" toAssin={false} items={items.voided} />
        </DndContext>
      </Grid>
    </Paper>
  );
}

export default App;

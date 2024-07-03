import './App.css';
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

  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<{ [key: string]: { id: string; title: string; description: string }[] }>({
    assined: assined,
    toAssin: toAssin
  });

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex(item => item.id === id);
      const overIndex = overItems.findIndex(item => item.id === overId);
      const newIndex = overIndex >= 0 ? overIndex : overItems.length;

      const movedItem = activeItems[activeIndex];
      const updatedActiveItems = activeItems.filter(item => item.id !== id);
      const updatedOverItems = [...overItems.slice(0, newIndex), movedItem, ...overItems.slice(newIndex)];

      return {
        ...prev,
        [activeContainer]: updatedActiveItems,
        [overContainer]: updatedOverItems
      };
    });
  }

  function handleDragEnd() {
    setActiveId(null);
  }

  function findContainer(itemId: string) {
    for (const [containerId, containerItems] of Object.entries(items)) {
      if (containerItems.some(item => item.id === itemId)) {
        return containerId;
      }
    }
    return null;
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
          <Container id="S0" toAssin={true} items={items.assined} />
          <Container id="S1" items={items.toAssin} />
        </DndContext>
      </Grid>
    </Paper>
  );
}

export default App;
import './App.css'
import { Box, Checkbox, FormControlLabel, Grid, IconButton, Paper } from '@mui/material'
import { SimpleTreeItemWrapper, SortableTree, TreeItemComponentProps } from 'dnd-kit-sortable-tree';
import React, { useState } from 'react';
import { Add, Remove } from '@mui/icons-material';

type dataType = {
  name:string,
  id:number,
  order:number,
  parent?: dataType,
  index?:number
}

function App() {
  const fakeNames = [
    'Frontend Development',
    'Backend Development',
    'Database Management',
    'Cloud Computing',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Cybersecurity',
    'Mobile Development',
    'Web Development',
    'UI/UX Design',
    'Network Administration',
    'DevOps',
    'Blockchain Technology',
    'Internet of Things (IoT)'
];

const generateRandomName = () => fakeNames[Math.floor(Math.random() * fakeNames.length)];

const [toAssign, setToAssign] = useState([
  { id: 1, name: generateRandomName(), order: 0 },
  { id: 2, name: generateRandomName(), order: 1 },
  { 
      id: 3, 
      name: generateRandomName(), 
      order: 2,
      children: [
          { id: 4, name: generateRandomName(), order: 0 },
          { id: 5, name: generateRandomName(), order: 1 }
      ]
  },
  { id: 6, name: generateRandomName(), order: 3 },
  { id: 7, name: generateRandomName(), order: 4 }
]) 

const [Assigned, setAssing] = useState<dataType[]>([]) 


const handleRemoveAssigned = (index: number) => {
  const updatedAssigned = [...Assigned]; 
  updatedAssigned.splice(index, 1); 
  setAssing(updatedAssigned); 
}



const TreeItem = React.forwardRef<HTMLDivElement,  TreeItemComponentProps<dataType>>((props, ref) => {
  return (
      <SimpleTreeItemWrapper {...props} ref={ref}>
          <Box justifyContent="space-between" alignItems="center" display="flex" width="100%">
              {props.item.name}
              {props?.item.parent &&
                  <>
                  <FormControlLabel
                      control={<Checkbox size='small'  checked={true} onChange={() => { }} name="visible" />}
                      label="Visível"
                      />
              </>}

              {!props?.item.parent && 
              
              <IconButton size='small' onClick={(e) => {
                e.stopPropagation(); 
                handleRemoveAssigned(props.item?.index || -1);
              }}>
              <Remove />
            </IconButton>
              }
          </Box>
      </SimpleTreeItemWrapper>
  );
});


const TreeItem2 = React.forwardRef<HTMLDivElement,  TreeItemComponentProps<dataType>>((props, ref) => {
  return (
      <SimpleTreeItemWrapper {...props} ref={ref}>
          <Box justifyContent="space-between" alignItems="center" display="flex" width="100%">
              {props.item.name}

              <IconButton size='small' onClick={() =>setAssing([...Assigned, props.item])}>
                <Add/>
              </IconButton>
          </Box>
      </SimpleTreeItemWrapper>
  );
});



const filteredItems = toAssign.filter(x => !Assigned.map(a => a.id).includes(x.id));



  return (
    <Paper sx={{p:2}}>
      <Grid container sx={{height:"80vh"}} marginTop={2} columnSpacing={4}>
          <Grid item xs={6}>
              <SortableTree 
               items={Assigned}
               onItemsChanged={(x) => setAssing(x) }
              TreeItemComponent={TreeItem}
              />
          </Grid>
          <Grid item xs={6}>
          <SortableTree 
                disableSorting
                items={filteredItems || []}
                onItemsChanged={(x) => setToAssign(x) }
               TreeItemComponent={TreeItem2}
              />
          </Grid>
        </Grid>   
    </Paper>
  )
}

export default App

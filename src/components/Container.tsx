/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import SortableItem from "./Item";

const containerStyle = {
    padding: 10,
    margin: 10,
    flex: 1,
};

export default function Container(props: any) {
    const { id, items, toAssin } = props;
    const { setNodeRef } = useDroppable({ id });

    return (
        <SortableContext
            id={id}
            items={items}
            strategy={verticalListSortingStrategy}
        >
            <div
                ref={setNodeRef}
                style={containerStyle}
                data-id={id}
            >
                {items.map((x: any) => (
                    <SortableItem
                        toAssin={toAssin}
                        key={x.id}
                        id={x.id || -1}
                        name={x.title}
                        children={x?.children || []}
                    />
                ))}
            </div>
        </SortableContext>
    );
}

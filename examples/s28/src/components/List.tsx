import type { Story } from '../types';
import { ListItem } from './ListItem';

type ListProps = {
  items: Story[];
  onRemoveItem: (id: number) => void;
};

export const List = ({ items, onRemoveItem }: ListProps) => (
  <ul>
    {items.map((item) => (
      <ListItem key={item.id} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

import type { Story } from '../types';

type ListItem = {
  item: Story;
  onRemoveItem: (id: number) => void;
};

export const ListItem = ({ item, onRemoveItem }: ListItem) => {
  const { id, title, description } = item;

  return (
    <li>
      <span>{title}</span>
      <span>{description}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(id)}>
          Удалить
        </button>
      </span>
    </li>
  );
};

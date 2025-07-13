type ListProps = {
  items: Array<{
    id: number;
    title: string;
    description: string;
  }>;
};

export const List = ({ items }: ListProps) => (
  <ul>
    {items.map(({ id, title, description }) => (
      <li key={id}>
        <span>{title}</span>
        <span>{description}</span>
      </li>
    ))}
  </ul>
);

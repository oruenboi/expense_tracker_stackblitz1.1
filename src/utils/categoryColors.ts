const categoryColors: { [key: string]: string } = {
  Food: '#FF6B6B',
  Transportation: '#4ECDC4',
  Entertainment: '#45B7D1',
  Utilities: '#FFA07A',
  Other: '#98D8C8',
};

export const getCategoryColor = (category: string): string => {
  return categoryColors[category] || '#98D8C8'; // Default color if category is not found
};
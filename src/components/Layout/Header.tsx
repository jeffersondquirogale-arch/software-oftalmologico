import { useAppStore } from '../../store/useAppStore';

export const Header = () => {
  const { currentModule } = useAppStore();

  return (
    <header className="bg-surface shadow-sm border-b border-border h-16 flex items-center px-8">
      <h2 className="text-2xl font-title font-semibold text-primary">
        {currentModule}
      </h2>
    </header>
  );
};

import CoverGenerator from '@/components/CoverGenerator';

export default function CoverTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <CoverGenerator />
        </div>
      </div>
    </div>
  );
}

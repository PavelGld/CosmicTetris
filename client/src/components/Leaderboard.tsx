import { useEffect } from 'react';
import { useLeaderboard } from '@/lib/stores/useLeaderboard';
import { formatScore } from '@/game/utils';

const Leaderboard = () => {
  const { entries, loadLeaderboard } = useLeaderboard();
  
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);
  
  // Get top 10 entries
  const topEntries = entries.slice(0, 10);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>
      
      {topEntries.length > 0 ? (
        <div className="overflow-hidden rounded border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300">
                  Rank
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300">
                  Player
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300">
                  Score
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300">
                  Level
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-900/50">
              {topEntries.map((entry, index) => (
                <tr key={`${entry.playerName}-${index}`}>
                  <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-300">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-white">{entry.playerName}</span>
                      <span className="text-xs text-gray-400">
                        {formatDate(entry.date)} ({entry.planetSides} sides)
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-sm font-mono text-white">
                    {formatScore(entry.score)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-sm text-white">
                    {entry.level}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-900/50 rounded border border-gray-700">
          <p className="text-gray-400">No scores yet!</p>
          <p className="text-gray-400 text-sm mt-1">Play a game to set your first record</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
